import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
/**
 * ? Local Imports
 */
import {
  IDayForecast,
  IForecast,
  IHourForecast,
  IPlace,
  IWeatherAlert,
  IWeatherBundle,
} from "./types";
import { periodHours } from "./format";

/**
 * Data sources (all free, no API key):
 * - Open-Meteo forecast, air quality and geocoding: https://open-meteo.com
 * - National Weather Service active alerts (US only): https://www.weather.gov/documentation/services-web-api
 * - BigDataCloud client-side reverse geocoding: https://www.bigdatacloud.com/free-api
 */
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const REVERSE_GEOCODING_URL =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";
const NWS_ALERTS_URL = "https://api.weather.gov/alerts/active";
// ? NWS asks every client to identify itself
const NWS_USER_AGENT = "jz-weather-app (github.com/zlshames/jz-weather-app)";

const REQUEST_TIMEOUT_MS = 15000;

const CURRENT_FIELDS = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "is_day",
  "weather_code",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
  "pressure_msl",
  "cloud_cover",
];

const HOURLY_FIELDS = [
  "temperature_2m",
  "apparent_temperature",
  "precipitation_probability",
  "precipitation",
  "weather_code",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
  "relative_humidity_2m",
  "dew_point_2m",
  "cloud_cover",
  "uv_index",
  "visibility",
  "pressure_msl",
  "is_day",
];

const DAILY_FIELDS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "apparent_temperature_max",
  "apparent_temperature_min",
  "precipitation_probability_max",
  "precipitation_sum",
  "sunrise",
  "sunset",
  "uv_index_max",
  "wind_speed_10m_max",
  "wind_direction_10m_dominant",
  "wind_gusts_10m_max",
];

// ? Open-Meteo's query parameters are snake_case
/* eslint-disable camelcase */
const FORECAST_OPTIONS = {
  temperature_unit: "fahrenheit",
  wind_speed_unit: "mph",
  precipitation_unit: "inch",
  timezone: "auto",
  forecast_days: 10,
};
/* eslint-enable camelcase */

const http = axios.create({ timeout: REQUEST_TIMEOUT_MS });
const RETRY_DELAY_MS = 1000;

// ? Open-Meteo occasionally answers 503 under load; one retry usually succeeds
const getWithRetry = async (
  url: string,
  config: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  try {
    return await http.get(url, config);
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : null;
    const isRetryable = !status || status >= 500;
    if (!isRetryable) throw error;
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    return http.get(url, config);
  }
};

// ? Open-Meteo returns null for values a model can't provide at a location
const num = (value: number | null | undefined) => value ?? 0;

export const fetchForecast = async (place: IPlace): Promise<IForecast> => {
  const { data } = await getWithRetry(FORECAST_URL, {
    params: {
      latitude: place.latitude,
      longitude: place.longitude,
      current: CURRENT_FIELDS.join(","),
      hourly: HOURLY_FIELDS.join(","),
      daily: DAILY_FIELDS.join(","),
      ...FORECAST_OPTIONS,
    },
  });

  const { current, hourly, daily } = data;

  const hours: IHourForecast[] = hourly.time.map((time: string, i: number) => ({
    time,
    temperature: num(hourly.temperature_2m[i]),
    feelsLike: num(hourly.apparent_temperature[i]),
    precipitationChance: num(hourly.precipitation_probability[i]),
    precipitationAmount: num(hourly.precipitation[i]),
    weatherCode: num(hourly.weather_code[i]),
    windSpeed: num(hourly.wind_speed_10m[i]),
    windDirection: num(hourly.wind_direction_10m[i]),
    windGusts: num(hourly.wind_gusts_10m[i]),
    humidity: num(hourly.relative_humidity_2m[i]),
    dewPoint: num(hourly.dew_point_2m[i]),
    cloudCover: num(hourly.cloud_cover[i]),
    uvIndex: num(hourly.uv_index[i]),
    visibility: num(hourly.visibility[i]),
    pressure: num(hourly.pressure_msl[i]),
    isDay: hourly.is_day[i] === 1,
  }));

  const days: IDayForecast[] = daily.time.map((date: string, i: number) => {
    // ? Like TWC, a day's low is the overnight low that follows it (6p–6a), not the
    // ? midnight-to-midnight minimum; the last day has no full night, so it falls back
    const night = periodHours(hours, date, "night");
    const hasFullNight = night.length === 12;
    return {
      date,
      weatherCode: num(daily.weather_code[i]),
      high: num(daily.temperature_2m_max[i]),
      low: hasFullNight
        ? Math.min(...night.map((hour) => hour.temperature))
        : num(daily.temperature_2m_min[i]),
      feelsLikeHigh: num(daily.apparent_temperature_max[i]),
      feelsLikeLow: hasFullNight
        ? Math.min(...night.map((hour) => hour.feelsLike))
        : num(daily.apparent_temperature_min[i]),
      precipitationChance: num(daily.precipitation_probability_max[i]),
      precipitationAmount: num(daily.precipitation_sum[i]),
      sunrise: daily.sunrise[i],
      sunset: daily.sunset[i],
      uvIndexMax: num(daily.uv_index_max[i]),
      windSpeedMax: num(daily.wind_speed_10m_max[i]),
      windDirection: num(daily.wind_direction_10m_dominant[i]),
      windGustsMax: num(daily.wind_gusts_10m_max[i]),
    };
  });

  // ? Times are local wall-clock strings ("2026-10-12T17:15"), so compare them as strings
  const currentHour = `${current.time.slice(0, 13)}:00`;
  const nowIndex = Math.max(
    0,
    hours.findIndex((hour) => hour.time === currentHour),
  );

  return {
    current: {
      time: current.time,
      temperature: num(current.temperature_2m),
      feelsLike: num(current.apparent_temperature),
      humidity: num(current.relative_humidity_2m),
      isDay: current.is_day === 1,
      weatherCode: num(current.weather_code),
      windSpeed: num(current.wind_speed_10m),
      windDirection: num(current.wind_direction_10m),
      windGusts: num(current.wind_gusts_10m),
      pressure: num(current.pressure_msl),
      cloudCover: num(current.cloud_cover),
    },
    hourly: hours,
    daily: days,
    nowIndex,
  };
};

export const fetchUsAqi = async (place: IPlace): Promise<number | null> => {
  const { data } = await http.get(AIR_QUALITY_URL, {
    params: {
      latitude: place.latitude,
      longitude: place.longitude,
      current: "us_aqi",
    },
  });
  return data?.current?.us_aqi ?? null;
};

// ? NWS hard-wraps alert text at ~70 columns; keep blank-line paragraph breaks only
const unwrap = (text: string) => text.replace(/([^\n])\n(?!\n)/g, "$1 ");

export const fetchAlerts = async (place: IPlace): Promise<IWeatherAlert[]> => {
  const { data } = await http.get(NWS_ALERTS_URL, {
    params: {
      point: `${place.latitude.toFixed(4)},${place.longitude.toFixed(4)}`,
    },
    headers: {
      "User-Agent": NWS_USER_AGENT,
      Accept: "application/geo+json",
    },
  });
  return (data?.features ?? []).map((feature: any) => {
    const { properties } = feature;
    return {
      id: properties.id,
      event: properties.event,
      headline: properties.headline ?? properties.event,
      severity: properties.severity,
      ends: properties.ends ?? properties.expires ?? null,
      description: unwrap(properties.description ?? ""),
      instruction: properties.instruction
        ? unwrap(properties.instruction)
        : null,
    };
  });
};

/**
 * Forecast is required; air quality and alerts are best-effort extras
 * (NWS alerts only cover the US, so other locations simply get none).
 */
export const fetchWeatherBundle = async (
  place: IPlace,
): Promise<IWeatherBundle> => {
  const [forecast, usAqi, alerts] = await Promise.all([
    fetchForecast(place),
    fetchUsAqi(place).catch(() => null),
    fetchAlerts(place).catch(() => []),
  ]);
  return { forecast, usAqi, alerts };
};

export const searchPlaces = async (query: string): Promise<IPlace[]> => {
  const { data } = await http.get(GEOCODING_URL, {
    params: { name: query, count: 10, language: "en", format: "json" },
  });
  return (data?.results ?? []).map((result: any) => ({
    name: result.name,
    region: [result.admin1, result.country].filter(Boolean).join(", "),
    latitude: result.latitude,
    longitude: result.longitude,
  }));
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number,
): Promise<string | null> => {
  const { data } = await http.get(REVERSE_GEOCODING_URL, {
    params: { latitude, longitude, localityLanguage: "en" },
  });
  // ? `locality` is the town itself; `city` can be the larger metro (e.g. San Jose)
  return data?.locality || data?.city || null;
};

/**
 * WMO weather interpretation codes, as returned by Open-Meteo.
 * https://open-meteo.com/en/docs#weather_variable_documentation
 */
type IconKind =
  | "clear"
  | "partly"
  | "cloudy"
  | "fog"
  | "rain"
  | "snow"
  | "storm";

interface ICodeInfo {
  day: string;
  night: string;
  kind: IconKind;
  icon?: string;
}

const CODES: Record<number, ICodeInfo> = {
  0: { day: "Sunny", night: "Clear", kind: "clear" },
  1: { day: "Mostly Sunny", night: "Mostly Clear", kind: "partly" },
  2: { day: "Partly Cloudy", night: "Partly Cloudy", kind: "partly" },
  3: { day: "Cloudy", night: "Cloudy", kind: "cloudy" },
  45: { day: "Fog", night: "Fog", kind: "fog" },
  48: { day: "Freezing Fog", night: "Freezing Fog", kind: "fog" },
  51: { day: "Light Drizzle", night: "Light Drizzle", kind: "rain" },
  53: { day: "Drizzle", night: "Drizzle", kind: "rain" },
  55: { day: "Heavy Drizzle", night: "Heavy Drizzle", kind: "rain" },
  56: {
    day: "Freezing Drizzle",
    night: "Freezing Drizzle",
    kind: "rain",
    icon: "weather-snowy-rainy",
  },
  57: {
    day: "Freezing Drizzle",
    night: "Freezing Drizzle",
    kind: "rain",
    icon: "weather-snowy-rainy",
  },
  61: { day: "Light Rain", night: "Light Rain", kind: "rain" },
  63: { day: "Rain", night: "Rain", kind: "rain" },
  65: {
    day: "Heavy Rain",
    night: "Heavy Rain",
    kind: "rain",
    icon: "weather-pouring",
  },
  66: {
    day: "Freezing Rain",
    night: "Freezing Rain",
    kind: "rain",
    icon: "weather-snowy-rainy",
  },
  67: {
    day: "Freezing Rain",
    night: "Freezing Rain",
    kind: "rain",
    icon: "weather-snowy-rainy",
  },
  71: { day: "Light Snow", night: "Light Snow", kind: "snow" },
  73: { day: "Snow", night: "Snow", kind: "snow" },
  75: {
    day: "Heavy Snow",
    night: "Heavy Snow",
    kind: "snow",
    icon: "weather-snowy-heavy",
  },
  77: { day: "Snow Grains", night: "Snow Grains", kind: "snow" },
  80: { day: "Showers", night: "Showers", kind: "rain" },
  81: { day: "Rain Showers", night: "Rain Showers", kind: "rain" },
  82: {
    day: "Heavy Showers",
    night: "Heavy Showers",
    kind: "rain",
    icon: "weather-pouring",
  },
  85: { day: "Snow Showers", night: "Snow Showers", kind: "snow" },
  86: {
    day: "Heavy Snow Showers",
    night: "Heavy Snow Showers",
    kind: "snow",
    icon: "weather-snowy-heavy",
  },
  95: { day: "Thunderstorms", night: "Thunderstorms", kind: "storm" },
  96: {
    day: "T-Storms with Hail",
    night: "T-Storms with Hail",
    kind: "storm",
    icon: "weather-hail",
  },
  99: {
    day: "T-Storms with Hail",
    night: "T-Storms with Hail",
    kind: "storm",
    icon: "weather-hail",
  },
};

const UNKNOWN: ICodeInfo = { day: "--", night: "--", kind: "cloudy" };

// ? MaterialCommunityIcons glyph names
const ICONS: Record<IconKind, { day: string; night: string }> = {
  clear: { day: "weather-sunny", night: "weather-night" },
  partly: {
    day: "weather-partly-cloudy",
    night: "weather-night-partly-cloudy",
  },
  cloudy: { day: "weather-cloudy", night: "weather-cloudy" },
  fog: { day: "weather-fog", night: "weather-fog" },
  rain: { day: "weather-rainy", night: "weather-rainy" },
  snow: { day: "weather-snowy", night: "weather-snowy" },
  storm: { day: "weather-lightning-rainy", night: "weather-lightning-rainy" },
};

const info = (code: number) => CODES[code] ?? UNKNOWN;

export const conditionLabel = (code: number, isDay = true) =>
  isDay ? info(code).day : info(code).night;

export const conditionIcon = (code: number, isDay = true) => {
  const { kind, icon } = info(code);
  return icon ?? (isDay ? ICONS[kind].day : ICONS[kind].night);
};

export const conditionKind = (code: number) => info(code).kind;

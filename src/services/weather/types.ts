export interface IPlace {
  name: string;
  region?: string;
  latitude: number;
  longitude: number;
  isCurrentLocation?: boolean;
}

export interface ICurrentConditions {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  isDay: boolean;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  pressure: number;
  cloudCover: number;
}

export interface IHourForecast {
  time: string;
  temperature: number;
  feelsLike: number;
  precipitationChance: number;
  precipitationAmount: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  humidity: number;
  dewPoint: number;
  cloudCover: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  isDay: boolean;
}

export interface IDayForecast {
  date: string;
  weatherCode: number;
  high: number;
  low: number;
  feelsLikeHigh: number;
  feelsLikeLow: number;
  precipitationChance: number;
  precipitationAmount: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  windSpeedMax: number;
  windDirection: number;
  windGustsMax: number;
}

export interface IWeatherAlert {
  id: string;
  event: string;
  headline: string;
  severity: string;
  ends: string | null;
  description: string;
  instruction: string | null;
}

export interface IForecast {
  current: ICurrentConditions;
  /** Every hour returned, starting one hour before the current hour. */
  hourly: IHourForecast[];
  daily: IDayForecast[];
  /** Index into `hourly` of the hour containing `current.time`. */
  nowIndex: number;
}

export interface IWeatherBundle {
  forecast: IForecast;
  usAqi: number | null;
  alerts: IWeatherAlert[];
}

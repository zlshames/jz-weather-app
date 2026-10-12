import { IHourForecast } from "./types";
import { conditionLabel } from "./weatherCodes";

/**
 * Forecast times are the location's wall-clock time without an offset
 * ("2026-10-12T17:00"), so they are parsed by hand instead of through Date,
 * which would shift them into the device's time zone.
 */
const parts = (iso: string) => ({
  year: Number(iso.slice(0, 4)),
  month: Number(iso.slice(5, 7)),
  day: Number(iso.slice(8, 10)),
  hour: Number(iso.slice(11, 13)),
  minute: Number(iso.slice(14, 16)),
});

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const COMPASS = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
];

const weekdayIndex = (date: string) => {
  const { year, month, day } = parts(date);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
};

export const degrees = (value: number) => `${Math.round(value)}°`;

export const percent = (value: number) => `${Math.round(value)}%`;

/** "5p", "12a" */
export const hourLabel = (iso: string) => {
  const { hour } = parts(iso);
  const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelveHour}${hour < 12 ? "a" : "p"}`;
};

/** "6:35", or "6:35 pm" with `withPeriod` */
export const clockLabel = (iso: string, withPeriod = false) => {
  const { hour, minute } = parts(iso);
  const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
  const label = `${twelveHour}:${String(minute).padStart(2, "0")}`;
  if (!withPeriod) return label;
  return `${label} ${hour < 12 ? "am" : "pm"}`;
};

/** "Mon" */
export const shortWeekday = (date: string) =>
  WEEKDAYS[weekdayIndex(date)].slice(0, 3);

/** "Monday, October 12" */
export const longDate = (date: string) => {
  const { month, day } = parts(date);
  return `${WEEKDAYS[weekdayIndex(date)]}, ${MONTHS[month - 1]} ${day}`;
};

/** "Monday, Oct 12" */
export const mediumDate = (date: string) => {
  const { month, day } = parts(date);
  return `${WEEKDAYS[weekdayIndex(date)]}, ${MONTHS[month - 1].slice(
    0,
    3,
  )} ${day}`;
};

export const dayOfMonth = (date: string) => parts(date).day;

export const compass = (direction: number) =>
  COMPASS[Math.round((((direction % 360) + 360) % 360) / 22.5) % 16];

export const wind = (speed: number, direction: number) =>
  `${Math.round(speed)} mph ${compass(direction)}`;

export const uvCategory = (uvIndex: number) => {
  if (uvIndex < 3) return "Low";
  if (uvIndex < 6) return "Moderate";
  if (uvIndex < 8) return "High";
  if (uvIndex < 11) return "Very High";
  return "Extreme";
};

export const aqiCategory = (aqi: number) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};

/** "Until 3PM Tue" for an ISO timestamp with an offset (NWS alert times). */
export const untilLabel = (iso: string | null) => {
  if (!iso) return "In effect";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "In effect";
  const hour = date.getHours();
  const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
  const minutes = date.getMinutes()
    ? `:${String(date.getMinutes()).padStart(2, "0")}`
    : "";
  const weekday = WEEKDAYS[date.getDay()].slice(0, 3);
  return `Until ${twelveHour}${minutes}${hour < 12 ? "AM" : "PM"} ${weekday}`;
};

/**
 * Hours belonging to the day (6a–6p) or night (6p–6a next morning) of `date`.
 */
export const periodHours = (
  hours: IHourForecast[],
  date: string,
  period: "day" | "night",
) => {
  // ? Hourly data is contiguous, so a period is the 12 hours from its start
  const start = `${date}T${period === "day" ? "06" : "18"}:00`;
  const startIndex = hours.findIndex((hour) => hour.time === start);
  return startIndex < 0 ? [] : hours.slice(startIndex, startIndex + 12);
};

/** The most frequent weather code across a set of hours (ties go to the more severe code). */
export const prevailingCode = (hours: IHourForecast[]) => {
  const counts = new Map<number, number>();
  hours.forEach((hour) =>
    counts.set(hour.weatherCode, (counts.get(hour.weatherCode) ?? 0) + 1),
  );
  let best = hours[0].weatherCode;
  counts.forEach((count, code) => {
    const bestCount = counts.get(best) ?? 0;
    if (count > bestCount || (count === bestCount && code > best)) best = code;
  });
  return best;
};

export const windiestHour = (hours: IHourForecast[]) =>
  hours.reduce((a, b) => (b.windSpeed > a.windSpeed ? b : a));

/**
 * A short forecast narrative in the style of "Mostly Clear. Low 48F. Winds NW at 5 to 10 mph."
 * Open-Meteo has no written forecasts, so this is generated from the hourly data.
 */
export const narrative = (hours: IHourForecast[], period: "day" | "night") => {
  if (!hours.length) return "";
  const isDay = period === "day";
  const temperatures = hours.map((hour) => hour.temperature);
  const speeds = hours.map((hour) => hour.windSpeed);
  const minSpeed = Math.round(Math.min(...speeds));
  const maxSpeed = Math.round(Math.max(...speeds));
  const chance = Math.max(...hours.map((hour) => hour.precipitationChance));
  const direction = compass(windiestHour(hours).windDirection);
  let winds = `Winds ${direction} at ${minSpeed} to ${maxSpeed} mph.`;
  if (maxSpeed < 5) winds = "Winds light and variable.";
  else if (minSpeed < 5) winds = `Winds ${direction} up to ${maxSpeed} mph.`;
  else if (minSpeed === maxSpeed)
    winds = `Winds ${direction} at ${maxSpeed} mph.`;

  const sentences = [
    `${conditionLabel(prevailingCode(hours), isDay)}.`,
    isDay
      ? `High ${Math.round(Math.max(...temperatures))}F.`
      : `Low ${Math.round(Math.min(...temperatures))}F.`,
    winds,
  ];
  if (chance >= 20) sentences.push(`Chance of precip ${Math.round(chance)}%.`);
  return sentences.join(" ");
};

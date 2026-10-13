import axios from "axios";

/**
 * Radar frames from RainViewer (free, no API key): https://www.rainviewer.com/api.html
 * The free tier covers the past ~2 hours in 10-minute frames, at zoom levels up to 7.
 */
const WEATHER_MAPS_URL = "https://api.rainviewer.com/public/weather-maps.json";
const REQUEST_TIMEOUT_MS = 15000;

export interface IRadarFrame {
  /** Unix time in seconds */
  time: number;
  path: string;
}

export interface IRadarFrames {
  host: string;
  frames: IRadarFrame[];
}

export const fetchRadarFrames = async (): Promise<IRadarFrames> => {
  const { data } = await axios.get(WEATHER_MAPS_URL, {
    timeout: REQUEST_TIMEOUT_MS,
  });
  const frames: IRadarFrame[] = [
    ...(data?.radar?.past ?? []),
    // ? Forecast frames, when RainViewer offers them
    ...(data?.radar?.nowcast ?? []),
  ];
  if (!data?.host || !frames.length) throw new Error("No radar frames");
  return { host: data.host, frames };
};

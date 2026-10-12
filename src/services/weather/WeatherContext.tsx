import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
/**
 * ? Local Imports
 */
import { fetchWeatherBundle, reverseGeocode } from "./api";
import { IPlace, IWeatherBundle } from "./types";
import {
  getCurrentCoordinates,
  requestLocationPermission,
} from "@services/location";

export type WeatherStatus =
  | "locating"
  | "loading"
  | "ready"
  | "error"
  | "no-location";

interface IWeatherContext {
  place: IPlace | null;
  weather: IWeatherBundle | null;
  status: WeatherStatus;
  error: string | null;
  refreshing: boolean;
  refresh: () => void;
  selectPlace: (place: IPlace) => void;
  locateMe: () => void;
}

const WeatherContext = createContext<IWeatherContext | null>(null);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [place, setPlace] = useState<IPlace | null>(null);
  const [weather, setWeather] = useState<IWeatherBundle | null>(null);
  const [status, setStatus] = useState<WeatherStatus>("locating");
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  // ? Ignore responses for a place the user has already switched away from
  const latestRequest = useRef(0);

  const load = useCallback(async (target: IPlace, isRefresh = false) => {
    const request = ++latestRequest.current;
    if (isRefresh) setRefreshing(true);
    else setStatus("loading");
    try {
      const bundle = await fetchWeatherBundle(target);
      if (request !== latestRequest.current) return;
      setWeather(bundle);
      setError(null);
      setStatus("ready");
    } catch (e) {
      if (request !== latestRequest.current) return;
      setError("We couldn't load the forecast. Check your connection.");
      setStatus("error");
    } finally {
      if (request === latestRequest.current) setRefreshing(false);
    }
  }, []);

  const locateMe = useCallback(async () => {
    setStatus("locating");
    try {
      const granted = await requestLocationPermission();
      if (!granted) {
        setStatus("no-location");
        return;
      }
      const coords = await getCurrentCoordinates();
      const name = await reverseGeocode(
        coords.latitude,
        coords.longitude,
      ).catch(() => null);
      setPlace({
        ...coords,
        name: name ?? "Current Location",
        isCurrentLocation: true,
      });
    } catch (e) {
      setStatus("no-location");
    }
  }, []);

  useEffect(() => {
    locateMe();
  }, [locateMe]);

  useEffect(() => {
    if (place) load(place);
  }, [place, load]);

  const refresh = useCallback(() => {
    if (place) load(place, true);
  }, [place, load]);

  const value = useMemo(
    () => ({
      place,
      weather,
      status,
      error,
      refreshing,
      refresh,
      selectPlace: setPlace,
      locateMe,
    }),
    [place, weather, status, error, refreshing, refresh, locateMe],
  );

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used inside a WeatherProvider");
  }
  return context;
};

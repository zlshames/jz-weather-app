// eslint-disable-next-line react-native/split-platform-components -- runtime Platform check below
import { PermissionsAndroid, Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";

export interface ICoordinates {
  latitude: number;
  longitude: number;
}

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === "ios") {
    const status = await Geolocation.requestAuthorization("whenInUse");
    return status === "granted";
  }
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
};

export const getCurrentCoordinates = () =>
  new Promise<ICoordinates>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      reject,
      {
        // ? City-level accuracy is plenty for a forecast and resolves faster
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 10 * 60 * 1000,
      },
    );
  });

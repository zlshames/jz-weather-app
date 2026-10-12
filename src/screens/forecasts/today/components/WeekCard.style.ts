import { StyleSheet } from "react-native";
import { weatherColors } from "@theme/weather";

export const BAR_TRACK_HEIGHT = 64;

export default StyleSheet.create({
  content: {
    paddingHorizontal: 12,
  },
  column: {
    width: 72,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  todayColumn: {
    borderColor: weatherColors.chipBorder,
  },
  weekday: {
    fontSize: 15,
  },
  date: {
    fontSize: 14,
    marginTop: 2,
    marginBottom: 8,
  },
  high: {
    fontSize: 18,
    marginTop: 8,
    marginBottom: 6,
  },
  barTrack: {
    width: 8,
    height: BAR_TRACK_HEIGHT,
  },
  bar: {
    position: "absolute",
    width: 8,
    borderRadius: 4,
    backgroundColor: weatherColors.text,
  },
  low: {
    fontSize: 16,
    marginTop: 6,
  },
  precip: {
    fontSize: 13,
    marginTop: 4,
  },
});

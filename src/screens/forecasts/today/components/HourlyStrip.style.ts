import { StyleSheet } from "react-native";
import { weatherColors } from "@theme/weather";

export const COLUMN_WIDTH = 64;
export const CHART_HEIGHT = 120;
// ? Room above each dot for its value label
export const LABEL_HEIGHT = 26;
export const DOT_SIZE = 10;
export const NOW_DOT_SIZE = 16;
export const SEGMENT_THICKNESS = 3;

export default StyleSheet.create({
  headerRow: {
    flexDirection: "row",
  },
  column: {
    width: COLUMN_WIDTH,
    height: 88,
    alignItems: "center",
  },
  pastColumn: {
    opacity: 0.5,
  },
  columnLabel: {
    fontSize: 15,
    marginBottom: 10,
  },
  sunLabel: {
    fontSize: 12,
  },
  chart: {
    height: CHART_HEIGHT,
  },
  segment: {
    position: "absolute",
    height: SEGMENT_THICKNESS,
    borderRadius: SEGMENT_THICKNESS / 2,
  },
  dot: {
    position: "absolute",
  },
  valueLabel: {
    position: "absolute",
    width: COLUMN_WIDTH,
    textAlign: "center",
    fontSize: 17,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 16,
  },
  metricButton: {
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  metricSelected: {
    borderBottomColor: weatherColors.text,
  },
  metricText: {
    fontSize: 13,
  },
});

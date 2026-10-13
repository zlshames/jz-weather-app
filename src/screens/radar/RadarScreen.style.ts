import { StyleSheet } from "react-native";
import { weatherColors } from "@theme/weather";
import { PANEL_OVERLAP } from "./radarMapHtml";

// ? Sampled from RainViewer's "Universal Blue" tiles, lightest to heaviest
export const RADAR_LEGEND = [
  "#d2c48b",
  "#88ddee",
  "#36bae5",
  "#00a3e0",
  "#0091ca",
  "#ffee00",
  "#ffaa00",
  "#ff4400",
  "#c10000",
];

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: weatherColors.surface,
  },
  map: {
    flex: 1,
  },
  mapError: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: weatherColors.surface,
  },
  locationPill: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: weatherColors.pill,
  },
  locationText: {
    // ? A fixed cap: flexShrink collapses text inside an absolutely positioned pill
    maxWidth: 200,
    fontSize: 16,
    marginHorizontal: 8,
  },
  panel: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // ? Pull the panel up over the map's bottom edge
    marginTop: -PANEL_OVERLAP,
    backgroundColor: weatherColors.sheet,
  },
  panelMessage: {
    alignItems: "center",
    paddingVertical: 24,
  },
  messageText: {
    fontSize: 15,
    textAlign: "center",
  },
  textButton: {
    marginTop: 8,
    padding: 8,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: weatherColors.chipActive,
  },
  timeText: {
    flex: 1,
    marginHorizontal: 12,
  },
  timeLabel: {
    fontSize: 17,
  },
  subLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  recenterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: weatherColors.surface,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  legendText: {
    fontSize: 12,
  },
  legendBar: {
    flex: 1,
    flexDirection: "row",
    height: 8,
    marginHorizontal: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  legendSegment: {
    flex: 1,
  },
});

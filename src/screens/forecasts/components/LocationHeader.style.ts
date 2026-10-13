import { StyleSheet } from "react-native";
import { weatherColors } from "@theme/weather";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: weatherColors.pill,
  },
  locationText: {
    fontSize: 18,
    marginHorizontal: 8,
    flexShrink: 1,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: weatherColors.pill,
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: weatherColors.alertMinor,
  },
  badgeText: {
    fontSize: 10,
  },
});

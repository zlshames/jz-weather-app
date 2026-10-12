import { StyleSheet } from "react-native";
import { weatherColors } from "@theme/weather";

export default StyleSheet.create({
  sheet: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: weatherColors.sheet,
  },
  content: {
    paddingTop: 12,
    paddingBottom: 32,
  },
  dayColumn: {
    width: 74,
    alignItems: "center",
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 14,
  },
  dayColumnSelected: {
    backgroundColor: weatherColors.selected,
  },
  dayName: {
    fontSize: 16,
  },
  dayDate: {
    fontSize: 16,
    marginBottom: 14,
  },
  dayHigh: {
    fontSize: 20,
  },
  dayLow: {
    fontSize: 18,
    marginTop: 4,
    marginBottom: 8,
  },
  dayPrecip: {
    fontSize: 15,
    marginTop: 8,
  },
  periodTabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: weatherColors.divider,
  },
  periodTab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  periodTabSelected: {
    borderBottomColor: weatherColors.text,
  },
  periodText: {
    fontSize: 20,
  },
  summary: {
    fontSize: 17,
    lineHeight: 28,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 20,
    paddingTop: 8,
    borderTopWidth: 8,
    borderTopColor: weatherColors.surface,
  },
  detailCell: {
    width: "50%",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: weatherColors.divider,
  },
  detailText: {
    marginLeft: 10,
    flexShrink: 1,
  },
  detailLabel: {
    fontSize: 15,
  },
  detailValue: {
    fontSize: 17,
    marginTop: 4,
  },
});

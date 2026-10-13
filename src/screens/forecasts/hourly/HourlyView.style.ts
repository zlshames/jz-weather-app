import { StyleSheet } from "react-native";
import { weatherColors } from "@theme/weather";

export default StyleSheet.create({
  // ? Android doesn't clip a list's children to its radius, so a wrapper does
  sheet: {
    flex: 1,
    overflow: "hidden",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: weatherColors.sheet,
  },
  sectionHeader: {
    fontSize: 20,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 14,
    backgroundColor: weatherColors.sheet,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: weatherColors.divider,
  },
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: weatherColors.divider,
  },
  rowSummary: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  time: {
    width: 48,
    fontSize: 17,
  },
  precip: {
    width: 64,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  precipText: {
    fontSize: 16,
    marginLeft: 2,
  },
  temperature: {
    width: 56,
    fontSize: 22,
  },
  wind: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  windText: {
    fontSize: 15,
    marginLeft: 6,
  },
  details: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: weatherColors.surface,
  },
  detailsTitle: {
    fontSize: 16,
    paddingVertical: 14,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailCell: {
    width: "50%",
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 16,
    marginTop: 2,
  },
});

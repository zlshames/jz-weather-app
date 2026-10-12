import { StyleSheet } from "react-native";
import { weatherColors } from "@theme/weather";

export default StyleSheet.create({
  container: {
    flexGrow: 0,
    backgroundColor: weatherColors.sheet,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: weatherColors.divider,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: weatherColors.chipBorder,
  },
  chipSelected: {
    backgroundColor: weatherColors.chipActive,
    borderColor: weatherColors.chipActive,
  },
  chipText: {
    fontSize: 16,
  },
});

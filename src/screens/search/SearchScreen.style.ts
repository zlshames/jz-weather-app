import { StyleSheet } from "react-native";
import fonts from "@fonts";
import { weatherColors } from "@theme/weather";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: weatherColors.navy,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  searchField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    paddingHorizontal: 14,
    borderRadius: 24,
    backgroundColor: weatherColors.sheet,
  },
  input: {
    flex: 1,
    height: 46,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: fonts.montserrat.regular,
    color: weatherColors.text,
  },
  list: {
    flex: 1,
    marginTop: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: weatherColors.sheet,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: weatherColors.divider,
  },
  rowText: {
    flex: 1,
    marginLeft: 14,
  },
  placeName: {
    fontSize: 17,
  },
  placeRegion: {
    fontSize: 14,
    marginTop: 2,
  },
  message: {
    textAlign: "center",
    fontSize: 15,
    marginTop: 32,
  },
});

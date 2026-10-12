import { StyleSheet } from "react-native";
import { weatherColors } from "@theme/weather";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: weatherColors.navy,
  },
  title: {
    fontSize: 40,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sheet: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    marginTop: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: weatherColors.sheet,
  },
  heading: {
    fontSize: 20,
    marginTop: 16,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 8,
  },
});

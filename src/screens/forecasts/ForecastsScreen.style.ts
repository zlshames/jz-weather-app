import { StyleSheet } from "react-native";
import { weatherColors } from "@theme/weather";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 40,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  status: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  statusTitle: {
    fontSize: 28,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: weatherColors.sheet,
  },
  buttonText: {
    fontSize: 16,
  },
});

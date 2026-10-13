import { StyleSheet } from "react-native";
import { weatherColors } from "@theme/weather";

const THUMB_SIZE = 18;
const LABEL_WIDTH = 40;

export default StyleSheet.create({
  // ? Taller than the track so it's easy to grab
  touchArea: {
    height: 32,
    justifyContent: "center",
    marginHorizontal: THUMB_SIZE / 2,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: weatherColors.divider,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: weatherColors.text,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    marginLeft: -THUMB_SIZE / 2,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 3,
    borderColor: weatherColors.sheet,
    backgroundColor: weatherColors.text,
  },
  labels: {
    height: 18,
    marginHorizontal: THUMB_SIZE / 2,
  },
  label: {
    position: "absolute",
    width: LABEL_WIDTH,
    marginLeft: -LABEL_WIDTH / 2,
    textAlign: "center",
    fontSize: 12,
  },
  nowLabel: {
    right: -LABEL_WIDTH / 2,
  },
});

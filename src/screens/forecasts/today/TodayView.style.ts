import { StyleSheet } from "react-native";
import { weatherColors } from "@theme/weather";

export default StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 48,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  temperature: {
    fontSize: 112,
    lineHeight: 128,
  },
  condition: {
    alignItems: "center",
    maxWidth: 140,
  },
  conditionText: {
    fontSize: 18,
    marginTop: 4,
    textAlign: "center",
  },
  heroDetail: {
    fontSize: 18,
    marginTop: 10,
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: weatherColors.banner,
  },
  alertText: {
    flex: 1,
    marginHorizontal: 10,
  },
  alertTitle: {
    fontSize: 17,
  },
  alertUntil: {
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  sheet: {
    flexGrow: 1,
    overflow: "hidden",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: weatherColors.surface,
  },
  section: {
    marginBottom: 10,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: weatherColors.sheet,
  },
  sectionBody: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
  },
  chevronButton: {
    width: 44,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: weatherColors.surface,
  },
  outlookText: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});

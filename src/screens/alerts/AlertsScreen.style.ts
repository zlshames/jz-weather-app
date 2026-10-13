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
  subtitle: {
    fontSize: 16,
    paddingHorizontal: 20,
    marginTop: 4,
  },
  sheet: {
    flex: 1,
    marginTop: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: weatherColors.surface,
  },
  content: {
    padding: 16,
    paddingTop: 24,
  },
  empty: {
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 8,
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 14,
    borderLeftWidth: 6,
    backgroundColor: weatherColors.sheet,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  event: {
    flex: 1,
    fontSize: 18,
  },
  until: {
    fontSize: 12,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
});

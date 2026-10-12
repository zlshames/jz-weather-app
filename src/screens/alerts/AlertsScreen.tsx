import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import RNBounceable from "@freakycoder/react-native-bounceable";
/**
 * ? Local Imports
 */
import styles from "./AlertsScreen.style";
import fonts from "@fonts";
import { weatherColors } from "@theme/weather";
import { IWeatherAlert } from "@services/weather/types";
import { untilLabel } from "@services/weather/format";
import { useWeather } from "@services/weather/WeatherContext";
import Text from "@shared-components/text-wrapper/TextWrapper";

const severityColor = (alert: IWeatherAlert) => {
  if (alert.severity === "Extreme") return weatherColors.alertExtreme;
  if (alert.severity === "Severe") return weatherColors.alertSevere;
  return weatherColors.alertMinor;
};

const AlertsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { place, weather } = useWeather();
  const [openAlert, setOpenAlert] = useState<string | null>(null);
  const alerts = weather?.alerts ?? [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text
        fontFamily={fonts.montserrat.bold}
        color={weatherColors.textOnDark}
        style={styles.title}
      >
        Alerts
      </Text>
      {place && (
        <Text
          fontFamily={fonts.montserrat.medium}
          color={weatherColors.textOnDarkMuted}
          style={styles.subtitle}
        >
          {place.name}
        </Text>
      )}
      <ScrollView style={styles.sheet} contentContainerStyle={styles.content}>
        {alerts.length === 0 && (
          <View style={styles.empty}>
            <Icon
              type={IconType.Ionicons}
              name="checkmark-circle-outline"
              size={48}
              color={weatherColors.textMuted}
            />
            <Text
              fontFamily={fonts.montserrat.bold}
              color={weatherColors.text}
              style={styles.emptyTitle}
            >
              No active alerts
            </Text>
            <Text
              fontFamily={fonts.montserrat.regular}
              color={weatherColors.textMuted}
              style={styles.emptyText}
            >
              {
                "Alerts come from the US National Weather Service, so they're only available for US locations."
              }
            </Text>
          </View>
        )}
        {alerts.map((alert) => {
          const isOpen = openAlert === alert.id;
          return (
            <RNBounceable
              key={alert.id}
              bounceEffectIn={0.98}
              style={[styles.card, { borderLeftColor: severityColor(alert) }]}
              onPress={() => setOpenAlert(isOpen ? null : alert.id)}
            >
              <View style={styles.cardHeader}>
                <Text
                  fontFamily={fonts.montserrat.bold}
                  color={weatherColors.text}
                  style={styles.event}
                >
                  {alert.event}
                </Text>
                <Icon
                  type={IconType.Ionicons}
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={weatherColors.textMuted}
                />
              </View>
              <Text
                fontFamily={fonts.montserrat.medium}
                color={weatherColors.textMuted}
                style={styles.until}
              >
                {untilLabel(alert.ends).toUpperCase()}
              </Text>
              <Text
                fontFamily={fonts.montserrat.regular}
                color={weatherColors.text}
                style={styles.body}
              >
                {alert.headline}
              </Text>
              {isOpen && (
                <>
                  <Text
                    fontFamily={fonts.montserrat.regular}
                    color={weatherColors.text}
                    style={styles.body}
                  >
                    {alert.description}
                  </Text>
                  {alert.instruction && (
                    <Text
                      fontFamily={fonts.montserrat.semiBold}
                      color={weatherColors.text}
                      style={styles.body}
                    >
                      {alert.instruction}
                    </Text>
                  )}
                </>
              )}
            </RNBounceable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default AlertsScreen;

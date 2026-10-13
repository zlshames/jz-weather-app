import React, { useMemo } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import RNBounceable from "@freakycoder/react-native-bounceable";
/**
 * ? Local Imports
 */
import styles from "./TodayView.style";
import HourlyStrip from "./components/HourlyStrip";
import WeekCard from "./components/WeekCard";
import HealthCards from "./components/HealthCards";
import fonts from "@fonts";
import { weatherColors } from "@theme/weather";
import {
  IForecast,
  IWeatherAlert,
  IWeatherBundle,
} from "@services/weather/types";
import { conditionLabel } from "@services/weather/weatherCodes";
import {
  degrees,
  narrative,
  percent,
  periodHours,
  untilLabel,
} from "@services/weather/format";
import Text from "@shared-components/text-wrapper/TextWrapper";
import WeatherIcon, {
  heroColor,
} from "@shared-components/weather-icon/WeatherIcon";

interface ITodayViewProps {
  weather: IWeatherBundle;
  refreshing: boolean;
  onRefresh: () => void;
  onOpenDaily: (dayIndex: number) => void;
  onOpenAlerts: () => void;
}

const outlook = ({ hourly, daily, nowIndex }: IForecast) => {
  const today = daily[0].date;
  const hourOfDay = Number(hourly[nowIndex].time.slice(11, 13));
  if (hourOfDay >= 17) {
    return {
      title: "Tonight's Outlook",
      text: narrative(periodHours(hourly, today, "night"), "night"),
    };
  }
  if (hourOfDay < 6) {
    const morning = hourly.findIndex((hour) => hour.time === `${today}T06:00`);
    return {
      title: "Tonight's Outlook",
      text: narrative(hourly.slice(nowIndex, morning), "night"),
    };
  }
  return {
    title: "Today's Outlook",
    text: narrative(periodHours(hourly, today, "day"), "day"),
  };
};

const alertColor = (alert: IWeatherAlert) => {
  if (alert.severity === "Extreme") return weatherColors.alertExtreme;
  if (alert.severity === "Severe") return weatherColors.alertSevere;
  return weatherColors.alertMinor;
};

const TodayView: React.FC<ITodayViewProps> = ({
  weather,
  refreshing,
  onRefresh,
  onOpenDaily,
  onOpenAlerts,
}) => {
  const { forecast, alerts, usAqi } = weather;
  const { current, daily, hourly, nowIndex } = forecast;
  const [today] = daily;
  const nextHour = hourly[nowIndex + 1];
  const { title: outlookTitle, text: outlookText } = useMemo(
    () => outlook(forecast),
    [forecast],
  );

  const Hero = () => (
    <View style={styles.hero}>
      <View style={styles.heroTop}>
        <Text
          fontFamily={fonts.montserrat.bold}
          color={weatherColors.textOnDark}
          style={styles.temperature}
        >
          {degrees(current.temperature)}
        </Text>
        <View style={styles.condition}>
          <WeatherIcon
            code={current.weatherCode}
            isDay={current.isDay}
            size={72}
            color={weatherColors.textOnDark}
          />
          <Text
            fontFamily={fonts.montserrat.semiBold}
            color={weatherColors.textOnDark}
            style={styles.conditionText}
          >
            {conditionLabel(current.weatherCode, current.isDay)}
          </Text>
        </View>
      </View>
      <Text
        fontFamily={fonts.montserrat.medium}
        color={weatherColors.textOnDark}
        style={styles.heroDetail}
      >
        {`Feels like ${degrees(current.feelsLike)}  |  H ${degrees(
          today.high,
        )}  |  L ${degrees(today.low)}`}
      </Text>
      {nextHour && (
        <Text
          fontFamily={fonts.montserrat.medium}
          color={weatherColors.textOnDark}
          style={styles.heroDetail}
        >
          Next hr rain chance{" "}
          <Text
            fontFamily={fonts.montserrat.bold}
            color={weatherColors.textOnDark}
          >
            {percent(nextHour.precipitationChance)}
          </Text>
        </Text>
      )}
      {alerts.length > 0 && (
        <RNBounceable style={styles.alertBanner} onPress={onOpenAlerts}>
          <Icon
            type={IconType.Ionicons}
            name="alert-circle"
            size={22}
            color={alertColor(alerts[0])}
          />
          <View style={styles.alertText}>
            <Text
              numberOfLines={1}
              fontFamily={fonts.montserrat.bold}
              color={weatherColors.text}
              style={styles.alertTitle}
            >
              {alerts.length > 1
                ? `${alerts[0].event} +${alerts.length - 1} more`
                : alerts[0].event}
            </Text>
            <Text
              fontFamily={fonts.montserrat.medium}
              color={weatherColors.text}
              style={styles.alertUntil}
            >
              {untilLabel(alerts[0].ends).toUpperCase()}
            </Text>
          </View>
          <Icon
            type={IconType.Ionicons}
            name="chevron-forward"
            size={20}
            color={weatherColors.text}
          />
        </RNBounceable>
      )}
    </View>
  );

  const SectionHeader = ({
    title,
    onPress,
  }: {
    title: string;
    onPress: () => void;
  }) => (
    <View style={styles.sectionHeader}>
      <Text
        fontFamily={fonts.montserrat.bold}
        color={weatherColors.text}
        style={styles.sectionTitle}
      >
        {title}
      </Text>
      <RNBounceable style={styles.chevronButton} onPress={onPress}>
        <Icon
          type={IconType.Ionicons}
          name="chevron-forward"
          size={20}
          color={weatherColors.text}
        />
      </RNBounceable>
    </View>
  );

  return (
    <ScrollView
      style={{ backgroundColor: heroColor(current.weatherCode, current.isDay) }}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={weatherColors.textOnDark}
        />
      }
    >
      <Hero />
      <View style={styles.sheet}>
        <View style={styles.section}>
          <SectionHeader title={outlookTitle} onPress={() => onOpenDaily(0)} />
          <Text
            fontFamily={fonts.montserrat.regular}
            color={weatherColors.textMuted}
            style={styles.outlookText}
          >
            {outlookText}
          </Text>
          <HourlyStrip forecast={forecast} />
        </View>
        <View style={styles.section}>
          <SectionHeader title="This Week" onPress={() => onOpenDaily(0)} />
          <WeekCard days={daily} onPressDay={onOpenDaily} />
        </View>
        <View style={[styles.section, styles.sectionBody]}>
          <Text
            fontFamily={fonts.montserrat.bold}
            color={weatherColors.text}
            style={styles.sectionTitle}
          >
            Health & Activities
          </Text>
          <HealthCards uvIndexMax={today.uvIndexMax} usAqi={usAqi} />
        </View>
      </View>
    </ScrollView>
  );
};

export default TodayView;

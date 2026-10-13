import React, { useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import RNBounceable from "@freakycoder/react-native-bounceable";
/**
 * ? Local Imports
 */
import styles from "./DailyView.style";
import fonts from "@fonts";
import { weatherColors } from "@theme/weather";
import {
  IDayForecast,
  IForecast,
  IHourForecast,
} from "@services/weather/types";
import { conditionLabel } from "@services/weather/weatherCodes";
import {
  clockLabel,
  dayOfMonth,
  degrees,
  mediumDate,
  narrative,
  percent,
  periodHours,
  prevailingCode,
  shortWeekday,
  uvCategory,
  wind,
  windiestHour,
} from "@services/weather/format";
import Text from "@shared-components/text-wrapper/TextWrapper";
import WeatherIcon from "@shared-components/weather-icon/WeatherIcon";

type Period = "day" | "night";

interface IDailyViewProps {
  forecast: IForecast;
  selectedDay: number;
  onSelectDay: (index: number) => void;
  refreshing: boolean;
  onRefresh: () => void;
}

const average = (values: number[]) =>
  values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : null;

const strongestWind = (hours: IHourForecast[], day: IDayForecast) => {
  if (!hours.length) return wind(day.windSpeedMax, day.windDirection);
  const windiest = windiestHour(hours);
  return wind(windiest.windSpeed, windiest.windDirection);
};

const details = (day: IDayForecast, hours: IHourForecast[], period: Period) => {
  const isDay = period === "day";
  const humidity = average(hours.map((hour) => hour.humidity));
  const cloudCover = average(hours.map((hour) => hour.cloudCover));
  const chance = hours.length
    ? Math.max(...hours.map((hour) => hour.precipitationChance))
    : day.precipitationChance;
  let feelsLike = isDay ? day.feelsLikeHigh : day.feelsLikeLow;
  if (hours.length) {
    const values = hours.map((hour) => hour.feelsLike);
    feelsLike = isDay ? Math.max(...values) : Math.min(...values);
  }

  return [
    {
      icon: "thermometer",
      label: "Temperature",
      value: degrees(isDay ? day.high : day.low),
    },
    {
      icon: "thermometer-lines",
      label: "Feels Like",
      value: degrees(feelsLike),
    },
    { icon: "weather-windy", label: "Wind", value: strongestWind(hours, day) },
    {
      icon: "weather-partly-cloudy",
      label: "Condition",
      // ? Match the summary above, which describes the same hours
      value: conditionLabel(
        hours.length ? prevailingCode(hours) : day.weatherCode,
        isDay,
      ),
    },
    isDay
      ? {
          icon: "white-balance-sunny",
          label: "UV Index",
          value: `${Math.round(day.uvIndexMax)} - ${uvCategory(
            day.uvIndexMax,
          )}`,
        }
      : {
          icon: "cloud-outline",
          label: "Cloud Cover",
          value: cloudCover === null ? "--" : percent(cloudCover),
        },
    {
      icon: "water-percent",
      label: "Humidity",
      value: humidity === null ? "--" : percent(humidity),
    },
    {
      icon: "umbrella-outline",
      label: "Precipitation",
      value: percent(chance),
    },
    isDay
      ? {
          icon: "weather-sunset-up",
          label: "Sunrise",
          value: clockLabel(day.sunrise, true),
        }
      : {
          icon: "weather-sunset-down",
          label: "Sunset",
          value: clockLabel(day.sunset, true),
        },
  ];
};

const DailyView: React.FC<IDailyViewProps> = ({
  forecast,
  selectedDay,
  onSelectDay,
  refreshing,
  onRefresh,
}) => {
  const { daily, hourly, nowIndex } = forecast;
  // ? Once evening arrives, today's daytime has passed, like TWC's "--" high
  const isTodayEvening = Number(hourly[nowIndex].time.slice(11, 13)) >= 18;
  const [period, setPeriod] = useState<Period>(
    selectedDay === 0 && isTodayEvening ? "night" : "day",
  );

  const day = daily[selectedDay];
  const hours = useMemo(
    () => periodHours(hourly, day.date, period),
    [hourly, day.date, period],
  );
  const summary = narrative(hours, period);

  return (
    <ScrollView
      style={styles.sheet}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {daily.map((item, index) => {
          const isSelected = index === selectedDay;
          const hidesHigh = index === 0 && isTodayEvening;
          return (
            <RNBounceable
              key={item.date}
              style={[styles.dayColumn, isSelected && styles.dayColumnSelected]}
              onPress={() => onSelectDay(index)}
            >
              <Text
                fontFamily={fonts.montserrat.bold}
                color={weatherColors.text}
                style={styles.dayName}
              >
                {shortWeekday(item.date)}
              </Text>
              <Text
                fontFamily={fonts.montserrat.bold}
                color={weatherColors.text}
                style={styles.dayDate}
              >
                {dayOfMonth(item.date)}
              </Text>
              <Text
                fontFamily={fonts.montserrat.bold}
                color={weatherColors.text}
                style={styles.dayHigh}
              >
                {hidesHigh ? "--" : degrees(item.high)}
              </Text>
              <Text
                fontFamily={fonts.montserrat.regular}
                color={weatherColors.text}
                style={styles.dayLow}
              >
                {degrees(item.low)}
              </Text>
              <WeatherIcon
                code={item.weatherCode}
                isDay={!hidesHigh}
                size={30}
              />
              <Text
                fontFamily={fonts.montserrat.regular}
                color={weatherColors.text}
                style={styles.dayPrecip}
              >
                {percent(item.precipitationChance)}
              </Text>
            </RNBounceable>
          );
        })}
      </ScrollView>

      <View style={styles.periodTabs}>
        {(["day", "night"] as Period[]).map((key) => {
          const isSelected = key === period;
          return (
            <RNBounceable
              key={key}
              style={[styles.periodTab, isSelected && styles.periodTabSelected]}
              onPress={() => setPeriod(key)}
            >
              <Text
                fontFamily={
                  isSelected ? fonts.montserrat.bold : fonts.montserrat.medium
                }
                color={
                  isSelected ? weatherColors.text : weatherColors.textMuted
                }
                style={styles.periodText}
              >
                {key === "day" ? "Day" : "Night"}
              </Text>
            </RNBounceable>
          );
        })}
      </View>

      <Text
        fontFamily={fonts.montserrat.regular}
        color={weatherColors.text}
        style={styles.summary}
      >
        <Text fontFamily={fonts.montserrat.bold} color={weatherColors.text}>
          {`${mediumDate(day.date)}${period === "night" ? " Night" : ""}:  `}
        </Text>
        {summary || "Detailed hourly data isn't available this far out."}
      </Text>

      <View style={styles.detailsGrid}>
        {details(day, hours, period).map(({ icon, label, value }) => (
          <View key={label} style={styles.detailCell}>
            <Icon
              type={IconType.MaterialCommunityIcons}
              name={icon}
              size={22}
              color={weatherColors.textMuted}
            />
            <View style={styles.detailText}>
              <Text
                fontFamily={fonts.montserrat.regular}
                color={weatherColors.textMuted}
                style={styles.detailLabel}
              >
                {label}
              </Text>
              <Text
                fontFamily={fonts.montserrat.bold}
                color={weatherColors.text}
                style={styles.detailValue}
              >
                {value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default DailyView;

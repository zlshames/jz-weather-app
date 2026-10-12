import React from "react";
import { ScrollView, View } from "react-native";
import RNBounceable from "@freakycoder/react-native-bounceable";
/**
 * ? Local Imports
 */
import styles, { BAR_TRACK_HEIGHT } from "./WeekCard.style";
import fonts from "@fonts";
import { weatherColors } from "@theme/weather";
import { IDayForecast } from "@services/weather/types";
import {
  dayOfMonth,
  degrees,
  percent,
  shortWeekday,
} from "@services/weather/format";
import Text from "@shared-components/text-wrapper/TextWrapper";
import WeatherIcon from "@shared-components/weather-icon/WeatherIcon";

interface IWeekCardProps {
  days: IDayForecast[];
  onPressDay: (index: number) => void;
}

const WeekCard: React.FC<IWeekCardProps> = ({ days, onPressDay }) => {
  const weekHigh = Math.max(...days.map((day) => day.high));
  const weekLow = Math.min(...days.map((day) => day.low));
  const range = weekHigh - weekLow || 1;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {days.map((day, index) => {
        const isToday = index === 0;
        // ? Each bar spans the day's low–high within the whole week's range
        const barTop = ((weekHigh - day.high) / range) * BAR_TRACK_HEIGHT;
        const barHeight = Math.max(
          ((day.high - day.low) / range) * BAR_TRACK_HEIGHT,
          8,
        );
        return (
          <RNBounceable
            key={day.date}
            style={[styles.column, isToday && styles.todayColumn]}
            onPress={() => onPressDay(index)}
          >
            <Text
              fontFamily={fonts.montserrat.bold}
              color={weatherColors.text}
              style={styles.weekday}
            >
              {isToday ? "Today" : shortWeekday(day.date)}
            </Text>
            <Text
              fontFamily={fonts.montserrat.medium}
              color={weatherColors.textMuted}
              style={styles.date}
            >
              {dayOfMonth(day.date)}
            </Text>
            <WeatherIcon code={day.weatherCode} size={30} />
            <Text
              fontFamily={fonts.montserrat.bold}
              color={weatherColors.text}
              style={styles.high}
            >
              {degrees(day.high)}
            </Text>
            <View style={styles.barTrack}>
              <View style={[styles.bar, { top: barTop, height: barHeight }]} />
            </View>
            <Text
              fontFamily={fonts.montserrat.medium}
              color={weatherColors.textMuted}
              style={styles.low}
            >
              {degrees(day.low)}
            </Text>
            <Text
              fontFamily={fonts.montserrat.medium}
              color={weatherColors.rain}
              style={styles.precip}
            >
              {day.precipitationChance >= 10
                ? percent(day.precipitationChance)
                : " "}
            </Text>
          </RNBounceable>
        );
      })}
    </ScrollView>
  );
};

export default WeekCard;

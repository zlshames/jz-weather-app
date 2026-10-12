import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import RNBounceable from "@freakycoder/react-native-bounceable";
/**
 * ? Local Imports
 */
import styles, {
  CHART_HEIGHT,
  COLUMN_WIDTH,
  DOT_SIZE,
  LABEL_HEIGHT,
  NOW_DOT_SIZE,
  SEGMENT_THICKNESS,
} from "./HourlyStrip.style";
import fonts from "@fonts";
import { weatherColors } from "@theme/weather";
import { IForecast, IHourForecast } from "@services/weather/types";
import { clockLabel, hourLabel } from "@services/weather/format";
import Text from "@shared-components/text-wrapper/TextWrapper";
import WeatherIcon from "@shared-components/weather-icon/WeatherIcon";

type Metric = "temperature" | "feelsLike" | "wind" | "humidity";

const METRICS: { key: Metric; label: string }[] = [
  { key: "temperature", label: "Temperature" },
  { key: "feelsLike", label: "Feels Like" },
  { key: "wind", label: "Wind" },
  { key: "humidity", label: "Humidity" },
];

const HOURS_SHOWN = 24;

type Column =
  | { kind: "hour"; hour: IHourForecast; isPast: boolean; isNow: boolean }
  | { kind: "sun"; time: string; event: "sunrise" | "sunset" };

const metricValue = (hour: IHourForecast, metric: Metric) => {
  switch (metric) {
    case "feelsLike":
      return hour.feelsLike;
    case "wind":
      return hour.windSpeed;
    case "humidity":
      return hour.humidity;
    default:
      return hour.temperature;
  }
};

const formatMetric = (value: number, metric: Metric) => {
  const rounded = Math.round(value);
  if (metric === "wind") return `${rounded}`;
  if (metric === "humidity") return `${rounded}%`;
  return `${rounded}°`;
};

const lineColor = (value: number, metric: Metric) => {
  if (metric === "wind" || metric === "humidity") return weatherColors.rain;
  if (value >= 80) return weatherColors.lineHot;
  if (value >= 65) return weatherColors.lineWarm;
  if (value >= 50) return weatherColors.lineMild;
  return weatherColors.lineCold;
};

/**
 * The previous hour, the next 24 hours, and sunrise/sunset markers slotted in
 * after the hour they fall in.
 */
const buildColumns = (forecast: IForecast): Column[] => {
  const { hourly, daily, nowIndex, current } = forecast;
  const start = Math.max(0, nowIndex - 1);
  const hours = hourly.slice(start, nowIndex + HOURS_SHOWN + 1);
  const sunEvents = daily.flatMap((day) => [
    { time: day.sunrise, event: "sunrise" as const },
    { time: day.sunset, event: "sunset" as const },
  ]);

  return hours.flatMap((hour, i): Column[] => {
    const index = start + i;
    const isNow = index === nowIndex;
    const columns: Column[] = [
      {
        kind: "hour",
        // ? "Now" shows current conditions so it matches the big temperature above
        hour: isNow
          ? {
              ...hour,
              temperature: current.temperature,
              feelsLike: current.feelsLike,
              windSpeed: current.windSpeed,
              humidity: current.humidity,
              weatherCode: current.weatherCode,
              isDay: current.isDay,
            }
          : hour,
        isPast: index < nowIndex,
        isNow,
      },
    ];
    sunEvents
      .filter(
        ({ time }) =>
          time.slice(0, 13) === hour.time.slice(0, 13) && time > current.time,
      )
      .forEach(({ time, event }) => columns.push({ kind: "sun", time, event }));
    return columns;
  });
};

interface IHourlyStripProps {
  forecast: IForecast;
}

const HourlyStrip: React.FC<IHourlyStripProps> = ({ forecast }) => {
  const [metric, setMetric] = useState<Metric>("temperature");
  const columns = useMemo(() => buildColumns(forecast), [forecast]);

  const points = useMemo(() => {
    const hourColumns = columns
      .map((column, columnIndex) => ({ column, columnIndex }))
      .filter(
        (
          entry,
        ): entry is {
          column: Extract<Column, { kind: "hour" }>;
          columnIndex: number;
        } => entry.column.kind === "hour",
      );
    const values = hourColumns.map(({ column }) =>
      metricValue(column.hour, metric),
    );
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const top = LABEL_HEIGHT + NOW_DOT_SIZE / 2;
    const usableHeight = CHART_HEIGHT - top - NOW_DOT_SIZE / 2;
    return hourColumns.map(({ column, columnIndex }, i) => ({
      x: columnIndex * COLUMN_WIDTH + COLUMN_WIDTH / 2,
      y: top + ((max - values[i]) / range) * usableHeight,
      value: values[i],
      isPast: column.isPast,
      isNow: column.isNow,
    }));
  }, [columns, metric]);

  const renderColumnHeader = (column: Column) => {
    if (column.kind === "sun") {
      const isSunset = column.event === "sunset";
      return (
        <View key={`sun-${column.time}`} style={styles.column}>
          <Text
            fontFamily={fonts.montserrat.medium}
            color={weatherColors.text}
            style={styles.columnLabel}
          >
            {clockLabel(column.time)}
          </Text>
          <Icon
            type={IconType.MaterialCommunityIcons}
            name={isSunset ? "weather-sunset-down" : "weather-sunset-up"}
            size={30}
            color={weatherColors.sunset}
          />
          <Text
            fontFamily={fonts.montserrat.semiBold}
            color={weatherColors.sunset}
            style={styles.sunLabel}
          >
            {isSunset ? "Sunset" : "Sunrise"}
          </Text>
        </View>
      );
    }
    const { hour, isNow, isPast } = column;
    return (
      <View
        key={hour.time}
        style={[styles.column, isPast && styles.pastColumn]}
      >
        <Text
          fontFamily={isNow ? fonts.montserrat.bold : fonts.montserrat.medium}
          color={weatherColors.text}
          style={styles.columnLabel}
        >
          {isNow ? "Now" : hourLabel(hour.time)}
        </Text>
        <WeatherIcon code={hour.weatherCode} isDay={hour.isDay} size={30} />
      </View>
    );
  };

  const renderSegments = () =>
    points.slice(1).map((end, i) => {
      const start = points[i];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.hypot(dx, dy);
      return (
        <View
          key={`segment-${start.x}`}
          style={[
            styles.segment,
            {
              left: (start.x + end.x) / 2 - length / 2,
              top: (start.y + end.y) / 2 - SEGMENT_THICKNESS / 2,
              width: length,
              backgroundColor: lineColor(end.value, metric),
              opacity: start.isPast ? 0.4 : 1,
              transform: [{ rotate: `${Math.atan2(dy, dx)}rad` }],
            },
          ]}
        />
      );
    });

  const renderPoints = () =>
    points.map((point) => {
      const size = point.isNow ? NOW_DOT_SIZE : DOT_SIZE;
      return (
        <React.Fragment key={`point-${point.x}`}>
          <Text
            fontFamily={fonts.montserrat.bold}
            color={weatherColors.text}
            style={[
              styles.valueLabel,
              {
                left: point.x - COLUMN_WIDTH / 2,
                top: point.y - size / 2 - LABEL_HEIGHT,
                opacity: point.isPast ? 0.5 : 1,
              },
            ]}
          >
            {formatMetric(point.value, metric)}
          </Text>
          <View
            style={[
              styles.dot,
              {
                left: point.x - size / 2,
                top: point.y - size / 2,
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: lineColor(point.value, metric),
                opacity: point.isPast ? 0.4 : 1,
              },
            ]}
          />
        </React.Fragment>
      );
    });

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={styles.headerRow}>
            {columns.map(renderColumnHeader)}
          </View>
          <View
            style={[styles.chart, { width: columns.length * COLUMN_WIDTH }]}
          >
            {renderSegments()}
            {renderPoints()}
          </View>
        </View>
      </ScrollView>
      <View style={styles.metricRow}>
        {METRICS.map(({ key, label }) => {
          const isSelected = key === metric;
          return (
            <RNBounceable
              key={key}
              style={[styles.metricButton, isSelected && styles.metricSelected]}
              onPress={() => setMetric(key)}
            >
              <Text
                fontFamily={
                  isSelected ? fonts.montserrat.bold : fonts.montserrat.medium
                }
                color={
                  isSelected ? weatherColors.text : weatherColors.textMuted
                }
                style={styles.metricText}
              >
                {label}
              </Text>
            </RNBounceable>
          );
        })}
      </View>
    </View>
  );
};

export default HourlyStrip;

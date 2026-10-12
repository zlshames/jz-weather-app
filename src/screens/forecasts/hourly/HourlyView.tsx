import React, { useCallback, useMemo, useState } from "react";
import { RefreshControl, SectionList, View } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import RNBounceable from "@freakycoder/react-native-bounceable";
/**
 * ? Local Imports
 */
import styles from "./HourlyView.style";
import fonts from "@fonts";
import { weatherColors } from "@theme/weather";
import { IForecast, IHourForecast } from "@services/weather/types";
import { conditionLabel } from "@services/weather/weatherCodes";
import {
  degrees,
  hourLabel,
  longDate,
  percent,
  uvCategory,
  wind,
} from "@services/weather/format";
import Text from "@shared-components/text-wrapper/TextWrapper";
import WeatherIcon from "@shared-components/weather-icon/WeatherIcon";

const METERS_PER_MILE = 1609.34;
const INHG_PER_HPA = 0.02953;

interface IHourlyViewProps {
  forecast: IForecast;
  refreshing: boolean;
  onRefresh: () => void;
}

const details = (hour: IHourForecast) => [
  { label: "Feels Like", value: degrees(hour.feelsLike) },
  { label: "Rain Amount", value: `${hour.precipitationAmount.toFixed(2)} in` },
  { label: "Wind Gusts", value: `${Math.round(hour.windGusts)} mph` },
  { label: "Cloud Cover", value: percent(hour.cloudCover) },
  { label: "Dew Point", value: degrees(hour.dewPoint) },
  {
    label: "UV Index",
    value: `${Math.round(hour.uvIndex)} - ${uvCategory(hour.uvIndex)}`,
  },
  {
    label: "Visibility",
    value: `${(hour.visibility / METERS_PER_MILE).toFixed(1)} mi`,
  },
  { label: "Humidity", value: percent(hour.humidity) },
  {
    label: "Pressure",
    value: `${(hour.pressure * INHG_PER_HPA).toFixed(2)} in`,
  },
];

const HourlyView: React.FC<IHourlyViewProps> = ({
  forecast,
  refreshing,
  onRefresh,
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const sections = useMemo(() => {
    const byDate = new Map<string, IHourForecast[]>();
    forecast.hourly.slice(forecast.nowIndex).forEach((hour) => {
      const date = hour.time.slice(0, 10);
      byDate.set(date, [...(byDate.get(date) ?? []), hour]);
    });
    return Array.from(byDate, ([date, data]) => ({
      title: longDate(date),
      data,
    }));
  }, [forecast]);

  const toggle = useCallback((time: string) => {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(time)) next.delete(time);
      else next.add(time);
      return next;
    });
  }, []);

  const renderHour = ({ item }: { item: IHourForecast }) => {
    const isExpanded = expanded.has(item.time);
    return (
      <View style={styles.row}>
        <RNBounceable
          bounceEffectIn={0.98}
          style={styles.rowSummary}
          onPress={() => toggle(item.time)}
        >
          <Text
            fontFamily={fonts.montserrat.medium}
            color={weatherColors.text}
            style={styles.time}
          >
            {hourLabel(item.time)}
          </Text>
          <WeatherIcon code={item.weatherCode} isDay={item.isDay} size={30} />
          <View style={styles.precip}>
            <Icon
              type={IconType.Ionicons}
              name="water-outline"
              size={14}
              color={weatherColors.textMuted}
            />
            <Text
              fontFamily={fonts.montserrat.regular}
              color={weatherColors.text}
              style={styles.precipText}
            >
              {percent(item.precipitationChance)}
            </Text>
          </View>
          <Text
            fontFamily={fonts.montserrat.regular}
            color={weatherColors.text}
            style={styles.temperature}
          >
            {degrees(item.temperature)}
          </Text>
          <View style={styles.wind}>
            {/* ? Arrow points where the wind is blowing to */}
            <Icon
              type={IconType.Ionicons}
              name="arrow-down"
              size={16}
              color={weatherColors.text}
              style={{ transform: [{ rotate: `${item.windDirection}deg` }] }}
            />
            <Text
              fontFamily={fonts.montserrat.regular}
              color={weatherColors.text}
              style={styles.windText}
            >
              {wind(item.windSpeed, item.windDirection)}
            </Text>
          </View>
          <Icon
            type={IconType.Ionicons}
            name={isExpanded ? "remove" : "add"}
            size={22}
            color={weatherColors.textMuted}
          />
        </RNBounceable>
        {isExpanded && (
          <View style={styles.details}>
            <Text
              fontFamily={fonts.montserrat.semiBold}
              color={weatherColors.text}
              style={styles.detailsTitle}
            >
              {`For the Hour: ${conditionLabel(item.weatherCode, item.isDay)}`}
            </Text>
            <View style={styles.detailsGrid}>
              {details(item).map(({ label, value }) => (
                <View key={label} style={styles.detailCell}>
                  <Text
                    fontFamily={fonts.montserrat.regular}
                    color={weatherColors.textMuted}
                    style={styles.detailLabel}
                  >
                    {label}
                  </Text>
                  <Text
                    fontFamily={fonts.montserrat.semiBold}
                    color={weatherColors.text}
                    style={styles.detailValue}
                  >
                    {value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.sheet}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.time}
        renderItem={renderHour}
        extraData={expanded}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section }) => (
          <Text
            fontFamily={fonts.montserrat.bold}
            color={weatherColors.text}
            style={styles.sectionHeader}
          >
            {section.title}
          </Text>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default HourlyView;

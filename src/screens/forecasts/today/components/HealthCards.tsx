import React from "react";
import { View } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
/**
 * ? Local Imports
 */
import styles from "./HealthCards.style";
import fonts from "@fonts";
import { weatherColors } from "@theme/weather";
import { aqiCategory, uvCategory } from "@services/weather/format";
import Text from "@shared-components/text-wrapper/TextWrapper";

interface IHealthCardsProps {
  uvIndexMax: number;
  usAqi: number | null;
}

interface IHealthRow {
  icon: string;
  title: string;
  subtitle: string;
  level: string;
}

const HealthCards: React.FC<IHealthCardsProps> = ({ uvIndexMax, usAqi }) => {
  const rows: IHealthRow[] = [
    {
      icon: "white-balance-sunny",
      title: "Skin Health",
      subtitle: `UV index up to ${Math.round(uvIndexMax)}`,
      level: uvCategory(uvIndexMax),
    },
  ];
  if (usAqi !== null) {
    rows.push({
      icon: "weather-windy",
      title: "Breathing",
      subtitle: `Air quality index ${Math.round(usAqi)}`,
      level: aqiCategory(usAqi),
    });
  }

  return (
    <View>
      {rows.map((row, index) => (
        <View
          key={row.title}
          style={[styles.row, index > 0 && styles.rowDivider]}
        >
          <View style={styles.iconCircle}>
            <Icon
              type={IconType.MaterialCommunityIcons}
              name={row.icon}
              size={22}
              color={weatherColors.text}
            />
          </View>
          <View style={styles.textContainer}>
            <Text
              fontFamily={fonts.montserrat.bold}
              color={weatherColors.text}
              style={styles.title}
            >
              {row.title}
            </Text>
            <Text
              fontFamily={fonts.montserrat.regular}
              color={weatherColors.textMuted}
              style={styles.subtitle}
            >
              {row.subtitle}
            </Text>
          </View>
          <Text
            fontFamily={fonts.montserrat.semiBold}
            color={weatherColors.text}
            style={styles.level}
          >
            {row.level}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default HealthCards;

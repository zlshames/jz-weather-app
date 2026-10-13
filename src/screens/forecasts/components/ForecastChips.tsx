import React from "react";
import { ScrollView } from "react-native";
import RNBounceable from "@freakycoder/react-native-bounceable";
/**
 * ? Local Imports
 */
import styles from "./ForecastChips.style";
import fonts from "@fonts";
import { weatherColors } from "@theme/weather";
import Text from "@shared-components/text-wrapper/TextWrapper";

export type ForecastView = "today" | "hourly" | "daily";

const CHIPS: { key: ForecastView; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "hourly", label: "Hourly" },
  { key: "daily", label: "Daily" },
];

interface IForecastChipsProps {
  selected: ForecastView;
  onSelect: (view: ForecastView) => void;
}

const ForecastChips: React.FC<IForecastChipsProps> = ({
  selected,
  onSelect,
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.container}
    contentContainerStyle={styles.content}
  >
    {CHIPS.map(({ key, label }) => {
      const isSelected = key === selected;
      return (
        <RNBounceable
          key={key}
          style={[styles.chip, isSelected && styles.chipSelected]}
          onPress={() => onSelect(key)}
        >
          <Text
            fontFamily={fonts.montserrat.medium}
            color={isSelected ? weatherColors.textOnDark : weatherColors.text}
            style={styles.chipText}
          >
            {label}
          </Text>
        </RNBounceable>
      );
    })}
  </ScrollView>
);

export default ForecastChips;

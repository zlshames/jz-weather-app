import React from "react";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
/**
 * ? Local Imports
 */
import { conditionIcon, conditionKind } from "@services/weather/weatherCodes";
import { weatherColors } from "@theme/weather";

/** Sky color behind the current conditions. */
export const heroColor = (code: number, isDay = true) => {
  if (!isDay) return weatherColors.heroNight;
  switch (conditionKind(code)) {
    case "clear":
    case "partly":
      return weatherColors.heroDay;
    case "cloudy":
    case "fog":
      return weatherColors.heroCloudy;
    default:
      return weatherColors.heroWet;
  }
};

interface IWeatherIconProps {
  code: number;
  isDay?: boolean;
  size?: number;
  color?: string;
}

export const weatherIconColor = (code: number, isDay = true) => {
  switch (conditionKind(code)) {
    case "clear":
    case "partly":
      return isDay ? weatherColors.sun : weatherColors.moon;
    case "rain":
      return weatherColors.rain;
    case "snow":
      return weatherColors.snow;
    case "storm":
      return weatherColors.storm;
    default:
      return weatherColors.cloud;
  }
};

const WeatherIcon: React.FC<IWeatherIconProps> = ({
  code,
  isDay = true,
  size = 28,
  color,
}) => (
  <Icon
    type={IconType.MaterialCommunityIcons}
    name={conditionIcon(code, isDay)}
    size={size}
    color={color ?? weatherIconColor(code, isDay)}
  />
);

export default WeatherIcon;

import React from "react";
import { View } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import RNBounceable from "@freakycoder/react-native-bounceable";
/**
 * ? Local Imports
 */
import styles from "./LocationHeader.style";
import fonts from "@fonts";
import { weatherColors } from "@theme/weather";
import Text from "@shared-components/text-wrapper/TextWrapper";

interface ILocationHeaderProps {
  placeName: string;
  isCurrentLocation?: boolean;
  alertCount: number;
  onPressLocation: () => void;
  onPressAlerts: () => void;
}

const LocationHeader: React.FC<ILocationHeaderProps> = ({
  placeName,
  isCurrentLocation,
  alertCount,
  onPressLocation,
  onPressAlerts,
}) => (
  <View style={styles.container}>
    <RNBounceable style={styles.locationPill} onPress={onPressLocation}>
      <Icon
        type={IconType.Ionicons}
        name={isCurrentLocation ? "navigate-outline" : "location-outline"}
        size={18}
        color={weatherColors.textOnDark}
      />
      <Text
        numberOfLines={1}
        fontFamily={fonts.montserrat.semiBold}
        color={weatherColors.textOnDark}
        style={styles.locationText}
      >
        {placeName}
      </Text>
      <Icon
        type={IconType.Ionicons}
        name="chevron-down"
        size={18}
        color={weatherColors.textOnDark}
      />
    </RNBounceable>
    <RNBounceable style={styles.circleButton} onPress={onPressAlerts}>
      <Icon
        type={IconType.Ionicons}
        name="notifications-outline"
        size={22}
        color={weatherColors.textOnDark}
      />
      {alertCount > 0 && (
        <View style={styles.badge}>
          <Text
            fontFamily={fonts.montserrat.bold}
            color={weatherColors.text}
            style={styles.badgeText}
          >
            {alertCount}
          </Text>
        </View>
      )}
    </RNBounceable>
  </View>
);

export default LocationHeader;

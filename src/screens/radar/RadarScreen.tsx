import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
/**
 * ? Local Imports
 */
import styles from "./RadarScreen.style";
import fonts from "@fonts";
import { weatherColors } from "@theme/weather";
import Text from "@shared-components/text-wrapper/TextWrapper";

// TODO: Build the radar map. It needs a map library (e.g. react-native-maps or
// Mapbox) plus a radar tile source, which are new native dependencies.
const RadarScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text
        fontFamily={fonts.montserrat.bold}
        color={weatherColors.textOnDark}
        style={styles.title}
      >
        Radar
      </Text>
      <View style={styles.sheet}>
        <Icon
          type={IconType.MaterialCommunityIcons}
          name="radar"
          size={56}
          color={weatherColors.textMuted}
        />
        <Text
          fontFamily={fonts.montserrat.bold}
          color={weatherColors.text}
          style={styles.heading}
        >
          Radar is coming soon
        </Text>
        <Text
          fontFamily={fonts.montserrat.regular}
          color={weatherColors.textMuted}
          style={styles.body}
        >
          An animated precipitation map for your location will live here.
        </Text>
      </View>
    </View>
  );
};

export default RadarScreen;

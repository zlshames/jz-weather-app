import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as NavigationService from "react-navigation-helpers";
import RNBounceable from "@freakycoder/react-native-bounceable";
/**
 * ? Local Imports
 */
import styles from "./ForecastsScreen.style";
import LocationHeader from "./components/LocationHeader";
import ForecastChips, { ForecastView } from "./components/ForecastChips";
import TodayView from "./today/TodayView";
import HourlyView from "./hourly/HourlyView";
import DailyView from "./daily/DailyView";
/**
 * ? Shared Imports
 */
import { SCREENS } from "@shared-constants";
import fonts from "@fonts";
import { weatherColors } from "@theme/weather";
import { useWeather } from "@services/weather/WeatherContext";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { heroColor } from "@shared-components/weather-icon/WeatherIcon";

const ForecastsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { place, weather, status, error, refreshing, refresh, locateMe } =
    useWeather();
  const [view, setView] = useState<ForecastView>("today");
  const [selectedDay, setSelectedDay] = useState(0);

  const openDaily = (dayIndex: number) => {
    setSelectedDay(dayIndex);
    setView("daily");
  };
  const openSearch = () => NavigationService.navigate(SCREENS.SEARCH);
  const openAlerts = () => NavigationService.navigate(SCREENS.ALERTS);

  // ? Only show forecast views once data for the current place has loaded
  const ready = status === "ready" ? weather : null;
  const backgroundColor =
    ready && view === "today"
      ? heroColor(
          ready.forecast.current.weatherCode,
          ready.forecast.current.isDay,
        )
      : weatherColors.navy;

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */

  const Button = ({
    label,
    onPress,
  }: {
    label: string;
    onPress: () => void;
  }) => (
    <RNBounceable style={styles.button} onPress={onPress}>
      <Text
        fontFamily={fonts.montserrat.semiBold}
        color={weatherColors.text}
        style={styles.buttonText}
      >
        {label}
      </Text>
    </RNBounceable>
  );

  const StatusMessage = () => {
    if (status === "no-location") {
      return (
        <View style={styles.status}>
          <Text
            fontFamily={fonts.montserrat.bold}
            color={weatherColors.textOnDark}
            style={styles.statusTitle}
          >
            Where are you?
          </Text>
          <Text
            fontFamily={fonts.montserrat.regular}
            color={weatherColors.textOnDarkMuted}
            style={styles.statusText}
          >
            Allow location access for local weather, or search for a city.
          </Text>
          <Button label="Search for a city" onPress={openSearch} />
          <Button label="Use my location" onPress={locateMe} />
        </View>
      );
    }
    if (status === "error") {
      return (
        <View style={styles.status}>
          <Text
            fontFamily={fonts.montserrat.regular}
            color={weatherColors.textOnDarkMuted}
            style={styles.statusText}
          >
            {error}
          </Text>
          <Button label="Try again" onPress={place ? refresh : locateMe} />
        </View>
      );
    }
    return (
      <View style={styles.status}>
        <ActivityIndicator size="large" color={weatherColors.textOnDark} />
        <Text
          fontFamily={fonts.montserrat.medium}
          color={weatherColors.textOnDarkMuted}
          style={styles.statusText}
        >
          {status === "locating"
            ? "Finding your location…"
            : "Loading forecast…"}
        </Text>
      </View>
    );
  };

  const Title = ({ children }: { children: string }) => (
    <Text
      fontFamily={fonts.montserrat.bold}
      color={weatherColors.textOnDark}
      style={styles.title}
    >
      {children}
    </Text>
  );

  const Content = () => {
    if (!ready) return <StatusMessage />;
    if (view === "hourly") {
      return (
        <>
          <Title>Hourly</Title>
          <HourlyView
            forecast={ready.forecast}
            refreshing={refreshing}
            onRefresh={refresh}
          />
        </>
      );
    }
    if (view === "daily") {
      return (
        <>
          <Title>Daily</Title>
          <DailyView
            forecast={ready.forecast}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            refreshing={refreshing}
            onRefresh={refresh}
          />
        </>
      );
    }
    return (
      <TodayView
        weather={ready}
        refreshing={refreshing}
        onRefresh={refresh}
        onOpenDaily={openDaily}
        onOpenAlerts={openAlerts}
      />
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor, paddingTop: insets.top }]}
    >
      <LocationHeader
        placeName={place?.name ?? "Locating…"}
        isCurrentLocation={place?.isCurrentLocation}
        alertCount={weather?.alerts.length ?? 0}
        onPressLocation={openSearch}
        onPressAlerts={openAlerts}
      />
      <View style={styles.content}>{Content()}</View>
      {ready && <ForecastChips selected={view} onSelect={setView} />}
    </View>
  );
};

export default ForecastsScreen;

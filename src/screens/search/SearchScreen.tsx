import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as NavigationService from "react-navigation-helpers";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import RNBounceable from "@freakycoder/react-native-bounceable";
/**
 * ? Local Imports
 */
import styles from "./SearchScreen.style";
import fonts from "@fonts";
import { weatherColors } from "@theme/weather";
import { IPlace } from "@services/weather/types";
import { searchPlaces } from "@services/weather/api";
import { useWeather } from "@services/weather/WeatherContext";
import Text from "@shared-components/text-wrapper/TextWrapper";

const SEARCH_DELAY_MS = 350;
const MIN_QUERY_LENGTH = 2;

const SearchScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { selectPlace, locateMe } = useWeather();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IPlace[]>([]);
  const [searching, setSearching] = useState(false);
  const [failed, setFailed] = useState(false);

  // ? Debounce typing, and drop results for queries that are no longer current
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setSearching(false);
      return undefined;
    }
    let cancelled = false;
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const places = await searchPlaces(trimmed);
        if (!cancelled) {
          setResults(places);
          setFailed(false);
        }
      } catch (e) {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, SEARCH_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const choose = (place: IPlace) => {
    selectPlace(place);
    NavigationService.goBack();
  };

  const chooseCurrentLocation = () => {
    locateMe();
    NavigationService.goBack();
  };

  const renderResult = ({ item }: { item: IPlace }) => (
    <RNBounceable
      bounceEffectIn={0.98}
      style={styles.row}
      onPress={() => choose(item)}
    >
      <Icon
        type={IconType.Ionicons}
        name="location-outline"
        size={22}
        color={weatherColors.textMuted}
      />
      <View style={styles.rowText}>
        <Text
          fontFamily={fonts.montserrat.semiBold}
          color={weatherColors.text}
          style={styles.placeName}
        >
          {item.name}
        </Text>
        {!!item.region && (
          <Text
            fontFamily={fonts.montserrat.regular}
            color={weatherColors.textMuted}
            style={styles.placeRegion}
          >
            {item.region}
          </Text>
        )}
      </View>
    </RNBounceable>
  );

  const ListHeader = () => (
    <RNBounceable
      bounceEffectIn={0.98}
      style={styles.row}
      onPress={chooseCurrentLocation}
    >
      <Icon
        type={IconType.Ionicons}
        name="navigate"
        size={22}
        color={weatherColors.rain}
      />
      <View style={styles.rowText}>
        <Text
          fontFamily={fonts.montserrat.semiBold}
          color={weatherColors.rain}
          style={styles.placeName}
        >
          Use my current location
        </Text>
      </View>
    </RNBounceable>
  );

  const ListEmpty = () => {
    if (searching) {
      return (
        <ActivityIndicator style={styles.message} color={weatherColors.text} />
      );
    }
    if (query.trim().length < MIN_QUERY_LENGTH) return null;
    return (
      <Text
        fontFamily={fonts.montserrat.regular}
        color={weatherColors.textMuted}
        style={styles.message}
      >
        {failed ? "Search failed. Check your connection." : "No places found."}
      </Text>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <RNBounceable
          style={styles.backButton}
          onPress={() => NavigationService.goBack()}
        >
          <Icon
            type={IconType.Ionicons}
            name="arrow-back"
            size={24}
            color={weatherColors.textOnDark}
          />
        </RNBounceable>
        <View style={styles.searchField}>
          <Icon
            type={IconType.Ionicons}
            name="search"
            size={18}
            color={weatherColors.textMuted}
          />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search city or zip code"
            placeholderTextColor={weatherColors.textMuted}
            returnKeyType="search"
            autoCorrect={false}
            style={styles.input}
          />
        </View>
      </View>
      <FlatList
        style={styles.list}
        data={results}
        keyExtractor={(item) => `${item.latitude},${item.longitude}`}
        renderItem={renderResult}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default SearchScreen;

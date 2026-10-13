import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as NavigationService from "react-navigation-helpers";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import RNBounceable from "@freakycoder/react-native-bounceable";
/**
 * ? Local Imports
 */
import styles, { RADAR_LEGEND } from "./RadarScreen.style";
import { LOCATION_ZOOM, OVERVIEW_ZOOM, radarMapHtml } from "./radarMapHtml";
import RadarTimeline from "./components/RadarTimeline";
import { SCREENS } from "@shared-constants";
import fonts from "@fonts";
import { weatherColors } from "@theme/weather";
import { useWeather } from "@services/weather/WeatherContext";
import { fetchRadarFrames, IRadarFrames } from "@services/weather/radar";
import { timestampLabel } from "@services/weather/format";
import Text from "@shared-components/text-wrapper/TextWrapper";

const FRAME_INTERVAL_MS = 500;
// ? Linger on the latest frame for a moment before the loop restarts
const LAST_FRAME_HOLD_TICKS = 3;
// ? RainViewer publishes a new frame every 10 minutes
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const DEFAULT_VIEW = { latitude: 39.5, longitude: -98.35, zoom: OVERVIEW_ZOOM };

const RadarScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { place, weather } = useWeather();
  const webView = useRef<WebView>(null);
  // ? Bumped on every "ready" message so a reloaded page gets its state re-sent
  const [mapSession, setMapSession] = useState(0);
  const [mapFailed, setMapFailed] = useState(false);
  const [radar, setRadar] = useState<IRadarFrames | null>(null);
  const [radarFailed, setRadarFailed] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frameIndexRef = useRef(frameIndex);
  frameIndexRef.current = frameIndex;

  const utcOffsetSeconds =
    weather?.forecast.utcOffsetSeconds ?? -new Date().getTimezoneOffset() * 60;
  const lastFrame = radar ? radar.frames.length - 1 : 0;

  const run = useCallback((script: string) => {
    webView.current?.injectJavaScript(`${script}; true;`);
  }, []);

  const loadFrames = useCallback(async () => {
    try {
      const result = await fetchRadarFrames();
      setRadar(result);
      setRadarFailed(false);
      setFrameIndex(result.frames.length - 1);
    } catch (e) {
      setRadarFailed(true);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      // ? The map is light, so the status bar needs dark icons here
      StatusBar.setBarStyle("dark-content");
      loadFrames();
      const timer = setInterval(loadFrames, REFRESH_INTERVAL_MS);
      return () => {
        clearInterval(timer);
        setPlaying(false);
        StatusBar.setBarStyle("light-content");
      };
    }, [loadFrames]),
  );

  const recenter = useCallback(() => {
    if (place) {
      run(
        `window.radar.center(${place.latitude}, ${place.longitude}, ${LOCATION_ZOOM}, true)`,
      );
    } else {
      const { latitude, longitude, zoom } = DEFAULT_VIEW;
      run(`window.radar.center(${latitude}, ${longitude}, ${zoom}, false)`);
    }
  }, [place, run]);

  useEffect(() => {
    if (mapSession) recenter();
  }, [mapSession, recenter]);

  // ? Declared before the showFrame effect so new layers exist before one is shown
  useEffect(() => {
    if (mapSession && radar) {
      run(
        `window.radar.setFrames(${JSON.stringify(radar.host)}, ${JSON.stringify(
          radar.frames,
        )})`,
      );
    }
  }, [mapSession, radar, run]);

  useEffect(() => {
    if (mapSession && radar) run(`window.radar.showFrame(${frameIndex})`);
  }, [mapSession, radar, frameIndex, run]);

  useEffect(() => {
    if (!playing || !radar) return undefined;
    let held = 0;
    const timer = setInterval(() => {
      const index = frameIndexRef.current;
      if (index < lastFrame) {
        setFrameIndex(index + 1);
      } else if (held < LAST_FRAME_HOLD_TICKS) {
        held += 1;
      } else {
        held = 0;
        setFrameIndex(0);
      }
    }, FRAME_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [playing, radar, lastFrame]);

  const togglePlaying = () => {
    if (!playing && frameIndex === lastFrame) setFrameIndex(0);
    setPlaying(!playing);
  };

  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === "ready") {
        setMapFailed(false);
        setMapSession((session) => session + 1);
      } else if (message.type === "error") {
        setMapFailed(true);
      }
    } catch (e) {
      // ? Ignore messages that aren't ours
    }
  };

  const retryMap = () => {
    setMapFailed(false);
    webView.current?.reload();
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */

  const Legend = () => (
    <View style={styles.legend}>
      <Text
        fontFamily={fonts.montserrat.medium}
        color={weatherColors.textMuted}
        style={styles.legendText}
      >
        Light
      </Text>
      <View style={styles.legendBar}>
        {RADAR_LEGEND.map((color) => (
          <View
            key={color}
            style={[styles.legendSegment, { backgroundColor: color }]}
          />
        ))}
      </View>
      <Text
        fontFamily={fonts.montserrat.medium}
        color={weatherColors.textMuted}
        style={styles.legendText}
      >
        Heavy
      </Text>
    </View>
  );

  const Controls = () => {
    if (radarFailed && !radar) {
      return (
        <View style={styles.panelMessage}>
          <Text
            fontFamily={fonts.montserrat.medium}
            color={weatherColors.textMuted}
            style={styles.messageText}
          >
            Radar data is unavailable right now.
          </Text>
          <RNBounceable style={styles.textButton} onPress={loadFrames}>
            <Text
              fontFamily={fonts.montserrat.bold}
              color={weatherColors.rain}
              style={styles.messageText}
            >
              Try again
            </Text>
          </RNBounceable>
        </View>
      );
    }
    if (!radar) {
      return (
        <ActivityIndicator
          style={styles.panelMessage}
          color={weatherColors.text}
        />
      );
    }
    return (
      <>
        <View style={styles.controlsRow}>
          <RNBounceable style={styles.playButton} onPress={togglePlaying}>
            <Icon
              type={IconType.Ionicons}
              name={playing ? "pause" : "play"}
              size={22}
              color={weatherColors.textOnDark}
            />
          </RNBounceable>
          <View style={styles.timeText}>
            <Text
              fontFamily={fonts.montserrat.bold}
              color={weatherColors.text}
              style={styles.timeLabel}
            >
              {timestampLabel(radar.frames[frameIndex].time, utcOffsetSeconds)}
            </Text>
            <Text
              fontFamily={fonts.montserrat.regular}
              color={weatherColors.textMuted}
              style={styles.subLabel}
            >
              Past 2 hours of precipitation
            </Text>
          </View>
          <RNBounceable style={styles.recenterButton} onPress={recenter}>
            <Icon
              type={IconType.Ionicons}
              name="locate"
              size={22}
              color={weatherColors.text}
            />
          </RNBounceable>
        </View>
        <RadarTimeline
          frames={radar.frames}
          frameIndex={frameIndex}
          utcOffsetSeconds={utcOffsetSeconds}
          onScrubStart={() => setPlaying(false)}
          onSelectFrame={setFrameIndex}
        />
        <Legend />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webView}
        style={styles.map}
        originWhitelist={["*"]}
        source={{ html: radarMapHtml }}
        onMessage={onMessage}
        onError={() => setMapFailed(true)}
        overScrollMode="never"
        setSupportMultipleWindows={false}
      />
      {mapFailed && (
        <View style={styles.mapError}>
          <Text
            fontFamily={fonts.montserrat.medium}
            color={weatherColors.textMuted}
            style={styles.messageText}
          >
            {"We couldn't load the map. Check your connection."}
          </Text>
          <RNBounceable style={styles.textButton} onPress={retryMap}>
            <Text
              fontFamily={fonts.montserrat.bold}
              color={weatherColors.rain}
              style={styles.messageText}
            >
              Try again
            </Text>
          </RNBounceable>
        </View>
      )}
      <RNBounceable
        style={[styles.locationPill, { top: insets.top + 8 }]}
        onPress={() => NavigationService.navigate(SCREENS.SEARCH)}
      >
        <Icon
          type={IconType.Ionicons}
          name={
            place?.isCurrentLocation ? "navigate-outline" : "location-outline"
          }
          size={16}
          color={weatherColors.textOnDark}
        />
        <Text
          numberOfLines={1}
          fontFamily={fonts.montserrat.semiBold}
          color={weatherColors.textOnDark}
          style={styles.locationText}
        >
          {place?.name ?? "Radar"}
        </Text>
        <Icon
          type={IconType.Ionicons}
          name="chevron-down"
          size={16}
          color={weatherColors.textOnDark}
        />
      </RNBounceable>
      <View style={styles.panel}>{Controls()}</View>
    </View>
  );
};

export default RadarScreen;

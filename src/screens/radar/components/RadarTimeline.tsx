import React, { useRef, useState } from "react";
import { GestureResponderEvent, LayoutChangeEvent, View } from "react-native";
/**
 * ? Local Imports
 */
import styles from "./RadarTimeline.style";
import fonts from "@fonts";
import { weatherColors } from "@theme/weather";
import { IRadarFrame } from "@services/weather/radar";
import { onTheHourLabel } from "@services/weather/format";
import Text from "@shared-components/text-wrapper/TextWrapper";

// ? Frames are 10 minutes apart; 3 frames keeps hour labels clear of "NOW"
const NOW_LABEL_CLEARANCE = 3;

interface IRadarTimelineProps {
  frames: IRadarFrame[];
  frameIndex: number;
  utcOffsetSeconds: number;
  onScrubStart: () => void;
  onSelectFrame: (index: number) => void;
}

const RadarTimeline: React.FC<IRadarTimelineProps> = ({
  frames,
  frameIndex,
  utcOffsetSeconds,
  onScrubStart,
  onSelectFrame,
}) => {
  const [width, setWidth] = useState(0);
  // ? Screen x of the track's left edge, taken when a touch starts. Move events'
  // ? locationX isn't reliably relative to the track on Android, so use pageX.
  const trackLeft = useRef(0);
  const last = Math.max(frames.length - 1, 1);
  const position = (index: number) => `${(index / last) * 100}%`;

  const selectAt = (event: GestureResponderEvent) => {
    if (!width) return;
    const x = event.nativeEvent.pageX - trackLeft.current;
    const fraction = Math.min(Math.max(x / width, 0), 1);
    onSelectFrame(Math.round(fraction * last));
  };

  return (
    <View>
      <View
        style={styles.touchArea}
        onLayout={(event: LayoutChangeEvent) =>
          setWidth(event.nativeEvent.layout.width)
        }
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(event) => {
          trackLeft.current =
            event.nativeEvent.pageX - event.nativeEvent.locationX;
          onScrubStart();
          selectAt(event);
        }}
        onResponderMove={selectAt}
      >
        <View style={styles.track} pointerEvents="none">
          <View style={[styles.progress, { width: position(frameIndex) }]} />
        </View>
        <View
          pointerEvents="none"
          style={[styles.thumb, { left: position(frameIndex) }]}
        />
      </View>
      <View style={styles.labels} pointerEvents="none">
        {frames.map((frame, index) => {
          const isLast = index === frames.length - 1;
          // ? Hour labels right before "NOW" would overlap it
          if (!isLast && frames.length - 1 - index < NOW_LABEL_CLEARANCE) {
            return null;
          }
          const label = isLast
            ? "NOW"
            : onTheHourLabel(frame.time, utcOffsetSeconds);
          if (!label) return null;
          return (
            <Text
              key={frame.time}
              fontFamily={
                isLast ? fonts.montserrat.bold : fonts.montserrat.medium
              }
              color={isLast ? weatherColors.text : weatherColors.textMuted}
              style={[
                styles.label,
                isLast ? styles.nowLabel : { left: position(index) },
              ]}
            >
              {label}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

export default RadarTimeline;

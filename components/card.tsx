import { Text, StyleSheet } from "react-native";
import React from "react";
import colors from "@/constants/colors";
import { SharedValue } from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  interpolate,
  withTiming,
  Easing
} from "react-native-reanimated";
import {
  Gesture,
  Directions,
  State,
  GestureDetector,
} from "react-native-gesture-handler";
import { CardData } from "@/constants/types";


type CardProps = {
  currentIndex: SharedValue<number>;
  previousIndex: SharedValue<number>;
  animatedValue: SharedValue<number>;
  stackPos: number;
  cardData: CardData;
  dataLength: number;
  maxVisibleItems: number;
};

const CardComponent = React.memo((props: CardProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      props.animatedValue.value,
      [props.stackPos - 1, props.stackPos, props.stackPos + 1],
      [-40, 1, 120],
    );

    const translateY2 = interpolate(
      props.animatedValue.value,
      [props.stackPos - 1, props.stackPos, props.stackPos + 1],
      [-40, 1, 10],
    );

    const scale = interpolate(
      props.animatedValue.value,
      [props.stackPos - 1, props.stackPos, props.stackPos + 1],
      [0.95, 1, 1.05],
    );

    const opacity = interpolate(
      props.animatedValue.value,
      [props.stackPos - 1, props.stackPos, props.stackPos + 1],
      [1, 1, 0],
    );

    const finalOpacity = props.stackPos < props.currentIndex.value + props.maxVisibleItems - 1
      ? opacity
      : props.stackPos == props.currentIndex.value + props.maxVisibleItems - 1
        ? withTiming(1, { duration: 500, easing: Easing.bezier(0.5, 0, 0.75, 0) })
        : withTiming(0, { duration: 500, easing: Easing.bezier(0.5, 0, 0.75, 0) });

    const baseTranslateY = props.stackPos === props.previousIndex.value ? translateY2 : translateY;
    const finalTranslateY = baseTranslateY;
    const finalScale = scale;

    return {
      transform: [
        { translateY: finalTranslateY },
        { scale: finalScale },
      ],
      opacity: finalOpacity,
    };
  });

  const upFlingGesture = Gesture.Fling().direction(Directions.UP).onEnd((event) => {
    if (event.state === State.END) {
      if (props.currentIndex.value !== 0) {
        props.animatedValue.value = withTiming(
          (props.currentIndex.value -= 1),
        );

        props.previousIndex.value = props.currentIndex.value - 1;
      }
    }
  });

  const downFlingGesture = Gesture.Fling().direction(Directions.DOWN).onEnd((event) => {
    if (event.state === State.END) {
      if (props.currentIndex.value !== props.dataLength - 1) {
        props.animatedValue.value = withTiming(
          (props.currentIndex.value += 1),
        );

        props.previousIndex.value = props.currentIndex.value;
      }
    }
  });

  return (
    <GestureDetector gesture={Gesture.Exclusive(upFlingGesture, downFlingGesture)}
    >
      <Animated.View
        style={[
          {
            zIndex: props.dataLength - props.stackPos,
            ...styles.wordCardContainer,
          },
          animatedStyle,
        ]}
      >
        <Text style={styles.wordText}>{props.cardData.word || 'Unknown word'}</Text>
        {props.cardData.phonetic && (
          <Text style={styles.phoneticText}>{props.cardData.phonetic || props.cardData.phonetics[0].text}</Text>
        )}
        <Text style={styles.definitionText}>
          {props.cardData.meanings?.[0]?.definitions?.[0]?.definition || 'No definition available'}
        </Text>
        {props.cardData.meanings?.[0]?.partOfSpeech && (
          <Text style={styles.partOfSpeechText}>
            {props.cardData.meanings[0].partOfSpeech}
          </Text>
        )}
      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  wordCardContainer: {
    position: "absolute",
    height: "78%",
    width: "95%",
    borderRadius: 20,
    backgroundColor: colors.primaryColor,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.4 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  wordText: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
    textTransform: "capitalize",
  },
  phoneticText: {
    fontSize: 18,
    color: colors.text,
    opacity: 0.8,
    marginBottom: 16,
    fontStyle: "italic",
  },
  definitionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: "left",
    marginBottom: 12,
  },
  partOfSpeechText: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    fontStyle: "italic",
    marginTop: "auto",
  },
});

export default CardComponent;

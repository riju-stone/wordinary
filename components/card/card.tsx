import { Text, StyleSheet } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { SharedValue } from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  interpolate,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  Directions,
  State,
  GestureDetector,
} from "react-native-gesture-handler";

type CardData = {
  word: string;
  pronounciation: string;
  meaning: string;
};

type CardProps = {
  currentIndex: SharedValue<number>;
  previousIndex: SharedValue<number>;
  animatedValue: SharedValue<number>;
  stackPos: number;
  cardData: CardData;
  dataLength: number;
  maxVisibleItems: number;
};

const CardComponent = (props: CardProps) => {
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

    return {
      transform: [
        {
          translateY:
            props.stackPos === props.previousIndex.value
              ? translateY2
              : translateY,
        },
        { scale },
      ],
      opacity:
        props.stackPos < props.currentIndex.value + props.maxVisibleItems - 1
          ? opacity
          : props.stackPos ==
            props.currentIndex.value + props.maxVisibleItems - 1
            ? withTiming(1, { duration: 400 })
            : withTiming(0, { duration: 400 }),
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
        <Text>{props.cardData.word}</Text>
        <Text>{props.cardData.pronounciation}</Text>
        <Text>{props.cardData.meaning}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  wordCardContainer: {
    position: "absolute",
    height: "80%",
    width: "95%",
    borderRadius: 20,
    backgroundColor: Colors.primaryColor,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.4 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10,
  },
});

export default CardComponent;

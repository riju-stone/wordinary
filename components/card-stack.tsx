import { View, StyleSheet, Text } from "react-native";
import React from "react";
import { useSharedValue } from "react-native-reanimated";
import CardComponent from "./card";
import { CardData } from "@/constants/types";

type CardStackProps = {
  maxVisibleItems: number;
  cardsData: Array<CardData>;
};

const CardStackComponent = React.memo(({ maxVisibleItems, cardsData }: CardStackProps) => {
  const animatedValue = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const previousIndex = useSharedValue(0);

  return (
    <View style={styles.cardStackContainer}>
      {cardsData.map((wordData, index) => {
        return (
          <CardComponent
            key={`card-${index}`}
            stackPos={index}
            currentIndex={currentIndex}
            previousIndex={previousIndex}
            animatedValue={animatedValue}
            cardData={wordData}
            dataLength={cardsData.length}
            maxVisibleItems={maxVisibleItems}
          />
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  cardStackContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default CardStackComponent;

import { View, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import CardStackComponent from "@/components/card-stack/card-stack";
import Colors from "@/constants/Colors";
import React from "react";

export default function HomeLayout() {
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.homeContainerTitle}>Word of the Day</Text>
      <CardStackComponent maxVisibleItems={3} />
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  homeContainerTitle: {
    position: "absolute",
    top: "5%",
    fontSize: 45,
    fontWeight: "800",
    color: Colors.text,
  },
});

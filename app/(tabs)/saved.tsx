import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function SavedLayout() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookmarks</Text>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#24243D",
  },
  title: {
    color: "white",
    fontSize: 45,
    fontWeight: "800",
  },
});

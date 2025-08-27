import React from "react";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";

import { BlurView } from "expo-blur";

import Colors from "@/constants/colors";

import HomeIcon from "@/assets/icons/home.svg";
import SearchIcon from "@/assets/icons/search.svg";
import BookmarkIcon from "@/assets/icons/bookmark.svg";
import SettingsIcon from "@/assets/icons/settings.svg";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        tabBarStyle:
          Platform.OS === "ios" ? styles.tabBarIos : styles.tabBarAndroid,
        headerShown: false,
        tabBarShowLabel: false,

        tabBarBackground: () => (
          <BlurView
            tint="light"
            intensity={20}
            style={StyleSheet.absoluteFillObject}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <HomeIcon name="home" color={Colors.focusedColor} />
            ) : (
              <HomeIcon name="home" color={Colors.unfocusedColor} />
            ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <SearchIcon name="search" color={Colors.focusedColor} />
            ) : (
              <SearchIcon name="search" color={Colors.unfocusedColor} />
            ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <BookmarkIcon name="paperclip" color={Colors.focusedColor} />
            ) : (
              <BookmarkIcon name="paperclip" color={Colors.unfocusedColor} />
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <SettingsIcon name="gear" color={Colors.focusedColor} />
            ) : (
              <SettingsIcon name="gear" color={Colors.unfocusedColor} />
            ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarAndroid: {
    position: "absolute",
    backgroundColor: "rgba(42, 42, 72, 0.8)",
    elevation: 0,
    height: 80,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: "18%",
    marginRight: "18%",
    marginBottom: 30,
    borderTopWidth: 0,
    overflow: "hidden",
    borderRadius: 20,
  },
  tabBarIos: {
    position: "absolute",
    backgroundColor: "rgba(42, 42, 72, 0.8)",
    elevation: 10,
    paddingTop: 20,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: "18%",
    marginRight: "18%",
    marginBottom: 25,
    borderTopWidth: 0,
    overflow: "hidden",
    borderRadius: 20,
  },
});

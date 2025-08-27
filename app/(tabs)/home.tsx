import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import CardStackComponent from "@/components/card-stack";
import colors from "@/constants/colors";
import React, { useEffect, useState, useCallback } from "react";
import { CardData } from "@/constants/types";
import WordService from "@/services/wordService";

export default function HomeLayout() {
  const [cardData, setCardData] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const words = await WordService.getDailyWords();
      setCardData(words);
    } catch (err) {
      console.error('Error fetching word data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch words');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCardData();
  }, []);

  if (error) {
    return (
      <View style={styles.homeContainer}>
        <Text style={styles.homeContainerTitle}>Word</Text>
        <Text style={styles.homeContainerTitle}>of the Day</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Oops! Something went wrong</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <Text style={styles.retryText} onPress={fetchCardData}>
            Tap to retry
          </Text>
        </View>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.homeContainerTitle}>Word</Text>
      <Text style={styles.homeContainerTitle}>of the Day</Text>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryColor} />
          <Text style={styles.loadingText}>Getting today's words...</Text>
        </View>
      ) : (
        <CardStackComponent
          maxVisibleItems={3}
          cardsData={cardData}
        />
      )}
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
    backgroundColor: colors.background,
    flex: 1,
  },
  homeContainerTitle: {
    width: "85%",
    top: "15%",
    fontSize: 60,
    fontWeight: "800",
    color: colors.text,
    textAlign: "left",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 24,
  },
  retryText: {
    fontSize: 16,
    color: colors.primaryColor,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

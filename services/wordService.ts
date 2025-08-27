import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardData } from '@/constants/types';

interface CachedWordData {
  data: CardData[];
  timestamp: number;
  date: string;
}

class WordService {
  private static readonly CACHE_KEY = 'daily_words';
  private static readonly WORDS_COUNT = 5;
  private static readonly RANDOM_WORDS_API = 'https://random-word-api.vercel.app/api';
  private static readonly DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';

  /**
   * Get today's date in YYYY-MM-DD format
   */
  private static getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Check if cached data is from today
   */
  private static isDataFromToday(cachedData: CachedWordData): boolean {
    const today = this.getTodayDate();
    return cachedData.date === today;
  }

  /**
   * Fetch random words from API
   */
  private static async fetchRandomWords(): Promise<string[]> {
    try {
      const response = await fetch(`${this.RANDOM_WORDS_API}?words=${this.WORDS_COUNT}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch random words: ${response.status}`);
      }
      const words = await response.json();
      return Array.isArray(words) ? words : [];
    } catch (error) {
      console.error('Error fetching random words:', error);
      throw error;
    }
  }

  /**
   * Fetch dictionary data for a single word
   */
  private static async fetchWordDefinition(word: string): Promise<CardData | null> {
    try {
      const response = await fetch(`${this.DICTIONARY_API}/${word}`);
      if (!response.ok) {
        if (response.status === 404) {
          // Word not found in dictionary, return null to filter it out
          return null;
        }
        throw new Error(`Failed to fetch definition for ${word}: ${response.status}`);
      }

      const data = await response.json();

      // Validate the response structure
      if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
      }

      const wordData = data[0];

      // Ensure required fields exist
      if (!wordData.word || !wordData.meanings || !Array.isArray(wordData.meanings) || wordData.meanings.length === 0) {
        return null;
      }

      // Ensure at least one meaning has definitions
      const validMeanings = wordData.meanings.filter((meaning: any) =>
        meaning.definitions && Array.isArray(meaning.definitions) && meaning.definitions.length > 0
      );

      if (validMeanings.length === 0) {
        return null;
      }

      // Return properly formatted word data
      return {
        word: wordData.word,
        phonetic: wordData.phonetic || '',
        phonetics: wordData.phonetics || [],
        meanings: validMeanings.map((meaning: any) => ({
          partOfSpeech: meaning.partOfSpeech || '',
          definitions: meaning.definitions.map((def: any) => ({
            definition: def.definition || '',
            example: def.example || ''
          }))
        }))
      };
    } catch (error) {
      console.error(`Error fetching definition for word "${word}":`, error);
      return null;
    }
  }

  /**
   * Fetch dictionary data for all words, filtering out invalid ones
   */
  private static async fetchWordsDefinitions(words: string[]): Promise<CardData[]> {
    const promises = words.map(word => this.fetchWordDefinition(word));
    const results = await Promise.all(promises);

    // Filter out null results (words without valid dictionary data)
    return results.filter((data): data is CardData => data !== null);
  }

  /**
   * Cache word data to AsyncStorage
   */
  private static async cacheWordData(data: CardData[]): Promise<void> {
    try {
      const cacheData: CachedWordData = {
        data,
        timestamp: Date.now(),
        date: this.getTodayDate()
      };

      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error caching word data:', error);
      // Don't throw error, as this is not critical for app functionality
    }
  }

  /**
   * Get cached word data from AsyncStorage
   */
  private static async getCachedWordData(): Promise<CardData[] | null> {
    try {
      const cachedDataString = await AsyncStorage.getItem(this.CACHE_KEY);
      if (!cachedDataString) {
        return null;
      }

      const cachedData: CachedWordData = JSON.parse(cachedDataString);

      // Check if data is from today
      if (this.isDataFromToday(cachedData)) {
        return cachedData.data;
      }

      // Data is old, remove it
      await AsyncStorage.removeItem(this.CACHE_KEY);
      return null;
    } catch (error) {
      console.error('Error retrieving cached word data:', error);
      // Clear corrupted cache
      await AsyncStorage.removeItem(this.CACHE_KEY);
      return null;
    }
  }

  /**
   * Main method to get daily words - checks cache first, then fetches if needed
   */
  public static async getDailyWords(): Promise<CardData[]> {
    try {
      // First, try to get cached data
      const cachedData = await this.getCachedWordData();
      if (cachedData && cachedData.length > 0) {
        return cachedData;
      }

      // No valid cached data, fetch new words
      const randomWords = await this.fetchRandomWords();
      if (randomWords.length === 0) {
        throw new Error('No random words received from API');
      }

      // Fetch definitions for all words and filter out invalid ones
      const wordsWithDefinitions = await this.fetchWordsDefinitions(randomWords);

      if (wordsWithDefinitions.length === 0) {
        throw new Error('No valid word definitions found');
      }

      // Cache the new data
      await this.cacheWordData(wordsWithDefinitions);

      return wordsWithDefinitions;
    } catch (error) {
      console.error('Error getting daily words:', error);
      throw error;
    }
  }

  /**
   * Force refresh - clears cache and fetches new data
   */
  public static async forceRefresh(): Promise<CardData[]> {
    try {
      await AsyncStorage.removeItem(this.CACHE_KEY);
      return await this.getDailyWords();
    } catch (error) {
      console.error('Error during force refresh:', error);
      throw error;
    }
  }

  /**
   * Clear cache - useful for testing or manual cache clearing
   */
  public static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

export default WordService;

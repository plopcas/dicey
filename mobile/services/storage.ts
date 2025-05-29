import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiceConfiguration, RollResult } from '../shared/types';

const STORAGE_KEYS = {
  CONFIGURATIONS: '@dicey_configurations',
  ROLL_HISTORY: '@dicey_roll_history',
} as const;

export class MobileStorageService {
  static async saveConfigurations(configurations: DiceConfiguration[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CONFIGURATIONS, JSON.stringify(configurations));
    } catch (error) {
      console.error('Error saving configurations:', error);
    }
  }

  static async getConfigurations(): Promise<DiceConfiguration[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CONFIGURATIONS);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((config: any) => ({
        ...config,
        createdAt: new Date(config.createdAt),
      }));
    } catch (error) {
      console.error('Error parsing stored configurations:', error);
      return [];
    }
  }

  static async saveRollHistory(rolls: RollResult[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ROLL_HISTORY, JSON.stringify(rolls));
    } catch (error) {
      console.error('Error saving roll history:', error);
    }
  }

  static async getRollHistory(): Promise<RollResult[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.ROLL_HISTORY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((roll: any) => ({
        ...roll,
        timestamp: new Date(roll.timestamp),
      }));
    } catch (error) {
      console.error('Error parsing stored roll history:', error);
      return [];
    }
  }

  static async clearRollHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ROLL_HISTORY);
    } catch (error) {
      console.error('Error clearing roll history:', error);
    }
  }
}
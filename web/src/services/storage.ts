import { DiceConfiguration, RollResult } from '../shared/types';

const STORAGE_KEYS = {
  CONFIGURATIONS: 'dicey_configurations',
  ROLL_HISTORY: 'dicey_roll_history',
} as const;

export class WebStorageService {
  static saveConfigurations(configurations: DiceConfiguration[]): void {
    localStorage.setItem(STORAGE_KEYS.CONFIGURATIONS, JSON.stringify(configurations));
  }

  static getConfigurations(): DiceConfiguration[] {
    const stored = localStorage.getItem(STORAGE_KEYS.CONFIGURATIONS);
    if (!stored) return [];
    
    try {
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

  static saveRollHistory(rolls: RollResult[]): void {
    localStorage.setItem(STORAGE_KEYS.ROLL_HISTORY, JSON.stringify(rolls));
  }

  static getRollHistory(): RollResult[] {
    const stored = localStorage.getItem(STORAGE_KEYS.ROLL_HISTORY);
    if (!stored) return [];
    
    try {
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

  static clearRollHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.ROLL_HISTORY);
  }
}
export interface Die {
  sides: number;
  quantity: number;
}

export interface DiceConfiguration {
  id: string;
  name: string;
  dice: Die[];
  createdAt: Date;
}

export interface RollResult {
  id: string;
  configurationId: string;
  configurationName: string;
  dice: Die[];
  results: number[][];
  total: number;
  timestamp: Date;
}

export interface DiceRollService {
  rollDice: (configuration: DiceConfiguration) => Promise<RollResult>;
  saveConfiguration: (configuration: Omit<DiceConfiguration, 'id' | 'createdAt'>) => Promise<DiceConfiguration>;
  getConfigurations: () => Promise<DiceConfiguration[]>;
  deleteConfiguration: (id: string) => Promise<void>;
  saveRoll: (roll: RollResult) => Promise<void>;
  getRollHistory: () => Promise<RollResult[]>;
  clearHistory: () => Promise<void>;
}

export const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100] as const;
export type DiceType = typeof DICE_TYPES[number];
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
  rollDice: (configuration: DiceConfiguration) => RollResult;
  saveConfiguration: (configuration: Omit<DiceConfiguration, 'id' | 'createdAt'>) => DiceConfiguration;
  getConfigurations: () => DiceConfiguration[];
  deleteConfiguration: (id: string) => void;
  saveRoll: (roll: RollResult) => void;
  getRollHistory: () => RollResult[];
  clearHistory: () => void;
}

export const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100] as const;
export type DiceType = typeof DICE_TYPES[number];
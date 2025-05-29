import { DiceConfiguration, RollResult, DiceRollService } from '../shared/types';
import { rollDice, generateId } from '../shared/utils';
import { WebStorageService } from './storage';

export class DiceService implements DiceRollService {
  rollDice(configuration: DiceConfiguration): RollResult {
    const result = rollDice(configuration);
    this.saveRoll(result);
    return result;
  }

  saveConfiguration(configData: Omit<DiceConfiguration, 'id' | 'createdAt'>): DiceConfiguration {
    const configuration: DiceConfiguration = {
      ...configData,
      id: generateId(),
      createdAt: new Date(),
    };

    const configurations = this.getConfigurations();
    configurations.push(configuration);
    WebStorageService.saveConfigurations(configurations);
    
    return configuration;
  }

  getConfigurations(): DiceConfiguration[] {
    return WebStorageService.getConfigurations();
  }

  deleteConfiguration(id: string): void {
    const configurations = this.getConfigurations().filter(config => config.id !== id);
    WebStorageService.saveConfigurations(configurations);
  }

  saveRoll(roll: RollResult): void {
    const history = this.getRollHistory();
    history.unshift(roll); // Add to beginning for most recent first
    
    // Keep only last 1000 rolls to prevent storage bloat
    if (history.length > 1000) {
      history.splice(1000);
    }
    
    WebStorageService.saveRollHistory(history);
  }

  getRollHistory(): RollResult[] {
    return WebStorageService.getRollHistory();
  }

  clearHistory(): void {
    WebStorageService.clearRollHistory();
  }
}

export const diceService = new DiceService();
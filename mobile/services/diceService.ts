import { DiceConfiguration, RollResult, DiceRollService } from '../shared/types';
import { rollDice, generateId } from '../shared/utils';
import { MobileStorageService } from './storage';

export class MobileDiceService implements DiceRollService {
  async rollDice(configuration: DiceConfiguration, modifiersEnabled: boolean = true): Promise<RollResult> {
    const result = rollDice(configuration, modifiersEnabled);
    // Save roll and wait for it to complete
    await this.saveRoll(result);
    return result;
  }

  async saveConfiguration(configData: Omit<DiceConfiguration, 'id' | 'createdAt'>): Promise<DiceConfiguration> {
    const configuration: DiceConfiguration = {
      ...configData,
      id: generateId(),
      createdAt: new Date(),
    };

    const configurations = await this.getConfigurations();
    configurations.push(configuration);
    await MobileStorageService.saveConfigurations(configurations);
    
    return configuration;
  }

  async getConfigurations(): Promise<DiceConfiguration[]> {
    return await MobileStorageService.getConfigurations();
  }

  async deleteConfiguration(id: string): Promise<void> {
    const configurations = await this.getConfigurations();
    const filtered = configurations.filter(config => config.id !== id);
    await MobileStorageService.saveConfigurations(filtered);
  }

  async saveRoll(roll: RollResult): Promise<void> {
    const history = await this.getRollHistory();
    history.unshift(roll); // Add to beginning for most recent first
    
    // Keep only last 1000 rolls to prevent storage bloat
    if (history.length > 1000) {
      history.splice(1000);
    }
    
    await MobileStorageService.saveRollHistory(history);
  }

  async getRollHistory(): Promise<RollResult[]> {
    return await MobileStorageService.getRollHistory();
  }

  async clearHistory(): Promise<void> {
    await MobileStorageService.clearRollHistory();
  }
}

export const mobileDiceService = new MobileDiceService();
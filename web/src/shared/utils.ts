import { Die, DiceConfiguration, RollResult } from './types';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const getSecureRandom = (max: number): number => {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return Math.floor((array[0] / (0xffffffff + 1)) * max) + 1;
  }
  
  // Fallback to Math.random for web environments
  return Math.floor(Math.random() * max) + 1;
};

export const rollSingleDie = (sides: number): number => {
  return getSecureRandom(sides);
};

export const rollDice = (configuration: DiceConfiguration): RollResult => {
  const results: number[][] = [];
  let total = 0;

  configuration.dice.forEach((die) => {
    const dieResults: number[] = [];
    for (let i = 0; i < die.quantity; i++) {
      const roll = rollSingleDie(die.sides);
      dieResults.push(roll);
      total += roll;
    }
    results.push(dieResults);
  });

  return {
    id: generateId(),
    configurationId: configuration.id,
    configurationName: configuration.name,
    dice: configuration.dice,
    results,
    total,
    timestamp: new Date(),
  };
};

export const formatDiceConfiguration = (dice: Die[]): string => {
  return dice
    .map((die) => `${die.quantity}D${die.sides}`)
    .join(' + ');
};

export const validateDiceConfiguration = (dice: Die[]): boolean => {
  return dice.length > 0 && dice.every((die) => die.quantity > 0 && die.sides > 0);
};
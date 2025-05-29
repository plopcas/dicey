import React, { useState } from 'react';
import { Die, DICE_TYPES } from '../shared/types';
import { formatDiceConfiguration, validateDiceConfiguration } from '../shared/utils';

interface DiceBuilderProps {
  onSave: (name: string, dice: Die[]) => void;
  onRoll: (dice: Die[]) => void;
}

export const DiceBuilder: React.FC<DiceBuilderProps> = ({ onSave, onRoll }) => {
  const [dice, setDice] = useState<Die[]>([]);
  const [configName, setConfigName] = useState('');

  const addDie = () => {
    setDice([...dice, { sides: 6, quantity: 1 }]);
  };

  const updateDie = (index: number, updates: Partial<Die>) => {
    const newDice = [...dice];
    newDice[index] = { ...newDice[index], ...updates };
    setDice(newDice);
  };

  const removeDie = (index: number) => {
    setDice(dice.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (configName.trim() && validateDiceConfiguration(dice)) {
      onSave(configName.trim(), dice);
      setConfigName('');
      setDice([]);
    }
  };

  const handleRoll = () => {
    if (validateDiceConfiguration(dice)) {
      onRoll(dice);
    }
  };

  const isValid = validateDiceConfiguration(dice);

  return (
    <div className="dice-builder">
      <h2>Dice Configuration</h2>
      
      <div className="dice-list">
        {dice.map((die, index) => (
          <div key={index} className="die-config">
            <label>
              Quantity:
              <input
                type="number"
                min="1"
                max="20"
                value={die.quantity}
                onChange={(e) => updateDie(index, { quantity: parseInt(e.target.value) || 1 })}
              />
            </label>
            
            <label>
              Sides:
              <select
                value={die.sides}
                onChange={(e) => updateDie(index, { sides: parseInt(e.target.value) })}
              >
                {DICE_TYPES.map(sides => (
                  <option key={sides} value={sides}>D{sides}</option>
                ))}
              </select>
            </label>
            
            <button onClick={() => removeDie(index)} className="remove-btn">
              Remove
            </button>
          </div>
        ))}
      </div>

      <button onClick={addDie} className="add-die-btn">
        Add Die
      </button>

      {dice.length > 0 && (
        <div className="config-preview">
          <strong>Configuration: {formatDiceConfiguration(dice)}</strong>
        </div>
      )}

      <div className="actions">
        <button
          onClick={handleRoll}
          disabled={!isValid}
          className="roll-btn primary"
        >
          Roll Dice
        </button>

        <div className="save-section">
          <input
            type="text"
            placeholder="Configuration name..."
            value={configName}
            onChange={(e) => setConfigName(e.target.value)}
          />
          <button
            onClick={handleSave}
            disabled={!isValid || !configName.trim()}
            className="save-btn"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
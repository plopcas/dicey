import React, { useState } from 'react';
import { Die, DICE_TYPES } from '../shared/types';
import { formatDiceConfiguration, validateDiceConfiguration } from '../shared/utils';
import { useSettings } from '../contexts/SettingsContext';

interface DiceBuilderProps {
  onSave: (name: string, dice: Die[]) => void;
  onRoll: (dice: Die[]) => void;
  currentDice: Die[];
  onDiceChange: (dice: Die[]) => void;
}

export const DiceBuilder: React.FC<DiceBuilderProps> = ({ onSave, onRoll, currentDice, onDiceChange }) => {
  const { modifiersEnabled } = useSettings();
  const [configName, setConfigName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCustomDieModal, setShowCustomDieModal] = useState(false);
  const [customDieSides, setCustomDieSides] = useState('');
  const [customDieIndex, setCustomDieIndex] = useState<number | null>(null);
  const [modifierInputs, setModifierInputs] = useState<{ [key: number]: string }>({});

  const addDie = () => {
    onDiceChange([...currentDice, { sides: 6, quantity: 1, modifier: 0 }]);
  };

  const updateDie = (index: number, updates: Partial<Die>) => {
    const newDice = [...currentDice];
    newDice[index] = { ...newDice[index], ...updates };
    onDiceChange(newDice);
  };

  const removeDie = (index: number) => {
    onDiceChange(currentDice.filter((_, i) => i !== index));
  };

  const clearConfiguration = () => {
    if (window.confirm('Are you sure you want to clear all dice?')) {
      onDiceChange([]);
    }
  };

  const openSaveModal = () => {
    if (!validateDiceConfiguration(currentDice)) {
      alert('Please add at least one die to save');
      return;
    }
    setShowSaveModal(true);
  };

  const handleSave = () => {
    if (configName.trim() && validateDiceConfiguration(currentDice)) {
      onSave(configName.trim(), currentDice);
      setConfigName('');
      setShowSaveModal(false);
      alert('Configuration saved!');
    }
  };

  const handleDieTypeChange = (index: number, newSides: number) => {
    if (newSides === -1) {
      // Custom die selected
      setCustomDieIndex(index);
      setCustomDieSides('');
      setShowCustomDieModal(true);
    } else {
      updateDie(index, { sides: newSides });
    }
  };

  const handleCustomDieSubmit = () => {
    const sides = parseInt(customDieSides);
    if (sides > 0 && customDieIndex !== null) {
      updateDie(customDieIndex, { sides });
      setShowCustomDieModal(false);
      setCustomDieSides('');
      setCustomDieIndex(null);
    }
  };

  const handleRoll = () => {
    if (validateDiceConfiguration(currentDice)) {
      onRoll(currentDice);
    }
  };

  const isValid = validateDiceConfiguration(currentDice);

  return (
    <div className="dice-builder">
      <h2>Dice configuration</h2>
      
      <div className="actions">
        <div className="button-group">
          <button
            onClick={openSaveModal}
            disabled={!isValid}
            className="btn btn-success"
          >
            Save
          </button>
          
          {currentDice.length > 0 && (
            <button
              onClick={clearConfiguration}
              className="btn btn-danger"
            >
              Clear
            </button>
          )}
          
          <button onClick={addDie} className="btn btn-success">
            + Add
          </button>
        </div>
      </div>

      <div className="dice-list">
        {currentDice.length === 0 ? (
          <div className="empty-state">
            <p>🎲</p>
            <p>Tap "Add" to start building your dice configuration</p>
          </div>
        ) : (
          <>
            <div className="dice-table-header">
              <span>Qty</span>
              <span>Die type</span>
              {modifiersEnabled && <span>Modifier</span>}
              <span>Action</span>
            </div>
            {currentDice.map((die, index) => (
              <div key={index} className="die-config">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={die.quantity}
                  onChange={(e) => updateDie(index, { quantity: parseInt(e.target.value) || 1 })}
                />
                
                <select
                  value={die.sides}
                  onChange={(e) => handleDieTypeChange(index, parseInt(e.target.value))}
                >
                  {DICE_TYPES.map(sides => (
                    <option key={sides} value={sides}>
                      {sides === -1 ? 'Custom...' : `D${sides}`}
                    </option>
                  ))}
                  {!DICE_TYPES.includes(die.sides as any) && (
                    <option value={die.sides}>D{die.sides}</option>
                  )}
                </select>
                
                {modifiersEnabled && (
                  <input
                    type="text"
                    value={modifierInputs[index] !== undefined ? modifierInputs[index] : (die.modifier || 0).toString()}
                    onChange={(e) => {
                      const value = e.target.value;
                      setModifierInputs({ ...modifierInputs, [index]: value });
                      
                      // Update the die if it's a valid number or empty
                      if (value === '' || value === '-') {
                        updateDie(index, { modifier: 0 });
                      } else {
                        const num = parseInt(value);
                        if (!isNaN(num) && num >= -99 && num <= 99) {
                          updateDie(index, { modifier: num });
                        }
                      }
                    }}
                    onFocus={(e) => {
                      // Clear the input if it shows 0
                      if (die.modifier === 0) {
                        setModifierInputs({ ...modifierInputs, [index]: '' });
                      }
                      e.target.select();
                    }}
                    onBlur={() => {
                      // Clean up the input state and ensure we have a valid number
                      const currentInput = modifierInputs[index];
                      if (currentInput === '' || currentInput === undefined) {
                        updateDie(index, { modifier: 0 });
                      }
                      const newInputs = { ...modifierInputs };
                      delete newInputs[index];
                      setModifierInputs(newInputs);
                    }}
                    placeholder="±0"
                    title="Enter modifier value (positive or negative)"
                    style={{ width: '100%', textAlign: 'center' }}
                  />
                )}
                
                <button onClick={() => removeDie(index)} className="remove-btn">
                  ×
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Save Configuration Modal */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Save configuration</h3>
            <input
              type="text"
              placeholder="Enter configuration name..."
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setConfigName('');
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!configName.trim()}
                className="save-btn primary"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Die Modal */}
      {showCustomDieModal && (
        <div className="modal-overlay" onClick={() => setShowCustomDieModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Custom die</h3>
            <p>How many faces does this die have?</p>
            <input
              type="number"
              placeholder="Enter number of faces (e.g., 3, 7, 13...)"
              value={customDieSides}
              onChange={(e) => setCustomDieSides(e.target.value)}
              min="2"
              max="1000"
              autoFocus
            />
            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowCustomDieModal(false);
                  setCustomDieSides('');
                  setCustomDieIndex(null);
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomDieSubmit}
                disabled={!customDieSides.trim() || parseInt(customDieSides) < 2}
                className="save-btn primary"
              >
                Create D{customDieSides || '?'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
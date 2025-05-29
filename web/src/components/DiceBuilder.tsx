import React, { useState } from 'react';
import { Die, DICE_TYPES } from '../shared/types';
import { formatDiceConfiguration, validateDiceConfiguration } from '../shared/utils';

interface DiceBuilderProps {
  onSave: (name: string, dice: Die[]) => void;
  onRoll: (dice: Die[]) => void;
  currentDice: Die[];
  onDiceChange: (dice: Die[]) => void;
}

export const DiceBuilder: React.FC<DiceBuilderProps> = ({ onSave, onRoll, currentDice, onDiceChange }) => {
  const [configName, setConfigName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const addDie = () => {
    onDiceChange([...currentDice, { sides: 6, quantity: 1 }]);
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

  const handleRoll = () => {
    if (validateDiceConfiguration(currentDice)) {
      onRoll(currentDice);
    }
  };

  const isValid = validateDiceConfiguration(currentDice);

  return (
    <div className="dice-builder">
      <h2>Dice Configuration</h2>
      
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
              <span>Die Type</span>
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
                  onChange={(e) => updateDie(index, { sides: parseInt(e.target.value) })}
                >
                  {DICE_TYPES.map(sides => (
                    <option key={sides} value={sides}>D{sides}</option>
                  ))}
                </select>
                
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
            <h3>Save Configuration</h3>
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
    </div>
  );
};
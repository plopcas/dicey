import React from 'react';
import { RollResult } from '../shared/types';
import { formatDiceConfiguration } from '../shared/utils';

interface RollHistoryProps {
  history: RollResult[];
  onClear: () => void;
}

export const RollHistory: React.FC<RollHistoryProps> = ({ history, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="roll-history empty">
        <h2>Roll History</h2>
        <p>No rolls yet. Start rolling some dice!</p>
      </div>
    );
  }

  return (
    <div className="roll-history">
      <div className="history-header">
        <h2>Roll History</h2>
        <button onClick={onClear} className="clear-btn danger">
          Clear History
        </button>
      </div>

      <div className="history-list">
        {history.map((roll) => (
          <div key={roll.id} className="history-item">
            <div className="roll-info">
              <div className="roll-header">
                <strong>{roll.configurationName}</strong>
                <span className="roll-total">Total: {roll.total}</span>
              </div>
              
              <div className="roll-formula">
                {formatDiceConfiguration(roll.dice)}
              </div>
              
              <div className="roll-details">
                {roll.dice.map((die, dieIndex) => (
                  <span key={dieIndex} className="die-detail">
                    {die.quantity}D{die.sides}: [{roll.results[dieIndex].join(', ')}]
                  </span>
                ))}
              </div>
              
              <div className="roll-time">
                {roll.timestamp.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
import React from 'react';
import { RollResult } from '../shared/types';

interface RollHistoryProps {
  history: RollResult[];
  onClear: () => void;
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const RollHistory: React.FC<RollHistoryProps> = ({ history, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="roll-history empty">
        <h2>Roll history</h2>
        <p>📋</p>
        <p>No roll history yet</p>
        <p>Start rolling dice to see your history here.</p>
      </div>
    );
  }

  return (
    <div className="roll-history">
      <div className="history-header">
        <h2>Roll history ({history.length})</h2>
        <button 
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all roll history?')) {
              onClear();
            }
          }}
          className="btn btn-danger"
        >
          Clear
        </button>
      </div>

      <div className="history-list">
        {history.map((roll) => (
          <div key={roll.id} className="history-item">
            <div className="roll-header">
              <div className="roll-title">
                {formatTime(roll.timestamp)}
              </div>
              <div className="roll-total-badge">
                {roll.total}
              </div>
            </div>
            
            <div className="roll-dice-results">
              {roll.dice.map((die, dieIndex) => (
                <div key={dieIndex} className="die-group">
                  <div className="die-group-header">
                    <span className="die-type">{die.quantity}D{die.sides}</span>
                    <span className="die-sum">
                      Sum: {roll.results[dieIndex].reduce((sum, value) => sum + value, 0)}
                    </span>
                  </div>
                  <div className="individual-rolls">
                    {roll.results[dieIndex].map((value, rollIndex) => (
                      <span key={rollIndex} className="roll-value">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
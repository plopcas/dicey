import React from 'react';
import { RollResult } from '../shared/types';
import { useSettings } from '../contexts/SettingsContext';

interface RollHistoryProps {
  history: RollResult[];
  onClear: () => void;
}

const formatTime = (date: Date) => {
  return date.toLocaleString([], { 
    year: 'numeric',
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
};

export const RollHistory: React.FC<RollHistoryProps> = ({ history, onClear }) => {
  const { modifiersEnabled } = useSettings();
  if (history.length === 0) {
    return (
      <div className="roll-history empty">
        <h2>Roll history</h2>
        <p>No roll history yet. Start rolling dice to see your history here.</p>
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
          <div key={roll.id} className="history-item-compact">
            <div className="history-date">
              {formatTime(roll.timestamp)}
            </div>
            <div className="history-row">
              <div className="history-dice">
                {roll.results.map((dieGroup, dieIndex) => 
                  dieGroup.map((rollValue, rollIndex) => {
                    const modifier = roll.modifiers ? roll.modifiers[dieIndex] : 0;
                    const hasModifier = modifiersEnabled && modifier !== 0;
                    const modifiedTotal = rollValue + modifier;
                    
                    if (hasModifier) {
                      return (
                        <span 
                          key={`${dieIndex}-${rollIndex}`}
                          className={`roll-value modifier ${modifier > 0 ? 'positive' : 'negative'}`}
                        >
                          {modifiedTotal}
                        </span>
                      );
                    } else {
                      return (
                        <span key={`${dieIndex}-${rollIndex}`} className="roll-value">
                          {rollValue}
                        </span>
                      );
                    }
                  })
                )}
              </div>
              
              <div className="history-total">
                {roll.total}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
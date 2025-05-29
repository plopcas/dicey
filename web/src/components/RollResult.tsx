import React from 'react';
import { RollResult as RollResultType, Die } from '../shared/types';
import { validateDiceConfiguration } from '../shared/utils';

interface RollResultProps {
  result: RollResultType | null;
  onRoll: (dice: Die[]) => void;
  currentDice: Die[];
  isRolling: boolean;
}

export const RollResult: React.FC<RollResultProps> = ({ result, onRoll, currentDice, isRolling }) => {
  const isValid = validateDiceConfiguration(currentDice);

  const handleRoll = () => {
    if (isValid) {
      onRoll(currentDice);
    }
  };

  return (
    <div className="roll-result">
      <button
        onClick={handleRoll}
        disabled={!isValid || isRolling}
        className={`roll-btn primary ${isRolling ? 'rolling' : ''}`}
      >
        {isRolling ? '🎲 Rolling...' : isValid ? '🎲 Roll Dice' : 'Add dice to roll'}
      </button>

      {result && (
        <>
          <div className="result-header">
            <div className="total">TOTAL <span className="total-value">{result.total}</span></div>
          </div>

          <div className="dice-results">
            {result.results.map((dieGroup, dieIndex) => (
              <div key={dieIndex} className="die-group-results">
                {dieGroup.map((roll, rollIndex) => (
                  <span key={rollIndex} className="roll-value">
                    {roll}
                  </span>
                ))}
                {result.modifiers[dieIndex] !== 0 && (
                  <span 
                    className={`roll-value modifier ${result.modifiers[dieIndex] > 0 ? 'positive' : 'negative'}`}
                  >
                    {result.modifiers[dieIndex] > 0 ? '+' : ''}{result.modifiers[dieIndex]}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="roll-timestamp">
            {result.timestamp.toLocaleString()}
          </div>
        </>
      )}

      {!result && (
        <div className="empty-state">
          <p>🎲</p>
          <p>Configure and roll some dice to see results!</p>
        </div>
      )}
    </div>
  );
};
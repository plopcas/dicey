import React from 'react';
import { RollResult as RollResultType, Die } from '../shared/types';
import { validateDiceConfiguration } from '../shared/utils';

interface RollResultProps {
  result: RollResultType | null;
  onRoll: (dice: Die[]) => void;
  currentDice: Die[];
}

export const RollResult: React.FC<RollResultProps> = ({ result, onRoll, currentDice }) => {
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
        disabled={!isValid}
        className="roll-btn primary"
      >
        {isValid ? '🎲 Roll Dice' : 'Add dice to roll'}
      </button>

      {result && (
        <>
          <div className="result-header">
            <div className="total">TOTAL <span className="total-value">{result.total}</span></div>
          </div>

          <div className="dice-results">
            {result.dice.map((die, dieIndex) => (
              <div key={dieIndex} className="die-result">
                <h4>{die.quantity}D{die.sides}</h4>
                <div className="individual-rolls">
                  {result.results[dieIndex].map((roll, rollIndex) => (
                    <span key={rollIndex} className="roll-value">
                      {roll}
                    </span>
                  ))}
                </div>
                <div className="die-total">
                  Sum: {result.results[dieIndex].reduce((sum, roll) => sum + roll, 0)}
                </div>
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
import React from 'react';
import { RollResult as RollResultType } from '../shared/types';

interface RollResultProps {
  result: RollResultType | null;
}

export const RollResult: React.FC<RollResultProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="roll-result empty">
        <h2>Roll Result</h2>
        <p>Configure and roll some dice to see results!</p>
      </div>
    );
  }

  return (
    <div className="roll-result">
      <h2>Roll Result</h2>
      
      <div className="result-header">
        <h3>{result.configurationName}</h3>
        <div className="total">Total: <span className="total-value">{result.total}</span></div>
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
        Rolled at {result.timestamp.toLocaleString()}
      </div>
    </div>
  );
};
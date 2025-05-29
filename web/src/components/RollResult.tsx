import React from 'react';
import { RollResult as RollResultType, Die } from '../shared/types';
import { validateDiceConfiguration } from '../shared/utils';
import { useSettings } from '../contexts/SettingsContext';

interface RollResultProps {
  result: RollResultType | null;
  onRoll: (dice: Die[]) => void;
  currentDice: Die[];
  isRolling: boolean;
}

export const RollResult: React.FC<RollResultProps> = ({ result, onRoll, currentDice, isRolling }) => {
  const { modifiersEnabled } = useSettings();
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
        {isRolling ? 'Rolling...' : isValid ? 'Roll' : 'Add dice to roll'}
      </button>

      {result && (
        <>
          <div className="result-header">
            <div className="total-value" style={{ fontSize: '4rem', textAlign: 'center' }}>{result.total}</div>
          </div>

          {(() => {
            // Calculate total number of dice and if any modifiers are applied
            const totalDiceCount = result.results.reduce((sum, dieGroup) => sum + dieGroup.length, 0);
            const hasAnyModifiers = result.modifiers && modifiersEnabled && 
              result.modifiers.some(modifier => modifier !== 0);
            
            // Show individual dice only if more than 1 die total OR modifiers are applied
            const shouldShowIndividualDice = totalDiceCount > 1 || hasAnyModifiers;
            
            return shouldShowIndividualDice ? (
              <div className="dice-results">
                {result.results.map((dieGroup, dieIndex) => (
                  <div key={dieIndex} className="die-group-results">
                    {dieGroup.map((roll, rollIndex) => {
                      const modifier = result.modifiers[dieIndex];
                      const hasModifier = modifiersEnabled && modifier !== 0;
                      const modifiedTotal = roll + modifier;
                      
                      if (hasModifier) {
                        return (
                          <span 
                            key={rollIndex} 
                            className={`roll-value modifier ${modifier > 0 ? 'positive' : 'negative'}`}
                          >
                            {modifiedTotal}({roll}{modifier > 0 ? '+' : ''}{modifier})
                          </span>
                        );
                      } else {
                        return (
                          <span key={rollIndex} className="roll-value">
                            {roll}
                          </span>
                        );
                      }
                    })}
                  </div>
                ))}
              </div>
            ) : null;
          })()}

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
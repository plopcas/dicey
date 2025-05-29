import React from 'react';
import { DiceConfiguration } from '../shared/types';
import { formatDiceConfiguration } from '../shared/utils';

interface SavedConfigurationsProps {
  configurations: DiceConfiguration[];
  onRoll: (config: DiceConfiguration) => void;
  onDelete: (id: string) => void;
}

export const SavedConfigurations: React.FC<SavedConfigurationsProps> = ({
  configurations,
  onRoll,
  onDelete,
}) => {
  if (configurations.length === 0) {
    return (
      <div className="saved-configurations empty">
        <h2>Saved configurations</h2>
        <p>No saved configurations yet. Create one using the dice builder!</p>
      </div>
    );
  }

  return (
    <div className="saved-configurations">
      <h2>Saved configurations</h2>
      
      <div className="configurations-list">
        {configurations.map((config) => (
          <div key={config.id} className="configuration-item">
            <div className="config-info">
              <h3>{config.name}</h3>
              <p className="config-formula">{formatDiceConfiguration(config.dice)}</p>
              <small>Created: {config.createdAt.toLocaleDateString()}</small>
            </div>
            
            <div className="config-actions">
              <button
                onClick={() => onRoll(config)}
                className="btn btn-primary"
                style={{ 
                  backgroundColor: '#667eea',
                  borderColor: '#667eea',
                  color: 'white'
                }}
              >
                Roll
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${config.name}"?`)) {
                    onDelete(config.id);
                  }
                }}
                className="btn btn-danger"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
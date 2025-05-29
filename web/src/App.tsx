import React, { useState, useEffect } from 'react';
import { DiceConfiguration, RollResult, Die } from './shared/types';
import { diceService } from './services/diceService';
import { DiceBuilder } from './components/DiceBuilder';
import { SavedConfigurations } from './components/SavedConfigurations';
import { RollResult as RollResultComponent } from './components/RollResult';
import { RollHistory } from './components/RollHistory';
import './App.css';

type Tab = 'builder' | 'saved' | 'history';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('builder');
  const [configurations, setConfigurations] = useState<DiceConfiguration[]>([]);
  const [rollHistory, setRollHistory] = useState<RollResult[]>([]);
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);

  useEffect(() => {
    setConfigurations(diceService.getConfigurations());
    setRollHistory(diceService.getRollHistory());
  }, []);

  const handleSaveConfiguration = (name: string, dice: Die[]) => {
    diceService.saveConfiguration({ name, dice });
    setConfigurations(diceService.getConfigurations());
  };

  const handleDeleteConfiguration = (id: string) => {
    diceService.deleteConfiguration(id);
    setConfigurations(diceService.getConfigurations());
  };

  const handleRoll = (dice: Die[] | DiceConfiguration) => {
    let result: RollResult;
    
    if ('id' in dice) {
      result = diceService.rollDice(dice);
    } else {
      const tempConfig: DiceConfiguration = {
        id: 'temp',
        name: 'Quick Roll',
        dice,
        createdAt: new Date(),
      };
      result = diceService.rollDice(tempConfig);
    }
    
    setLastRoll(result);
    setRollHistory(diceService.getRollHistory());
  };

  const handleClearHistory = () => {
    diceService.clearHistory();
    setRollHistory([]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎲 Dicey</h1>
        <p>Your digital dice rolling companion</p>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'builder' ? 'active' : ''}`}
          onClick={() => setActiveTab('builder')}
        >
          Dice Builder
        </button>
        <button
          className={`nav-btn ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved ({configurations.length})
        </button>
        <button
          className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History ({rollHistory.length})
        </button>
      </nav>

      <main className="app-main">
        <div className="content-container">
          <div className="primary-content">
            {activeTab === 'builder' && (
              <DiceBuilder onSave={handleSaveConfiguration} onRoll={handleRoll} />
            )}
            {activeTab === 'saved' && (
              <SavedConfigurations
                configurations={configurations}
                onRoll={handleRoll}
                onDelete={handleDeleteConfiguration}
              />
            )}
            {activeTab === 'history' && (
              <RollHistory history={rollHistory} onClear={handleClearHistory} />
            )}
          </div>

          <div className="sidebar">
            <RollResultComponent result={lastRoll} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
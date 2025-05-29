import React, { useState, useEffect, useCallback } from 'react';
import { DiceConfiguration, RollResult, Die } from './shared/types';
import { diceService } from './services/diceService';
import { DiceBuilder } from './components/DiceBuilder';
import { SavedConfigurations } from './components/SavedConfigurations';
import { RollResult as RollResultComponent } from './components/RollResult';
import { RollHistory } from './components/RollHistory';
import { Statistics } from './components/Statistics';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { validateDiceConfiguration } from './shared/utils';
import './App.css';

type Tab = 'builder' | 'saved' | 'history' | 'statistics';

const AppContent: React.FC = () => {
  const { soundEnabled, modifiersEnabled, setSoundEnabled, setModifiersEnabled } = useSettings();
  const [activeTab, setActiveTab] = useState<Tab>('builder');
  const [configurations, setConfigurations] = useState<DiceConfiguration[]>([]);
  const [rollHistory, setRollHistory] = useState<RollResult[]>([]);
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const [currentDice, setCurrentDice] = useState<Die[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Keyboard shortcut for rolling dice
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space' && activeTab === 'builder' && validateDiceConfiguration(currentDice)) {
      event.preventDefault();
      handleRoll(currentDice);
    }
  }, [activeTab, currentDice]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [configs, history] = await Promise.all([
        diceService.getConfigurations(),
        diceService.getRollHistory()
      ]);
      setConfigurations(configs);
      setRollHistory(history);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create dice roll sound effect
  const playDiceSound = () => {
    if (!soundEnabled) return;
    try {
      const audio = new Audio('/dice-142528.mp3');
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.log('Audio play failed:', error);
      });
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const handleSaveConfiguration = async (name: string, dice: Die[]) => {
    try {
      await diceService.saveConfiguration({ name, dice });
      const newConfigs = await diceService.getConfigurations();
      setConfigurations(newConfigs);
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  const handleDeleteConfiguration = async (id: string) => {
    try {
      await diceService.deleteConfiguration(id);
      const newConfigs = await diceService.getConfigurations();
      setConfigurations(newConfigs);
    } catch (error) {
      console.error('Error deleting configuration:', error);
    }
  };

  const handleRoll = async (dice: Die[] | DiceConfiguration) => {
    try {
      setIsRolling(true);
      playDiceSound();
      
      // Add a delay for animation effect
      await new Promise(resolve => setTimeout(resolve, 400));
      
      let result: RollResult;
      
      if ('id' in dice) {
        // Rolling a saved configuration - switch to builder tab to show result
        result = await diceService.rollDice(dice, modifiersEnabled);
        setCurrentDice(dice.dice); // Load the dice configuration
        setActiveTab('builder');
      } else {
        // Rolling a temporary configuration
        const tempConfig: DiceConfiguration = {
          id: 'temp',
          name: 'Quick Roll',
          dice,
          createdAt: new Date(),
        };
        result = await diceService.rollDice(tempConfig, modifiersEnabled);
        setCurrentDice(dice); // Update current dice state
      }
      
      setLastRoll(result);
      
      // Update roll history count immediately
      setRollHistory(prev => [result, ...prev]);
    } catch (error) {
      console.error('Error rolling dice:', error);
    } finally {
      setIsRolling(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await diceService.clearHistory();
      setRollHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div style={{ textAlign: 'center' }}>
          <h1>🎲 Dicey</h1>
          <p>Your digital dice rolling companion</p>
        </div>
      </header>

      <nav className="app-nav" style={{ position: 'relative' }}>
        <button
          className={`nav-btn ${activeTab === 'builder' ? 'active' : ''}`}
          onClick={() => setActiveTab('builder')}
        >
          Builder
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
        <button
          className={`nav-btn ${activeTab === 'statistics' ? 'active' : ''}`}
          onClick={() => setActiveTab('statistics')}
        >
          Statistics
        </button>
        <button 
          className="settings-gear"
          onClick={() => setShowSettings(!showSettings)}
          style={{
            position: 'absolute',
            top: '50%',
            right: '16px',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'black',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px'
          }}
        >
          ⚙
        </button>
      </nav>

      <main className="app-main">
        {loading ? (
          <div className="loading">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="content-container">
            {activeTab === 'builder' ? (
              <>
                <div className="primary-content">
                  <RollResultComponent result={lastRoll} onRoll={handleRoll} currentDice={currentDice} isRolling={isRolling} />
                </div>
                <div className="sidebar">
                  <DiceBuilder 
                    onSave={handleSaveConfiguration} 
                    onRoll={handleRoll}
                    currentDice={currentDice}
                    onDiceChange={setCurrentDice}
                  />
                </div>
              </>
            ) : (
              <div className="full-width-content">
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
                {activeTab === 'statistics' && (
                  <Statistics history={rollHistory} />
                )}
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Settings Dropdown */}
      {showSettings && (
        <>
          {/* Backdrop to handle outside clicks */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setShowSettings(false)}
          />
          
          {/* Settings dropdown */}
          <div 
            style={{
              position: 'fixed',
              top: '120px',
              right: '20px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
              minWidth: '200px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Settings</h3>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={soundEnabled} 
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                />
                Sound effects
              </label>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={modifiersEnabled} 
                  onChange={(e) => setModifiersEnabled(e.target.checked)}
                />
                Modifiers
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
};

export default App;
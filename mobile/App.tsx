import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { DiceConfiguration, RollResult, Die } from './shared/types';
import { mobileDiceService } from './services/diceService';
import { DiceBuilder } from './components/DiceBuilder';
import { SavedConfigurations } from './components/SavedConfigurations';
import { RollHistory } from './components/RollHistory';
import { styles, colors } from './styles/styles';

type Tab = 'builder' | 'saved' | 'history';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('builder');
  const [configurations, setConfigurations] = useState<DiceConfiguration[]>([]);
  const [rollHistory, setRollHistory] = useState<RollResult[]>([]);
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const [currentDice, setCurrentDice] = useState<Die[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Loading data...');
      
      const [configs, history] = await Promise.all([
        mobileDiceService.getConfigurations(),
        mobileDiceService.getRollHistory()
      ]);
      
      console.log('Loaded configs:', configs.length);
      console.log('Loaded history:', history.length);
      
      setConfigurations(configs);
      setRollHistory(history);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfiguration = async (name: string, dice: Die[]) => {
    try {
      console.log('Saving configuration:', name, dice);
      await mobileDiceService.saveConfiguration({ name, dice });
      // Update configurations in real-time without full reload
      const newConfigs = await mobileDiceService.getConfigurations();
      setConfigurations(newConfigs);
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  const handleDeleteConfiguration = async (id: string) => {
    try {
      console.log('Deleting configuration:', id);
      await mobileDiceService.deleteConfiguration(id);
      // Update configurations in real-time without full reload
      const newConfigs = await mobileDiceService.getConfigurations();
      setConfigurations(newConfigs);
    } catch (error) {
      console.error('Error deleting configuration:', error);
    }
  };

  const handleRoll = async (dice: Die[] | DiceConfiguration) => {
    try {
      setIsRolling(true);
      console.log('Rolling dice:', dice);
      
      // Add a delay for animation effect
      await new Promise(resolve => setTimeout(resolve, 400));
      
      let result: RollResult;
      
      if ('id' in dice) {
        // Rolling a saved configuration - navigate to builder tab to show result
        result = await mobileDiceService.rollDice(dice);
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
        result = await mobileDiceService.rollDice(tempConfig);
        setCurrentDice(dice); // Update current dice state
      }
      
      console.log('Roll result:', result);
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
      console.log('Clearing history');
      await mobileDiceService.clearHistory();
      setRollHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.emptyStateText, { marginTop: 16 }]}>Loading...</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'builder':
        return (
          <DiceBuilder 
            onSave={handleSaveConfiguration} 
            onRoll={handleRoll}
            lastRoll={lastRoll}
            currentDice={currentDice}
            onDiceChange={setCurrentDice}
            isRolling={isRolling}
          />
        );
      case 'saved':
        return (
          <SavedConfigurations
            configurations={configurations}
            onRoll={handleRoll}
            onDelete={handleDeleteConfiguration}
          />
        );
      case 'history':
        return (
          <RollHistory
            history={rollHistory}
            onClear={handleClearHistory}
          />
        );
      default:
        return null;
    }
  };

  const getTabLabel = (tab: Tab) => {
    switch (tab) {
      case 'builder':
        return 'Builder';
      case 'saved':
        return `Saved (${configurations.length})`;
      case 'history':
        return `History (${rollHistory.length})`;
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎲 Dicey</Text>
        <Text style={styles.headerSubtitle}>
          Your digital dice rolling companion
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {(['builder', 'saved', 'history'] as Tab[]).map((tab) => (
          <Pressable
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => {
              setActiveTab(tab);
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {getTabLabel(tab)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {renderTabContent()}
      </View>

    </SafeAreaView>
  );
};

export default App;
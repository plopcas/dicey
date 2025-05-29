import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, SafeAreaView, StatusBar } from 'react-native';
import { DiceConfiguration, RollResult, Die } from './shared/types';
import { mobileDiceService } from './services/diceService';
import { DiceBuilder } from './components/DiceBuilder';
import { SavedConfigurations } from './components/SavedConfigurations';
import { RollHistory } from './components/RollHistory';
import { RollResultModal } from './components/RollResultModal';
import { styles, colors } from './styles/styles';

type Tab = 'builder' | 'saved' | 'history';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('builder');
  const [configurations, setConfigurations] = useState<DiceConfiguration[]>([]);
  const [rollHistory, setRollHistory] = useState<RollResult[]>([]);
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const [showRollResult, setShowRollResult] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const configs = await mobileDiceService.getConfigurations();
      const history = await mobileDiceService.getRollHistory();
      setConfigurations(configs);
      setRollHistory(history);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSaveConfiguration = async (name: string, dice: Die[]) => {
    try {
      await mobileDiceService.saveConfiguration({ name, dice });
      await loadData();
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  const handleDeleteConfiguration = async (id: string) => {
    try {
      await mobileDiceService.deleteConfiguration(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting configuration:', error);
    }
  };

  const handleRoll = async (dice: Die[] | DiceConfiguration) => {
    try {
      let result: RollResult;
      
      if ('id' in dice) {
        // Rolling a saved configuration
        result = mobileDiceService.rollDice(dice);
      } else {
        // Rolling a temporary configuration
        const tempConfig: DiceConfiguration = {
          id: 'temp',
          name: 'Quick Roll',
          dice,
          createdAt: new Date(),
        };
        result = mobileDiceService.rollDice(tempConfig);
      }
      
      setLastRoll(result);
      setShowRollResult(true);
      await loadData();
    } catch (error) {
      console.error('Error rolling dice:', error);
    }
  };

  const handleClearHistory = async () => {
    try {
      await mobileDiceService.clearHistory();
      setRollHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'builder':
        return (
          <DiceBuilder 
            onSave={handleSaveConfiguration} 
            onRoll={handleRoll} 
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
            onPress={() => setActiveTab(tab)}
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

      {/* Roll Result Modal */}
      <RollResultModal
        result={lastRoll}
        visible={showRollResult}
        onClose={() => setShowRollResult(false)}
      />
    </SafeAreaView>
  );
};

export default App;
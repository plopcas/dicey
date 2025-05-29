import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { DiceConfiguration, RollResult, Die } from './shared/types';
import { mobileDiceService } from './services/diceService';
import { DiceBuilder } from './components/DiceBuilder';
import { styles } from './styles/styles';

type Tab = 'builder' | 'saved' | 'history';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('builder');
  const [configurations, setConfigurations] = useState<DiceConfiguration[]>([]);
  const [rollHistory, setRollHistory] = useState<RollResult[]>([]);
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const configs = await mobileDiceService.getConfigurations();
    const history = await mobileDiceService.getRollHistory();
    setConfigurations(configs);
    setRollHistory(history);
  };

  const handleSaveConfiguration = async (name: string, dice: Die[]) => {
    await mobileDiceService.saveConfiguration({ name, dice });
    loadData();
  };

  const handleDeleteConfiguration = async (id: string) => {
    await mobileDiceService.deleteConfiguration(id);
    loadData();
  };

  const handleRoll = async (dice: Die[] | DiceConfiguration) => {
    let result: RollResult;
    
    if ('id' in dice) {
      result = mobileDiceService.rollDice(dice);
    } else {
      const tempConfig: DiceConfiguration = {
        id: 'temp',
        name: 'Quick Roll',
        dice,
        createdAt: new Date(),
      };
      result = mobileDiceService.rollDice(tempConfig);
    }
    
    setLastRoll(result);
    loadData();
  };

  const handleClearHistory = async () => {
    await mobileDiceService.clearHistory();
    setRollHistory([]);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'builder':
        return <DiceBuilder onSave={handleSaveConfiguration} onRoll={handleRoll} />;
      case 'saved':
        return <SavedConfigurationsScreen configurations={configurations} onRoll={handleRoll} onDelete={handleDeleteConfiguration} />;
      case 'history':
        return <RollHistoryScreen history={rollHistory} onClear={handleClearHistory} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#667eea' }}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎲 Dicey</Text>
        <Text style={styles.headerSubtitle}>Your digital dice rolling companion</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'builder' && styles.activeTab]}
          onPress={() => setActiveTab('builder')}
        >
          <Text style={[styles.tabText, activeTab === 'builder' && styles.activeTabText]}>
            Builder
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
          onPress={() => setActiveTab('saved')}
        >
          <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
            Saved ({configurations.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History ({rollHistory.length})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderTabContent()}
      </View>

      {lastRoll && (
        <RollResultOverlay result={lastRoll} onClose={() => setLastRoll(null)} />
      )}
    </SafeAreaView>
  );
};

// Placeholder components - these would be implemented similarly to the web versions
const SavedConfigurationsScreen: React.FC<any> = () => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyStateIcon}>📋</Text>
    <Text style={styles.emptyStateText}>Saved configurations will appear here</Text>
  </View>
);

const RollHistoryScreen: React.FC<any> = () => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyStateIcon}>📜</Text>
    <Text style={styles.emptyStateText}>Roll history will appear here</Text>
  </View>
);

const RollResultOverlay: React.FC<any> = ({ result, onClose }) => (
  <View style={styles.rollResult}>
    <View style={styles.resultHeader}>
      <Text style={styles.resultConfigName}>{result.configurationName}</Text>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{result.total}</Text>
      </View>
    </View>
    <TouchableOpacity onPress={onClose} style={styles.saveButton}>
      <Text style={styles.saveButtonText}>Close</Text>
    </TouchableOpacity>
  </View>
);

export default App;
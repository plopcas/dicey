import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, SafeAreaView, StatusBar, ActivityIndicator, Modal } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { DiceConfiguration, RollResult, Die } from './shared/types';
import { mobileDiceService } from './services/diceService';
import { DiceBuilder } from './components/DiceBuilder';
import { SavedConfigurations } from './components/SavedConfigurations';
import { RollHistory } from './components/RollHistory';
import { Statistics } from './components/Statistics';
import { SettingsModal } from './components/SettingsModal';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { styles, colors } from './styles/styles';

type Tab = 'roll' | 'saved' | 'history' | 'statistics';

const AppContent: React.FC = () => {
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<Tab>('roll');
  const [configurations, setConfigurations] = useState<DiceConfiguration[]>([]);
  const [rollHistory, setRollHistory] = useState<RollResult[]>([]);
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const [currentDice, setCurrentDice] = useState<Die[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    loadData();
    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadSound = async () => {
    try {
      const { sound: loadedSound } = await Audio.Sound.createAsync(
        require('./assets/dice-142528.mp3')
      );
      setSound(loadedSound);
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  };

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

      // Add haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Play sound if enabled
      if (settings.soundEnabled && sound) {
        try {
          await sound.replayAsync();
        } catch (error) {
          console.error('Error playing sound:', error);
        }
      }

      // Add a delay for animation effect
      await new Promise(resolve => setTimeout(resolve, 400));

      let result: RollResult;

      if ('id' in dice) {
        // Rolling a saved configuration - navigate to builder tab to show result
        result = await mobileDiceService.rollDice(dice, settings.modifiersEnabled);
        setCurrentDice(dice.dice); // Load the dice configuration
        setActiveTab('roll');
      } else {
        // Rolling a temporary configuration
        const tempConfig: DiceConfiguration = {
          id: 'temp',
          name: 'Quick Roll',
          dice,
          createdAt: new Date(),
        };
        result = await mobileDiceService.rollDice(tempConfig, settings.modifiersEnabled);
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
      case 'roll':
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
      case 'statistics':
        return (
          <Statistics
            history={rollHistory}
          />
        );
      default:
        return null;
    }
  };

  const getTabLabel = (tab: Tab) => {
    switch (tab) {
      case 'roll':
        return 'Roll';
      case 'saved':
        return `Saved (${configurations.length})`;
      case 'history':
        return `History (${rollHistory.length})`;
      case 'statistics':
        return 'Statistics';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.row, { width: '100%' }]}>
          <View style={{ position: 'absolute', left: 16, top: -4, bottom: 4, justifyContent: 'center', alignItems: 'center' }}>
            <Pressable
              style={styles.settingsIcon}
              onPress={() => setShowMenu(true)}
            >
              <Text style={{ fontSize: 24, color: 'white' }}>☰</Text>
            </Pressable>
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.headerTitle}>🎲 Dicey</Text>
          </View>
        </View>
      </View>


      {/* Content */}
      <View style={{ flex: 1 }}>
        {renderTabContent()}
      </View>

      {/* Navigation Menu Modal */}
      <Modal
        visible={showMenu}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMenu(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setShowMenu(false)}
          />
          <View style={{
            backgroundColor: 'white',
            paddingVertical: 40,
            paddingHorizontal: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '50%'
          }}>
            {(['roll', 'saved', 'history', 'statistics'] as Tab[]).map((tab) => (
              <Pressable
                key={tab}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  marginBottom: 8,
                  backgroundColor: activeTab === tab ? colors.primary : 'transparent'
                }}
                onPress={() => {
                  setActiveTab(tab);
                  setShowMenu(false);
                }}
              >
                <Text style={{
                  fontSize: 18,
                  fontWeight: activeTab === tab ? '600' : '400',
                  color: activeTab === tab ? 'white' : colors.text,
                  textAlign: 'center'
                }}>
                  {getTabLabel(tab)}
                </Text>
              </Pressable>
            ))}

            {/* Separator line */}
            <View style={{
              height: 1,
              backgroundColor: '#e0e0e0',
              marginVertical: 16,
              marginHorizontal: 20
            }} />

            {/* Settings option */}
            <Pressable
              style={{
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderRadius: 8,
                marginBottom: 8,
                backgroundColor: 'transparent'
              }}
              onPress={() => {
                setShowMenu(false);
                setShowSettings(true);
              }}
            >
              <Text style={{
                fontSize: 18,
                fontWeight: '400',
                color: colors.text,
                textAlign: 'center'
              }}>
                Settings
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />

    </SafeAreaView>
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
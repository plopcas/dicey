import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Alert, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Die, DICE_TYPES, RollResult } from '../shared/types';
import { formatDiceConfiguration, validateDiceConfiguration } from '../shared/utils';
import { styles, colors } from '../styles/styles';

interface DiceBuilderProps {
  onSave: (name: string, dice: Die[]) => void;
  onRoll: (dice: Die[]) => void;
  lastRoll?: RollResult | null;
  loadedConfiguration?: Die[] | null;
}

export const DiceBuilder: React.FC<DiceBuilderProps> = ({ onSave, onRoll, lastRoll, loadedConfiguration }) => {
  const [dice, setDice] = useState<Die[]>(loadedConfiguration || []);
  const [configName, setConfigName] = useState('');

  useEffect(() => {
    if (loadedConfiguration) {
      setDice(loadedConfiguration);
    }
  }, [loadedConfiguration]);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const addDie = () => {
    setDice([...dice, { sides: 6, quantity: 1 }]);
  };

  const updateDie = (index: number, updates: Partial<Die>) => {
    const newDice = [...dice];
    newDice[index] = { ...newDice[index], ...updates };
    setDice(newDice);
  };

  const removeDie = (index: number) => {
    setDice(dice.filter((_, i) => i !== index));
  };

  const clearConfiguration = () => {
    Alert.alert(
      'Clear Configuration',
      'Are you sure you want to clear all dice?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => setDice([]) },
      ]
    );
  };

  const handleSave = () => {
    if (!configName.trim()) {
      Alert.alert('Missing Name', 'Please enter a configuration name');
      return;
    }
    
    if (!validateDiceConfiguration(dice)) {
      Alert.alert('Invalid Configuration', 'Please add at least one die');
      return;
    }

    onSave(configName.trim(), dice);
    setConfigName(''); // Only clear the name, keep the dice configuration
    Alert.alert('Success', 'Configuration saved!');
  };

  const handleRoll = () => {
    if (!validateDiceConfiguration(dice)) {
      Alert.alert('Invalid Configuration', 'Please add at least one die to roll');
      return;
    }
    onRoll(dice);
  };

  const isValid = validateDiceConfiguration(dice);

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.scrollContent, { paddingBottom: 20 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Section - Quick Roll and Last Result */}
      <View style={[styles.card, { margin: 16, marginBottom: 8 }]}>
        <Text style={styles.sectionTitle}>Quick Roll</Text>
        
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.primaryButton,
            !isValid && styles.disabledButton,
            pressed && isValid && styles.primaryButtonPressed,
            { marginBottom: 16 }
          ]}
          onPress={handleRoll}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>
            {isValid ? '🎲 Roll Dice' : 'Add dice below to roll'}
          </Text>
        </Pressable>

        {lastRoll && (
          <View style={[styles.preview, { marginBottom: 0 }]}>
            <View style={[styles.row, styles.spaceBetween, { marginBottom: 8 }]}>
              <Text style={[styles.previewText, { flex: 1 }]}>
                {lastRoll.configurationName}
              </Text>
              <Text style={[styles.totalValue, { fontSize: 24, marginLeft: 16 }]}>
                {lastRoll.total}
              </Text>
            </View>
            <View style={styles.individualRolls}>
              {lastRoll.results.flat().map((roll, index) => (
                <Text key={index} style={styles.rollValue}>
                  {roll}
                </Text>
              ))}
            </View>
          </View>
        )}

        {dice.length > 0 && (
          <View style={[styles.preview, { marginTop: lastRoll ? 12 : 0, marginBottom: 0 }]}>
            <Text style={styles.previewText}>
              {formatDiceConfiguration(dice)}
            </Text>
          </View>
        )}
      </View>

      {/* Middle Section - Save Configuration */}
      <View style={[styles.card, { margin: 16, marginTop: 8, marginBottom: 8 }]}>
        <Text style={styles.inputLabel}>Save Configuration</Text>
        <View style={[styles.row, { gap: 12 }]}>
          <TextInput
            style={[
              styles.textInput,
              styles.flex1,
              focusedInput === 'configName' && styles.textInputFocused,
            ]}
            placeholder="Enter configuration name..."
            placeholderTextColor={colors.textLight}
            value={configName}
            onChangeText={setConfigName}
            onFocus={() => setFocusedInput('configName')}
            onBlur={() => setFocusedInput(null)}
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
          
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.successButton,
              (!isValid || !configName.trim()) && styles.disabledButton,
              pressed && isValid && configName.trim() && styles.successButtonPressed,
              { paddingHorizontal: 20 }
            ]}
            onPress={handleSave}
            disabled={!isValid || !configName.trim()}
          >
            <Text style={styles.buttonText}>💾</Text>
          </Pressable>
        </View>
      </View>

      {/* Bottom Section - Dice Configuration */}
      <View style={[styles.card, { margin: 16, marginTop: 8 }]}>
        <View style={[styles.row, styles.spaceBetween, { marginBottom: 16 }]}>
          <Text style={styles.sectionTitle}>Dice Configuration</Text>
          <View style={[styles.row, { gap: 8 }]}>
            {dice.length > 0 && (
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.smallButton,
                  styles.dangerButton,
                  pressed && styles.dangerButtonPressed,
                ]}
                onPress={clearConfiguration}
              >
                <Text style={styles.smallButtonText}>Clear</Text>
              </Pressable>
            )}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.smallButton,
                styles.successButton,
                pressed && styles.successButtonPressed,
              ]}
              onPress={addDie}
            >
              <Text style={styles.smallButtonText}>+ Add</Text>
            </Pressable>
          </View>
        </View>

        {dice.length === 0 ? (
          <View style={[styles.center, { paddingVertical: 20 }]}>
            <Text style={styles.emptyStateIcon}>🎲</Text>
            <Text style={styles.emptyStateText}>
              Tap "Add" to start building your dice configuration
            </Text>
          </View>
        ) : (
          <>
            {/* Table Header */}
            <View style={[styles.row, { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <Text style={[styles.inputLabel, { flex: 1, textAlign: 'center' }]}>Qty</Text>
              <Text style={[styles.inputLabel, { flex: 1, textAlign: 'center' }]}>Die Type</Text>
              <Text style={[styles.inputLabel, { width: 60, textAlign: 'center' }]}>Action</Text>
            </View>

            {/* Dice List - Now part of main scroll */}
            <View style={{ paddingVertical: 8 }}>
              {dice.map((die, index) => (
                <View key={index} style={[styles.row, { paddingVertical: 16, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.borderLight, minHeight: 80 }]}>
                  {/* Quantity Input */}
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <TextInput
                      style={[
                        styles.numberInput,
                        focusedInput === `quantity-${index}` && styles.numberInputFocused,
                        { 
                          width: '80%', 
                          height: 48, 
                          textAlign: 'center',
                          fontSize: 18,
                          fontWeight: '600',
                          color: colors.text,
                          paddingVertical: 8,
                          paddingHorizontal: 4
                        }
                      ]}
                      value={die.quantity.toString()}
                      onChangeText={(text) => {
                        const num = parseInt(text) || 1;
                        updateDie(index, { quantity: Math.max(1, Math.min(20, num)) });
                      }}
                      onFocus={() => setFocusedInput(`quantity-${index}`)}
                      onBlur={() => setFocusedInput(null)}
                      keyboardType="numeric"
                      maxLength={2}
                      selectTextOnFocus
                    />
                  </View>
                  
                  {/* Die Type Display + Picker */}
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <View
                      style={[
                        styles.picker,
                        { 
                          width: '80%', 
                          height: 48, 
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: colors.surface,
                          position: 'relative',
                        }
                      ]}
                    >
                      <Text style={[styles.previewText, { fontSize: 18, fontWeight: '600', color: colors.primary }]}>
                        D{die.sides} ▼
                      </Text>
                      <Picker
                        selectedValue={die.sides}
                        onValueChange={(value) => updateDie(index, { sides: value })}
                        style={{ 
                          position: 'absolute',
                          width: '100%',
                          height: 48,
                          opacity: 0 // Hide the picker but keep it functional
                        }}
                      >
                        {DICE_TYPES.map(sides => (
                          <Picker.Item 
                            key={sides} 
                            label={`D${sides}`} 
                            value={sides}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>

                  {/* Remove Button */}
                  <View style={{ width: 60, alignItems: 'center' }}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.button,
                        styles.smallButton,
                        styles.dangerButton,
                        pressed && styles.dangerButtonPressed,
                        { width: 48, height: 48, paddingHorizontal: 0 }
                      ]}
                      onPress={() => removeDie(index)}
                    >
                      <Text style={[styles.smallButtonText, { fontSize: 16 }]}>🗑️</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};
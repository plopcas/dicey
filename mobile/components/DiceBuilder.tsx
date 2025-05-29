import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Die, DICE_TYPES } from '../shared/types';
import { formatDiceConfiguration, validateDiceConfiguration } from '../shared/utils';
import { styles, colors } from '../styles/styles';

interface DiceBuilderProps {
  onSave: (name: string, dice: Die[]) => void;
  onRoll: (dice: Die[]) => void;
}

export const DiceBuilder: React.FC<DiceBuilderProps> = ({ onSave, onRoll }) => {
  const [dice, setDice] = useState<Die[]>([]);
  const [configName, setConfigName] = useState('');
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
    setConfigName('');
    setDice([]);
    Alert.alert('Success', 'Configuration saved successfully!');
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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dice Configuration</Text>
        
        {dice.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🎲</Text>
            <Text style={styles.emptyStateTitle}>No Dice Added</Text>
            <Text style={styles.emptyStateText}>
              Tap the "Add Die" button below to start building your dice configuration.
            </Text>
          </View>
        ) : (
          <View style={styles.diceList}>
            {dice.map((die, index) => (
              <View key={index} style={styles.dieConfig}>
                <View style={styles.dieInputs}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Quantity</Text>
                    <TextInput
                      style={[
                        styles.numberInput,
                        focusedInput === `quantity-${index}` && styles.numberInputFocused
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
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Die Type</Text>
                    <View style={styles.picker}>
                      <Picker
                        selectedValue={die.sides}
                        onValueChange={(value) => updateDie(index, { sides: value })}
                        style={{ height: 48 }}
                      >
                        {DICE_TYPES.map(sides => (
                          <Picker.Item 
                            key={sides} 
                            label={`D${sides}`} 
                            value={sides}
                            style={{ fontSize: 16 }}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>
                
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.smallButton,
                    styles.dangerButton,
                    pressed && styles.dangerButtonPressed,
                  ]}
                  onPress={() => removeDie(index)}
                >
                  <Text style={styles.smallButtonText}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.successButton,
            pressed && styles.successButtonPressed,
          ]}
          onPress={addDie}
        >
          <Text style={styles.buttonText}>➕ Add Die</Text>
        </Pressable>

        {dice.length > 0 && (
          <View style={styles.preview}>
            <Text style={styles.previewText}>
              {formatDiceConfiguration(dice)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.primaryButton,
            !isValid && styles.disabledButton,
            pressed && isValid && styles.primaryButtonPressed,
          ]}
          onPress={handleRoll}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>
            {isValid ? '🎲 Roll Dice' : 'Add dice to roll'}
          </Text>
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.inputLabel}>Save Configuration</Text>
          <TextInput
            style={[
              styles.textInput,
              focusedInput === 'configName' && styles.textInputFocused
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
          
          <View style={styles.mt}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.successButton,
                (!isValid || !configName.trim()) && styles.disabledButton,
                pressed && isValid && configName.trim() && styles.successButtonPressed,
              ]}
              onPress={handleSave}
              disabled={!isValid || !configName.trim()}
            >
              <Text style={styles.buttonText}>
                💾 Save Configuration
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
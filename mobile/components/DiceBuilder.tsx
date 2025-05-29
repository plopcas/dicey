import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Die, DICE_TYPES } from '../shared/types';
import { formatDiceConfiguration, validateDiceConfiguration } from '../shared/utils';
import { styles } from '../styles/styles';

interface DiceBuilderProps {
  onSave: (name: string, dice: Die[]) => void;
  onRoll: (dice: Die[]) => void;
}

export const DiceBuilder: React.FC<DiceBuilderProps> = ({ onSave, onRoll }) => {
  const [dice, setDice] = useState<Die[]>([]);
  const [configName, setConfigName] = useState('');

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
      Alert.alert('Error', 'Please enter a configuration name');
      return;
    }
    
    if (!validateDiceConfiguration(dice)) {
      Alert.alert('Error', 'Please add at least one die');
      return;
    }

    onSave(configName.trim(), dice);
    setConfigName('');
    setDice([]);
    Alert.alert('Success', 'Configuration saved!');
  };

  const handleRoll = () => {
    if (!validateDiceConfiguration(dice)) {
      Alert.alert('Error', 'Please add at least one die');
      return;
    }
    onRoll(dice);
  };

  const isValid = validateDiceConfiguration(dice);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dice Configuration</Text>
      
      <View style={styles.diceList}>
        {dice.map((die, index) => (
          <View key={index} style={styles.dieConfig}>
            <View style={styles.dieInputs}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Quantity:</Text>
                <TextInput
                  style={styles.numberInput}
                  value={die.quantity.toString()}
                  onChangeText={(text) => updateDie(index, { quantity: parseInt(text) || 1 })}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Sides:</Text>
                <Picker
                  style={styles.picker}
                  selectedValue={die.sides}
                  onValueChange={(value) => updateDie(index, { sides: value })}
                >
                  {DICE_TYPES.map(sides => (
                    <Picker.Item key={sides} label={`D${sides}`} value={sides} />
                  ))}
                </Picker>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeDie(index)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.addDieButton} onPress={addDie}>
        <Text style={styles.addDieButtonText}>Add Die</Text>
      </TouchableOpacity>

      {dice.length > 0 && (
        <View style={styles.configPreview}>
          <Text style={styles.configPreviewText}>
            Configuration: {formatDiceConfiguration(dice)}
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.rollButton, !isValid && styles.disabledButton]}
          onPress={handleRoll}
          disabled={!isValid}
        >
          <Text style={styles.rollButtonText}>Roll Dice</Text>
        </TouchableOpacity>

        <View style={styles.saveSection}>
          <TextInput
            style={styles.textInput}
            placeholder="Configuration name..."
            value={configName}
            onChangeText={setConfigName}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!isValid || !configName.trim()) && styles.disabledButton
            ]}
            onPress={handleSave}
            disabled={!isValid || !configName.trim()}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
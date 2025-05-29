import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Alert, Pressable, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Die, DICE_TYPES, RollResult } from '../shared/types';
import { formatDiceConfiguration, validateDiceConfiguration } from '../shared/utils';
import { styles, colors } from '../styles/styles';

interface DiceBuilderProps {
  onSave: (name: string, dice: Die[]) => void;
  onRoll: (dice: Die[]) => void;
  lastRoll?: RollResult | null;
  currentDice: Die[];
  onDiceChange: (dice: Die[]) => void;
}

export const DiceBuilder: React.FC<DiceBuilderProps> = ({ onSave, onRoll, lastRoll, currentDice, onDiceChange }) => {
  const [configName, setConfigName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCustomDieModal, setShowCustomDieModal] = useState(false);
  const [customDieSides, setCustomDieSides] = useState('');
  const [customDieIndex, setCustomDieIndex] = useState<number | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const addDie = () => {
    onDiceChange([...currentDice, { sides: 6, quantity: 1, modifier: 0 }]);
  };

  const updateDie = (index: number, updates: Partial<Die>) => {
    const newDice = [...currentDice];
    newDice[index] = { ...newDice[index], ...updates };
    onDiceChange(newDice);
  };

  const removeDie = (index: number) => {
    onDiceChange(currentDice.filter((_, i) => i !== index));
  };

  const clearConfiguration = () => {
    Alert.alert(
      'Clear Configuration',
      'Are you sure you want to clear all dice?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => onDiceChange([]) },
      ]
    );
  };

  const openSaveModal = () => {
    if (!validateDiceConfiguration(currentDice)) {
      Alert.alert('Invalid Configuration', 'Please add at least one die to save');
      return;
    }
    setShowSaveModal(true);
  };

  const handleSave = () => {
    if (!configName.trim()) {
      Alert.alert('Missing Name', 'Please enter a configuration name');
      return;
    }

    onSave(configName.trim(), currentDice);
    setConfigName(''); // Only clear the name, keep the dice configuration
    setShowSaveModal(false);
    Alert.alert('Success', 'Configuration saved!');
  };

  const handleRoll = () => {
    if (!validateDiceConfiguration(currentDice)) {
      Alert.alert('Invalid Configuration', 'Please add at least one die to roll');
      return;
    }
    onRoll(currentDice);
  };

  const handleDieTypeChange = (index: number, newSides: number) => {
    if (newSides === -1) {
      // Custom die selected
      setCustomDieIndex(index);
      setCustomDieSides('');
      setShowCustomDieModal(true);
    } else {
      updateDie(index, { sides: newSides });
    }
  };

  const handleCustomDieSubmit = () => {
    const sides = parseInt(customDieSides);
    if (sides > 0 && customDieIndex !== null) {
      updateDie(customDieIndex, { sides });
      setShowCustomDieModal(false);
      setCustomDieSides('');
      setCustomDieIndex(null);
    }
  };

  const isValid = validateDiceConfiguration(currentDice);

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[styles.scrollContent, { paddingBottom: 20 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Section - Quick Roll and Last Result */}
      <View style={[styles.card, { margin: 16, marginBottom: 8 }]}>
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
            <View style={[styles.row, { marginBottom: 8, alignItems: 'center' }]}>
              <Text style={[styles.previewText, { fontWeight: '600', color: colors.textSecondary }]}>
                TOTAL
              </Text>
              <Text style={[styles.totalValue, { fontSize: 32, marginLeft: 16, fontWeight: 'bold' }]}>
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

        {currentDice.length > 0 && (
          <View style={[styles.preview, { marginTop: lastRoll ? 12 : 0, marginBottom: 0 }]}>
            <Text style={styles.previewText}>
              {formatDiceConfiguration(currentDice)}
            </Text>
          </View>
        )}
      </View>


      {/* Bottom Section - Dice Configuration */}
      <View style={[styles.card, { margin: 16, marginTop: 8 }]}>
        <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Dice Configuration</Text>
        
        <View style={[styles.row, { gap: 8, marginBottom: 16 }]}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.smallButton,
              styles.successButton,
              !isValid && styles.disabledButton,
              pressed && isValid && styles.successButtonPressed,
              { flex: 1 }
            ]}
            onPress={openSaveModal}
            disabled={!isValid}
          >
            <Text style={styles.smallButtonText}>Save</Text>
          </Pressable>
          
          {currentDice.length > 0 && (
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.smallButton,
                styles.dangerButton,
                pressed && styles.dangerButtonPressed,
                { flex: 1 }
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
              { flex: 1 }
            ]}
            onPress={addDie}
          >
            <Text style={styles.smallButtonText}>+ Add</Text>
          </Pressable>
        </View>

        {currentDice.length === 0 ? (
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
              {currentDice.map((die, index) => (
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
                        onValueChange={(value) => handleDieTypeChange(index, value)}
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
                            label={sides === -1 ? 'Custom...' : `D${sides}`} 
                            value={sides}
                          />
                        ))}
                        {!DICE_TYPES.includes(die.sides as any) && (
                          <Picker.Item 
                            label={`D${die.sides}`} 
                            value={die.sides}
                          />
                        )}
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
                      <Text style={[styles.smallButtonText, { fontSize: 16, color: 'white' }]}>×</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
      
      {/* Save Configuration Modal */}
      <Modal
        visible={showSaveModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={[styles.card, { width: '100%', maxWidth: 400 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 16, textAlign: 'center' }]}>Save Configuration</Text>
            
            <TextInput
              style={[
                styles.textInput,
                focusedInput === 'configName' && styles.textInputFocused,
                { marginBottom: 20 }
              ]}
              placeholder="Enter configuration name..."
              placeholderTextColor={colors.textLight}
              value={configName}
              onChangeText={setConfigName}
              onFocus={() => setFocusedInput('configName')}
              onBlur={() => setFocusedInput(null)}
              returnKeyType="done"
              onSubmitEditing={handleSave}
              autoFocus={true}
            />
            
            <View style={[styles.row, { gap: 12 }]}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.smallButton,
                  { flex: 1, backgroundColor: colors.textLight },
                  pressed && { backgroundColor: colors.border }
                ]}
                onPress={() => {
                  setShowSaveModal(false);
                  setConfigName('');
                }}
              >
                <Text style={[styles.smallButtonText, { color: 'white' }]}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.smallButton,
                  styles.successButton,
                  !configName.trim() && styles.disabledButton,
                  pressed && configName.trim() && styles.successButtonPressed,
                  { flex: 1 }
                ]}
                onPress={handleSave}
                disabled={!configName.trim()}
              >
                <Text style={styles.smallButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Custom Die Modal */}
      <Modal
        visible={showCustomDieModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCustomDieModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={[styles.card, { width: '100%', maxWidth: 400 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 16, textAlign: 'center' }]}>Custom Die</Text>
            
            <Text style={[styles.inputLabel, { marginBottom: 8, textAlign: 'center' }]}>
              How many faces does this die have?
            </Text>
            
            <TextInput
              style={[
                styles.textInput,
                focusedInput === 'customDie' && styles.textInputFocused,
                { marginBottom: 20 }
              ]}
              placeholder="Enter number of faces (e.g., 3, 7, 13...)"
              placeholderTextColor={colors.textLight}
              value={customDieSides}
              onChangeText={setCustomDieSides}
              onFocus={() => setFocusedInput('customDie')}
              onBlur={() => setFocusedInput(null)}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={handleCustomDieSubmit}
              autoFocus={true}
            />
            
            <View style={[styles.row, { gap: 12 }]}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.smallButton,
                  { flex: 1, backgroundColor: colors.textLight },
                  pressed && { backgroundColor: colors.border }
                ]}
                onPress={() => {
                  setShowCustomDieModal(false);
                  setCustomDieSides('');
                  setCustomDieIndex(null);
                }}
              >
                <Text style={[styles.smallButtonText, { color: 'white' }]}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.smallButton,
                  styles.successButton,
                  (!customDieSides.trim() || parseInt(customDieSides) < 2) && styles.disabledButton,
                  pressed && customDieSides.trim() && parseInt(customDieSides) >= 2 && styles.successButtonPressed,
                  { flex: 1 }
                ]}
                onPress={handleCustomDieSubmit}
                disabled={!customDieSides.trim() || parseInt(customDieSides) < 2}
              >
                <Text style={styles.smallButtonText}>
                  Create D{customDieSides || '?'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
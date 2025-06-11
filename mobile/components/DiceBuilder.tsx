import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, Alert, Pressable, Modal, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Die, DICE_TYPES, RollResult } from '../shared/types';
import { formatDiceConfiguration, validateDiceConfiguration } from '../shared/utils';
import { useSettings } from '../contexts/SettingsContext';
import { styles, colors } from '../styles/styles';

interface DiceBuilderProps {
  onSave: (name: string, dice: Die[]) => void;
  onRoll: (dice: Die[]) => void;
  lastRoll?: RollResult | null;
  currentDice: Die[];
  onDiceChange: (dice: Die[]) => void;
  onClearLastRoll?: () => void;
  isRolling?: boolean;
}

export const DiceBuilder: React.FC<DiceBuilderProps> = ({ onSave, onRoll, lastRoll, currentDice, onDiceChange, onClearLastRoll, isRolling }) => {
  const { settings } = useSettings();
  const [configName, setConfigName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCustomDieModal, setShowCustomDieModal] = useState(false);
  const [customDieSides, setCustomDieSides] = useState('');
  const [customDieIndex, setCustomDieIndex] = useState<number | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [modifierInputs, setModifierInputs] = useState<{ [key: number]: string }>({});
  const [showModifierModal, setShowModifierModal] = useState(false);
  const [modifierDieIndex, setModifierDieIndex] = useState<number | null>(null);
  const [modifierValue, setModifierValue] = useState('');
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [quantityDieIndex, setQuantityDieIndex] = useState<number | null>(null);
  const [quantityValue, setQuantityValue] = useState('');
  const modifierInputRef = useRef<TextInput>(null);
  const quantityInputRef = useRef<TextInput>(null);

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
        { 
          text: 'Clear', 
          style: 'destructive', 
          onPress: () => {
            onDiceChange([]);
            onClearLastRoll?.();
          }
        },
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

  const isCustomDieValid = () => {
    const sides = parseInt(customDieSides);
    return !isNaN(sides) && sides > 0;
  };

  const handleCustomDieSubmit = () => {
    const sides = parseInt(customDieSides);
    if (isCustomDieValid() && customDieIndex !== null) {
      updateDie(customDieIndex, { sides });
      setShowCustomDieModal(false);
      setCustomDieSides('');
      setCustomDieIndex(null);
    }
  };

  const openModifierModal = (index: number) => {
    setModifierDieIndex(index);
    const value = (currentDice[index].modifier || 0).toString();
    setModifierValue(value);
    setShowModifierModal(true);
    // Multiple attempts to ensure focus and selection work
    setTimeout(() => {
      modifierInputRef.current?.focus();
      setTimeout(() => {
        modifierInputRef.current?.setSelection(0, value.length);
      }, 50);
    }, 200);
  };

  const openQuantityModal = (index: number) => {
    setQuantityDieIndex(index);
    const value = currentDice[index].quantity.toString();
    setQuantityValue(value);
    setShowQuantityModal(true);
    // Multiple attempts to ensure focus and selection work
    setTimeout(() => {
      quantityInputRef.current?.focus();
      setTimeout(() => {
        quantityInputRef.current?.setSelection(0, value.length);
      }, 50);
    }, 200);
  };

  const handleModifierSubmit = () => {
    if (modifierDieIndex !== null) {
      const num = parseInt(modifierValue) || 0;
      updateDie(modifierDieIndex, { modifier: Math.max(-99, Math.min(99, num)) });
      setShowModifierModal(false);
      setModifierValue('');
      setModifierDieIndex(null);
    }
  };

  const handleQuantitySubmit = () => {
    if (quantityDieIndex !== null) {
      const value = parseInt(quantityValue) || 1;
      updateDie(quantityDieIndex, { quantity: Math.max(1, Math.min(20, value)) });
      setShowQuantityModal(false);
      setQuantityValue('');
      setQuantityDieIndex(null);
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
            (!isValid || isRolling) && styles.disabledButton,
            pressed && isValid && !isRolling && styles.primaryButtonPressed,
            { marginBottom: 16 }
          ]}
          onPress={handleRoll}
          disabled={!isValid || isRolling}
        >
          <Text style={styles.buttonText}>
            {isRolling ? 'Rolling...' : isValid ? 'Roll' : 'Add dice below to roll'}
          </Text>
        </Pressable>

        {lastRoll && (
          <View style={[styles.preview, { marginBottom: 0 }]}>
            <View style={[styles.row, { marginBottom: 8, alignItems: 'center', justifyContent: 'center' }]}>
              <Text style={[styles.totalValue, { fontSize: 64, fontWeight: 'bold', color: colors.primary }]}>
                {lastRoll.total}
              </Text>
            </View>
            {(() => {
              // Calculate total number of dice and if any modifiers are applied
              const totalDiceCount = lastRoll.results.reduce((sum, dieGroup) => sum + dieGroup.length, 0);
              const hasAnyModifiers = lastRoll.modifiers && settings.modifiersEnabled && 
                lastRoll.modifiers.some(modifier => modifier !== 0);
              
              // Show individual dice only if more than 1 die total OR modifiers are applied
              const shouldShowIndividualDice = totalDiceCount > 1 || hasAnyModifiers;
              
              return shouldShowIndividualDice ? (
                <View style={styles.individualRolls}>
                  {lastRoll.results.map((dieGroup, dieIndex) => 
                    dieGroup.map((roll, rollIndex) => {
                      const modifier = lastRoll.modifiers ? lastRoll.modifiers[dieIndex] : 0;
                      const hasModifier = settings.modifiersEnabled && modifier !== 0;
                      const modifiedTotal = roll + modifier;
                      
                      if (hasModifier) {
                        return (
                          <Text 
                            key={`${dieIndex}-${rollIndex}`} 
                            style={[
                              styles.rollValue,
                              {
                                backgroundColor: modifier > 0 ? colors.success : colors.danger,
                              }
                            ]}
                          >
                            {modifiedTotal}({roll}{modifier > 0 ? '+' : ''}{modifier})
                          </Text>
                        );
                      } else {
                        return (
                          <Text key={`${dieIndex}-${rollIndex}`} style={styles.rollValue}>
                            {roll}
                          </Text>
                        );
                      }
                    })
                  )}
                </View>
              ) : null;
            })()}
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
        <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Dice configuration</Text>
        
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
              <Text style={[styles.inputLabel, { flex: 1, textAlign: 'center' }]}>Die type</Text>
              {settings.modifiersEnabled && (
                <Text style={[styles.inputLabel, { flex: 1, textAlign: 'center' }]}>Modifier</Text>
              )}
              <Text style={[styles.inputLabel, { width: 60, textAlign: 'center' }]}>Action</Text>
            </View>

            {/* Dice List - Now part of main scroll */}
            <View style={{ paddingVertical: 8 }}>
              {currentDice.map((die, index) => (
                <View key={index} style={[styles.row, { paddingVertical: 16, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.borderLight, minHeight: 80 }]}>
                  {/* Quantity Button */}
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.numberInput,
                        { 
                          width: '80%', 
                          height: 48, 
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: pressed ? colors.borderLight : colors.surface,
                          paddingVertical: 8,
                          paddingHorizontal: 4,
                        }
                      ]}
                      onPress={() => openQuantityModal(index)}
                    >
                      <Text style={{ 
                        fontSize: 14, 
                        fontWeight: '600', 
                        color: colors.text
                      }}>
                        {die.quantity}
                      </Text>
                    </Pressable>
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
                      <Text style={[styles.previewText, { fontSize: 14, fontWeight: '600', color: colors.text }]}>
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

                  {/* Modifier Button */}
                  {settings.modifiersEnabled && (
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Pressable
                        style={({ pressed }) => [
                          styles.numberInput,
                          { 
                            width: '80%', 
                            height: 48, 
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: pressed ? colors.borderLight : colors.surface,
                            paddingVertical: 8,
                            paddingHorizontal: 4,
                          }
                        ]}
                        onPress={() => openModifierModal(index)}
                      >
                        <Text style={{ 
                          fontSize: 14, 
                          fontWeight: '600', 
                          color: (die.modifier || 0) === 0 ? colors.textLight : colors.text 
                        }}>
                          {(die.modifier || 0) === 0 ? '0' : ((die.modifier || 0) > 0 ? `+${die.modifier}` : (die.modifier || 0).toString())}
                        </Text>
                      </Pressable>
                    </View>
                  )}

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
            <Text style={[styles.sectionTitle, { marginBottom: 16, textAlign: 'center' }]}>Save configuration</Text>
            
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
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <View style={[styles.card, { width: '100%', maxWidth: 400 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 16, textAlign: 'center' }]}>Custom die</Text>
            
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
              blurOnSubmit={false}
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
                  !isCustomDieValid() && styles.disabledButton,
                  pressed && isCustomDieValid() && styles.successButtonPressed,
                  { flex: 1 }
                ]}
                onPress={handleCustomDieSubmit}
                disabled={!isCustomDieValid()}
              >
                <Text style={styles.smallButtonText}>
                  Create D{customDieSides || '?'}
                </Text>
              </Pressable>
            </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* Modifier Modal */}
      <Modal
        visible={showModifierModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModifierModal(false)}
      >
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <View style={[styles.card, { width: '100%', maxWidth: 400 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 16, textAlign: 'center' }]}>Set modifier</Text>
            
            <Text style={[styles.inputLabel, { marginBottom: 8, textAlign: 'center' }]}>
              Enter modifier value (positive or negative)
            </Text>
            
            <TextInput
              ref={modifierInputRef}
              style={[
                styles.textInput,
                focusedInput === 'modifier' && styles.textInputFocused,
                { marginBottom: 20 }
              ]}
              placeholder="Enter modifier (e.g., +2, -1, 0)"
              placeholderTextColor={colors.textLight}
              value={modifierValue}
              onChangeText={setModifierValue}
              onFocus={() => {
                setFocusedInput('modifier');
                // Additional selection attempt on focus
                setTimeout(() => {
                  modifierInputRef.current?.setSelection(0, modifierValue.length);
                }, 10);
              }}
              onBlur={() => setFocusedInput(null)}
              keyboardType="numbers-and-punctuation"
              returnKeyType="done"
              onSubmitEditing={handleModifierSubmit}
              autoFocus={true}
              selectTextOnFocus
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
                  setShowModifierModal(false);
                  setModifierValue('');
                  setModifierDieIndex(null);
                }}
              >
                <Text style={[styles.smallButtonText, { color: 'white' }]}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.smallButton,
                  styles.successButton,
                  pressed && styles.successButtonPressed,
                  { flex: 1 }
                ]}
                onPress={handleModifierSubmit}
              >
                <Text style={styles.smallButtonText}>
                  Set Modifier
                </Text>
              </Pressable>
            </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Quantity Modal */}
      <Modal
        visible={showQuantityModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQuantityModal(false)}
      >
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <View style={[styles.card, { width: '100%', maxWidth: 400 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 16, textAlign: 'center' }]}>Set quantity</Text>
            
            <Text style={[styles.inputLabel, { marginBottom: 8, textAlign: 'center' }]}>
              Enter number of dice (1-20)
            </Text>
            
            <TextInput
              ref={quantityInputRef}
              style={[
                styles.textInput,
                focusedInput === 'quantity' && styles.textInputFocused,
                { marginBottom: 20 }
              ]}
              placeholder="Enter quantity (e.g., 1, 2, 5)"
              placeholderTextColor={colors.textLight}
              value={quantityValue}
              onChangeText={setQuantityValue}
              onFocus={() => {
                setFocusedInput('quantity');
                // Additional selection attempt on focus
                setTimeout(() => {
                  quantityInputRef.current?.setSelection(0, quantityValue.length);
                }, 10);
              }}
              onBlur={() => setFocusedInput(null)}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={handleQuantitySubmit}
              autoFocus={true}
              selectTextOnFocus
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
                  setShowQuantityModal(false);
                  setQuantityValue('');
                  setQuantityDieIndex(null);
                }}
              >
                <Text style={[styles.smallButtonText, { color: 'white' }]}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.smallButton,
                  styles.successButton,
                  pressed && styles.successButtonPressed,
                  { flex: 1 }
                ]}
                onPress={handleQuantitySubmit}
              >
                <Text style={styles.smallButtonText}>
                  Set Quantity
                </Text>
              </Pressable>
            </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
};
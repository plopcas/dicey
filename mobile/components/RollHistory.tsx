import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { RollResult } from '../shared/types';
import { formatDiceConfiguration } from '../shared/utils';
import { useSettings } from '../contexts/SettingsContext';
import { styles, colors } from '../styles/styles';

interface RollHistoryProps {
  history: RollResult[];
  onClear: () => void;
}

export const RollHistory: React.FC<RollHistoryProps> = ({ history, onClear }) => {
  const { settings } = useSettings();
  
  const handleClear = () => {
    Alert.alert(
      'Clear history',
      'Are you sure you want to clear all roll history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear all', style: 'destructive', onPress: onClear },
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.emptyState, { marginHorizontal: 0 }]}>
          <Text style={styles.emptyStateIcon}>📜</Text>
          <Text style={styles.emptyStateTitle}>No roll history</Text>
          <Text style={styles.emptyStateText}>
            Start rolling dice to see your roll history here. All rolls are automatically saved.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <View style={[styles.row, styles.spaceBetween, { marginBottom: 16 }]}>
          <Text style={styles.sectionTitle}>
            Roll history ({history.length})
          </Text>
          
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.smallButton,
              styles.dangerButton,
              pressed && styles.dangerButtonPressed,
            ]}
            onPress={handleClear}
          >
            <Text style={styles.smallButtonText}>Clear all</Text>
          </Pressable>
        </View>
        
        <View style={styles.list}>
          {history.map((roll) => (
            <View key={roll.id} style={styles.listItem}>
              <View style={styles.listItemHeader}>
                <Text style={styles.listItemTitle} numberOfLines={1}>
                  {formatTime(roll.timestamp)}
                </Text>
                <View style={[styles.totalContainer, { minWidth: 'auto', paddingHorizontal: 12, paddingVertical: 4 }]}>
                  <Text style={[styles.totalValue, { fontSize: 20 }]}>
                    {roll.total}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.listItemSubtitle}>
                {formatDiceConfiguration(roll.dice)}
              </Text>
              
              <View style={{ marginVertical: 8 }}>
                {roll.dice.map((die, dieIndex) => (
                  <View key={dieIndex} style={{ marginBottom: 4 }}>
                    <Text style={[styles.listItemMeta, { marginBottom: 4 }]}>
                      {die.quantity}D{die.sides}:
                    </Text>
                    <View style={styles.individualRolls}>
                      {roll.results[dieIndex].map((rollValue, rollIndex) => {
                        const modifier = roll.modifiers ? roll.modifiers[dieIndex] : 0;
                        const hasModifier = settings.modifiersEnabled && modifier !== 0;
                        const modifiedTotal = rollValue + modifier;
                        
                        if (hasModifier) {
                          return (
                            <Text 
                              key={rollIndex}
                              style={[
                                styles.rollValue,
                                {
                                  backgroundColor: modifier > 0 ? colors.success : colors.danger,
                                }
                              ]}
                            >
                              {modifiedTotal}({rollValue}{modifier > 0 ? '+' : ''}{modifier})
                            </Text>
                          );
                        } else {
                          return (
                            <Text key={rollIndex} style={styles.rollValue}>
                              {rollValue}
                            </Text>
                          );
                        }
                      })}
                    </View>
                  </View>
                ))}
              </View>
              
              <Text style={styles.listItemMeta}>
                {roll.configurationName !== 'Quick Roll' ? roll.configurationName : formatDiceConfiguration(roll.dice)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
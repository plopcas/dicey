import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { RollResult } from '../shared/types';
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
        { text: 'Clear', style: 'destructive', onPress: onClear },
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
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
            <Text style={styles.smallButtonText}>Clear</Text>
          </Pressable>
        </View>
        
        <View style={styles.list}>
          {history.map((roll) => (
            <View key={roll.id} style={[styles.listItem, { paddingVertical: 12 }]}>
              <Text style={[styles.listItemMeta, { fontSize: 12, color: colors.textSecondary, marginBottom: 8 }]}>
                {formatTime(roll.timestamp)}
              </Text>
              
              <View style={[styles.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                <View style={[styles.individualRolls, { flex: 1, justifyContent: 'flex-start' }]}>
                  {roll.results.map((dieGroup, dieIndex) => 
                    dieGroup.map((rollValue, rollIndex) => {
                      const modifier = roll.modifiers ? roll.modifiers[dieIndex] : 0;
                      const hasModifier = settings.modifiersEnabled && modifier !== 0;
                      const modifiedTotal = rollValue + modifier;
                      
                      if (hasModifier) {
                        return (
                          <Text 
                            key={`${dieIndex}-${rollIndex}`}
                            style={[
                              styles.rollValue,
                              {
                                backgroundColor: modifier > 0 ? colors.success : colors.danger,
                                fontSize: 14,
                                minWidth: 32,
                                paddingVertical: 4,
                                paddingHorizontal: 6
                              }
                            ]}
                          >
                            {modifiedTotal}
                          </Text>
                        );
                      } else {
                        return (
                          <Text 
                            key={`${dieIndex}-${rollIndex}`} 
                            style={[
                              styles.rollValue,
                              {
                                fontSize: 14,
                                minWidth: 32,
                                paddingVertical: 4,
                                paddingHorizontal: 6
                              }
                            ]}
                          >
                            {rollValue}
                          </Text>
                        );
                      }
                    })
                  )}
                </View>
                
                <View style={[styles.totalContainer, { minWidth: 'auto', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: colors.surface }]}>
                  <Text style={[styles.totalValue, { fontSize: 18, fontWeight: 'bold', color: colors.primary }]}>
                    {roll.total}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
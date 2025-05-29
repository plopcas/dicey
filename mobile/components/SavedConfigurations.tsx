import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { DiceConfiguration } from '../shared/types';
import { formatDiceConfiguration } from '../shared/utils';
import { styles, colors } from '../styles/styles';

interface SavedConfigurationsProps {
  configurations: DiceConfiguration[];
  onRoll: (config: DiceConfiguration) => void;
  onDelete: (id: string) => void;
}

export const SavedConfigurations: React.FC<SavedConfigurationsProps> = ({
  configurations,
  onRoll,
  onDelete,
}) => {
  const handleDelete = (config: DiceConfiguration) => {
    Alert.alert(
      'Delete Configuration',
      `Are you sure you want to delete "${config.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(config.id) },
      ]
    );
  };

  if (configurations.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📋</Text>
          <Text style={styles.emptyStateTitle}>No Saved Configurations</Text>
          <Text style={styles.emptyStateText}>
            Create and save dice configurations in the Builder tab to see them here.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Saved Configurations ({configurations.length})
        </Text>
        
        <View style={styles.list}>
          {configurations.map((config) => (
            <View key={config.id} style={styles.listItem}>
              <View style={styles.listItemHeader}>
                <Text style={styles.listItemTitle} numberOfLines={2}>
                  {config.name}
                </Text>
                <View style={styles.row}>
                  <Text style={styles.listItemMeta}>
                    {config.dice.reduce((sum, die) => sum + die.quantity, 0)} dice
                  </Text>
                </View>
              </View>
              
              <Text style={styles.listItemSubtitle}>
                {formatDiceConfiguration(config.dice)}
              </Text>
              
              <Text style={styles.listItemMeta}>
                Created: {config.createdAt.toLocaleDateString()}
              </Text>
              
              <View style={[styles.actionRow, styles.actionRowSpread]}>
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.primaryButton,
                    styles.flex1,
                    { marginRight: 8 },
                    pressed && styles.primaryButtonPressed,
                  ]}
                  onPress={() => onRoll(config)}
                >
                  <Text style={styles.buttonText}>🎲 Roll</Text>
                </Pressable>
                
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.dangerButton,
                    { paddingHorizontal: 16 },
                    pressed && styles.dangerButtonPressed,
                  ]}
                  onPress={() => handleDelete(config)}
                >
                  <Text style={styles.buttonText}>🗑️</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
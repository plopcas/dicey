import React from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { RollResult } from '../shared/types';
import { styles, colors } from '../styles/styles';

interface RollResultModalProps {
  result: RollResult | null;
  visible: boolean;
  onClose: () => void;
}

export const RollResultModal: React.FC<RollResultModalProps> = ({ 
  result, 
  visible, 
  onClose 
}) => {
  if (!result) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.resultHeader}>
              <Text style={styles.resultConfigName}>
                {result.configurationName}
              </Text>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{result.total}</Text>
              </View>
            </View>

            {/* Dice Results */}
            <View style={styles.diceResults}>
              {result.dice.map((die, dieIndex) => (
                <View key={dieIndex} style={styles.dieResult}>
                  <Text style={styles.dieTitle}>
                    {die.quantity}D{die.sides}
                  </Text>
                  
                  <View style={styles.individualRolls}>
                    {result.results[dieIndex].map((roll, rollIndex) => (
                      <Text key={rollIndex} style={styles.rollValue}>
                        {roll}
                      </Text>
                    ))}
                  </View>
                  
                  <Text style={styles.dieTotal}>
                    Sum: {result.results[dieIndex].reduce((sum, roll) => sum + roll, 0)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Timestamp */}
            <Text style={[styles.listItemMeta, styles.textCenter]}>
              Rolled at {formatTime(result.timestamp)}
            </Text>

            {/* Close Button */}
            <View style={styles.mt}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.primaryButton,
                  pressed && styles.primaryButtonPressed,
                ]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>✨ Awesome!</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
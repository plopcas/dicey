import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { RollResult } from '../shared/types';
import { useSettings } from '../contexts/SettingsContext';
import { styles, colors } from '../styles/styles';

interface StatisticsProps {
  history: RollResult[];
}

export const Statistics: React.FC<StatisticsProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.emptyState, { marginHorizontal: 0 }]}>
          <Text style={styles.emptyStateIcon}>📊</Text>
          <Text style={styles.emptyStateTitle}>No Statistics Yet</Text>
          <Text style={styles.emptyStateText}>
            Start rolling dice to see your statistics here.
          </Text>
        </View>
      </View>
    );
  }

  // Calculate statistics
  const totals = history.map(roll => roll.total);
  const average = totals.reduce((sum, total) => sum + total, 0) / totals.length;
  const min = Math.min(...totals);
  const max = Math.max(...totals);
  
  // Group totals for histogram
  const totalCounts: { [key: number]: number } = {};
  totals.forEach(total => {
    totalCounts[total] = (totalCounts[total] || 0) + 1;
  });
  
  const sortedTotals = Object.entries(totalCounts)
    .map(([total, count]) => ({ total: parseInt(total), count }))
    .sort((a, b) => a.total - b.total);
  
  const maxCount = Math.max(...Object.values(totalCounts));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        
        <View style={[styles.row, { marginBottom: 20 }]}>
          <View style={[styles.card, { flex: 1, marginRight: 8 }]}>
            <Text style={[styles.inputLabel, { textAlign: 'center', marginBottom: 8 }]}>
              TOTAL ROLLS
            </Text>
            <Text style={[styles.totalValue, { textAlign: 'center', fontSize: 32 }]}>
              {history.length}
            </Text>
          </View>
          
          <View style={[styles.card, { flex: 1, marginLeft: 8 }]}>
            <Text style={[styles.inputLabel, { textAlign: 'center', marginBottom: 8 }]}>
              AVERAGE
            </Text>
            <Text style={[styles.totalValue, { textAlign: 'center', fontSize: 32 }]}>
              {average.toFixed(1)}
            </Text>
          </View>
        </View>
        
        <View style={[styles.row, { marginBottom: 20 }]}>
          <View style={[styles.card, { flex: 1, marginRight: 8 }]}>
            <Text style={[styles.inputLabel, { textAlign: 'center', marginBottom: 8 }]}>
              MINIMUM
            </Text>
            <Text style={[styles.totalValue, { textAlign: 'center', fontSize: 32 }]}>
              {min}
            </Text>
          </View>
          
          <View style={[styles.card, { flex: 1, marginLeft: 8 }]}>
            <Text style={[styles.inputLabel, { textAlign: 'center', marginBottom: 8 }]}>
              MAXIMUM
            </Text>
            <Text style={[styles.totalValue, { textAlign: 'center', fontSize: 32 }]}>
              {max}
            </Text>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={[styles.inputLabel, { marginBottom: 16, textAlign: 'center' }]}>
            ROLL DISTRIBUTION
          </Text>
          
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'flex-end', 
            justifyContent: 'center',
            height: 150,
            paddingHorizontal: 10,
            overflow: 'hidden'
          }}>
            {sortedTotals.map(({ total, count }) => (
              <View key={total} style={{ alignItems: 'center', marginHorizontal: 1, flex: 1, maxWidth: 25 }}>
                <View
                  style={{
                    backgroundColor: colors.primary,
                    width: Math.min(18, Math.max(8, 300 / sortedTotals.length - 4)),
                    height: Math.max((count / maxCount) * 120, 10),
                    borderRadius: 2,
                    marginBottom: 4,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingTop: 2,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 8, fontWeight: 'bold' }}>
                    {count}
                  </Text>
                </View>
                <Text style={[styles.previewText, { fontSize: 10, color: colors.textSecondary }]}>
                  {total}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
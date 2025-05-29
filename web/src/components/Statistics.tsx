import React from 'react';
import { RollResult } from '../shared/types';

interface StatisticsProps {
  history: RollResult[];
}

export const Statistics: React.FC<StatisticsProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="statistics empty">
        <h2>Statistics</h2>
        <p>📊</p>
        <p>No roll data yet</p>
        <p>Start rolling dice to see your statistics here.</p>
      </div>
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
    <div className="statistics">
      <h2>Roll Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Rolls</h3>
          <div className="stat-value">{history.length}</div>
        </div>
        
        <div className="stat-card">
          <h3>Average Total</h3>
          <div className="stat-value">{average.toFixed(1)}</div>
        </div>
        
        <div className="stat-card">
          <h3>Minimum Roll</h3>
          <div className="stat-value">{min}</div>
        </div>
        
        <div className="stat-card">
          <h3>Maximum Roll</h3>
          <div className="stat-value">{max}</div>
        </div>
      </div>
      
      <div className="chart-section">
        <h3>Roll Total Distribution</h3>
        <div className="histogram">
          {sortedTotals.map(({ total, count }) => (
            <div key={total} className="histogram-bar">
              <div 
                className="bar" 
                style={{ 
                  height: `${(count / maxCount) * 200}px`,
                  minHeight: '20px'
                }}
              >
                <span className="bar-count">{count}</span>
              </div>
              <div className="bar-label">{total}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ResultDisplay({ salary }) {
  if (salary === null) return null;

  return (
    <View style={styles.resultContainer}>
      <Text style={styles.result}>Total Salary: ₹{salary.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  resultContainer: {
    marginTop: 25,
    padding: 20,
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  result: {
    fontSize: 20,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
});

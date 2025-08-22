import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CalculatorForm({ hours, rate, onHoursChange, onRateChange, onCalculate }) {
  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter total working hours"
        keyboardType="numeric"
        value={hours}
        onChangeText={onHoursChange}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter rate per hour (₹)"
        keyboardType="numeric"
        value={rate}
        onChangeText={onRateChange}
      />

      <TouchableOpacity style={styles.button} onPress={onCalculate}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

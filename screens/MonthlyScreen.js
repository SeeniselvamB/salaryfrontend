
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

export default function MonthlyScreen() {
  const [rate, setRate] = useState('');
  const [workingDays, setWorkingDays] = useState('');
  const [dailyHours, setDailyHours] = useState('');
  const [salary, setSalary] = useState(null);

  const calculateSalary = () => {
    if (!rate || !workingDays || !dailyHours) {
      Alert.alert('Missing Input', 'Please fill all fields.');
      return;
    }

    const rateValue = parseFloat(rate);
    const daysValue = parseInt(workingDays);

    const parts = dailyHours.split('.');
    const hourPart = parseInt(parts[0]) || 0;
    const minutePart = parts[1] ? parseInt(parts[1]) : 0;

    if (isNaN(rateValue) || rateValue <= 0 || isNaN(daysValue) || daysValue <= 0) {
      Alert.alert('Invalid Input', 'Enter valid hourly rate and working days.');
      return;
    }

    if (minutePart >= 60) {
      Alert.alert('Invalid Minutes', 'Minutes must be less than 60.');
      return;
    }

    const totalHoursPerDay = hourPart + minutePart / 60;
    const totalHours = totalHoursPerDay * daysValue;
    const totalSalary = totalHours * rateValue;

    setSalary({
      totalSalary: totalSalary.toFixed(2),
      totalHours: totalHours.toFixed(2),
      dailyHours: `${hourPart}h ${minutePart}m`,
      days: daysValue,
    });
  };

  const resetForm = () => {
    setRate('');
    setWorkingDays('');
    setDailyHours('');
    setSalary(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Salary Calculator</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Hourly Rate"
        keyboardType="decimal-pad"
        value={rate}
        onChangeText={setRate}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Working Days"
        keyboardType="number-pad"
        value={workingDays}
        onChangeText={setWorkingDays}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Daily Hours"
        keyboardType="decimal-pad"
        value={dailyHours}
        onChangeText={setDailyHours}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: '#4facfe' }]} onPress={calculateSalary}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#e74c3c' }]} onPress={resetForm}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>

      {salary && (
        <View style={styles.result}>
          <Text style={styles.resultText}>Monthly Salary: ₹{salary.totalSalary}</Text>
          <Text style={styles.breakdown}>
            {salary.days} days × {salary.dailyHours} @ ₹{rate}/hr = {salary.totalHours} hours
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: '#f0f0f0' 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    fontSize: 16,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 17, 
    fontWeight: 'bold' 
  },
  result: { 
    alignItems: 'center', 
    marginTop: 20 
  },
  resultText: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#2e7d32' 
  },
  breakdown: { 
    fontSize: 14, 
    color: '#555', 
    marginTop: 6, 
    textAlign: 'center' 
  },
});

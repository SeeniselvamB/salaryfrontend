import React from 'react';
import { View, Text, TouchableOpacity,Modal, StyleSheet } from 'react-native';



export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salary Calculator</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Daily')}>
        <Text style={styles.buttonText}>Daily Hours</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Weekly')}>
        <Text style={styles.buttonText}>Weekly</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Monthly')}>
        <Text style={styles.buttonText}>Monthly</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#1565c0',
  },
  button: {
    backgroundColor: '#42a5f5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});

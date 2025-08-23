// DailyScreen.js
import React, { useState, useReducer } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

// Reducer for managing projects (hourly rate + hours worked)
const projectsReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PROJECT':
      return [
        ...state,
        { id: Date.now(), hourlyWage: '', hoursWorked: '' },
      ];
    case 'UPDATE_PROJECT':
      return state.map((project) =>
        project.id === action.id ? { ...project, ...action.payload } : project
      );
    case 'REMOVE_PROJECT':
      return state.filter((project) => project.id !== action.id);
    default:
      return state;
    case 'RESET_PROJECTS':
      return [{ id: Date.now(), hourlyWage: '', hoursWorked: '' }];
  }
};

const ProjectInput = ({ project, dispatch, isRemovable }) => {
  const handleChange = (name, value) => {
    dispatch({
      type: 'UPDATE_PROJECT',
      id: project.id,
      payload: { [name]: value },
    });
  };

  return (
    <View style={styles.projectContainer}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Hourly Rate</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={project.hourlyWage}
          onChangeText={(text) => handleChange('hourlyWage', text)}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Hours Worked</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={project.hoursWorked}
          onChangeText={(text) => handleChange('hoursWorked', text)}
        />
      </View>
      {isRemovable && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => dispatch({ type: 'REMOVE_PROJECT', id: project.id })}
        >
          <Text style={styles.removeText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const DailyScreen = () => {
  const [projects, dispatch] = useReducer(projectsReducer, [
    { id: Date.now(), hourlyWage: '', hoursWorked: '' },
  ]);
  const [results, setResults] = useState(null);

  const calculateSalary = () => {
    let totalGrossSalary = 0;
    let isValid = true;

    projects.forEach((project) => {
      const wage = parseFloat(project.hourlyWage);
      const hours = parseFloat(project.hoursWorked);

      if (isNaN(wage) || isNaN(hours) || wage <= 0 || hours <= 0) {
        isValid = false;
      }
      totalGrossSalary += wage * hours;
    });
    
    if (!isValid) {
      setResults({ error: 'Please enter valid numbers for all projects.' });
      return;
    }

    setResults({
      gross: totalGrossSalary.toFixed(2),
    });
  };
  const resetAll = () => {
  dispatch({ type: 'RESET_PROJECTS' });
  setResults(null);
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Freelancer's Companion</Text>

      {projects.map((project) => (
        <ProjectInput
          key={project.id}
          project={project}
          dispatch={dispatch}
          isRemovable={projects.length > 1}
        />
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => dispatch({ type: 'ADD_PROJECT' })}
      >
        <Text style={styles.addButtonText}>+ Add Another Project</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.calculateButton}
        onPress={calculateSalary}
      >
        <Text style={styles.calculateButtonText}>Calculate My Income</Text>
      </TouchableOpacity>

      {results && (
        <View
          style={results.error ? styles.errorBox : styles.resultsBox}
        >
          {results.error ? (
            <Text style={styles.errorText}>{results.error}</Text>
          ) : (
            <>
              <Text style={styles.resultTitle}>Financial Summary</Text>
              <Text style={styles.resultText}>
                Today Total Income:{' '}
                <Text style={styles.resultValue}>{results.gross}</Text>
              </Text>
            </>
          )}
        </View>
      )}
      
<TouchableOpacity
  style={{
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  }}
  onPress={resetAll}
>
  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
    Reset
  </Text>
</TouchableOpacity>

    </ScrollView>
  );
  
};

export default DailyScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  heading: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 20,
  },
  projectContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#495057',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'transparent',
  },
  removeText: {
    fontSize: 24,
    color: '#e74c3c',
  },
  addButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d8e0',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#6a82fb',
    fontSize: 16,
    fontWeight: '600',
  },
  calculateButton: {
    backgroundColor: '#6a82fb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resultsBox: {
    marginTop: 20,
    backgroundColor: '#e9f5e9',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#155724',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#216d2e',
  },
  resultValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  errorBox: {
    marginTop: 20,
    backgroundColor: '#f8d7da',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  errorText: {
    color: '#721c24',
    fontSize: 16,
    textAlign: 'center',
  },
});

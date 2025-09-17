import React, { useEffect,useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';

import { saveToBackend, loadFromBackend } from '../utils/backendHelper';
import { deleteAllWeeklyEntries } from '../utils/backendHelper';
import { recalculateEntries } from '../utils/calculateUtils';
import { restoreSalariesFromBackend } from '../utils/salaryRestore';


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function WeeklyScreen() {
  

  const [rate, setRate] = useState('10');
  const [timeEntries, setTimeEntries] = useState(
    days.map(() => ({
      inTime: '',
      inAmPm: 'AM',
      outTime: '',
      outAmPm: 'PM',
      hours: '-',
      salary: '',
      isLeave: true,
      rate: '',
    }))
  );
  

  const [result, setResult] = useState(null);
const [showHelp, setShowHelp] = useState(false);
useEffect(() => {
  loadFromBackend(setTimeEntries,setRate); 
}, []);

useEffect(() => {
  loadFromBackend((backendData) => {
    const formattedData = formatWeeklyEntriesWithDefaultPM(backendData);
    const restoredData = restoreSalariesFromBackend(formattedData, rate);
    setTimeEntries(restoredData);
  });
}, []);

useEffect(() => {
  loadFromBackend((backendData) => {
    const formattedData = formatWeeklyEntriesWithDefaultPM(backendData);
    setTimeEntries(formattedData);
  });
}, []);


  const convertToDecimalHours = (timeStr, ampm) => {
    if (!/^\d{1,2}(\.\d{0,2})?$/.test(timeStr)) return null;
    const [h, m = '0'] = timeStr.split('.');
    let hour = parseInt(h);
    let minute = parseInt(m.padEnd(2, '0'));

    if (isNaN(hour) || isNaN(minute) || hour > 12 || minute >= 60) return null;

    let time = hour + minute / 60;
    if (ampm === 'PM' && hour !== 12) time += 12;
    if (ampm === 'AM' && hour === 12) time -= 12;

    return time;
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...timeEntries];
    updated[index][field] = value;

    const entry = updated[index];
    const hourlyRate = parseFloat(rate);
    const inTime = entry.inTime.trim();
    const outTime = entry.outTime.trim();

    if (!inTime && !outTime) {
      entry.hours = 'Leave';
      entry.salary = '';
      entry.isLeave = true;
    } else if (!inTime) {
      entry.hours = 'Intime Required';
      entry.salary = 'Invalid';
      entry.isLeave = true;
    } else if (!outTime) {
      entry.hours = 'Outtime Required';
      entry.salary = 'Invalid';
      entry.isLeave = true;
    } else {
      const inVal = convertToDecimalHours(inTime, entry.inAmPm);
      const outVal = convertToDecimalHours(outTime, entry.outAmPm);

      if (inVal === null || outVal === null || isNaN(hourlyRate)) {
        entry.hours = 'Invalid';
        entry.salary = 'Invalid';
        entry.isLeave = true;
      } else {
        let worked = outVal >= inVal ? outVal - inVal : (24 - inVal + outVal);
        entry.hours = worked.toFixed(2);
        entry.salary = (worked * hourlyRate).toFixed(2);
        entry.isLeave = false;
      }
    }

    setTimeEntries(updated);
  };
  

  const calculateWeeklySalary = () => {
    const validEntries = timeEntries.filter(
      (e) =>
        !e.isLeave &&
        !isNaN(parseFloat(e.hours)) &&
        !isNaN(parseFloat(e.salary))
    );

    if (validEntries.length === 0) {
      Alert.alert('No valid entries', 'Please ensure valid time inputs are filled.');
      return;
    }

    let totalHours = 0;
    let totalSalary = 0;

    validEntries.forEach((e) => {
      totalHours += parseFloat(e.hours);
      totalSalary += parseFloat(e.salary);
    });

    setResult({
      daysWorked: validEntries.length,
      totalHours,
      totalSalary,
    });
  };

  const handleReset = async () => {
  setRate('10');
  setTimeEntries(
    days.map(() => ({
      inTime: '',
      inAmPm: 'AM',
      outTime: '',
      outAmPm: 'PM',
      hours: '-',
      salary: '',
      isLeave: true,
    }))
  );
  setResult(null);

  try {
    await deleteAllWeeklyEntries(setTimeEntries);
    console.log('Backend entries cleared!');
  } catch (error) {
    console.error('Error deleting entries:', error);
    Alert.alert('Error', 'Failed to delete entries from backend.');
  }
};



  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Weekly Salary Calculator</Text>
      <View style={styles.helpButtonContainer}>
        <TouchableOpacity onPress={() => setShowHelp(true)} style={styles.helpButton}>
          <Text style={styles.helpButtonText}>Help</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rateContainer}>
        <Text style={styles.rateLabel}>Hourly Rate ₹/hr:</Text>
        <TextInput
          style={[styles.rateInput, { width: 70 }]}
          value={rate}
          onChangeText={(val) => {
            if (/^\d{0,3}(\.\d{0,2})?$/.test(val)) setRate(val);
          }}
          keyboardType="decimal-pad"
          placeholder="₹"
        />
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.tableCol}>Day</Text>
        <Text style={styles.tableCol}>In</Text>
        <Text style={styles.tableCol}>Out</Text>
        <Text style={styles.tableCol}>Hours</Text>
        <Text style={styles.tableCol}>Salary</Text>
      </View>

      {days.map((day, index) => {
        const entry = timeEntries[index];
        return (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.dayText}>{day}</Text>

            <View style={styles.timeInputContainer}>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                value={entry.inTime}
                placeholder="In"
                onChangeText={(val) => {
                  if (/^\d{0,2}(\.\d{0,2})?$/.test(val)) {
                    handleInputChange(index, 'inTime', val);
                  }
                }}
              />
              <TouchableOpacity
                style={styles.picker}
                onPress={() =>
                  handleInputChange(index, 'inAmPm', entry.inAmPm === 'AM' ? 'PM' : 'AM')
                }
              >
                <Text style={styles.pickerText}>{entry.inAmPm}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timeInputContainer}>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                value={entry.outTime}
                placeholder="Out"
                onChangeText={(val) => {
                  if (/^\d{0,2}(\.\d{0,2})?$/.test(val)) {
                    handleInputChange(index, 'outTime', val);
                  }
                }}
              />
              <TouchableOpacity
                style={styles.picker}
                onPress={() =>
                  handleInputChange(index, 'outAmPm', entry.outAmPm === 'AM' ? 'PM' : 'AM')
                }
              >
                <Text style={styles.pickerText}>{entry.outAmPm}</Text>
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.hoursText,
                entry.hours === 'Invalid' || entry.hours.includes('Required') || entry.hours === 'Leave'
                  ? styles.leaveText
                  : null,
              ]}
            >
              {entry.hours}
            </Text>

            <Text style={[styles.salaryText, entry.salary === 'Invalid' ? styles.leaveText : null]}>
              {entry.salary}
            </Text>

      
      
          </View>
        );
      })}

      <View style={styles.buttonContainer}>
        <Button title="Calculate" onPress={calculateWeeklySalary} color="#4CAF50" />
        <View style={{ height: 10 }} />
        <Button title="Reset" onPress={handleReset} color="#f44336" />
      </View>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Days Worked: {result.daysWorked}</Text>
          <Text style={styles.resultText}>Total Hours: {result.totalHours.toFixed(2)}</Text>
          <Text style={styles.resultText}>Weekly Salary: ₹ {result.totalSalary.toFixed(2)}</Text>
        </View>
      )}
      <Modal visible={showHelp} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setShowHelp(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✖</Text>
            </TouchableOpacity>
            <Text style={styles.helpTitle}>Time Format Help</Text>
            <Text style={styles.helpText}>First set the Hourly Rate after that give the Intime and Outtime</Text>
            <Text style={styles.helpText}>Valid Time Examples:</Text>
            <Text style={styles.helpBullet}>• 9 AM</Text>
            <Text style={styles.helpBullet}>• 10:30 PM</Text>
            <Text style={styles.helpBullet}>• 5 pm (case insensitive)</Text>
            <Text style={styles.helpText}>Invalid Time Examples:</Text>
            <Text style={styles.helpBullet}>• 13 PM</Text>
            <Text style={styles.helpBullet}>• 1330</Text>
            <Text style={styles.helpBullet}>• 9:75 AM</Text>
            <Text style={styles.helpText}>You can enter overnight shifts like:</Text>
            <Text style={styles.helpBullet}>• In Time: 10 PM</Text>
            <Text style={styles.helpBullet}>• Out Time: 6 AM</Text>
          </View>
        </View>
      </Modal>
      <Button
  title="Save"
  onPress={() => saveToBackend(timeEntries, rate)}
  color="#2196F3"
/>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f9f9ff' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#2c3e50',
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  rateInput: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#eef',
    textAlign: 'center',
    fontSize: 13,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#d0d9ff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  tableCol: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    marginBottom: 5,
    borderRadius: 8,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dayText: { flex: 1, textAlign: 'center', fontWeight: '600', color: '#34495e', fontSize: 13 },
  timeInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#bbb',
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#f2f2f2',
    fontSize: 8,
  },
  picker: {
    marginLeft: 4,
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: '#ddeeff',
    borderRadius: 6,
  },
  pickerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
  },
  hoursText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
    color: '#2d3436',
  },
  leaveText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  salaryText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#34495e',
  },
  buttonContainer: {
    marginVertical: 20,
  },
  resultContainer: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
    color: '#2c3e50',
  },
  helpButtonContainer: {
    position: 'absolute',
    top: 40,
    right: 0,
  },
  helpButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 20,
  },
  helpButtonText: { color: 'white', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 5,
    zIndex: 10,
  },
  closeButtonText: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
  },
  helpTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  helpText: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
    color: '#222',
  },
  helpBullet: {
    marginLeft: 10,
    color: '#555',
  },
});





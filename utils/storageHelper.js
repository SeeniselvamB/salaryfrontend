// storageHelper.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const STORAGE_KEY = '@weekly_entries';
const RATE_KEY = '@hourly_rate';
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Converts 12-hour time with AM/PM into decimal hours
 */
export const convertToDecimalHours = (timeStr, amPm) => {
    if (!timeStr) return null;
    const parts = timeStr.split('.');
    let hour = parseInt(parts[0], 10);
    let minute = parseInt((parts[1] || '0').padEnd(2, '0'), 10);
    if (isNaN(hour) || isNaN(minute) || hour > 12 || minute >= 60) return null;
    if (amPm === 'PM' && hour !== 12) hour += 12;
    if (amPm === 'AM' && hour === 12) hour = 0;
    return hour + minute / 60;
};

/**
 * Calculates worked hours handling overnight shifts
 */
export const calculateWorkedHours = (inTime, inAmPm, outTime, outAmPm) => {
    const inDec = convertToDecimalHours(inTime, inAmPm);
    const outDec = convertToDecimalHours(outTime, outAmPm);
    if (inDec === null || outDec === null) return 0;
    return outDec >= inDec ? outDec - inDec : 24 - inDec + outDec;
};

/**
 * Calculates salary
 */
export const calculateSalary = (workedHours, rate, isLeave) => {
    if (isLeave || !rate || isNaN(rate)) return 0;
    return parseFloat((workedHours * rate).toFixed(2));
};

/**
 * Format backend (or AsyncStorage) entries into frontend-friendly format
 */
export const formatWeeklyEntriesWithDefaultPM = (backendData = []) => {
    return days.map((day) => {
        const entry = backendData.find((e) => e.day === day);
        const inTimeRaw = entry?.inTime || '';
        const outTimeRaw = entry?.outTime || '';
        const hasValidTimes = !!inTimeRaw || !!outTimeRaw;

        return {
            inTime: inTimeRaw.split(' ')[0] || '',
            inAmPm: inTimeRaw.toUpperCase().includes('PM') ? 'PM' : 'AM',
            outTime: outTimeRaw.split(' ')[0] || '',
            outAmPm: !outTimeRaw
                ? 'PM'
                : outTimeRaw.toUpperCase().includes('AM')
                    ? 'AM'
                    : outTimeRaw.toUpperCase().includes('PM')
                        ? 'PM'
                        : 'PM',
            hours: entry?.totalHours !== undefined ? entry.totalHours.toFixed(2) : '-',
            salary: entry?.salary || '',
            isLeave: hasValidTimes ? false : true,
        };
    });
};

/**
 * Restore salaries from stored entries using current rate
 */
export const restoreSalariesFromStorage = (entries, rate) => {
    return entries.map((entry) => {
        if (!entry.inTime && !entry.outTime) return { ...entry, hours: '-', salary: '', isLeave: true };
        const workedHours = calculateWorkedHours(entry.inTime, entry.inAmPm, entry.outTime, entry.outAmPm);
        const salary = calculateSalary(workedHours, rate, entry.isLeave);
        return { ...entry, hours: workedHours.toFixed(2), salary: salary.toFixed(2), isLeave: false };
    });
};

/**
 * Save entries + rate to AsyncStorage
 */
export const saveToStorage = async (entries, rate) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        await AsyncStorage.setItem(RATE_KEY, String(rate));
        Alert.alert('Success', 'Weekly entries saved successfully.');
    } catch (error) {
        console.error('Save error:', error);
        Alert.alert('Error', 'Failed to save entries.');
    }
};

/**
 * Load entries + rate from AsyncStorage
 */
export const loadFromStorage = async (setTimeEntries, setRate) => {
    try {
        const entriesJSON = await AsyncStorage.getItem(STORAGE_KEY);
        const rate = await AsyncStorage.getItem(RATE_KEY);
        const loadedEntries = entriesJSON ? JSON.parse(entriesJSON) : days.map(() => ({
            inTime: '',
            inAmPm: 'AM',
            outTime: '',
            outAmPm: 'PM',
            hours: '-',
            salary: '',
            isLeave: true,
            rate: '',
        }));
        setTimeEntries(loadedEntries);
        setRate(rate || '10');
    } catch (error) {
        console.error('Load error:', error);
        Alert.alert('Error', 'Failed to load entries.');
    }
};

/**
 * Delete all entries from AsyncStorage
 */
export const deleteAllStorageEntries = async (setTimeEntries, setRate) => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
        await AsyncStorage.removeItem(RATE_KEY);
        const clearedEntries = days.map(() => ({
            inTime: '',
            inAmPm: 'AM',
            outTime: '',
            outAmPm: 'PM',
            hours: '-',
            salary: '',
            isLeave: true,
            rate: '',
        }));
        setTimeEntries(clearedEntries);
        setRate('10');
        Alert.alert('Success', 'All entries have been reset.');
    } catch (error) {
        console.error('Delete error:', error);
        Alert.alert('Error', 'Failed to delete entries.');
    }
};

/**
 * Recalculate all entries' hours and salary using current rate
 */
export const recalculateEntries = (entries, rate) => {
    return entries.map((entry) => {
        if (!entry.inTime && !entry.outTime) return { ...entry, hours: '-', salary: '', isLeave: true };
        const workedHours = calculateWorkedHours(entry.inTime, entry.inAmPm, entry.outTime, entry.outAmPm);
        const salary = calculateSalary(workedHours, rate, entry.isLeave);
        return { ...entry, hours: workedHours.toFixed(2), salary: salary.toFixed(2), isLeave: false };
    });
};

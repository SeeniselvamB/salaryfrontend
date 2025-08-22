const API_URL = 'http://172.19.21.52:8080/api/weekly'; // Your backend IP

export const fetchWeeklyEntries = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Error fetching weekly entries:', error);
    return [];
  }
};

export const saveWeeklyEntries = async (payload) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Save failed');
    return await response.json();
  } catch (error) {
    console.error('Error saving entries:', error);
  }
};
// api.js

export const deleteAllWeeklyEntries = async () => {
  try {
    const response = await fetch('http://172.19.21.52:8080/api/weekly', {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete weekly entries');
    }

    console.log('All weekly entries deleted from backend.');
  } catch (error) {
    console.error('Error deleting entries:', error);
  }
};


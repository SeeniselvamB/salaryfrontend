const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Converts backend data into frontend-friendly timeEntries format.
 * Ensures outAmPm is 'PM' by default unless data explicitly has 'AM'.
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
      // 👇 Fix: if outTime is empty, default to PM; otherwise detect AM/PM
      outAmPm: !outTimeRaw
        ? 'PM'
        : outTimeRaw.toUpperCase().includes('AM')
          ? 'AM'
          : outTimeRaw.toUpperCase().includes('PM')
            ? 'PM'
            : 'PM', // fallback default

      hours: entry?.totalHours !== undefined ? entry.totalHours.toFixed(2) : '-',
      salary: entry?.salary || '',
      isLeave: hasValidTimes ? false : true,
    };
  });
};

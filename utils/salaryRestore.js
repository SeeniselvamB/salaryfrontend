// utils/salaryRestore.js

/**
 * Ensures that loaded entries preserve backend salaries.
 * If salary is missing or invalid, it recalculates using rate.
 */
export const restoreSalariesFromBackend = (entries, rate) => {
  return entries.map(entry => {
    const hasValidSalary =
      entry.salary !== undefined &&
      entry.salary !== null &&
      entry.salary !== '' &&
      !isNaN(parseFloat(entry.salary));

    // ✅ If salary is valid from backend, keep it as is
    if (hasValidSalary) {
      return {
        ...entry,
        salary: parseFloat(entry.salary).toFixed(2),
        hours: entry.hours !== undefined && entry.hours !== null
          ? parseFloat(entry.hours).toFixed(2)
          : '-',
      };
    }

    // ❌ If salary is invalid, recalculate it
    const inVal = convertToDecimalHours(entry.inTime, entry.inAmPm);
    const outVal = convertToDecimalHours(entry.outTime, entry.outAmPm);
    const hourlyRate = parseFloat(rate);

    if (inVal === null || outVal === null || isNaN(hourlyRate)) {
      return { ...entry, hours: 'Invalid', salary: 'Invalid', isLeave: true };
    }

    let worked = outVal >= inVal ? outVal - inVal : 24 - inVal + outVal;
    return {
      ...entry,
      hours: worked.toFixed(2),
      salary: (worked * hourlyRate).toFixed(2),
      isLeave: false,
    };
  });
};

// Helper
function convertToDecimalHours(timeStr, ampm) {
  if (!/^\d{1,2}(\.\d{0,2})?$/.test(timeStr)) return null;
  const [h, m = '0'] = timeStr.split('.');
  let hour = parseInt(h);
  let minute = parseInt(m.padEnd(2, '0'));

  if (isNaN(hour) || isNaN(minute) || hour > 12 || minute >= 60) return null;

  let time = hour + minute / 60;
  if (ampm === 'PM' && hour !== 12) time += 12;
  if (ampm === 'AM' && hour === 12) time -= 12;

  return time;
}

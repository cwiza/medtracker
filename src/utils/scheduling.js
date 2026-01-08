// Scheduling helpers for determining whether a medication is due today

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000); // ms per day
}

export function shouldTakeMedToday(medication, today = new Date()) {
  const { frequency, daysOfWeek } = medication;

  if (!frequency) return false;

  if (frequency === 'daily') return true;

  if (frequency === 'every-other-day') {
    const dayOfYear = getDayOfYear(today);
    return dayOfYear % 2 === 0;
  }

  if (frequency === 'specific-days') {
    if (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0) return false;
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayLabel = labels[today.getDay()];
    return daysOfWeek.includes(dayLabel);
  }

  if (frequency === 'custom') {
    // MVP: always show and let user decide
    return true;
  }

  return false;
}

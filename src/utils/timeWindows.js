// Time window helpers: given 'HH:MM', return human-readable +/- 1 hour window

function parseTimeToDate(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const now = new Date();
  const d = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    Number.isFinite(h) ? h : 0,
    Number.isFinite(m) ? m : 0,
    0,
    0,
  );
  return d;
}

function formatTime(date) {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getTimeWindowLabel(timeStr) {
  const center = parseTimeToDate(timeStr);
  const start = new Date(center.getTime() - 60 * 60 * 1000);
  const end = new Date(center.getTime() + 60 * 60 * 1000);

  const startLabel = formatTime(start);
  const endLabel = formatTime(end);
  return `${startLabel} - ${endLabel}`;
}

export function formatClockTime(timeStr) {
  return formatTime(parseTimeToDate(timeStr));
}

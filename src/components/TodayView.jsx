import React, { useMemo, useState } from 'react';
import { getTimeWindowLabel, formatClockTime } from '../utils/timeWindows.js';
import { shouldTakeMedToday } from '../utils/scheduling.js';

function priorityStyles(priority) {
  if (priority === 'critical') {
    return {
      border: 'border-red-600',
      bg: 'bg-red-50',
      badgeBg: 'bg-red-600',
      badgeText: 'text-white',
    };
  }
  if (priority === 'important') {
    return {
      border: 'border-orange-500',
      bg: 'bg-orange-50',
      badgeBg: 'bg-orange-500',
      badgeText: 'text-white',
    };
  }
  return {
    border: 'border-green-600',
    bg: 'bg-green-50',
    badgeBg: 'bg-green-600',
    badgeText: 'text-white',
  };
}

function getTodayKey(date) {
  return date.toISOString().slice(0, 10);
}

function getTimeOfDayInfo(timeStr) {
  if (!timeStr) {
    return { key: 'any', label: '🕒 Any time' };
  }
  const [hStr] = timeStr.split(':');
  const hour = Number(hStr);
  if (!Number.isFinite(hour)) {
    return { key: 'any', label: '🕒 Any time' };
  }

  if (hour >= 4 && hour < 11) {
    return { key: 'morning', label: '☀️ Morning' };
  }
  if (hour >= 11 && hour < 15) {
    return { key: 'midday', label: '🍽️ Lunch' };
  }
  if (hour >= 15 && hour < 19) {
    return { key: 'evening', label: '🌆 Evening' };
  }
  return { key: 'bedtime', label: '🌙 Bedtime' };
}

function timeOfDayClasses(key) {
  switch (key) {
    case 'morning':
      return 'bg-yellow-100 text-yellow-900 border-yellow-300';
    case 'midday':
      return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    case 'evening':
      return 'bg-indigo-100 text-indigo-900 border-indigo-300';
    case 'bedtime':
      return 'bg-slate-800 text-slate-100 border-slate-700';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

function getNameClass(fontSize) {
  if (fontSize === 'extra') return 'text-2xl';
  if (fontSize === 'large') return 'text-xl';
  return 'text-lg';
}

function getDoseClass(fontSize) {
  if (fontSize === 'extra') return 'text-2xl';
  if (fontSize === 'large') return 'text-xl';
  return 'text-lg';
}

function getFrequencyLabel(med) {
  if (!med) return '';
  if (med.frequency === 'daily') return 'Daily';
  if (med.frequency === 'every-other-day') return 'Every other day';
  if (med.frequency === 'specific-days' && Array.isArray(med.daysOfWeek)) {
    return med.daysOfWeek.join(', ');
  }
  if (med.frequency === 'custom') return med.customFrequency || 'Custom schedule';
  return '';
}

export default function TodayView({ medications, takenLog, onTake, onUndo, fontSize = 'normal' }) {
  const [openIds, setOpenIds] = useState({});

  const today = useMemo(() => new Date(), []);
  const todayKey = getTodayKey(today);

  const schedule = useMemo(() => {
    const entries = [];
    medications.forEach((med) => {
      if (!shouldTakeMedToday(med, today)) return;
      (med.times || []).forEach((timeStr) => {
        if (!timeStr) return;
        entries.push({
          med,
          scheduledTime: timeStr,
        });
      });
    });

    entries.sort((a, b) => (a.scheduledTime > b.scheduledTime ? 1 : -1));
    return entries;
  }, [medications, today]);

  const totalDoses = schedule.length;
  const takenCount = schedule.filter((entry) =>
    takenLog.some(
      (log) =>
        log.medId === entry.med.id &&
        log.scheduledTime === entry.scheduledTime &&
        log.date === todayKey,
    ),
  ).length;

  function isTaken(entry) {
    return takenLog.some(
      (log) =>
        log.medId === entry.med.id &&
        log.scheduledTime === entry.scheduledTime &&
        log.date === todayKey,
    );
  }

  function getTakenEntry(entry) {
    return (
      takenLog.find(
        (log) =>
          log.medId === entry.med.id &&
          log.scheduledTime === entry.scheduledTime &&
          log.date === todayKey,
      ) || null
    );
  }

  function toggleOpen(id) {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const canSpeak =
    typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined';

  function buildSpeechText() {
    if (!schedule.length) {
      return 'No medications scheduled for today.';
    }

    const parts = ['Here is your medication schedule for today.'];

    schedule.forEach((entry) => {
      const { med, scheduledTime } = entry;
      const windowLabel = getTimeWindowLabel(scheduledTime);
      const priorityLabel = med.priority || 'routine';
      const base = `${med.name || 'Medication'}, ${med.dose || ''}`.trim();
      const instructions = med.instructions ? ` Instructions: ${med.instructions}.` : '';
      parts.push(
        `${priorityLabel} medication around ${windowLabel}: ${base}.${instructions}`,
      );
    });

    return parts.join(' ');
  }

  function handleSpeak() {
    if (!canSpeak) {
      window.alert('Voice reading is not supported on this device or browser.');
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(buildSpeechText());
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  if (schedule.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center px-4 text-center text-gray-700">
        <div className="mb-4 h-16 w-16 rounded-full bg-blue-50 text-4xl leading-[4rem] text-blue-500">
          ⏰
        </div>
        <p className="mb-1 text-xl font-semibold">No medications scheduled for today</p>
        <p className="max-w-xs text-base text-gray-600">
          Once you add medications, you will see a simple list of what to take and when.
        </p>
      </div>
    );
  }

  const progressAngle = totalDoses > 0 ? (takenCount / totalDoses) * 360 : 0;
  const currentDate = 'January 13, 2026';

  return (
    <div className="space-y-4 pb-20">
      <div className="sticky top-[64px] z-10">
        <div className="flex flex-col items-center justify-center rounded-[10px] bg-[#d1ede5] px-5 py-4 text-center text-slate-900">
          <div className="relative flex h-56 w-56 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-white" />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(#4dbd91 ${progressAngle}deg, #d1e9e2 0deg)` ,
                maskImage: 'radial-gradient(transparent 58%, black 60%)',
                WebkitMaskImage: 'radial-gradient(transparent 58%, black 60%)',
              }}
            />
            <div className="relative flex h-48 w-48 flex-col items-center justify-center rounded-full bg-white text-center text-slate-800 shadow-[0_14px_35px_rgba(15,23,42,0.18)]">
              <div className="text-lg font-semibold">Today</div>
              <div className="text-4xl font-bold">{takenCount}/{totalDoses}</div>
              <div className="text-sm">{currentDate}</div>
            </div>
          </div>
        </div>
      </div>
      {schedule.map((entry, index) => {
        const { med, scheduledTime } = entry;
        const styles = priorityStyles(med.priority);
        const taken = isTaken(entry);
        const takenEntry = getTakenEntry(entry);
        const id = `${med.id}-${scheduledTime}-${index}`;
        const lowStock = typeof med.pillsRemaining === 'number' && med.pillsRemaining < 10;
        const timeOfDay = getTimeOfDayInfo(scheduledTime);
        const timeOfDayChip = timeOfDayClasses(timeOfDay.key);
        const priorityLabel = (med.priority || 'routine').toLowerCase();

        return (
          <div
            key={id}
            className="rounded-[10px] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span
                    className={`rounded-full border px-2 py-1 text-[11px] font-medium ${timeOfDayChip}`}
                  >
                    {timeOfDay.label}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${styles.badgeBg} ${styles.badgeText}`}
                  >
                    {priorityLabel === 'critical' && 'Critical'}
                    {priorityLabel === 'important' && 'Important'}
                    {priorityLabel === 'routine' && 'Routine'}
                    {!['critical', 'important', 'routine'].includes(priorityLabel) && 'Routine'}
                  </span>
                </div>
                <div className={`${getNameClass(fontSize)} font-bold text-slate-800`}>
                  {med.name}
                </div>
                <div className={`${getDoseClass(fontSize)} font-semibold text-slate-400`}>
                  {med.dose}
                </div>
                <p className="mt-1 text-sm font-medium text-slate-400">
                  {getFrequencyLabel(med)}
                  {getFrequencyLabel(med) && ' · '}
                  {formatClockTime(scheduledTime)}
                </p>
                {med.instructions && (
                  <p className="mt-1 text-xs text-slate-500">{med.instructions}</p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 self-stretch justify-center text-right">
                {taken ? (
                  <>
                    <span className="inline-flex min-h-[32px] items-center rounded-full bg-[#e9f7f2] px-4 py-1 text-xs font-bold text-[#4dbd91]">
                      Taken ·{' '}
                      {takenEntry?.takenAt
                        ? new Date(takenEntry.takenAt).toLocaleTimeString(undefined, {
                            hour: 'numeric',
                            minute: '2-digit',
                          })
                        : '—'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUndo(med, scheduledTime)}
                      className="min-h-[32px] rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500"
                    >
                      Undo
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => onTake(med, scheduledTime)}
                    className="min-h-[40px] rounded-full bg-[#4a80f0] px-5 py-2 text-sm font-bold text-white shadow-md shadow-blue-200"
                  >
                    Mark as taken
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => toggleOpen(id)}
                  className="text-[11px] font-medium text-[#4a80f0]"
                >
                  {openIds[id] ? 'Hide details' : 'More info'}
                </button>
              </div>
            </div>

            {openIds[id] && (
              <div className="mt-2 rounded-xl bg-white/70 p-3 text-sm text-gray-800">
                {med.doctor && (
                  <p className="mb-1">
                    <span className="font-semibold">Doctor: </span>
                    {med.doctor}
                  </p>
                )}
                <p className="mb-1">
                  <span className="font-semibold">Frequency: </span>
                  {med.frequency === 'daily' && 'Daily'}
                  {med.frequency === 'every-other-day' && 'Every other day'}
                  {med.frequency === 'specific-days' && med.daysOfWeek?.join(', ')}
                  {med.frequency === 'custom' && (med.customFrequency || 'Custom schedule')}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Pills remaining: </span>
                  {typeof med.pillsRemaining === 'number' ? med.pillsRemaining : 'N/A'}
                </p>
                {med.refillable && (
                  <p className="mb-1 text-xs text-gray-700">Prescription is refillable.</p>
                )}
                {med.notes && (
                  <p className="mt-1 text-xs text-gray-700">
                    <span className="font-semibold">Notes: </span>
                    {med.notes}
                  </p>
                )}
                {lowStock && (
                  <p className="mt-2 rounded-lg bg-yellow-100 px-3 py-2 text-xs font-semibold text-yellow-900">
                    ⚠ Only {med.pillsRemaining} pills remaining - consider refill
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Utilities for localStorage persistence of medications and taken log

const MED_KEY = 'medications';
const TAKEN_KEY = 'takenLog';

export function loadMedications() {
  try {
    const raw = localStorage.getItem(MED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error('Failed to load medications from localStorage', e);
    return [];
  }
}

export function saveMedications(medications) {
  try {
    localStorage.setItem(MED_KEY, JSON.stringify(medications));
  } catch (e) {
    console.error('Failed to save medications to localStorage', e);
  }
}

export function loadTakenLog() {
  try {
    const raw = localStorage.getItem(TAKEN_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error('Failed to load taken log from localStorage', e);
    return [];
  }
}

export function saveTakenLog(takenLog) {
  try {
    localStorage.setItem(TAKEN_KEY, JSON.stringify(takenLog));
  } catch (e) {
    console.error('Failed to save taken log to localStorage', e);
  }
}

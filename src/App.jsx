import React, { useEffect, useState } from 'react';
import TodayView from './components/TodayView.jsx';
import AllMedsView from './components/AllMedsView.jsx';
import MedForm from './components/MedForm.jsx';
import { loadMedications, saveMedications, loadTakenLog, saveTakenLog } from './utils/storage.js';

function getTodayKey(date) {
  return date.toISOString().slice(0, 10);
}

function getSampleMedications() {
  const today = new Date();
  const baseId = today.getTime();

  return [
    {
      id: baseId + 1,
      name: 'Morning chemo tablet',
      dose: '400 mg',
      frequency: 'daily',
      times: ['08:00'],
      daysOfWeek: [],
      customFrequency: '',
      doctor: 'Dr. Lee (Oncology)',
      priority: 'critical',
      instructions: 'Take with a full glass of water. Stay upright for 30 minutes.',
      pillsRemaining: 18,
      refillable: true,
      notes: 'Call the clinic if you notice severe nausea, rash, or bleeding.',
    },
    {
      id: baseId + 2,
      name: 'Anti-nausea pill',
      dose: '8 mg',
      frequency: 'specific-days',
      times: ['07:30'],
      daysOfWeek: ['Mon', 'Wed', 'Fri'],
      customFrequency: '',
      doctor: 'Dr. Lee (Oncology)',
      priority: 'important',
      instructions: 'Take 30 minutes before chemo tablet. Take with a light snack.',
      pillsRemaining: 9,
      refillable: true,
      notes: 'Helps with chemo-related nausea.',
    },
    {
      id: baseId + 3,
      name: 'Phosphate binder',
      dose: '1 tablet',
      frequency: 'daily',
      times: ['12:00', '18:00'],
      daysOfWeek: [],
      customFrequency: '',
      doctor: 'Dr. Patel (Nephrology)',
      priority: 'critical',
      instructions: 'Take with meals. Do not skip when eating.',
      pillsRemaining: 24,
      refillable: true,
      notes: 'For chronic kidney disease / dialysis support.',
    },
    {
      id: baseId + 4,
      name: 'Blood pressure pill',
      dose: '10 mg',
      frequency: 'daily',
      times: ['09:00'],
      daysOfWeek: [],
      customFrequency: '',
      doctor: 'Dr. Gomez (Primary Care)',
      priority: 'important',
      instructions: 'Take at the same time every morning. Stand up slowly.',
      pillsRemaining: 12,
      refillable: true,
      notes: 'For high blood pressure common in older adults.',
    },
    {
      id: baseId + 5,
      name: 'Evening water pill',
      dose: '20 mg',
      frequency: 'every-other-day',
      times: ['19:00'],
      daysOfWeek: [],
      customFrequency: '',
      doctor: 'Dr. Patel (Nephrology)',
      priority: 'important',
      instructions: 'Take early enough to avoid nighttime trips to the bathroom.',
      pillsRemaining: 8,
      refillable: true,
      notes: 'Helps remove extra fluid. Call doctor if swelling increases.',
    },
    {
      id: baseId + 6,
      name: 'Cholesterol pill',
      dose: '40 mg',
      frequency: 'daily',
      times: ['21:30'],
      daysOfWeek: [],
      customFrequency: '',
      doctor: 'Dr. Gomez (Primary Care)',
      priority: 'routine',
      instructions: 'Take in the evening. May take with or without food.',
      pillsRemaining: 28,
      refillable: true,
      notes: 'For long-term heart protection.',
    },
  ];
}

export default function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [medications, setMedications] = useState([]);
  const [takenLog, setTakenLog] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [caregiverMode, setCaregiverMode] = useState(false);
  const [caregiverPin, setCaregiverPin] = useState('');
  const [hasCaregiverPin, setHasCaregiverPin] = useState(false);
  const [showCaregiverModal, setShowCaregiverModal] = useState(false);
  const [caregiverInput, setCaregiverInput] = useState('');
  const [caregiverConfirm, setCaregiverConfirm] = useState('');
  const [caregiverError, setCaregiverError] = useState('');
  const [fontSize, setFontSize] = useState('normal');

  useEffect(() => {
    const meds = loadMedications();
    const log = loadTakenLog();
    const storedFontSize = localStorage.getItem('fontSize');
    const storedPin = localStorage.getItem('caregiverPin');

    if (!meds || meds.length === 0) {
      setMedications(getSampleMedications());
    } else {
      setMedications(meds);
    }

    setTakenLog(log);

    if (storedFontSize === 'large' || storedFontSize === 'extra' || storedFontSize === 'normal') {
      setFontSize(storedFontSize);
    }

    if (storedPin) {
      setCaregiverPin(storedPin);
      setHasCaregiverPin(true);
    }
  }, []);

  useEffect(() => {
    saveMedications(medications);
  }, [medications]);

  useEffect(() => {
    saveTakenLog(takenLog);
  }, [takenLog]);

  useEffect(() => {
    if (fontSize) {
      localStorage.setItem('fontSize', fontSize);
    }
  }, [fontSize]);

  useEffect(() => {
    if (caregiverPin) {
      localStorage.setItem('caregiverPin', caregiverPin);
    }
  }, [caregiverPin]);

  function handleSaveMed(med) {
    setMedications((prev) => {
      const exists = prev.some((m) => m.id === med.id);
      if (exists) {
        return prev.map((m) => (m.id === med.id ? med : m));
      }
      return [...prev, med];
    });
    setShowForm(false);
    setEditingMed(null);
  }

  function handleEditMed(med) {
    setEditingMed(med);
    setShowForm(true);
  }

  function handleDeleteMed(med) {
    if (!window.confirm('Delete this medication and its history?')) return;
    setMedications((prev) => prev.filter((m) => m.id !== med.id));
    setTakenLog((prev) => prev.filter((log) => log.medId !== med.id));
  }

  function handleTake(med, scheduledTime) {
    const now = new Date();
    const todayKey = getTodayKey(now);
    setTakenLog((prev) => {
      const exists = prev.some(
        (log) =>
          log.medId === med.id &&
          log.scheduledTime === scheduledTime &&
          log.date === todayKey,
      );
      if (exists) return prev;
      const entry = {
        medId: med.id,
        scheduledTime,
        takenAt: now.toISOString(),
        date: todayKey,
      };
      return [...prev, entry];
    });
  }

  function handleUndo(med, scheduledTime) {
    const todayKey = getTodayKey(new Date());
    setTakenLog((prev) =>
      prev.filter(
        (log) =>
          !(
            log.medId === med.id &&
            log.scheduledTime === scheduledTime &&
            log.date === todayKey
          ),
      ),
    );
  }

  function openAddForm() {
    setEditingMed(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingMed(null);
  }

  function openCaregiverDialog() {
    setCaregiverError('');
    setCaregiverInput('');
    setCaregiverConfirm('');
    setShowCaregiverModal(true);
  }

  function closeCaregiverDialog() {
    setShowCaregiverModal(false);
    setCaregiverError('');
    setCaregiverInput('');
    setCaregiverConfirm('');
  }

  function handleCaregiverSubmit(event) {
    event.preventDefault();

    if (!hasCaregiverPin) {
      if (!caregiverInput || caregiverInput.length < 4) {
        setCaregiverError('Please choose a 4-digit PIN.');
        return;
      }
      if (caregiverInput !== caregiverConfirm) {
        setCaregiverError('PINs do not match.');
        return;
      }
      setCaregiverPin(caregiverInput);
      setHasCaregiverPin(true);
      setCaregiverMode(true);
      closeCaregiverDialog();
      return;
    }

    if (caregiverInput === caregiverPin) {
      setCaregiverMode(true);
      closeCaregiverDialog();
    } else {
      setCaregiverError('Incorrect PIN.');
    }
  }

  function handleFontSizeChange(size) {
    setFontSize(size);
  }

  return (
    <div
      className={`mx-auto flex min-h-screen max-w-xl flex-col bg-gray-100 ${
        fontSize === 'large' ? 'text-lg' : fontSize === 'extra' ? 'text-xl' : 'text-base'
      }`}
    >
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 px-4 pt-4 pb-2 shadow-sm backdrop-blur">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Med Tracker</h1>
            <p className="text-xs text-gray-600">Simple medication schedule for your day</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={caregiverMode ? () => setCaregiverMode(false) : openCaregiverDialog}
              className={`min-h-[32px] rounded-full border px-3 py-1 text-[11px] font-semibold ${
                caregiverMode
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-gray-300 bg-white text-gray-800'
              }`}
            >
              {caregiverMode ? 'Caregiver: ON' : 'Caregiver'}
            </button>
            <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1 text-[11px]">
              <span className="px-1 text-[10px] text-gray-600">Text size</span>
              <button
                type="button"
                onClick={() => handleFontSizeChange('normal')}
                className={`min-h-[28px] rounded-full px-2 py-1 font-semibold ${
                  fontSize === 'normal'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('large')}
                className={`min-h-[28px] rounded-full px-2 py-1 font-semibold ${
                  fontSize === 'large'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('extra')}
                className={`min-h-[28px] rounded-full px-2 py-1 font-semibold ${
                  fontSize === 'extra'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                A++
              </button>
            </div>
          </div>
        </div>

        <nav className="mt-1 grid grid-cols-2 gap-2 rounded-full bg-gray-100 p-1 text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`min-h-[44px] rounded-full px-3 py-2 font-semibold ${
              activeTab === 'today'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-transparent text-gray-700'
            }`}
          >
            Today's Schedule
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`min-h-[44px] rounded-full px-3 py-2 font-semibold ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-transparent text-gray-700'
            }`}
          >
            All Medications
          </button>
        </nav>
      </header>

      <main className="flex-1 px-4 pt-3 pb-6">
        {activeTab === 'today' ? (
          <TodayView
            medications={medications}
            takenLog={takenLog}
            onTake={handleTake}
            onUndo={handleUndo}
            fontSize={fontSize}
          />
        ) : (
          <AllMedsView
            medications={medications}
            onEdit={handleEditMed}
            onDelete={handleDeleteMed}
            caregiverMode={caregiverMode}
            fontSize={fontSize}
          />
        )}
      </main>

      <button
        type="button"
        onClick={openAddForm}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white shadow-lg hover:bg-blue-700"
        aria-label="Add medication"
      >
        +
      </button>

      {showForm && (
        <MedForm
          initialMed={editingMed}
          onSave={handleSaveMed}
          onCancel={closeForm}
          fontSize={fontSize}
        />
      )}

      {showCaregiverModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xs rounded-2xl bg-white p-4 shadow-xl">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              {hasCaregiverPin ? 'Caregiver PIN' : 'Set caregiver PIN'}
            </h2>
            <p className="mb-3 text-xs text-gray-600">
              {hasCaregiverPin
                ? 'Enter the caregiver PIN to unlock editing and advanced options.'
                : 'Choose a simple 4-digit PIN so only caregivers can change medications.'}
            </p>
            <form onSubmit={handleCaregiverSubmit} className="space-y-3 text-sm">
              <div>
                <label className="mb-1 block font-medium">
                  {hasCaregiverPin ? 'Enter PIN' : 'Create PIN'}
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base tracking-[0.3em]"
                  value={caregiverInput}
                  onChange={(event) => setCaregiverInput(event.target.value)}
                />
              </div>

              {!hasCaregiverPin && (
                <div>
                  <label className="mb-1 block font-medium">Confirm PIN</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={8}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base tracking-[0.3em]"
                    value={caregiverConfirm}
                    onChange={(event) => setCaregiverConfirm(event.target.value)}
                  />
                </div>
              )}

              {caregiverError && (
                <p className="text-xs text-red-600">{caregiverError}</p>
              )}

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeCaregiverDialog}
                  className="min-h-[36px] rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[36px] rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  {hasCaregiverPin ? 'Unlock' : 'Save PIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="mt-auto px-4 pb-4 pt-2 text-center text-[11px] text-gray-500">
        <p>
          Med Tracker is for personal organization only. It does not provide medical advice. Always
          consult your healthcare provider.
        </p>
      </footer>
    </div>
  );
}

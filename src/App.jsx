import React, { useEffect, useState } from 'react';
import TodayView from './components/TodayView.jsx';
import AllMedsView from './components/AllMedsView.jsx';
import HistoryView from './components/HistoryView.jsx';
import SettingsView from './components/SettingsView.jsx';
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
      name: 'Morning multivitamin',
      dose: '1 tablet',
      frequency: 'daily',
      times: ['08:00'],
      daysOfWeek: [],
      customFrequency: '',
      doctor: 'Dr. Rivera (Primary Care)',
      priority: 'critical',
      instructions: 'Take with a full glass of water after breakfast.',
      pillsRemaining: 30,
      refillable: true,
      notes: 'General daily vitamin. Stop and call your doctor if you notice anything unusual.',
    },
    {
      id: baseId + 2,
      name: 'Stomach comfort tablet',
      dose: '1 tablet',
      frequency: 'specific-days',
      times: ['07:30'],
      daysOfWeek: ['Mon', 'Wed', 'Fri'],
      customFrequency: '',
      doctor: 'Dr. Rivera (Primary Care)',
      priority: 'important',
      instructions: 'Take with a small snack if your stomach feels uneasy.',
      pillsRemaining: 12,
      refillable: true,
      notes: 'For occasional stomach upset as advised by your doctor.',
    },
    {
      id: baseId + 3,
      name: 'Lunch-time digestive aid',
      dose: '1 capsule',
      frequency: 'daily',
      times: ['12:00', '18:00'],
      daysOfWeek: [],
      customFrequency: '',
      doctor: 'Dr. Chen (Gastroenterology)',
      priority: 'critical',
      instructions: 'Take with meals. Swallow whole with water.',
      pillsRemaining: 20,
      refillable: true,
      notes: 'Supports comfortable digestion with meals.',
    },
    {
      id: baseId + 4,
      name: 'Blood pressure tablet',
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
      name: 'Evening fluid tablet',
      dose: '20 mg',
      frequency: 'every-other-day',
      times: ['19:00'],
      daysOfWeek: [],
      customFrequency: '',
      doctor: 'Dr. Kim (Cardiology)',
      priority: 'important',
      instructions: 'Take early enough to avoid nighttime trips to the bathroom.',
      pillsRemaining: 8,
      refillable: true,
      notes: 'Helps manage fluid balance as advised by your doctor.',
    },
    {
      id: baseId + 6,
      name: 'Cholesterol tablet',
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
      notes: 'For long-term heart and cholesterol management.',
    },
  ];
}

function BottomNavItem({ label, icon, active, onClick }) {
  const activeClasses = active ? 'text-[#4a80f0]' : 'text-slate-400';
  const iconBgClasses = active ? 'bg-[#4a80f0] text-white' : 'bg-slate-200 text-slate-500';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-tight ${activeClasses}`}
    >
      <div className={`flex h-7 w-7 items-center justify-center rounded-full text-base ${iconBgClasses}`}>
        <span aria-hidden="true">{icon}</span>
      </div>
      <span>{label}</span>
    </button>
  );
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

  function handleCaregiverButtonClick() {
    if (caregiverMode) {
      setCaregiverMode(false);
    } else {
      openCaregiverDialog();
    }
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
      className={`mx-auto flex min-h-screen max-w-xl flex-col bg-[#eef7f4] ${
        fontSize === 'large' ? 'text-lg' : fontSize === 'extra' ? 'text-xl' : 'text-base'
      }`}
    >
      <header className="sticky top-0 z-20 bg-[#eef7f4]/90 px-4 pt-3 pb-2 backdrop-blur">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-semibold text-slate-900">MedTracker</h1>
            <p className="text-[11px] text-slate-500">Simple daily medication tracker</p>
          </div>
        </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-3 pb-8">
        {activeTab === 'today' && (
          <TodayView
            medications={medications}
            takenLog={takenLog}
            onTake={handleTake}
            onUndo={handleUndo}
            fontSize={fontSize}
          />
        )}
        {activeTab === 'all' && (
          <AllMedsView
            medications={medications}
            onEdit={handleEditMed}
            onDelete={handleDeleteMed}
            caregiverMode={caregiverMode}
            fontSize={fontSize}
          />
        )}
        {activeTab === 'history' && (
          <HistoryView medications={medications} takenLog={takenLog} />
        )}
        {activeTab === 'settings' && (
          <SettingsView
            caregiverMode={caregiverMode}
            onCaregiverButtonClick={handleCaregiverButtonClick}
            fontSize={fontSize}
            onFontSizeChange={handleFontSizeChange}
          />
        )}
      </main>

      <button
        type="button"
        onClick={openAddForm}
        className="fixed bottom-20 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#4a80f0] text-3xl font-bold text-white shadow-lg hover:bg-blue-700"
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

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/80 px-6 py-3 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <BottomNavItem
            label="Today"
            icon="☀️"
            active={activeTab === 'today'}
            onClick={() => setActiveTab('today')}
          />
          <BottomNavItem
            label="Meds"
            icon="💊"
            active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          />
          <BottomNavItem
            label="History"
            icon="📅"
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
          />
          <BottomNavItem
            label="Settings"
            icon="⚙️"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </div>
      </nav>

      <footer className="mt-auto px-4 pb-4 pt-2 text-center text-[11px] text-gray-500">
        <p>
          Med Tracker is for personal organization only. It does not provide medical advice. Always
          consult your healthcare provider.
        </p>
      </footer>
    </div>
  );
}

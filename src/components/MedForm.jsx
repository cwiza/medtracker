import React, { useState, useEffect } from 'react';

const PRIORITIES = [
  { value: 'critical', label: 'Critical' },
  { value: 'important', label: 'Important' },
  { value: 'routine', label: 'Routine' },
];

const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'every-other-day', label: 'Every other day' },
  { value: 'specific-days', label: 'Specific days' },
  { value: 'custom', label: 'Custom' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MedForm({ initialMed, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [priority, setPriority] = useState('routine');
  const [frequency, setFrequency] = useState('daily');
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [customFrequency, setCustomFrequency] = useState('');
  const [times, setTimes] = useState(['']);
  const [instructions, setInstructions] = useState('');
  const [doctor, setDoctor] = useState('');
  const [pillsRemaining, setPillsRemaining] = useState('');
  const [refillable, setRefillable] = useState(false);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialMed) {
      setName(initialMed.name || '');
      setDose(initialMed.dose || '');
      setPriority(initialMed.priority || 'routine');
      setFrequency(initialMed.frequency || 'daily');
      setDaysOfWeek(initialMed.daysOfWeek || []);
      setCustomFrequency(initialMed.customFrequency || '');
      setTimes(initialMed.times && initialMed.times.length ? initialMed.times : ['']);
      setInstructions(initialMed.instructions || '');
      setDoctor(initialMed.doctor || '');
      setPillsRemaining(
        typeof initialMed.pillsRemaining === 'number' ? String(initialMed.pillsRemaining) : '',
      );
      setRefillable(Boolean(initialMed.refillable));
      setNotes(initialMed.notes || '');
    }
  }, [initialMed]);

  function toggleDay(day) {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  function updateTime(index, value) {
    setTimes((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function addTimeField() {
    setTimes((prev) => [...prev, '']);
  }

  function removeTimeField(index) {
    setTimes((prev) => prev.filter((_, i) => i !== index));
  }

  function validate() {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Medication name is required.';
    if (!dose.trim()) nextErrors.dose = 'Dose is required.';

    const cleanedTimes = times.map((t) => t.trim()).filter(Boolean);
    if (cleanedTimes.length === 0) nextErrors.times = 'At least one time is required.';

    setErrors(nextErrors);
    return { valid: Object.keys(nextErrors).length === 0, cleanedTimes };
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { valid, cleanedTimes } = validate();
    if (!valid) return;

    const med = {
      id: initialMed?.id ?? Date.now(),
      name: name.trim(),
      dose: dose.trim(),
      priority,
      frequency,
      times: cleanedTimes,
      daysOfWeek: frequency === 'specific-days' ? daysOfWeek : [],
      customFrequency: frequency === 'custom' ? customFrequency.trim() : '',
      doctor: doctor.trim(),
      instructions: instructions.trim(),
      pillsRemaining:
        pillsRemaining === '' || Number.isNaN(Number(pillsRemaining))
          ? 0
          : Number(pillsRemaining),
      refillable,
      notes: notes.trim(),
    };

    onSave(med);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          {initialMed ? 'Edit Medication' : 'Add Medication'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm sm:text-base">
          <div>
            <label className="mb-1 block font-medium">Medication Name *</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-1 block font-medium">Dose *</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base"
              placeholder="500mg, 1 tablet, etc."
              value={dose}
              onChange={(e) => setDose(e.target.value)}
            />
            {errors.dose && <p className="mt-1 text-sm text-red-600">{errors.dose}</p>}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium">Priority</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block font-medium">Frequency</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {frequency === 'specific-days' && (
            <div>
              <label className="mb-1 block font-medium">Days of Week</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => {
                  const active = daysOfWeek.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`min-w-[44px] rounded-full border px-3 py-2 text-sm font-medium ${
                        active
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-300 bg-white text-gray-800'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {frequency === 'custom' && (
            <div>
              <label className="mb-1 block font-medium">Custom Schedule</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base"
                placeholder="e.g., First Monday of each month"
                value={customFrequency}
                onChange={(e) => setCustomFrequency(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="mb-1 block font-medium">Times to Take *</label>
            <div className="space-y-2">
              {times.map((t, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="time"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-base"
                    value={t}
                    onChange={(e) => updateTime(index, e.target.value)}
                  />
                  {times.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTimeField(index)}
                      className="rounded-full border border-gray-300 px-3 py-2 text-sm text-gray-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTimeField}
                className="mt-1 rounded-full border border-dashed border-blue-500 px-3 py-2 text-sm font-medium text-blue-600"
              >
                + Add another time
              </button>
            </div>
            {errors.times && <p className="mt-1 text-sm text-red-600">{errors.times}</p>}
          </div>

          <div>
            <label className="mb-1 block font-medium">Special Instructions</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base"
              rows={2}
              placeholder="Take with food, before bed, don't drive, etc."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium">Doctor / Prescriber</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Pills Remaining</label>
              <input
                type="number"
                min="0"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base"
                value={pillsRemaining}
                onChange={(e) => setPillsRemaining(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="refillable"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
              checked={refillable}
              onChange={(e) => setRefillable(e.target.checked)}
            />
            <label htmlFor="refillable" className="text-sm">
              This prescription is refillable
            </label>
          </div>

          <div>
            <label className="mb-1 block font-medium">Additional Notes</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="min-h-[44px] rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Save Medication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

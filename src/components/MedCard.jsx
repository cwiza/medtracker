import React, { useState } from 'react';
import { formatClockTime } from '../utils/timeWindows.js';

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

export default function MedCard({ med, onEdit, onDelete, caregiverMode, fontSize = 'normal' }) {
  const [open, setOpen] = useState(false);
  const styles = priorityStyles(med.priority);
  const lowStock = typeof med.pillsRemaining === 'number' && med.pillsRemaining < 10;
  const canEdit = Boolean(caregiverMode && onEdit);
  const canDelete = Boolean(caregiverMode && onDelete);

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wide ${styles.badgeBg} ${styles.badgeText}`}
            >
              {med.priority || 'routine'}
            </span>
          </div>
          <div className={`${getNameClass(fontSize)} font-bold text-slate-800`}>
            {med.name}
          </div>
          <div className={`${getDoseClass(fontSize)} font-semibold text-slate-400`}>
            {med.dose}
          </div>
          <div className="mt-1 text-sm font-medium text-slate-400">
            {med.frequency === 'daily' && 'Daily'}
            {med.frequency === 'every-other-day' && 'Every other day'}
            {med.frequency === 'specific-days' && med.daysOfWeek?.join(', ')}
            {med.frequency === 'custom' && (med.customFrequency || 'Custom schedule')}
          </div>
          {Array.isArray(med.times) && med.times.length > 0 && (
            <div className="mt-1 text-sm text-slate-400">
              Times:{' '}
              {med.times.map((t, index) => formatClockTime(t)).join(', ')}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => canEdit && onEdit?.(med)}
              disabled={!canEdit}
              className={`min-h-[36px] rounded-full border px-3 py-1 text-xs font-medium ${
                canEdit
                  ? 'border-gray-300 text-gray-800'
                  : 'border-gray-200 text-gray-400 opacity-60 cursor-not-allowed'
              }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => canDelete && onDelete?.(med)}
              disabled={!canDelete}
              className={`min-h-[36px] rounded-full border px-3 py-1 text-xs font-semibold ${
                canDelete
                  ? 'border-red-500 text-red-600'
                  : 'border-gray-200 text-gray-400 opacity-60 cursor-not-allowed'
              }`}
            >
              Delete
            </button>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-xs font-medium text-blue-700"
          >
            {open ? 'Hide details' : 'More info'}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-2 rounded-xl bg-white/70 p-3 text-sm text-gray-800">
          {med.instructions && (
            <p className="mb-1">
              <span className="font-semibold">Instructions: </span>
              {med.instructions}
            </p>
          )}
          {med.doctor && (
            <p className="mb-1">
              <span className="font-semibold">Doctor: </span>
              {med.doctor}
            </p>
          )}
          <p className="mb-1">
            <span className="font-semibold">Pills remaining: </span>
            {typeof med.pillsRemaining === 'number' ? med.pillsRemaining : 'N/A'}
          </p>
          {med.refillable && <p className="mb-1 text-xs text-gray-700">Prescription is refillable.</p>}
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
}

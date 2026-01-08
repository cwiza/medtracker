import React from 'react';
import MedCard from './MedCard.jsx';

export default function AllMedsView({ medications, onEdit, onDelete, caregiverMode, fontSize = 'normal' }) {
  if (!medications.length) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center px-4 text-center text-gray-700">
        <div className="mb-4 h-16 w-16 rounded-full bg-green-50 text-4xl leading-[4rem] text-green-500">
          💊
        </div>
        <p className="mb-1 text-lg font-semibold">No medications added yet</p>
        <p className="max-w-xs text-sm text-gray-600">
          Tap the + button to add your first medication and build your schedule.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {medications.map((med) => (
        <MedCard
          key={med.id}
          med={med}
          onEdit={onEdit}
          onDelete={onDelete}
          caregiverMode={caregiverMode}
          fontSize={fontSize}
        />
      ))}
    </div>
  );
}

import React from 'react';

export default function SettingsView({
  caregiverMode,
  onCaregiverButtonClick,
  fontSize = 'normal',
  onFontSizeChange,
}) {
  return (
    <div className="space-y-4 pb-20">
      <div className="rounded-[28px] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Caregiver mode</h2>
        <p className="text-sm text-slate-600 mb-3">
          Turn caregiver mode on to protect editing and deleting medications with a PIN.
        </p>
        <button
          type="button"
          onClick={onCaregiverButtonClick}
          className={`min-h-[40px] rounded-full border px-4 py-2 text-sm font-semibold shadow-sm ${
            caregiverMode
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-slate-200 bg-white text-slate-800'
          }`}
        >
          {caregiverMode ? 'Caregiver: ON' : 'Enable caregiver mode'}
        </button>
      </div>

      <div className="rounded-[28px] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Text size</h2>
        <p className="text-sm text-slate-600 mb-3">
          Choose the text size that is most comfortable to read.
        </p>
        <div className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-[11px] shadow-sm">
          <span className="px-1 text-[10px] text-slate-600">Text size</span>
          <button
            type="button"
            onClick={() => onFontSizeChange('normal')}
            className={`min-h-[28px] rounded-full px-3 py-1 text-xs font-semibold ${
              fontSize === 'normal'
                ? 'bg-[#4a80f0] text-white'
                : 'bg-white text-slate-800'
            }`}
          >
            A
          </button>
          <button
            type="button"
            onClick={() => onFontSizeChange('large')}
            className={`min-h-[28px] rounded-full px-3 py-1 text-xs font-semibold ${
              fontSize === 'large'
                ? 'bg-[#4a80f0] text-white'
                : 'bg-white text-slate-800'
            }`}
          >
            A+
          </button>
          <button
            type="button"
            onClick={() => onFontSizeChange('extra')}
            className={`min-h-[28px] rounded-full px-3 py-1 text-xs font-semibold ${
              fontSize === 'extra'
                ? 'bg-[#4a80f0] text-white'
                : 'bg-white text-slate-800'
            }`}
          >
            A++
          </button>
        </div>
      </div>
    </div>
  );
}

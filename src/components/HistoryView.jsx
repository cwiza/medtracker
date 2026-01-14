import React, { useMemo } from 'react';

function groupTakenByDate(takenLog) {
  const map = new Map();

  takenLog.forEach((entry) => {
    const { date } = entry;
    if (!date) return;
    if (!map.has(date)) {
      map.set(date, []);
    }
    map.get(date).push(entry);
  });

  return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
}

function formatDateLabel(dateKey) {
  // dateKey is in YYYY-MM-DD from getTodayKey
  const parts = dateKey.split('-');
  if (parts.length !== 3) return dateKey;
  const [year, month, day] = parts.map((p) => Number(p));
  const jsDate = new Date(year, month - 1, day);
  if (Number.isNaN(jsDate.getTime())) return dateKey;

  return jsDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export default function HistoryView({ medications, takenLog }) {
  const grouped = useMemo(() => groupTakenByDate(takenLog), [takenLog]);

  // Quick lookup from medId to medication details
  const medMap = useMemo(() => {
    const map = new Map();
    medications.forEach((med) => {
      map.set(med.id, med);
    });
    return map;
  }, [medications]);

  const totalDoses = takenLog.length;

  if (!grouped.length) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center px-4 text-center text-gray-700">
        <div className="mb-4 h-16 w-16 rounded-full bg-blue-50 text-4xl leading-[4rem] text-blue-500">
          📅
        </div>
        <p className="mb-1 text-xl font-semibold">No history yet</p>
        <p className="max-w-xs text-base text-gray-600">
          As you mark medications as taken, your recent days will appear here.
        </p>
      </div>
    );
  }

  const recent = grouped.slice(0, 7);

  return (
    <div className="space-y-6 pb-20">
      {/* Hero summary card, styled to match MedsApp hero vibe reset */}
      <div className="relative overflow-hidden mb-2 bg-gradient-to-r from-[#52B79A] to-[#4A80F0] rounded-[40px] p-8 text-white shadow-xl shadow-blue-100">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80">History</p>
            <h2 className="text-2xl font-black tracking-tight">Recent doses</h2>
            <p className="pt-2 text-sm leading-snug opacity-90 max-w-[220px]">
              A quick view of doses you have marked as taken over the last few days.
            </p>
          </div>

          {/* Simple count chip mimicking the circular summary vibe */}
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-[999px] bg-white/10 text-center text-[11px] font-bold">
            <span className="uppercase tracking-[0.16em] opacity-80">Total</span>
            <span className="text-2xl font-black leading-tight">{totalDoses}</span>
            <span className="opacity-80">doses</span>
          </div>
        </div>
      </div>

      {/* Per-day history cards */}
      {recent.map(([dateKey, entries]) => {
        const label = formatDateLabel(dateKey);
        const uniqueMeds = new Set(entries.map((e) => e.medId));

        // Build a compact description of a few meds for this day
        const sampleDescriptions = entries
          .slice(0, 3)
          .map((entry) => {
            const med = medMap.get(entry.medId);
            const medName = med?.name || 'Medication';
            const timeText = entry.scheduledTime || '';
            return `${medName}${timeText ? ` • ${timeText}` : ''}`;
          });

        const remainingCount = entries.length - sampleDescriptions.length;

        return (
          <div
            key={dateKey}
            className="mb-4 flex items-center justify-between rounded-[40px] bg-white p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-slate-50"
          >
            <div className="max-w-[65%] space-y-1">
              <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-700 border border-slate-50">
                📅 {label}
              </p>
              <h3 className="text-[22px] font-black leading-tight text-slate-800">
                {entries.length} dose{entries.length === 1 ? '' : 's'} taken
              </h3>
              <p className="mb-1 text-[13px] font-bold text-slate-400">
                {uniqueMeds.size} medication{uniqueMeds.size === 1 ? '' : 's'}
              </p>
              {sampleDescriptions.length > 0 && (
                <p className="mt-1 text-[12px] text-slate-400 font-medium leading-relaxed max-w-[240px]">
                  {sampleDescriptions.join(' • ')}
                  {remainingCount > 0 && ` • +${remainingCount} more`}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-4">
              <button
                type="button"
                className="bg-[#4A80F0] text-white px-8 py-4 rounded-[20px] text-[15px] font-black shadow-lg shadow-blue-100 active:scale-95 transition-transform whitespace-nowrap"
              >
                View day
              </button>
              <button
                type="button"
                className="text-[#4A80F0] text-sm font-extrabold hover:underline"
              >
                More details
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

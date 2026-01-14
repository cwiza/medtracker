import React from 'react';

// Modern Soft UI Med Tracker Prototype
const MedsAppPrototype = () => {
  const medications = [
    { name: 'Levothyroxine', schedule: 'Daily, Morning', time: '8:00 AM', status: 'taken', color: 'green' },
    { name: 'Lisinopril', schedule: 'Daily, Evening', time: '7:00 PM', status: 'pending', color: 'blue' },
    { name: 'Ibuprofen', schedule: 'As Needed', time: 'Record dose', status: 'none', color: 'gray' },
  ];

  return (
    <div className="min-h-screen bg-[#eef7f4] font-sans text-slate-800 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <button type="button" className="text-2xl">
          ☰
        </button>
        <h1 className="text-xl font-semibold">My Meds</h1>
        <button type="button" className="text-2xl">
          💊
        </button>
      </header>

      {/* Progress Circle Section */}
      <section className="flex flex-col items-center py-8">
        <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-white shadow-inner">
          {/* Visual Progress Ring using Conic Gradient */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(#4dbd91 280deg, #d1e9e2 0deg)',
              maskImage: 'radial-gradient(transparent 58%, black 60%)',
              WebkitMaskImage: 'radial-gradient(transparent 58%, black 60%)',
            }}
          />
          <div className="z-10 text-center">
            <p className="mb-1 text-xs font-medium text-slate-400">Today's Doses</p>
            <h2 className="text-4xl font-bold">7/9</h2>
            <p className="text-sm font-medium text-slate-500">Taken</p>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="mt-6 flex gap-2">
          <div className="h-2 w-2 rounded-full bg-[#4dbd91]" />
          <div className="h-2 w-2 rounded-full bg-slate-300" />
          <div className="h-2 w-2 rounded-full bg-slate-300" />
        </div>
      </section>

      {/* Med Cards List */}
      <main className="space-y-4 px-5">
        {medications.map((med) => (
          <div
            key={med.name}
            className="flex items-center justify-between rounded-[28px] bg-white p-6 shadow-sm"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">{med.name}</h3>
              <p className="text-sm font-medium text-slate-400">{med.schedule}</p>
              <div className="flex items-center pt-1 text-xs font-bold text-[#4dbd91]">
                <span className="mr-1">✓</span>
                {med.time}
              </div>
            </div>

            {med.status === 'taken' && (
              <button
                type="button"
                className="rounded-full bg-[#e9f7f2] px-5 py-2 text-sm font-bold text-[#4dbd91]"
              >
                Taken
              </button>
            )}
            {med.status === 'pending' && (
              <button
                type="button"
                className="rounded-full bg-[#4a80f0] px-5 py-2 text-sm font-bold text-white shadow-md shadow-blue-200"
              >
                Mark as taken
              </button>
            )}
            {med.status === 'none' && <div className="text-xs text-slate-400">Tap to record</div>}
          </div>
        ))}
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <NavItem label="Today" active />
        <NavItem label="Schedule" />
        <NavItem label="Meds" />
        <NavItem label="Progress" />
        <NavItem label="Settings" />
      </nav>
    </div>
  );
};

const NavItem = ({ label, active }) => (
  <div
    className={`flex flex-col items-center gap-1 ${
      active ? 'text-[#4a80f0]' : 'text-slate-300'
    }`}
  >
    <div className={`h-6 w-6 rounded-md ${active ? 'bg-[#4a80f0]' : 'bg-slate-200'}`} />
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </div>
);

export default MedsAppPrototype;

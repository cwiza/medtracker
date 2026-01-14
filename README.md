# MedTracker Glasmorphism

A simple, mobile-friendly Progressive Web App (PWA) to help patients and caregivers manage complex medication schedules. Built with React, Tailwind CSS, and localStorage (no backend).

> **Important:** Med Tracker is for personal medication organization only. It does **not** provide medical advice.

---

## What This Is For

- Older adults who have many daily medications and want a simple checklist.
- People with chronic conditions (e.g. cancer, heart, kidney disease) juggling complex schedules.
- Family members or caregivers who help someone else remember what to take and when.
- Tracking pill counts and knowing when it may be time to request a refill.

---

## Features (MVP)

- Add medications with:
  - Name, dose, priority (Critical / Important / Routine)
  - Frequency (Daily, Every other day, Specific days, Custom)
  - One or more times per day
  - Special instructions (e.g. "Take with food", "Before bed")
  - Doctor/prescriber
  - Pills remaining + refillable flag
  - Notes
- Today’s Schedule view
  - Shows only medications due **today** based on frequency
  - Grouped by time, sorted earliest → latest
  - Time windows (±1 hour, e.g. `7:00 AM – 9:00 AM`)
  - Mark as **Taken** with timestamp; **Undo** support
  - Priority color coding (red/orange/green) + text labels
  - Expandable details with doctor, instructions, pills remaining, refill
- All Medications view
  - List of all meds with edit/delete
  - Low-stock warning if pills remaining `< 10`
  - Expandable "More info" section
- Data persistence
  - Medications and taken history stored in `localStorage`
  - Works offline (no server)
- PWA basics
  - Installable via browser "Add to Home Screen"
  - Manifest configured for standalone display
- Elderly-focused helpers
  - Adjustable text size (Normal / Large / Extra) with simple header controls
  - Caregiver mode with PIN to protect editing/deleting medications
  - "Read aloud" button on Today view using device text-to-speech

---

## Tech Stack

- React 18 + Vite
- Tailwind CSS 3
- localStorage for data persistence
- Lucide (planned) / basic emoji icons for now

---

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm (comes with Node)

### Install dependencies

From the project root (this folder):

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`). Open that in your browser to use the app.

For a nicer mobile test experience, open it on your phone (same network) or use your desktop browser’s mobile device emulation.

---

## Building for Production

```bash
npm run build
```

The production-ready static files will be in the `dist/` directory. Any static file host (GitHub Pages, Netlify, Vercel, etc.) can serve this.

Example static deployment steps:

1. Run `npm run build`
2. Upload the contents of `dist/` to your static host
3. Point your custom domain (optional) to that deployment

---

## PWA / Offline Use

- Manifest is defined in `public/manifest.json`
- App can be installed to the home screen on modern browsers
- Data is stored locally with `localStorage`, so it works offline after first load

To improve the PWA further (future work):

- Add a service worker for offline caching of assets
- Fine-tune icons and splash screens for iOS/Android

---

## Data & Privacy

- All medication data is stored **only on the user’s device** via `localStorage`.
- The app does **not** send data to any server by default.

**Privacy Statement:**

> All data is stored locally on your device. This app does not collect, transmit, or store any personal information on external servers. Your medication data never leaves your device.

---

## Medical Disclaimer

> Med Tracker is for personal medication organization only. It does **not** provide medical advice. Always consult your healthcare provider about your medications. Do not use this app to make medical decisions.

This app is **not**:

- A replacement for medical advice
- HIPAA compliant
- A clinical decision support tool
- A drug interaction checker (could be added in future versions)

---

## Folder Structure

Key files:

- `index.html` – app entry HTML
- `src/main.jsx` – React entry point
- `src/App.jsx` – main app shell and state management
- `src/components/TodayView.jsx` – today’s schedule UI
- `src/components/AllMedsView.jsx` – all medications list
- `src/components/MedForm.jsx` – add/edit medication modal form
- `src/components/MedCard.jsx` – medication card display
- `src/utils/storage.js` – localStorage helpers
- `src/utils/scheduling.js` – frequency logic
- `src/utils/timeWindows.js` – time window labels
- `public/manifest.json` – PWA manifest

---

## Roadmap / Backlog

Potential future enhancements (beyond current MVP):

- Export/import medication data as JSON
- Print-friendly medication list for doctor visits
- Medication history view (past 7/30 days)
- Browser push notifications for reminders
- Drug interaction warnings via a free API
- Photo upload + OCR of prescription labels
- Multi-device sync via backend
- Emergency info card / lock-screen-style view for EMTs and doctors
- Simple daily check-in ("Did you miss any meds today?")
- Dedicated refills overview screen ("Needs refill now" / "Running low soon")
- Optional ultra-simple "Now / Next" home screen focused only on the next 1–2 doses

---

## Contributing

Issues and pull requests are welcome. Please:

- Avoid adding any backend that stores personal medical data unless you handle privacy and compliance properly
- Keep the UI focused on clarity, simplicity, and accessibility (large text, big buttons, high contrast)

---

## License

Planned: MIT License (permissive, suitable for open source). Add a standard MIT `LICENSE` file if you publish this repository publicly.

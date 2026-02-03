# SEAMUNs

A modern web app for tracking Model United Nations (MUN) conferences across **South East Asia**. Built with vanilla HTML, CSS, and JavaScript, with optional Firebase auth and persistence.

## Features

### Conference listing
- **Tabs**: All Registered MUNs · Upcoming · Previous · Attending · Attended
- **Search**: By conference name, organization, or location
- **Filters**: Status (All / Upcoming / Previous), location, and committee (multi-select with search)
- **Stats**: Counts for Upcoming, Previous, and Total
- **Dates**: Display in dd/mm/yyyy
- **Status tags**: UPCOMING / PREVIOUS from conference dates; attendance: Not Attending / Attending / Attended

### Conferences section
- **Upcoming & Previous MUNs**: Main list of registered conferences
- **Prospective MUNs**: Conferences not yet fully registered
- **How to Host an MUN**: Guide for organisers

### Schools & advisors
- **Participating Schools**: List of schools
- **How to Become a Participating School**
- **Advisor Guide**

### Delegates & chairs
- **How to Sign Up (Delegate Guide)**
- **Individual Delegates**
- **Chair Guide**
- **Chair Superlatives**
- **MUN Guide**
- **How to Prep**
- **How to Stand Out**
- **Confidence Building**
- **Support at Conferences**

### Resources
- **Points** · **Motions** · **Committees** (Traditional & Special)
- **Conduct** · **Speeches** · **Resolutions** · **Crisis** · **General Assembly**
- **Position Papers** · **Chair Superlatives** · **Examples** · **Awards** · **Templates**
- **Archive**: shared reference library (position papers, chair reports, slides, speeches, prep docs). Logged-in users can upload; everyone can browse and filter by category. Data is shared via Firebase (Firestore + Storage).
- **MUN Simulation Game**: path `/munsimulation/` (single-player MUN procedure simulator)
- **SEAMUNs Dashboard**: [thedashboard.seamuns.site](https://thedashboard.seamuns.site) — for use during conferences; chairs and delegates can track activity and documents

### User experience
- **Theme**: Dark mode toggle + 9 accent colours (red, orange, yellow, green, blue, purple, pink, grey, mono)
- **Auth**: Login / Sign up (email or Google) via Firebase when configured
- **My Profile**: User profile and list of conferences you’re attending or have attended
- **MUN Simulation**: Direct nav link to the single-player MUN procedure game

### Conference details
- Full conference info: organisation, location, dates, registration deadline, description
- Committees list with topics and chair info
- **Mark as Attending** / **Mark as Attended**
- **View Details** opens the full conference page

### Data & tech
- **Persistence**: Firebase (when configured) and/or browser localStorage
- **Conference data**: Single reference file with all conferences and their info:
  - **`js/conferences-data.js`** — used by the app; edit to add or update conferences.
  - **`data/conferences.json`** — same data in JSON (human-readable reference).
- **Pre-loaded**: 7 conferences (MUN07 IV, STAMUN XI, THAIMUN XIII, TSIMUN 2026, KMIDSMUN II, HISMUN VI, Newton MUN I)
- **Archive (shared)**: Uploaded files and metadata are stored in Firebase so all users see the same content:
  - **Firestore** collection `archive`: each document has `title`, `category`, `description`, `uploadedBy`, `downloadUrl`, `fileName`, `createdAt`.
  - **Firebase Storage**: files are stored under `archive/`; Firestore holds the public download URL. Anyone can read archive items; only authenticated users can add new ones (enforced in the app and should be reflected in Firebase Security Rules).

## Getting started

### Prerequisites
- Modern browser (Chrome, Firefox, Safari, Edge)
- For auth: Firebase project; copy `env.example.js` to `env.js` and add your config (keep `env.js` out of version control)

### Run locally
1. Clone or download the project.
2. (Optional) Copy `env.example.js` to `env.js` and add Firebase credentials.
3. Open `index.html` in a browser or serve the folder with any static server.

No build step required.

### Production / deploy (login and Firebase)
`env.js` is gitignored, so it is not deployed with the repo. To enable login on your live site, **upload `env.js`** (with your Firebase credentials) to your **site root** (same folder as `index.html`). The app requests `/env.js` or `../env.js` from pages, so the file must be at the root. Without it you’ll see a 404 for `env.js` and “Firebase config missing” in the console; the rest of the site works, but login won’t.

### Why isn’t Google sign-in working?

1. **Firebase config**  
   Ensure `env.js` exists (copy from `env.example.js`) and has real Firebase values. If `env.js` is missing or still has placeholders, Firebase won’t initialize and Google sign-in will show “Google Sign-In is not available”.

2. **Authorized domains**  
   In [Firebase Console](https://console.firebase.google.com) → **Authentication** → **Settings** → **Authorized domains**, add the domain where the app runs, e.g.:
   - `localhost` (for local testing)
   - Your production host (e.g. `seamuns.site`, `yourusername.github.io`)
   Opening the site via `file://` will not work; use a local server or a hosted URL.

3. **Google provider**  
   In Firebase Console → **Authentication** → **Sign-in method**, enable **Google**.

4. **Pop-ups**  
   Google sign-in uses a pop-up. If the browser or an extension blocks pop-ups, allow them for your site and try again.

5. **Console errors**  
   Open DevTools (F12) → **Console**. Firebase and `firebase-config.js` log errors (e.g. missing config, `auth/unauthorized-domain`). Fix any reported issues.

6. **Other console messages**  
   A **404 for `rul?tid=G-...`** or **“Blocked a frame with origin … doubleclick.net”** usually comes from Hostinger-injected tracking or a browser extension (e.g. `content.js`), not from this app. You can ignore them or disable the host’s analytics/extensions if you want a clean console. **env.js** is loaded via `env-loader.js` so a missing `env.js` (e.g. on production) does not cause a script 404.

## Project structure (main pieces)

```
mun-tracker/
├── index.html               # Home: conference list, search, filters, tabs
├── env.example.js           # Example env (Firebase keys)
├── README.md
├── database-schema.sql      # API database schema reference
├── munsimulation/   # MUN Simulation Game (munsimulation)
│   ├── index.html           # Delegate simulation entry
│   ├── chairs.html          # Chair's Role procedure practice
│   ├── script.js            # Delegate sim logic
│   ├── chairs.js            # Chair sim logic
│   ├── styles.css, chairs.css, logo.png
│   └── README.md
├── pages/                   # All other HTML pages
│   ├── conference-template.html  # Conference detail page
│   ├── profile.html             # My Profile (attending / attended)
│   ├── about.html
│   ├── prospective-muns.html, how-to-host.html
│   ├── participating-schools.html, become-participating-school.html, advisor-guide.html
│   ├── delegate-signup.html, individual-delegates.html, chair-guide.html, chair-superlatives.html
│   ├── mun-guide.html, how-to-prep.html, stand-out.html, confidence.html, support.html
│   ├── points.html, motions.html, committees.html, conduct.html, speeches.html
│   ├── resolutions.html, crisis.html, ga.html, position-papers.html
│   ├── examples.html, awards.html, templates.html, archive.html
│   └── ...
├── data/                    # Reference data
│   └── conferences.json     # All conferences and their info (JSON reference)
├── js/                      # Scripts
│   ├── conferences-data.js  # All conferences and their info (used by app; edit for reference)
│   ├── script.js            # Conference list, filters, tabs, sample data
│   ├── conference-detail.js  # Conference detail page logic
│   ├── profile.js           # Profile page logic
│   ├── firebase-config.js   # Firebase init (uses env.js); archive helpers (Firestore + Storage)
│   ├── archive.js           # Archive page: load, filter, upload
│   └── theme-init.js        # Theme (dark/light + colour) persistence
├── css/
│   └── styles.css           # Global styles, themes, layout
├── assets/
│   └── logo.png
└── api/                     # Optional PHP/backend (e.g. feedback, conferences)
```

## Usage

- **Browse conferences**: Use tabs (All / Upcoming / Previous / Attending / Attended), search, and filters.
- **Conference details**: Click **View Details** on a card.
- **Attendance**: On the detail page, use **Mark as Attending** or **Mark as Attended** (when logged in).
- **Profile**: Open **My Profile** to see your attending/attended conferences.
- **Theme**: Use the moon icon for dark mode and the colour swatches for accent theme.
- **MUN Simulation**: Use the **MUN Simulation** nav link to open the game at `/munsimulation/`.

## Tech stack

- **HTML5** · **CSS3** (layout, theming, responsive)
- **JavaScript (ES6+)** · **Font Awesome** icons
- **Firebase** (optional): Auth, Firestore
- **Local storage**: Conferences and theme when Firebase not used

## Browser support

- Chrome, Firefox, Safari, Edge (recent versions)
- Requires JavaScript enabled

## License

Open source; see repository for license details.

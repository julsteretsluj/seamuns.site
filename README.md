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
2. (Optional) Copy `env.example.js` to `env.js` and add Firebase credentials. If the repo has an encrypted `env.js.enc` instead, see **Encrypted env (env.js.enc)** below to decrypt it.
3. Open `index.html` in a browser or serve the folder with any static server.

No build step required.

### Production / deploy (login and Firebase)
`env.js` is gitignored, so it is not deployed with the repo. To enable login on your live site, **upload `env.js`** (with your Firebase credentials) to your **site root** (same folder as `index.html`). The app requests `/env.js` or `../env.js` from pages, so the file must be at the root. Without it you’ll see a 404 for `env.js` and “Firebase config missing” in the console; the rest of the site works, but login won’t.

### Privacy policy and terms links
In `env.js` you can set optional URLs (leave as `""` to hide):

- **`PRIVACY_POLICY_URL`** — Full URL to your privacy policy. When set, it appears in the Sign Up modal and in the site footer on the home page.
- **`TERMS_URL`** — Full URL to your terms of service. When set, it appears next to the privacy link in the signup text and in the footer.

Example: `PRIVACY_POLICY_URL: "https://yoursite.com/privacy"`, `TERMS_URL: "https://yoursite.com/terms"`.

### Encrypted env (env.js.enc)
You can store Firebase credentials in the repo as an encrypted file so only people with the passphrase can get plain `env.js`.

- **Encrypt** (after creating or editing `env.js`):  
  `./scripts/encrypt-env.sh`  
  Prompts for a passphrase, or set `ENV_ENCRYPT_KEY=yourpassphrase` to run non-interactively. Creates `env.js.enc` in the project root. Commit `env.js.enc`; keep the passphrase secret.

- **Decrypt** (for local run or before deploy):  
  `./scripts/decrypt-env.sh`  
  Prompts for the same passphrase (or use `ENV_ENCRYPT_KEY`). Produces `env.js` in the project root. Then run the app or upload `env.js` to your server as above.

- **Repo layout**: `env.js` stays in `.gitignore`; only `env.js.enc` is committed. New clones: run `decrypt-env.sh` with the shared passphrase to get `env.js`.

### Using env so it’s not shown to users

- **Not in the repo**: `env.js` is in `.gitignore`, so it never appears in the published source or in git history. Deploy it only to your server (or decrypt `env.js.enc` there) so the repo stays clean.

- **Not in the page source**: The app loads env via a separate request (fetch), not as inline script in the HTML, so the values don’t appear in “View page source”.

- **What visitors can still see**: When someone opens your site, the browser loads the env file so the app can connect to Firebase. In DevTools → Network or Sources they can see that request and its response. That’s normal: **Firebase client config (apiKey, projectId, etc.) is meant to be public**. Security is enforced by Firebase (Authorized domains, Firestore/Auth rules), not by hiding the config.

- **Optional – less obvious path**: To avoid a filename that looks like “env”, use a different path. Put your config in e.g. `config/app.js` and point the loader at it. On the **home page** set `data-env-path="config/app.js"` on the env-loader script; on **pages/** use `data-env-path="../config/app.js"`. Upload that file to your server as `config/app.js`. Add `config/app.js` (or the whole `config/` folder) to `.gitignore` if you don’t want it in the repo. The file is still loaded by the browser, but its name isn’t obviously “env”.

- **Real secrets**: Don’t put server API keys or private keys in env.js. Use a backend (e.g. Cloud Functions) for anything that must stay secret; the front end should only get Firebase client config and, if needed, short-lived tokens from your backend.

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

5. **“Insufficient permissions” or “Missing or insufficient permissions”**  
   This usually means **Firestore security rules** are blocking the app from creating or reading your user profile after Google sign-in. In [Firebase Console](https://console.firebase.google.com) → **Firestore Database** → **Rules**, add rules that allow authenticated users to read/write their own data. See **`firestore.rules.example`** in the repo for a ready-to-paste rules file (copy into the Rules editor and click **Publish**).

6. **Console errors**  
   Open DevTools (F12) → **Console**. Firebase and `firebase-config.js` log errors (e.g. missing config, `auth/unauthorized-domain`). Fix any reported issues.

7. **Other console messages**  
   A **404 for `rul?tid=G-...`** or **“Blocked a frame with origin … doubleclick.net”** usually comes from Hostinger-injected tracking or a browser extension (e.g. `content.js`), not from this app. You can ignore them or disable the host’s analytics/extensions if you want a clean console. **env.js** is loaded via `env-loader.js` so a missing `env.js` (e.g. on production) does not cause a script 404.

## Project structure (main pieces)

```
mun-tracker/
├── index.html               # Home: conference list, search, filters, tabs
├── env.example.js           # Example env (Firebase keys)
├── env.js.enc               # Optional: encrypted env.js (decrypt with scripts/decrypt-env.sh)
├── firestore.rules.example  # Firestore security rules (copy to Firebase Console if Google sign-in shows "insufficient permissions")
├── scripts/
│   ├── encrypt-env.sh       # Encrypt env.js → env.js.enc (passphrase)
│   ├── decrypt-env.sh       # Decrypt env.js.enc → env.js (passphrase)
│   └── setup-database.sql   # One-shot DB setup: creates seamuns_db + tables + sample data
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
└── api/                     # Optional PHP backend (conferences, feedback)
    ├── database.example.php  # Copy to database.php and set DB credentials (database.php is gitignored)
    ├── conferences.php     # Conferences CRUD API
    └── feedback.php        # Feedback/reviews API
```

### Using the backend

The repo includes an **optional PHP + MySQL backend** in `api/`. The app currently runs without it (conferences from `js/conferences-data.js`, auth/attendance from Firebase). Use the backend if you want to store conferences or feedback in your own database and keep credentials on the server.

**1. Prerequisites**

- PHP (e.g. 7.4+) with PDO MySQL
- MySQL or MariaDB
- Web server (Apache/Nginx) that runs PHP

**2. Database setup**

- **Option A – one-shot setup (recommended):**  
  Run the setup script as a user that can create databases (e.g. `root`):  
  `mysql -u root -p < scripts/setup-database.sql`  
  This creates the database `seamuns_db`, all tables, and sample data (MUN07 IV). For a clean reset, run `DROP DATABASE seamuns_db;` first.

- **Option B – manual:**  
  Create the database and a MySQL user, then import the schema:  
  `mysql -u your_user -p seamuns_db < database-schema.sql`

- Copy **`api/database.example.php`** to **`api/database.php`** and set your credentials there (`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`). `api/database.php` is gitignored so real credentials are not committed.

**3. Deploy**

- Upload the whole project (including `api/`) to a host that supports PHP and MySQL (e.g. Hostinger, shared hosting). Ensure the document root serves your `index.html` and that `api/*.php` are reachable at e.g. `https://yoursite.com/api/conferences.php`.

**4. API endpoints**

- **Conferences**: `GET/POST/PUT/DELETE api/conferences.php`  
  - `GET api/conferences.php` – list all; `GET api/conferences.php?id=1` – one by id.
- **Feedback**: `GET/POST/PUT/DELETE api/feedback.php`  
  - Query params: `conference_id`, `user_id` for GET.

CORS is set to `*` in the PHP files so the front end can call the API from your domain. For production you may want to restrict `Access-Control-Allow-Origin` to your site.

**5. Using the backend from the front end**

- From JavaScript, call the API with `fetch()`:
  - `fetch('/api/conferences.php')` or `fetch('https://yoursite.com/api/conferences.php')` for conferences.
  - Send JSON with `Content-Type: application/json` for POST/PUT.
- The app does **not** use this API by default; conference data comes from `js/conferences-data.js`. To switch to the backend you’d change the app to load conferences from the API instead of the static file (and optionally keep Firebase for auth).

**6. Keeping secrets**

- **Database credentials** stay in `api/database.php` on the server. The repo provides `api/database.example.php`; `api/database.php` is in `.gitignore` so you don’t commit real credentials.
- **Firebase**: keep using `env.js` (or encrypted `env.js.enc`) for client-side Firebase config. For server-only secrets (e.g. a server API key), use environment variables or a config file that is only on the server and never sent to the browser.

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

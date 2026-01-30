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
- **MUN Simulation Game**: link to [munsimulation.seamuns.site](https://munsimulation.seamuns.site) (single-player MUN procedure simulator)

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
- **Sample data**: 7 pre-loaded conferences (MUN07 IV, STAMUN XI, THAIMUN XIII, TSIMUN 2026, KMIDSMUN II, HISMUN VI, Newton MUN I)
- **Add conference**: Via Add Conference flow when available

## Getting started

### Prerequisites
- Modern browser (Chrome, Firefox, Safari, Edge)
- For auth: Firebase project; copy `env.example.js` to `env.js` and add your config (keep `env.js` out of version control)

### Run locally
1. Clone or download the project.
2. (Optional) Copy `env.example.js` to `env.js` and add Firebase credentials.
3. Open `index.html` in a browser or serve the folder with any static server.

No build step required.

## Project structure (main pieces)

```
mun-tracker/
├── index.html              # Home: conference list, search, filters, tabs
├── conference-template.html # Conference detail page
├── profile.html             # My Profile (attending / attended)
├── add-conference.html      # Add conference
├── script.js                # Conference list, filters, tabs, sample data
├── conference-detail.js     # Conference detail page logic
├── profile.js               # Profile page logic
├── firebase-config.js       # Firebase init (uses env.js)
├── styles.css               # Global styles, themes, layout
├── theme-init.js            # Theme (dark/light + colour) persistence
├── logo.png
├── env.example.js           # Example env (Firebase keys)
├── README.md
├── Conferences:             index, prospective-muns, how-to-host
├── Schools:                 participating-schools, become-participating-school, advisor-guide
├── Delegates & Chairs:      delegate-signup, individual-delegates, chair-guide, chair-superlatives,
│                            mun-guide, how-to-prep, stand-out, confidence, support
├── Resources:               points, motions, committees, conduct, speeches, resolutions,
│                            crisis, ga, position-papers, examples, awards, templates
├── About:                   about.html
└── api/                     # Optional PHP/backend (e.g. feedback, conferences)
```

## Usage

- **Browse conferences**: Use tabs (All / Upcoming / Previous / Attending / Attended), search, and filters.
- **Conference details**: Click **View Details** on a card.
- **Attendance**: On the detail page, use **Mark as Attending** or **Mark as Attended** (when logged in).
- **Profile**: Open **My Profile** to see your attending/attended conferences.
- **Theme**: Use the moon icon for dark mode and the colour swatches for accent theme.
- **MUN Simulation**: Use the **MUN Simulation** nav link to open [munsimulation.seamuns.site](https://munsimulation.seamuns.site).

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

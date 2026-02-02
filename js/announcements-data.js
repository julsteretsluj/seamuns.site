/**
 * Announcements list. Add new items with date (YYYY-MM-DD) — they are sorted newest first.
 * Update this file daily (or whenever you add an announcement) and set date to today.
 */
window.SEAMUNS_ANNOUNCEMENTS = [
    {
        date: '2026-01-29',
        icon: 'fas fa-bullhorn',
        title: 'Announcements page',
        body: 'A dedicated page for product updates and new features. You’re reading it now.'
    },
    {
        date: '2026-01-29',
        icon: 'fab fa-discord',
        title: 'Discord server link',
        body: 'Join the community on Discord. Find the link on <a href="about.html">About & Contact</a>.'
    },
    {
        date: '2026-01-28',
        icon: 'fas fa-archive',
        title: 'Archive — shared reference library',
        body: 'Browse and share MUN work: position papers, chair reports, slides (ceremony or crisis), speeches, and prep documents. Filter by category; logged-in users can upload. Data is shared for everyone via Firebase.',
        linkText: 'Go to Archive →',
        linkHref: 'archive.html'
    },
    {
        date: '2026-01-28',
        icon: 'fas fa-columns',
        title: 'Layout and space use',
        body: 'Content sections now use the full container width so grids and cards show multiple columns on wide screens. Conference detail and slideshow areas are wider; no more single narrow column.'
    },
    {
        date: '2026-01-27',
        icon: 'fas fa-user',
        title: 'Profile: attending, attended, awards',
        body: 'My Profile shows your attending and attended conferences, stats, and awards. Add awards by conference and committee; optional pronouns and profile picture when logged in with Firebase.',
        linkText: 'My Profile →',
        linkHref: 'profile.html'
    },
    {
        date: '2026-01-27',
        icon: 'fas fa-sign-in-alt',
        title: 'Google sign-in and auth',
        body: 'Login and Sign up (email or Google) work on all pages, including the profile page. Attendance and profile data sync when you’re logged in.'
    },
    {
        date: '2026-01-26',
        icon: 'fas fa-gamepad',
        title: 'MUN Simulation Game',
        body: 'Single-player MUN procedure simulator. Practice points, motions, and flow. Linked from the nav and from <a href="about.html">About & Contact</a>.',
        linkText: 'Open MUN Simulation →',
        linkHref: '../munsimulation/',
        external: true
    },
    {
        date: '2026-01-26',
        icon: 'fas fa-list',
        title: 'Conference listing: tabs, search, filters',
        body: 'Tabs for All · Upcoming · Previous · Attending · Attended. Search by name, organisation, or location. Filter by status, location, and committee (multi-select). Stats for upcoming, previous, and total.',
        linkText: 'Conferences →',
        linkHref: '../index.html'
    },
    {
        date: '2026-01-25',
        icon: 'fas fa-palette',
        title: 'Theme: dark mode and 9 accent colours',
        body: 'Toggle dark/light mode and choose from red, orange, yellow, green, blue, purple, pink, grey, or mono. Preference is saved.'
    },
    {
        date: '2026-01-25',
        icon: 'fas fa-graduation-cap',
        title: 'Participating Schools',
        body: 'Data-driven list of schools from conference data. See <a href="participating-schools.html">Participating Schools</a>.'
    },
    {
        date: '2026-01-24',
        icon: 'fas fa-book',
        title: 'Resources and guides',
        body: 'Points, Motions, Committees, Conduct, Speeches, Resolutions, Crisis, GA, Position Papers, Chair Superlatives, Examples, Awards, Templates, and Archive — all linked from the Resources menu.'
    }
];

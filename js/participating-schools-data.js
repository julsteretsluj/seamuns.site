/**
 * Participating schools for SEAMUNs (profile selector + participating-schools page).
 * Primary source: unique `organization` values from `window.MUN_CONFERENCES_DATA`,
 * excluding Brighton hosts and the non-campus org "SEAMUN".
 * Requires `conferences-data.js` loaded before this file (or load order fixed + refresh hook).
 */
window.MUN_PARTICIPATING_SCHOOLS = [
    'Harrow International School Bangkok',
    'King Mongkut\'s International Demonstration School',
    'Lycée Français International de Bangkok (LFIB)',
    'Newton Sixth Form',
    'Ruamrudee International School',
    'St Andrews International School, High School Campus',
    'St Andrews International School, Sukhumvit 107',
    'TSI Bearing Primary Campus'
];

/**
 * Rebuilds MUN_PARTICIPATING_SCHOOLS from listed conferences. Call after MUN_CONFERENCES_DATA is available.
 */
window.refreshParticipatingSchoolsFromConferences = function () {
    var conferences = window.MUN_CONFERENCES_DATA;
    if (!Array.isArray(conferences) || conferences.length === 0) return;
    var seen = {};
    var out = [];
    for (var i = 0; i < conferences.length; i++) {
        var c = conferences[i];
        var org = c && c.organization != null ? String(c.organization).trim() : '';
        if (!org) continue;
        if (/brighton/i.test(org)) continue;
        if (org === 'SEAMUN') continue;
        if (seen[org]) continue;
        seen[org] = true;
        out.push(org);
    }
    out.sort(function (a, b) {
        return a.localeCompare(b, undefined, { sensitivity: 'base' });
    });
    if (out.length) window.MUN_PARTICIPATING_SCHOOLS = out;
};

window.refreshParticipatingSchoolsFromConferences();

/** Generic higher-education categories for profile (no institution names). */
window.MUN_UNIVERSITIES_THAILAND = [
    'Bangkok metropolitan area (university or college student)',
    'Northern Thailand — university or college student',
    'Northeastern Thailand — university or college student',
    'Southern Thailand — university or college student',
    'Eastern or central Thailand — university or college student',
    'International or English-medium higher education in Thailand',
    'Thai public university or college',
    'Thai private university or college',
    'Vocational or technical college',
    'Online or hybrid study (based in Thailand)',
    'Other higher education (add details in notes if you wish)'
];

/**
 * Renders announcements from SEAMUNS_ANNOUNCEMENTS (newest first) and sets "Last updated" to today.
 * Run after DOM is ready and after announcements-data.js is loaded.
 */
(function () {
    function formatDisplayDate(isoDate) {
        var d = new Date(isoDate + 'T12:00:00');
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    function setLastUpdated() {
        var el = document.getElementById('announcementsLastUpdated');
        if (el) {
            el.textContent = formatDisplayDate(new Date().toISOString().slice(0, 10));
        }
    }

    function renderAnnouncements() {
        var list = document.getElementById('announcementsList');
        if (!list || typeof window.SEAMUNS_ANNOUNCEMENTS === 'undefined') return;

        var items = window.SEAMUNS_ANNOUNCEMENTS.slice().sort(function (a, b) {
            return b.date.localeCompare(a.date);
        });

        list.innerHTML = items.map(function (item) {
            var link = '';
            if (item.linkText && item.linkHref) {
                var target = item.external ? ' target="_blank" rel="noopener noreferrer"' : '';
                link = '<p style="margin: 0; margin-top: 8px;"><a href="' + item.linkHref + '"' + target + '>' + item.linkText + '</a></p>';
            }
            return (
                '<article class="info-card" style="margin-bottom: 24px;">' +
                '<p style="margin: 0 0 8px 0; font-size: 0.85rem; color: var(--text-tertiary);">Posted: ' + formatDisplayDate(item.date) + '</p>' +
                '<h3 style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">' +
                '<i class="' + item.icon + '" style="color: var(--accent-color);"></i>' +
                item.title +
                '</h3>' +
                '<p style="margin: 0; color: var(--text-secondary);">' + item.body + '</p>' +
                link +
                '</article>'
            );
        }).join('');
    }

    function init() {
        setLastUpdated();
        renderAnnouncements();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

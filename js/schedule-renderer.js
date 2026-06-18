/**
 * Parses conference schedule HTML and renders a visual timeline.
 */
(function (global) {
    'use strict';

    function escapeHtml(text) {
        if (text == null) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    var KIND_ICONS = {
        break: 'fa-mug-hot',
        ceremony: 'fa-flag',
        committee: 'fa-gavel',
        logistics: 'fa-door-open',
        misc: 'fa-circle'
    };

    function classifyEvent(title) {
        var t = (title || '').toLowerCase();
        if (/\b(break|lunch|snack|meal|coffee|transition)\b/.test(t)) return 'break';
        if (/\b(opening|closing|ceremony|goodbye)\b/.test(t)) return 'ceremony';
        if (/\b(committee|session|debate|voting|resolution|icebreaker)\b/.test(t)) return 'committee';
        if (/\b(arrival|registration|departure|delegate|photo|end of)\b/.test(t)) return 'logistics';
        return 'misc';
    }

    function splitTitleMeta(ev) {
        var raw = ev.raw;
        var title = raw;
        var purpose = '';
        var meta = '';

        var locParts = raw.split(/\s*[—\-–]\s*/);
        if (locParts.length >= 2) {
            raw = locParts[0].trim();
            meta = locParts.slice(1).join(' — ');
        }

        var purposeMatch = raw.match(/^(.+?)\s*(\([^)]+\))\s*$/);
        if (purposeMatch) {
            title = purposeMatch[1].trim();
            purpose = purposeMatch[2].trim();
        } else {
            title = raw.trim();
        }

        return {
            start: ev.start,
            end: ev.end || '',
            title: title,
            purpose: purpose,
            meta: meta,
            kind: classifyEvent(title)
        };
    }

    function parseEventLine(text) {
        text = (text || '').trim().replace(/\s+/g, ' ');
        if (!text) return null;

        var rangeRe = /^(\d{1,2}:\d{2}(?:\s*[ap]\.?m\.?)?)\s*[–\-—]\s*(\d{1,2}:\d{2}(?:\s*[ap]\.?m\.?)?)\s*[—\-–]\s*(.+)$/i;
        var m = text.match(rangeRe);
        if (m) return splitTitleMeta({ start: m[1], end: m[2], raw: m[3] });

        var singleRe = /^(\d{1,2}:\d{2}(?:\s*[ap]\.?m\.?)?)\s*[—\-–]\s*(.+)$/i;
        m = text.match(singleRe);
        if (m) return splitTitleMeta({ start: m[1], end: '', raw: m[2] });

        var spaceRe = /^(\d{1,2}:\d{2})\s+(.+)$/i;
        m = text.match(spaceRe);
        if (m) return splitTitleMeta({ start: m[1], end: '', raw: m[2] });

        return { start: '', end: '', title: text, purpose: '', meta: '', kind: classifyEvent(text) };
    }

    function parseBulletParagraph(p) {
        var strong = p.querySelector('strong');
        var dayTitle = strong ? strong.textContent.replace(/:$/, '').trim() : 'Schedule';
        var body = p.textContent.trim();
        if (strong) {
            body = body.replace(strong.textContent, '').replace(/^[:\s]+/, '');
        }
        var parts = body.split(/\s*·\s*|\s*•\s*/).map(function (s) { return s.trim(); }).filter(Boolean);
        var events = [];
        parts.forEach(function (part) {
            var ev = parseEventLine(part);
            if (ev) events.push(ev);
        });
        return { title: dayTitle, events: events };
    }

    function parseListItems(ul) {
        return Array.from(ul.querySelectorAll('li')).map(function (li) {
            return parseEventLine(li.textContent);
        }).filter(Boolean);
    }

    function isDayHeaderText(text) {
        var t = (text || '').trim();
        if (/^\d{1,2}\s*[–\-—]\s*\d{1,2}/.test(t)) return false;
        return /^(day\s*\d+)/i.test(t) || /^(january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(t);
    }

    function parseDetailsGroup(detailsEl) {
        var summary = detailsEl.querySelector('summary');
        var title = summary ? summary.textContent.trim() : 'Group';
        var days = [];
        detailsEl.querySelectorAll('p').forEach(function (p) {
            var parsed = parseBulletParagraph(p);
            if (parsed.events.length) days.push(parsed);
        });
        return { type: 'group', title: title, days: days };
    }

    function parseScheduleHtml(html) {
        var doc = new DOMParser().parseFromString('<div id="sched-root">' + html + '</div>', 'text/html');
        var root = doc.getElementById('sched-root');
        if (!root) return { overview: [], sections: [] };

        var overview = [];
        var sections = [];
        var pendingDayTitle = null;

        function flushPendingList(ul) {
            var events = parseListItems(ul);
            if (!events.length) return;
            sections.push({
                type: 'day',
                title: pendingDayTitle || 'Schedule',
                events: events
            });
            pendingDayTitle = null;
        }

        Array.from(root.children).forEach(function (node) {
            var tag = node.tagName ? node.tagName.toLowerCase() : '';
            if (tag === 'details') {
                pendingDayTitle = null;
                sections.push(parseDetailsGroup(node));
            } else if (tag === 'p') {
                var strong = node.querySelector('strong');
                var hasBullets = /[·•]/.test(node.textContent);
                if (strong && hasBullets && /day\s*\d+/i.test(strong.textContent)) {
                    pendingDayTitle = null;
                    var dayParsed = parseBulletParagraph(node);
                    if (dayParsed.events.length) {
                        sections.push({ type: 'day', title: dayParsed.title, events: dayParsed.events });
                    }
                } else if (strong && isDayHeaderText(strong.textContent) && !hasBullets) {
                    var restAfterStrong = node.textContent.replace(strong.textContent, '').trim();
                    if (restAfterStrong.length > 20) {
                        overview.push(node.textContent.trim());
                        pendingDayTitle = null;
                    } else {
                        pendingDayTitle = node.textContent.trim();
                    }
                } else {
                    overview.push(node.textContent.trim());
                    pendingDayTitle = null;
                }
            } else if (tag === 'ul') {
                flushPendingList(node);
            }
        });

        return { overview: overview, sections: sections };
    }

    function extractActivityChips(text) {
        var chips = [];
        var lower = text.toLowerCase();
        var map = [
            ['Opening Ceremony', /\bopening\b/],
            ['Committee Sessions', /\bcommittee\b/],
            ['Closing Ceremony', /\bclosing\b/],
            ['Full Day', /\bfull\s*day\b/],
            ['Two Days', /\btwo-?day\b/],
            ['Three Days', /\bthree-?day\b/]
        ];
        map.forEach(function (pair) {
            if (pair[1].test(lower)) chips.push(pair[0]);
        });
        if (!chips.length && text.length > 10) {
            text.split(/[,\-–—]/).forEach(function (part) {
                part = part.trim();
                if (part.length > 3 && part.length < 48) chips.push(part);
            });
        }
        return chips.slice(0, 6);
    }

    function formatTimeRange(ev) {
        if (ev.start && ev.end) return escapeHtml(ev.start) + '–' + escapeHtml(ev.end);
        if (ev.start) return escapeHtml(ev.start);
        return '';
    }

    function renderEvent(ev, isLast) {
        var icon = KIND_ICONS[ev.kind] || KIND_ICONS.misc;
        var timeHtml = formatTimeRange(ev);
        var purposeHtml = ev.purpose
            ? '<span class="schedule-event__purpose">' + escapeHtml(ev.purpose) + '</span>'
            : '';
        var metaHtml = ev.meta
            ? '<span class="schedule-event__meta">' + escapeHtml(ev.meta) + '</span>'
            : '';
        var lastClass = isLast ? ' schedule-event--last' : '';

        return (
            '<div class="schedule-event schedule-event--' + ev.kind + lastClass + '">' +
                '<div class="schedule-event__time-col">' +
                    (timeHtml ? '<time class="schedule-event__time">' + timeHtml + '</time>' : '') +
                '</div>' +
                '<div class="schedule-event__track" aria-hidden="true">' +
                    '<span class="schedule-event__dot"></span>' +
                    '<span class="schedule-event__line"></span>' +
                '</div>' +
                '<div class="schedule-event__card">' +
                    '<i class="fas ' + icon + ' schedule-event__icon" aria-hidden="true"></i>' +
                    '<div class="schedule-event__body">' +
                        '<span class="schedule-event__title">' + escapeHtml(ev.title) + '</span>' +
                        purposeHtml +
                        metaHtml +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    }

    function renderTimeline(events) {
        if (!events || !events.length) return '';
        var html = '<div class="schedule-timeline" role="list">';
        events.forEach(function (ev, i) {
            html += renderEvent(ev, i === events.length - 1);
        });
        html += '</div>';
        return html;
    }

    function renderOverview(overviewLines) {
        if (!overviewLines.length) return '';
        var html = '<div class="schedule-intro">';
        overviewLines.forEach(function (line) {
            var chips = extractActivityChips(line);
            html += '<p class="schedule-intro__text">' + escapeHtml(line) + '</p>';
            if (chips.length) {
                html += '<div class="schedule-intro__chips">';
                chips.forEach(function (chip) {
                    html += '<span class="schedule-chip">' + escapeHtml(chip) + '</span>';
                });
                html += '</div>';
            }
        });
        html += '</div>';
        return html;
    }

    function hasTimelineContent(sections) {
        return sections.some(function (s) {
            if (s.type === 'day') return s.events && s.events.length > 0;
            if (s.type === 'group') {
                return s.days && s.days.some(function (d) { return d.events.length > 0; });
            }
            return false;
        });
    }

    global.renderScheduleVisual = function (html, linkifyFn) {
        if (!html || typeof html !== 'string') return '';

        var parsed = parseScheduleHtml(html);
        if (!hasTimelineContent(parsed.sections)) {
            if (parsed.overview.length) {
                var summaryOnly = '<div class="schedule-visual schedule-visual--summary">' + renderOverview(parsed.overview) + '</div>';

                return typeof linkifyFn === 'function' ? linkifyFn(summaryOnly) : summaryOnly;
            }
            return '';
        }

        var out = '<div class="schedule-visual">';
        out += renderOverview(parsed.overview);

        parsed.sections.forEach(function (section) {
            if (section.type === 'day') {
                out += '<section class="schedule-day">' +
                    '<h4 class="schedule-day__title">' + escapeHtml(section.title) + '</h4>' +
                    renderTimeline(section.events) +
                    '</section>';
            } else if (section.type === 'group') {
                var daysHtml = section.days.map(function (day) {
                    return '<section class="schedule-day schedule-day--nested">' +
                        '<h5 class="schedule-day__title schedule-day__title--sub">' + escapeHtml(day.title) + '</h5>' +
                        renderTimeline(day.events) +
                        '</section>';
                }).join('');
                out += '<details class="schedule-group">' +
                    '<summary class="schedule-group__summary">' +
                    '<i class="fas fa-layer-group schedule-group__icon" aria-hidden="true"></i>' +
                    '<span>' + escapeHtml(section.title) + '</span>' +
                    '</summary>' +
                    '<div class="schedule-group__body">' + daysHtml + '</div>' +
                    '</details>';
            }
        });

        out += '</div>';

        if (typeof linkifyFn === 'function') {
            out = linkifyFn(out);
        }
        return out;
    };
})(typeof window !== 'undefined' ? window : this);

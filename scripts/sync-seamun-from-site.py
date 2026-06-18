#!/usr/bin/env python3
"""Sync SEAMUN I 2027 (conference id 8) from seamun.com committee & schedule data."""
import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COMMITTEE_DATA_URL = 'https://seamun.com/scripts/committee-data.js'

ESL = {'unhrc'}

VENUE_LINK = 'https://dprep.ac.th/secondary-campus/'
SCHEDULE_URL = 'https://seamun.com/scripts/schedule-data.js'

VENUE_NAME = 'D-PREP International School Secondary Campus'

ORDER = [
    ('ecosoc', 'ECOSOC', 'ECOSOC (Economic and Social Council)'),
    ('press', 'Press Corps', 'Press Corps'),
    ('unhrc', 'UNHRC', 'UNHRC (United Nations Human Rights Council)'),
    ('unodc', 'UNODC', 'UNODC (United Nations Office on Drugs and Crime)'),
    ('unsc', 'UNSC', 'UNSC (CRISIS)'),
    ('unwomen', 'UN Women', 'UN Women (United Nations Entity for Gender Equality and the Empowerment of Women)'),
    ('disec', 'DISEC', 'DISEC (Disarmament and International Security Committee)'),
    ('fwc', 'FWC', 'FWC (CRISIS) — Fantasy World Committee'),
    ('interpol', 'Interpol', 'Interpol (International Criminal Police Organization)'),
    ('who', 'WHO', 'WHO (World Health Organization)'),
]

DIFFICULTY = {
    'ecosoc': 'beginner',
    'press': 'beginner',
    'unhrc': 'intermediate',
    'unodc': 'intermediate',
    'unsc': 'intermediate',
    'unwomen': 'intermediate',
    'disec': 'advanced',
    'fwc': 'advanced',
    'interpol': 'advanced',
    'who': 'advanced',
}

GRADE = {
    'ecosoc': ('7–12 (Year 8–13)', None),
    'press': ('7–12 (Year 8–13)', None),
    'unhrc': ('9–12 (Year 10–13)', 'mature topics'),
    'unodc': ('9–12 (Year 10–13)', 'mature topics'),
    'unsc': ('7–12 (Year 8–13)', None),
    'unwomen': ('9–12 (Year 10–13)', 'mature topics'),
    'disec': ('7–12 (Year 8–13)', None),
    'fwc': ('9–12 (Year 10–13)', None),
    'interpol': ('9–12 (Year 10–13)', None),
    'who': ('9–12 (Year 10–13)', 'mature topics'),
}


def fetch(url: str) -> str:
    with urllib.request.urlopen(url, timeout=30) as resp:
        return resp.read().decode('utf-8')


def extract_js_object(text: str, marker: str) -> dict:
    idx = text.index(marker)
    start = text.index('{', idx)
    depth = 0
    for i in range(start, len(text)):
        if text[i] == '{':
            depth += 1
        elif text[i] == '}':
            depth -= 1
            if depth == 0:
                blob = text[start:i + 1]
                try:
                    return json.loads(blob)
                except json.JSONDecodeError:
                    fixed = re.sub(r'([{,]\s*)([A-Za-z_][\w]*)\s*:', r'\1"\2":', blob)
                    return json.loads(fixed)
    raise ValueError(f'Could not parse object for {marker}')


def schedule_item_line(item: dict) -> str:
    t = item['time']
    act = item['activity']
    purpose = ''
    m = re.match(r'^(.+?)\s*[—\-]\s*(Motion Focused|Resolution Writing|Voting Procedures|Motions & Resolution Writing)$', act, re.I)
    if m:
        act = m.group(1).strip()
        purpose = m.group(2).strip().lower()
        if 'motion' in purpose:
            purpose = '(motion-focused)'
        elif 'resolution writing' in purpose and 'motions' in purpose:
            purpose = '(motions & resolution writing)'
        elif 'resolution writing' in purpose:
            purpose = '(resolution writing)'
        elif 'voting' in purpose:
            purpose = '(voting procedures)'
    label = f'{t} {act}'
    if purpose:
        label += f' {purpose}'
    return label


def build_schedule_html(schedule: dict) -> str:
    intro = (
        '<p><strong>16–17 January 2027</strong> — two-day conference at '
        f'<a href="{VENUE_LINK}" target="_blank" rel="noopener noreferrer">{VENUE_NAME}</a> '
        '(Bang Phli, Samut Prakan). Committees run on staggered lunch groups (see your committee).</p>'
    )
    parts = [intro]
    for key in ('group1', 'group2', 'group3'):
        g = schedule[key]
        committees = ', '.join(g['committees'])
        parts.append(
            f'<details style="margin: 0.75rem 0;"><summary><strong>{g["label"]}</strong> — {committees}</summary>'
        )
        for day in g['days']:
            lines = ' · '.join(schedule_item_line(it) for it in day['items'])
            parts.append(f'<p><strong>{day["title"].split("—")[0].strip()}:</strong> {lines}</p>')
        parts.append('</details>')
    return '\n'.join(parts)


def build_committee_line(display: str, topics: list, esl: bool) -> str:
    topic_str = ' | '.join(
        t['text'] if t['text'].startswith('The Question') else f'The Question of {t["text"]}'
        for t in topics
    )
    base = display.split(' (')[0].strip() if esl and '(ESL)' not in display else display
    if esl and '(ESL)' not in base:
        if ' (' in display:
            base = display.split(' (')[0].strip() + ' (ESL) (' + display.split(' (', 1)[1]
        else:
            base = display + ' (ESL)'
    return f'{base} - {topic_str}'


def main():
    committee_data = extract_js_object(fetch(COMMITTEE_DATA_URL), 'SEAMUNCommitteeData')
    try:
        schedule = load_schedule()
    except Exception:
        schedule = {
            'group1': {
                'label': 'Group 1',
                'committees': ['UNHRC', 'DISEC', 'Press Corps'],
                'days': [
                    {'title': 'Day 1 — Friday, January 16, 2027', 'items': [
                        {'time': '7:30', 'activity': 'Arrival & Registration'},
                        {'time': '8:30', 'activity': 'Opening Ceremony'},
                        {'time': '9:15', 'activity': 'Break & Photo Ops'},
                        {'time': '9:45', 'activity': 'Icebreakers'},
                        {'time': '10:00', 'activity': 'Committee Session 1 — Motion Focused'},
                        {'time': '11:00', 'activity': 'Lunch (Eat)'},
                        {'time': '11:30', 'activity': 'Lunch (Socialise)'},
                        {'time': '12:00', 'activity': 'Committee Session 2 — Resolution Writing'},
                        {'time': '14:30', 'activity': 'Break & Photo Ops — Resolutions Due'},
                        {'time': '15:00', 'activity': 'Committee Session 3 — Voting Procedures'},
                        {'time': '16:30', 'activity': 'Feedback Sessions & Delegate Departure'},
                        {'time': '17:00', 'activity': 'Chair + SMT Departure'},
                    ]},
                    {'title': 'Day 2 — Saturday, January 17, 2027', 'items': [
                        {'time': '7:30', 'activity': 'Arrival'},
                        {'time': '8:30', 'activity': 'Registration & Photo Ops'},
                        {'time': '9:00', 'activity': 'Committee Session 1 — Motion Focused'},
                        {'time': '10:00', 'activity': 'Break'},
                        {'time': '10:30', 'activity': 'Committee Session 2 — Motions & Resolution Writing'},
                        {'time': '12:00', 'activity': 'Lunch (Socialise)'},
                        {'time': '12:30', 'activity': 'Lunch (Eat)'},
                        {'time': '13:00', 'activity': 'Committee Session 3 — Resolution Writing'},
                        {'time': '14:30', 'activity': 'Break — Resolutions Due'},
                        {'time': '15:00', 'activity': 'Committee Session 4 — Voting Procedures'},
                        {'time': '16:00', 'activity': 'Feedback & Break'},
                        {'time': '16:30', 'activity': 'Closing Ceremony'},
                        {'time': '17:30', 'activity': 'Photo Ops & Chair + Delegate Departure'},
                        {'time': '18:00', 'activity': 'SMT Departure'},
                    ]},
                ],
            },
            'group2': {
                'label': 'Group 2',
                'committees': ['WHO', 'UN Women', 'UNSC'],
                'days': [
                    {'title': 'Day 1 — Friday, January 16, 2027', 'items': [
                        {'time': '7:30', 'activity': 'Arrival & Registration'},
                        {'time': '8:30', 'activity': 'Opening Ceremony'},
                        {'time': '9:15', 'activity': 'Break & Photo Ops'},
                        {'time': '9:45', 'activity': 'Icebreakers'},
                        {'time': '10:00', 'activity': 'Committee Session 1 — Motion Focused'},
                        {'time': '11:00', 'activity': 'Lunch (Socialise)'},
                        {'time': '11:30', 'activity': 'Lunch (Eat)'},
                        {'time': '12:30', 'activity': 'Committee Session 2 — Resolution Writing'},
                        {'time': '14:30', 'activity': 'Break & Photo Ops — Resolutions Due'},
                        {'time': '15:00', 'activity': 'Committee Session 3 — Voting Procedures'},
                        {'time': '16:30', 'activity': 'Feedback Sessions & Delegate Departure'},
                        {'time': '17:00', 'activity': 'Chair + SMT Departure'},
                    ]},
                    {'title': 'Day 2 — Saturday, January 17, 2027', 'items': [
                        {'time': '7:30', 'activity': 'Arrival'},
                        {'time': '8:30', 'activity': 'Registration & Photo Ops'},
                        {'time': '9:00', 'activity': 'Committee Session 1 — Motion Focused'},
                        {'time': '10:00', 'activity': 'Break'},
                        {'time': '10:30', 'activity': 'Committee Session 2 — Motions & Resolution Writing'},
                        {'time': '11:30', 'activity': 'Lunch (Eat)'},
                        {'time': '12:00', 'activity': 'Lunch (Socialise)'},
                        {'time': '12:30', 'activity': 'Committee Session 3 — Resolution Writing'},
                        {'time': '14:30', 'activity': 'Break — Resolutions Due'},
                        {'time': '15:00', 'activity': 'Committee Session 4 — Voting Procedures'},
                        {'time': '16:00', 'activity': 'Feedback & Break'},
                        {'time': '16:30', 'activity': 'Closing Ceremony'},
                        {'time': '17:30', 'activity': 'Photo Ops & Chair + Delegate Departure'},
                        {'time': '18:00', 'activity': 'SMT Departure'},
                    ]},
                ],
            },
            'group3': {
                'label': 'Group 3',
                'committees': ['ECOSOC', 'UNODC', 'Interpol', 'FWC'],
                'days': [
                    {'title': 'Day 1 — Friday, January 16, 2027', 'items': [
                        {'time': '7:30', 'activity': 'Arrival & Registration'},
                        {'time': '8:30', 'activity': 'Opening Ceremony'},
                        {'time': '9:15', 'activity': 'Break & Photo Ops'},
                        {'time': '9:45', 'activity': 'Icebreakers'},
                        {'time': '10:00', 'activity': 'Committee Session 1 — Motion Focused'},
                        {'time': '11:30', 'activity': 'Lunch (Socialise)'},
                        {'time': '12:00', 'activity': 'Lunch (Eat)'},
                        {'time': '13:00', 'activity': 'Committee Session 2 — Resolution Writing'},
                        {'time': '14:30', 'activity': 'Break & Photo Ops — Resolutions Due'},
                        {'time': '15:00', 'activity': 'Committee Session 3 — Voting Procedures'},
                        {'time': '16:30', 'activity': 'Feedback Sessions & Delegate Departure'},
                        {'time': '17:00', 'activity': 'Chair + SMT Departure'},
                    ]},
                    {'title': 'Day 2 — Saturday, January 17, 2027', 'items': [
                        {'time': '7:30', 'activity': 'Arrival'},
                        {'time': '8:30', 'activity': 'Registration & Photo Ops'},
                        {'time': '9:00', 'activity': 'Committee Session 1 — Motion Focused'},
                        {'time': '10:00', 'activity': 'Break'},
                        {'time': '10:30', 'activity': 'Committee Session 2 — Motions & Resolution Writing'},
                        {'time': '11:30', 'activity': 'Lunch (Socialise)'},
                        {'time': '12:00', 'activity': 'Lunch (Eat)'},
                        {'time': '12:30', 'activity': 'Committee Session 3 — Resolution Writing'},
                        {'time': '14:30', 'activity': 'Break — Resolutions Due'},
                        {'time': '15:00', 'activity': 'Committee Session 4 — Voting Procedures'},
                        {'time': '16:00', 'activity': 'Feedback & Break'},
                        {'time': '16:30', 'activity': 'Closing Ceremony'},
                        {'time': '17:30', 'activity': 'Photo Ops & Chair + Delegate Departure'},
                        {'time': '18:00', 'activity': 'SMT Departure'},
                    ]},
                ],
            },
        }

    committee_sizes = []
    committees = []
    allocations = []
    unique_topics = []
    committee_overrides = {}

    total_delegates = 0
    total_chairs = 0

    for key, abbrev, display in ORDER:
        data = committee_data[key]
        delegates = data['delegates']
        chairs = data['chairs']
        total_delegates += delegates
        total_chairs += chairs

        gr, gn = GRADE[key]
        entry = {
            'abbrev': abbrev,
            'chairLabel': 'Editors' if key == 'press' else 'Chairs',
            'chairs': chairs,
            'delegates': delegates,
            'total': chairs + delegates,
            'gradeRange': gr,
        }
        if gn:
            entry['gradeNote'] = gn
        if key == 'press':
            entry['participantLabel'] = 'Journalists'
        committee_sizes.append(entry)

        topics = data['topics']
        esl = key in ESL
        committees.append(build_committee_line(display, topics, esl))

        for t in topics:
            text = t['text']
            short = text.replace('The Question of ', '').strip()
            unique_topics.append(short)

        participant = 'journalists' if key == 'press' else 'delegates'
        allocations.append(
            f"{abbrev} ({delegates} {participant}): {', '.join(data['allocations'])}"
        )
        committee_overrides[abbrev] = {'difficulty': DIFFICULTY[key]}

    description = (
        'SEAMUN I 2027 — Policies with a Purpose. A student-led, non-profit Model UN conference '
        'focused on global healthcare and sustainability. Two days at D-PREP International School '
        'Secondary Campus (Samut Prakan) with 10 committees across UN bodies, Press Corps, and crisis '
        'formats (UNSC, FWC). 200 delegate positions and 20 chairs; 100% of surplus donated to TRCS.'
    )

    venue_guide = (
        f'<p>Hosted at <strong><a href="{VENUE_LINK}" target="_blank" rel="noopener noreferrer">'
        f'{VENUE_NAME}</a></strong> — 97/9 Moo 1, Bang Phli Yai, Bang Phli, Samut Prakan 10540 '
        f'(Bang Phli, Samut Prakan).</p>'
        '<p>Room assignments and arrival instructions will be shared with delegates closer to the conference. '
        'See <a href="https://seamun.com/contact" target="_blank" rel="noopener noreferrer">seamun.com/contact</a> '
        'for venue details.</p>'
        '<p><strong>Accessibility:</strong> Wheelchair accessible and sensory-friendly. A dedicated sensory room '
        'with fidget and regulation tools will be available; access is subject to your accommodation application form submission.</p>'
    )

    extra_notes = (
        '<p><strong>SEAMUN I 2027 — Policies with a Purpose.</strong> Student-led, non-profit Model UN conference '
        f'at <strong><a href="{VENUE_LINK}" target="_blank" rel="noopener noreferrer">{VENUE_NAME}</a></strong> '
        '(Bang Phli, Samut Prakan). Official site: <a href="https://seamun.com" target="_blank" rel="noopener noreferrer">seamun.com</a>.</p>'
        '<p><strong>Mission:</strong> Integrate the MUN circuit in a prestigious and inclusive manner. As a non-profit initiative, '
        'SEAMUN promotes professionalism, creativity, and collaboration through a sustainable, high-tech, and unbiased conference. '
        'All surplus is donated to <strong>TRCS</strong> (Thai Red Cross Society).</p>'
        '<p><strong>Grades:</strong> Open to ages 12–18 (Grades 7–12 / Years 8–13), with committee-specific grade ranges.</p>'
        '<p><strong>Fees:</strong> Delegate 2,500 THB · Chair 800 THB · Advisors &amp; media/photographers: free.</p>'
        f'<p><strong>Capacity:</strong> {total_delegates} delegates, {total_chairs} chairs, up to 60 staff (including student staff).</p>'
        '<p><strong>Academic:</strong> 10 committees. Crisis committees: <strong>UNSC</strong> and <strong>FWC (Fantasy World)</strong>. '
        'Position papers are <strong>required for awards eligibility</strong>. Digital note passing via the conference platform.</p>'
        '<p><strong>Contact:</strong> <a href="mailto:information@seamun.com">information@seamun.com</a> · '
        '<a href="https://www.instagram.com/seamun.th.conference/" target="_blank" rel="noopener noreferrer">@seamun.th.conference</a></p>'
        '<p><strong>Resources:</strong> <a href="rop-2027.html">Rules of Procedure (RoP)</a> · '
        '<a href="chair-guide.html">Chair Guide</a> · '
        '<a href="https://forms.gle/8UmzMFZP1gEhw9bs9" target="_blank" rel="noopener noreferrer">Chair application form</a>.</p>'
    )

    updates = {
        'location': 'D-PREP Secondary Campus, Samut Prakan, Thailand',
        'description': description,
        'size': f'{total_delegates + total_chairs}+ ({total_delegates} delegates, {total_chairs} chairs, up to 60 staff)',
        'committeeSizes': committee_sizes,
        'committeeOverrides': committee_overrides,
        'committees': committees,
        'uniqueTopics': unique_topics,
        'allocations': allocations,
        'schedule': build_schedule_html(schedule),
        'venueGuide': venue_guide,
        'extraNotes': extra_notes,
    }

    # Update JSON
    json_path = ROOT / 'data' / 'conferences.json'
    confs = json.loads(json_path.read_text(encoding='utf-8'))
    for i, c in enumerate(confs):
        if c.get('id') == 8:
            confs[i].update(updates)
            break
    else:
        raise SystemExit('Conference id 8 not found in conferences.json')
    json_path.write_text(json.dumps(confs, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')

    # Update JS — replace fields inside id: 8 block via JSON round-trip for complex fields
    js_path = ROOT / 'js' / 'conferences-data.js'
    js_text = js_path.read_text(encoding='utf-8')
    confs_js = json.loads(json_path.read_text(encoding='utf-8'))
    seamun = next(c for c in confs_js if c['id'] == 8)

    def js_str(s):
        return json.dumps(s, ensure_ascii=False)

    def js_array(arr):
        return '[\n' + ',\n'.join('        ' + js_str(x) for x in arr) + ',\n    ]'

    def js_committee_sizes(sizes):
        lines = ['    committeeSizes: [']
        for s in sizes:
            lines.append('        {')
            for k, v in s.items():
                lines.append(f'            {k}: {js_str(v)},')
            lines[-1] = lines[-1].rstrip(',')
            lines.append('        },')
        lines.append('    ],')
        return '\n'.join(lines)

    def js_overrides(ov):
        lines = ['    committeeOverrides: {']
        for k, v in ov.items():
            key = js_str(k) if ' ' in k else k
            if not k[0].isalpha() or ' ' in k:
                key = js_str(k)
            else:
                key = k if k.isidentifier() else js_str(k)
            lines.append(f'        {key}: {{ difficulty: {js_str(v["difficulty"])} }},')
        lines.append('    },')
        return '\n'.join(lines)

    desc_pat = re.compile(r'(id: 8,[\s\S]*?description: )(?:\"(?:\\.|[^\"])*\")', re.M)
    js_text = desc_pat.sub(r'\1' + js_str(updates['description']), js_text, count=1)

    js_text = re.sub(
        r'(id: 8,[\s\S]*?location: )(?:\"(?:\\.|[^\"])*\")',
        r'\1' + js_str(updates['location']),
        js_text,
        count=1,
    )
    js_text = re.sub(
        r'(id: 8,[\s\S]*?size: )(?:\"(?:\\.|[^\"])*\")',
        r'\1' + js_str(updates['size']),
        js_text,
        count=1,
    )

    # Replace large blocks between markers for id 8
    start = js_text.index('    committeeSizes: [', js_text.index('id: 8'))
    end = js_text.index('    forms: [', start)
    middle = (
        js_committee_sizes(seamun['committeeSizes']) + '\n'
        '    // RoP difficulty badges for SEAMUN I 2027 (from seamun.com)\n'
        + js_overrides(seamun['committeeOverrides']) + '\n'
        '    committees: ' + js_array(seamun['committees']).replace('\n    ]', '\n    ],') + '\n'
        '    uniqueTopics: ' + js_array(seamun['uniqueTopics']).replace('\n    ]', '\n    ],') + '\n'
        '    chairsPages: ' + js_str(seamun['chairsPages']) + ',\n'
        '    allocations: ' + js_array(seamun['allocations']).replace('\n    ]', '\n    ],') + '\n'
        '    forms: '
    )
    js_text = js_text[:start] + middle + js_text[end + len('    forms: '):]

    sched_start = js_text.index('    schedule: ', js_text.index('id: 8'))
    sched_end = js_text.index('    venueGuide: ', sched_start)
    js_text = js_text[:sched_start] + f'    schedule: {js_str(updates["schedule"])},\n' + js_text[sched_end:]

    venue_end = js_text.index('    extraNotes: ', sched_end)
    js_text = js_text[:sched_end] + f'    venueGuide: {js_str(updates["venueGuide"])},\n' + js_text[venue_end:]

    extra_anchor = '\n},\n{\n    id: 9,'
    extra_end = js_text.index(extra_anchor, js_text.index('id: 8'))
    js_text = (
        js_text[:venue_end]
        + f'    extraNotes: {js_str(updates["extraNotes"])}\n'
        + js_text[extra_end:]
    )

    js_path.write_text(js_text, encoding='utf-8')
    print(f'Synced SEAMUN I 2027: {len(committees)} committees, {total_delegates} delegates, {total_chairs} chairs')


if __name__ == '__main__':
    main()

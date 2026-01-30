-- Add STAMUN XI Conference
-- St Andrews International School MUN Conference

INSERT INTO conferences (
    conference_id,
    name,
    organization,
    location,
    country_code,
    start_date,
    end_date,
    description,
    website,
    registration_deadline,
    position_paper_deadline,
    status,
    size,
    general_email,
    mun_account,
    advisor_account,
    sec_gen_accounts,
    parliamentarian_accounts,
    price_per_delegate,
    independent_dels_welcome,
    independent_signup_link,
    advisor_signup_link,
    disabled_suitable,
    sensory_suitable,
    schedule,
    venue_guide,
    extra_notes
) VALUES (
    2,
    'STAMUN XI',
    'St Andrews International School, High School Campus',
    'Bangkok, Thailand',
    'TH',
    '2025-11-16',
    '2025-11-16',
    'The eleventh annual STAMUN conference at St Andrews International School High School Campus, featuring 5 diverse committees covering global issues from drone warfare to mental health.',
    NULL,
    NULL,
    NULL,
    'previous',
    '130 attendees',
    NULL,
    '@munstandrews',
    NULL,
    'Sarina Luthra',
    NULL,
    '600 THB',
    NULL,
    NULL,
    NULL,
    TRUE,
    FALSE,
    '<p><strong>November 16, 2025:</strong> 8:00 AM - 5:30 PM</p>',
    '<p>Conference held at St Andrews International School, High School Campus. Wheelchair accessible.</p>',
    '<p>Delegate fee: 600 THB. Follow us on Instagram: @munstandrews for updates. Secretary General: Sarina Luthra. <strong>Accessibility:</strong> Wheelchair accessible. Not sensory-friendly.</p>'
);

-- Insert committees for STAMUN XI
INSERT INTO committees (conference_id, name, topic, chair_info) VALUES
(2, 'DISEC', 'The Question of Regulating the Use of Drone Weaponry in Modern Warfare', 'Florence (@flo.walker.1), Dipayan (@dipayanbose911)'),
(2, 'WHO', 'The Question of Strengthening Global Mental Health Infrastructure Post-Pandemic', 'Meredith (@meredith.x31), Aashirya (@aashirya.2007)'),
(2, 'UNESCO', 'The Question of the Preservation of Cultural Heritage During Armed Conflicts', 'Agrim (@agrimdaga), Anishka (@ani.nn27)'),
(2, 'UNEP', 'The Question of Combating Ocean Plastic Pollution Through International Collaboration', 'Jazz (@jazz_atitcha), Fehmiya (@fehmiyaa)'),
(2, 'UNHRC', 'The Question of Safeguarding the rights of refugees in conflict zones', 'Rosalind (@roslyn.ry), Rosalind (@rosalind.m.p)');

-- Insert unique topics for STAMUN XI
INSERT INTO unique_topics (conference_id, topic) VALUES
(2, 'Drone Weaponry Regulation'),
(2, 'Global Mental Health Infrastructure'),
(2, 'Cultural Heritage Preservation'),
(2, 'Ocean Plastic Pollution'),
(2, 'Refugee Rights in Conflict Zones');

-- Insert allocations for STAMUN XI
INSERT INTO allocations (conference_id, country) VALUES
(2, 'United States of America'),
(2, 'United Kingdom'),
(2, 'India'),
(2, 'Thailand'),
(2, 'New Zealand');

-- Insert available awards for STAMUN XI
INSERT INTO available_awards (conference_id, award_name) VALUES
(2, 'Overall Best Delegate'),
(2, 'Overall Best Chair'),
(2, 'Committee Best Delegate'),
(2, 'Committee Honorable Mention'),
(2, 'Committee Best Position Paper');

-- Verify the insert
SELECT * FROM conferences WHERE conference_id = 2;
SELECT * FROM committees WHERE conference_id = 2;
SELECT * FROM allocations WHERE conference_id = 2;
SELECT * FROM available_awards WHERE conference_id = 2;


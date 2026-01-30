-- Add KMIDSMUN II Conference
-- King Mongkut's International Demonstration School MUN Conference

INSERT INTO conferences (
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
    extra_notes, 
    created_at
) VALUES (
    'KMIDSMUN II',
    'King Mongkut''s International Demonstration School',
    'KMIDS (King Mongkut''s International Demonstration School), Bangkok, Thailand',
    'TH',
    '2026-01-24',
    '2026-01-24',
    'The second annual KMIDSMUN conference at King Mongkut''s International Demonstration School, featuring diverse committees and welcoming independent delegates.',
    '',
    '2025-10-25',
    '',
    'previous',
    'TBD',
    'rattanapetmattheus@gmail.com',
    '@kmidsmun',
    'rattanapetmattheus@gmail.com',
    'Mattheus (rattanapetmattheus@gmail.com) (@sushi_inhaler), Olan (olan.sinsuriya@gmail.com) (@olanbonk)',
    'Peach (pidnapak.s@gmail.com) (@papoopi), Unna (sirikorn.kuna@gmail.com) (@unnii.k)',
    '800 THB',
    1,
    'https://forms.gle/vTdnjhx5PhfqkAh59',
    'https://docs.google.com/forms/d/e/1FAIpQLSdxL3s49nq-OjOyfj8QvXQv47SO1dEL1iVoYXsvxWuLl_T-FQ/viewform?fbclid=PAZnRzaANn8_lleHRuA2FlbQIxMQABpwjo4DVYbBSB_JNvacVk0o_xBTRXXGTi_Bme3U652v6O3JzYCepqYQKMxA-I_aem_Nf8AuCkQd1Cld2rNyzNLcA',
    1,
    1,
    '<p><strong>January 24, 2026:</strong> Full Day Conference - Opening Ceremony, Committee Sessions, Closing Ceremony</p>',
    '<p>Conference held at KMIDS (King Mongkut''s International Demonstration School). Wheelchair accessible and sensory-friendly.</p>',
    '<p>KMIDSMUN II - The second annual MUN conference at King Mongkut''s International Demonstration School. Delegate fee: 800 THB. Chair fee: Free. Registration deadline: October 25th, 2025. Independent delegates are welcome. <strong>Accessibility:</strong> Wheelchair accessible and sensory-friendly. Follow us on Instagram: @kmidsmun for updates. Secretary General: Mattheus (@sushi_inhaler). Deputy Secretary General: Olan (@olanbonk). Parliamentarians: Peach (@papoopi) and Unna (@unnii.k).</p>',
    NOW()
);

-- Get the conference ID for committee insertions
SET @conference_id = LAST_INSERT_ID();

-- Insert committees for KMIDSMUN II
INSERT INTO committees (conference_id, name, topic, chair_info) VALUES
(@conference_id, 'WHO', 'The Question of Global Regulation and Access to Gender-Affirming Surgery', 'Head chair: Dhanwaras (@erng._), Deputy chair: Karn (@karnmightbephotogenic)'),
(@conference_id, 'UNEP', 'The Question of the Conservation of Biodiversity and the Protection of Endangered Species', 'Head chair: Veda (@v3dx_2204), Deputy chair: Yama (@yama.leaung)'),
(@conference_id, 'UNHRC', 'The Question of Human Rights Violations Against LGBTQIA+ Individuals', 'Head chair: Mitra (@luzzysaur), Deputy chair: Mishty (@misht_yy_)'),
(@conference_id, 'DISEC', 'The Question of Preventing the Militarization of the Arctic', 'Head chair: Rosalind (@rosyln.ry), Deputy chair: Emily (@ememiiile)'),
(@conference_id, 'Press Corps', 'The Question of Ensuring the Safety of Journalists in the Practice of Journalism', 'Editor in chief: Pakamol (@noeynw_), Deputy editor in chief: Navan (@n4vvs__)'),
(@conference_id, 'SPECPOL', 'The Question of the Global Rise of Religious Nationalism', 'Head chair: Budh (@budhman1234), Deputy chair: Rawit/Louis (@larrymcchubby)'),
(@conference_id, 'ICJ', 'The Question of Allegations of Genocide Against the Rohingya People', 'Head chair: Celia (@thatburmesegal), Deputy chair: Maprang (@fishy_mp)');

-- Insert unique topics for KMIDSMUN II
-- Topics are already included in committee topics above

-- Insert available awards for KMIDSMUN II
INSERT INTO available_awards (conference_id, award_name) VALUES
(@conference_id, 'Best Chair'),
(@conference_id, 'Honorable Chair'),
(@conference_id, 'Best Delegate (per committee)'),
(@conference_id, 'Honorable Mention Delegate (per committee)');

-- Insert sample allocations (placeholder - contact conference for actual allocations)
-- Allocations not provided in the conference information

-- Display success message
SELECT 'KMIDSMUN II conference successfully added to database!' as message;

-- Add HISMUN VI Conference to Database
-- Run this script to add HISMUN VI to your MUN database

-- Insert the main conference
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
    'HISMUN VI',
    'Harrow International School Bangkok',
    'Harrow International School Bangkok',
    'TH',
    '2026-01-31',
    '2026-01-31',
    'The sixth annual HISMUN conference at Harrow International School Bangkok, featuring 6 diverse committees covering topics from ageing global population to AI regulation in outer space.',
    '',
    '2025-11-30',
    '',
    'upcoming',
    'TBD',
    '',
    '@his.mun',
    '',
    'Venice (@vncesque), Noa (@noa.ksit), Tracy (@traacyou)',
    'Kwankao (@kwankaochuaphanich), Emery (@ananas_antagonist), Bun (@bun_uthaisang)',
    '800 THB until Nov 30th then 1000 THB',
    0,
    '',
    '',
    1,
    0,
    '<p><strong>January 31, 2026:</strong> Full Day Conference - Opening Ceremony, Committee Sessions, Closing Ceremony</p>',
    '<p>Conference held at Harrow International School Bangkok. Wheelchair accessible.</p>',
    '<p>HISMUN VI conference featuring 6 dynamic committees with varying difficulty levels. Delegate fee: 800 THB until November 30th, then 1000 THB. Chair fee: Free. <strong>Position Papers:</strong> Position papers are mandatory to be eligible for awards. <strong>Accessibility:</strong> Wheelchair accessible. Not sensory-friendly. The UNEP committee will be present unless there are not enough delegates. Follow us on Instagram: @his.mun for updates. Secretary Generals: Venice (@vncesque), Noa (@noa.ksit), Tracy (@traacyou). Parliamentarians: Kwankao (@kwankaochuaphanich), Emery (@ananas_antagonist), Bun (@bun_uthaisang).</p>',
    NOW()
);

-- Get the conference ID for foreign key references
SET @hismun_id = LAST_INSERT_ID();

-- Insert committees for HISMUN VI
INSERT INTO committees (conference_id, name, topic, chair_info) VALUES
(@hismun_id, 'ECOSOC', 'The Question of Addressing the Economic and Social Impacts of an Ageing Global Population', 'Chairs: TBD'),
(@hismun_id, 'WHO', 'The Question of Addressing Barriers to Universal Vaccination in the Post-Pandemic Era', 'Chairs: TBD'),
(@hismun_id, 'UN WOMEN', 'The Question of the Welfare and Treatment of Women in Conflict or War Zones', 'Chairs: TBD'),
(@hismun_id, 'SPECPOL', 'The Question of Addressing the Regulation of Artificial Intelligence in Outer Space to Ensure Peaceful Exploration', 'Chairs: TBD'),
(@hismun_id, 'HSC', 'The Question of Addressing the Threat of Nuclear Proliferation and the Establishment of a Hotline Between the United States and the Soviet Union', 'Chairs: TBD'),
(@hismun_id, 'UNEP', 'The Question of Addressing Sustainable Solutions for How the International Community can Develop to Combat Water Scarcity in Arid Regions Through Innovation and International Cooperation', 'Chairs: TBD');

-- Insert unique topics for HISMUN VI
INSERT INTO unique_topics (conference_id, topic) VALUES
(@hismun_id, 'Economic and Social Impacts of Ageing Global Population'),
(@hismun_id, 'Barriers to Universal Vaccination in Post-Pandemic Era'),
(@hismun_id, 'Welfare and Treatment of Women in Conflict Zones'),
(@hismun_id, 'Regulation of Artificial Intelligence in Outer Space'),
(@hismun_id, 'Nuclear Proliferation and US-Soviet Hotline'),
(@hismun_id, 'Sustainable Solutions for Water Scarcity in Arid Regions');

-- Insert available awards for HISMUN VI
INSERT INTO available_awards (conference_id, award_name) VALUES
(@hismun_id, 'Best Chairs'),
(@hismun_id, 'Honourable Mention for Chairs'),
(@hismun_id, 'Overall Best Delegate'),
(@hismun_id, 'Best Delegate (per committee)'),
(@hismun_id, 'Honourable Mention (per committee)'),
(@hismun_id, 'Best Overall Position Paper');

-- Insert sample allocations (placeholder - contact conference for actual allocations)
INSERT INTO allocations (conference_id, country) VALUES
(@hismun_id, 'TBD - Contact conference for country assignments');

-- Display success message
SELECT 'HISMUN VI conference successfully added to database!' as message;


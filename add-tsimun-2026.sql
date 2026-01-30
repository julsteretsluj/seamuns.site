-- Add TSIMUN 2026 Conference
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
    'TSIMUN 2026',
    'TSI International School',
    'TSI Bearing Primary Campus, Bangkok, Thailand',
    'TH',
    '2026-01-31',
    '2026-01-31',
    'TSI International School''s first annual Model United Nations conference (TSIMUN I). Delegates will engage in diverse debates addressing critical global issues from protecting human health and the environment to advancing education and safeguarding human rights in times of conflict.',
    '',
    '',
    '',
    'upcoming',
    '150-200 attendees',
    'tsimun@tsi.ac.th',
    '@tsi.mun',
    'tsimun@tsi.ac.th',
    'Krishiv Savani – krishiv.sa.student@tsi.ac.th, Anishka Nag – anishka.na.student@tsi.ac.th',
    'Contact via tsimun@tsi.ac.th',
    '600 THB',
    1,
    'https://docs.google.com/forms/d/e/1FAIpQLSeBsQPcZNO8RWDy4hvZx9sXtmvyOj3ifUQxDMjjN6kp4PE_3Q/viewform?fbclid=PAZXh0bgNhZW0CMTEAAaenyvvpPRCi4dXjGXnKyM9cel4-T6-z54aNnc3VlBhzq3ljFkp4X4RytI_xFg_aem_IlhPMU9a7H5rFVeYctJgbg',
    'Contact via tsimun@tsi.ac.th',
    0,
    0,
    '<p><strong>January 31, 2026:</strong> Full Day Conference - Opening Ceremony, Committee Sessions, Closing Ceremony</p>',
    '<p>Conference held at TSI Bearing Primary Campus. Maps: https://maps.app.goo.gl/wP6S1sp1xcHtga3v9?g_st=ipc</p>',
    '<p>TSI International School''s inaugural MUN conference featuring 6 dynamic committees. Delegate fee: 600 THB. Chair fee: Free. All school delegations must be accompanied by a school advisor. Independent delegates should contact tsimun@tsi.ac.th. Middle school students are eligible to participate. Follow us on Instagram: @tsi.mun for updates.</p>',
    NOW()
);

-- Get the conference ID for committee insertions
SET @conference_id = LAST_INSERT_ID();

-- Add UNEP Committee
INSERT INTO committees (conference_id, name, topic, chair_info) VALUES (
    @conference_id,
    'UNEP',
    'The Question of Addressing the Impact of Waste on Human Health and the Environment',
    'Chairs: TBD'
);

-- Add ECOSOC Committee
INSERT INTO committees (conference_id, name, topic, chair_info) VALUES (
    @conference_id,
    'ECOSOC',
    'The Question of Promoting Equal Access to Quality Education Worldwide',
    'Chairs: TBD'
);

-- Add WHO Committee
INSERT INTO committees (conference_id, name, topic, chair_info) VALUES (
    @conference_id,
    'WHO',
    'The Question of Combatting Childhood Pneumonia Through Strengthened Health Services',
    'Chairs: TBD'
);

-- Add UNHRC Committee
INSERT INTO committees (conference_id, name, topic, chair_info) VALUES (
    @conference_id,
    'UNHRC',
    'The Question of the Protection of Human Rights in Active Conflict Zones',
    'Chairs: TBD'
);

-- Add CSTD Committee
INSERT INTO committees (conference_id, name, topic, chair_info) VALUES (
    @conference_id,
    'CSTD',
    'The Question of Establishing Ethical Frameworks for the Global Use of Artificial Intelligence',
    'Chairs: TBD'
);

-- Add World Bank Committee
INSERT INTO committees (conference_id, name, topic, chair_info) VALUES (
    @conference_id,
    'World Bank',
    'The Question of Ensuring Consumer Protection and Data Privacy in the Expansion of Mobile Banking and Microfinance Services',
    'Chairs: TBD'
);

-- Insert unique topics for TSIMUN 2026
INSERT INTO unique_topics (conference_id, topic) VALUES
(@conference_id, 'Waste Impact on Human Health and Environment'),
(@conference_id, 'Equal Access to Quality Education'),
(@conference_id, 'Childhood Pneumonia Prevention'),
(@conference_id, 'Human Rights in Conflict Zones'),
(@conference_id, 'AI Ethical Frameworks'),
(@conference_id, 'Consumer Protection in Mobile Banking');

-- Insert available awards for TSIMUN 2026
INSERT INTO available_awards (conference_id, award_name) VALUES
(@conference_id, 'Best Delegate'),
(@conference_id, 'Honorable Mention'),
(@conference_id, 'Best Position Paper'),
(@conference_id, 'Best Chair');

-- Insert sample allocations (placeholder - contact conference for actual allocations)
INSERT INTO allocations (conference_id, country) VALUES
(@conference_id, 'TBD - Contact conference for country assignments');

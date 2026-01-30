-- Add THAIMUN XIII Conference to Database
-- Run this script to add THAIMUN XIII to your MUN database

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
    chairs_pages, 
    schedule, 
    venue_guide, 
    extra_notes, 
    created_at
) VALUES (
    'THAIMUN XIII',
    'Brighton College',
    'Bangkok, Thailand',
    'TH',
    '2026-03-20',
    '2026-03-22',
    'The thirteenth annual THAIMUN conference at Brighton College, featuring 19 diverse committees covering international security, justice, health, and specialized organizations.',
    '',
    '',
    '',
    'upcoming',
    'TBD',
    'john.bangkok@hotmail.com',
    '@thailandmun',
    'john.bangkok@hotmail.com',
    'Contact via john.bangkok@hotmail.com',
    'Contact via john.bangkok@hotmail.com',
    'TBD THB',
    1,
    'Contact John Wood at john.bangkok@hotmail.com',
    'Advisors are mandatory - Contact John Wood at john.bangkok@hotmail.com',
    1,
    0,
    '<p>Chair applications contact: john.bangkok@hotmail.com</p>',
    '<p><strong>March 20-22, 2026:</strong> Three-day conference - Opening Ceremony, Committee Sessions, Closing Ceremony</p>',
    '<p>Conference held at Brighton College campus. Wheelchair accessible. Not sensory-friendly.</p>',
    '<p>Three-day conference featuring 19 committees including traditional UN bodies and specialized organizations. <strong>Independent Delegates:</strong> Yes, independent delegates are welcome! Contact John Wood at john.bangkok@hotmail.com for registration. <strong>Advisors:</strong> Advisors are mandatory for all delegations. Contact John Wood at john.bangkok@hotmail.com for advisor registration. <strong>Accessibility:</strong> Wheelchair accessible. Not sensory-friendly. Follow us on Instagram: @thailandmun for updates.</p>',
    NOW()
);

-- Get the conference ID for foreign key references
SET @thaimun_id = LAST_INSERT_ID();

-- Insert committees for THAIMUN XIII
INSERT INTO committees (conference_id, committee_name, topic, chairs_info) VALUES
(@thaimun_id, 'UNSC', 'The Question of Addressing the Red Sea Crisis in Yemen | The Question of Addressing the Rise of Terrorist Insurgencies in West Africa', 'Chairs: TBD'),
(@thaimun_id, 'ICJ', 'The Land and Maritime Delimitation and Sovereignty over Islands (Gabon v. Equatorial Guinea, 2023, Advisory) | The Jurisdictional Immunities of the State (Germany v. Italy : Greece Intervening, 2012, Contentious) | The Obligation to Negotiate Access to the Pacific Ocean (Bolivia v. Chile, 2018, Contentious)', 'Chairs: TBD'),
(@thaimun_id, 'IMO', 'The Question of Addressing Maritime Security in the Gulf of Guinea | The Question of Regulating Autonomous Shipping Technologies', 'Chairs: TBD'),
(@thaimun_id, 'INTERPOL', 'The Question of Addressing Cybercrime and International Cooperation | The Question of Combating Human Trafficking Networks', 'Chairs: TBD'),
(@thaimun_id, 'IOC', 'The Question of Addressing the Participation of Transgender Athletes in International Sporting Events | The Question of Preventing the Politicization of the Olympic Games in Times of Global Conflict', 'Chairs: TBD'),
(@thaimun_id, 'ECOSOC', 'The Question of Addressing the Consequences of the Global Shift Towards Cashless Economies | The Question of Addressing Aid Dependency in Developing States', 'Chairs: TBD'),
(@thaimun_id, 'ARAB League', 'The Question of Addressing the Geopolitical Consequences of New Trade Corridors in the Arab League | The Question of Addressing the US Military Presence in the Arab League', 'Chairs: TBD'),
(@thaimun_id, 'DISEC', 'The Question of Addressing the Militarization of Humanitarian Aid Channels | The Question of Addressing Quantum Computing Arms Race in Military Intelligence', 'Chairs: TBD'),
(@thaimun_id, 'NATO', 'The Question of Addressing Cybersecurity Threats to Critical Infrastructure | The Question of Addressing Hybrid Warfare and Disinformation Campaigns', 'Chairs: TBD'),
(@thaimun_id, 'USCC', 'The Question of Imposing Tariffs on Foreign States | The Question of Regulating Legal Immigration | The Question of Providing Military Aid to Foreign States', 'Chairs: TBD'),
(@thaimun_id, 'UKPC', 'The Question of Repealing the Online Safety Act of 2025 | The Question of Assisted Dying Legislation | The Question of Nationalizing British Railways', 'Chairs: TBD'),
(@thaimun_id, 'HCC', 'The Korean War (1950-1953) | The Byzantine Sassanid (602-628 AD)', 'Chairs: TBD'),
(@thaimun_id, 'UNHRC', 'The Question of Systemic Racism in the Justice System | The Question of Predictive Policing Technologies', 'Chairs: TBD'),
(@thaimun_id, 'UNOOSA', 'The Question of Regulating Space Debris and Orbital Traffic Management | The Question of Addressing the Commercialization of Space Resources', 'Chairs: TBD'),
(@thaimun_id, 'UNODC', 'The Question of Preventing Money Laundering Amidst the Rise of Cryptocurrency | The Question of Implementing International Regulation of Spyware and Surveillance Technology', 'Chairs: TBD'),
(@thaimun_id, 'HSOC', 'The Korean War (1950-1953) | The Byzantine Sassanid (602-628 AD)', 'Chairs: TBD'),
(@thaimun_id, 'WHO', 'The Question of Human Challenge Trials as a Means of Accelerating Vaccine Development | The Question of Addressing the 2025 Cholera Outbreak', 'Chairs: TBD'),
(@thaimun_id, 'Press Corps', 'The Question of Addressing the Decline of Public Trust in Journalism in the 21st-Century', 'Chairs: TBD');

-- Insert available awards for THAIMUN XIII
INSERT INTO available_awards (conference_id, award_name) VALUES
(@thaimun_id, 'Best Delegate'),
(@thaimun_id, 'Outstanding Delegate'),
(@thaimun_id, 'Honorable Mention'),
(@thaimun_id, 'Best Position Paper');

-- Insert sample allocations (placeholder - contact conference for actual allocations)
INSERT INTO allocations (conference_id, country_name) VALUES
(@thaimun_id, 'TBD - Contact conference for country assignments');

-- Display success message
SELECT 'THAIMUN XIII conference successfully added to database!' as message;

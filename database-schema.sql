-- SEAMUNs Database Schema
-- Model United Nations Conference Tracker Database
-- Created: 2025

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    pronouns VARCHAR(50),
    profile_picture TEXT,
    banner TEXT,
    auth_provider VARCHAR(50) DEFAULT 'email',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- ============================================
-- CONFERENCES TABLE
-- ============================================
CREATE TABLE conferences (
    conference_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    location VARCHAR(255),
    country_code CHAR(2),
    start_date DATE,
    end_date DATE,
    description TEXT,
    website VARCHAR(500),
    registration_deadline DATE,
    position_paper_deadline DATE,
    status ENUM('upcoming', 'ongoing', 'past') DEFAULT 'upcoming',
    size VARCHAR(100),
    general_email VARCHAR(255),
    mun_account VARCHAR(255),
    advisor_account VARCHAR(255),
    sec_gen_accounts TEXT,
    parliamentarian_accounts TEXT,
    price_per_delegate VARCHAR(100),
    independent_dels_welcome BOOLEAN DEFAULT FALSE,
    independent_signup_link TEXT,
    advisor_signup_link TEXT,
    disabled_suitable BOOLEAN DEFAULT FALSE,
    sensory_suitable BOOLEAN DEFAULT FALSE,
    schedule TEXT,
    venue_guide TEXT,
    extra_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_start_date (start_date),
    INDEX idx_location (location)
);

-- ============================================
-- COMMITTEES TABLE
-- ============================================
CREATE TABLE committees (
    committee_id INT AUTO_INCREMENT PRIMARY KEY,
    conference_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    topic TEXT,
    chair_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conference_id) REFERENCES conferences(conference_id) ON DELETE CASCADE,
    INDEX idx_conference (conference_id)
);

-- ============================================
-- AWARDS TABLE
-- ============================================
CREATE TABLE awards (
    award_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    conference_id INT NOT NULL,
    award_type VARCHAR(100) NOT NULL,
    committee VARCHAR(255),
    country VARCHAR(255),
    award_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (conference_id) REFERENCES conferences(conference_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_conference (conference_id),
    INDEX idx_award_type (award_type)
);

-- ============================================
-- ATTENDANCE TABLE
-- ============================================
CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    conference_id INT NOT NULL,
    status ENUM('not-attending', 'attending', 'attended') DEFAULT 'not-attending',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (conference_id) REFERENCES conferences(conference_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_conference (user_id, conference_id),
    INDEX idx_user (user_id),
    INDEX idx_conference (conference_id),
    INDEX idx_status (status)
);

-- ============================================
-- FEEDBACK TABLE
-- ============================================
CREATE TABLE feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    conference_id INT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    recommend BOOLEAN DEFAULT FALSE,
    highlights TEXT,
    improvements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (conference_id) REFERENCES conferences(conference_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_conference_feedback (user_id, conference_id),
    INDEX idx_conference (conference_id),
    INDEX idx_user (user_id),
    INDEX idx_rating (rating)
);

-- ============================================
-- ALLOCATIONS TABLE (Country assignments)
-- ============================================
CREATE TABLE allocations (
    allocation_id INT AUTO_INCREMENT PRIMARY KEY,
    conference_id INT NOT NULL,
    country VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conference_id) REFERENCES conferences(conference_id) ON DELETE CASCADE,
    INDEX idx_conference (conference_id)
);

-- ============================================
-- AVAILABLE AWARDS TABLE
-- ============================================
CREATE TABLE available_awards (
    available_award_id INT AUTO_INCREMENT PRIMARY KEY,
    conference_id INT NOT NULL,
    award_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conference_id) REFERENCES conferences(conference_id) ON DELETE CASCADE,
    INDEX idx_conference (conference_id)
);

-- ============================================
-- PREVIOUS WINNERS TABLE
-- ============================================
CREATE TABLE previous_winners (
    winner_id INT AUTO_INCREMENT PRIMARY KEY,
    conference_id INT NOT NULL,
    winner_name VARCHAR(255) NOT NULL,
    award_type VARCHAR(255),
    year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conference_id) REFERENCES conferences(conference_id) ON DELETE CASCADE,
    INDEX idx_conference (conference_id),
    INDEX idx_year (year)
);

-- ============================================
-- UNIQUE TOPICS TABLE
-- ============================================
CREATE TABLE unique_topics (
    topic_id INT AUTO_INCREMENT PRIMARY KEY,
    conference_id INT NOT NULL,
    topic VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conference_id) REFERENCES conferences(conference_id) ON DELETE CASCADE,
    INDEX idx_conference (conference_id)
);

-- ============================================
-- SAMPLE DATA - MUN07 IV Conference
-- ============================================
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
    1,
    'MUN07 IV',
    'St Andrews International School, Sukhumvit 107',
    'Bangkok, Thailand',
    'TH',
    '2026-03-07',
    '2026-03-07',
    'The fourth annual MUN07 conference at St Andrews International School Sukhumvit 107, featuring 10 diverse committees including specialized bodies and regional organizations.',
    'https://mun07.org',
    '2026-02-07',
    '2026-02-14',
    'upcoming',
    '250+ attendees',
    'mun07sta@gmail.com',
    '@mun07',
    'mun07sta@gmail.com',
    'PJ (@janekij_) and Poon (@natthawit._)',
    'Contact via mun07sta@gmail.com',
    '900 THB',
    TRUE,
    'https://forms.gle/cwyjPqszetrQGaNN8',
    'https://forms.gle/xKSp8oSejzXDE6gV7',
    TRUE,
    TRUE,
    '<p><strong>March 7, 2026:</strong> Full Day Conference - Opening Ceremony, Committee Sessions, Closing Ceremony</p>',
    '<p>Conference held at St Andrews International School, Sukhumvit 107 campus. Wheelchair accessible with access ramps available.</p>',
    '<p>Business attire required. 10 specialized committees including UNHRC, UNSC, UNOOSA, SPECPOL, DISEC, USCC, INTERPOL, ICJ, ASEAN, and Press Corps. <strong>Accessibility:</strong> Wheelchair accessible with ramps available. Sensory-friendly with break room available for delegates who need it. Delegate fee: 900 THB. Follow us on Instagram: @mun07 for updates. Secretary Generals: PJ (@janekij_) and Poon (@natthawit._)</p>'
);

-- Insert committees for MUN07 IV
INSERT INTO committees (conference_id, name, topic, chair_info) VALUES
(1, 'UNHRC', 'The Question of Human Rights Abuses in Detention Centres and Prisons in The United States', 'Head Chair: Tamara (@__.t.petrosyan.__), Deputy Chair: Anai (@anai._.ona)'),
(1, 'UNSC', 'The Question of Preventing Escalation in the Taiwan Strait between Taiwan and China', 'Head Chair: Flo (@flo.walker.1), Deputy Chair: Agrim (@agrimdaga)'),
(1, 'UNOOSA', 'The Question of Preventing the Weaponisation of Satellites in Outer Space', 'Head Chair: Rose (@roslyn.ry), Deputy Chair: Tenzin (@tenzinyangring)'),
(1, 'SPECPOL', 'The Question of International Oversight in Yemen''s Political Transition with an emphasis on the Houthi Terror Organisation', 'Head Chair: Kirill (@krlse23), Deputy Chair: Hayeon (@hayeonnkk)'),
(1, 'DISEC', 'The Question of the Use of Drones in Modern Warfare with an emphasis on The Ukraine-Russia War', 'Head Chair: Vicka (@vicka.w), Deputy Chair: Myesha (@nidhika_s)'),
(1, 'USCC', 'The Question of the Use of the National Guard as a Domestic Policing Force on US Soil', 'President: Aimie (@aimiea_), Vice President: Budh (@budhman1234)'),
(1, 'INTERPOL', 'The Question of Combating Human Trafficking Networks Along Western Europe with an emphasis on Paris', 'President: Pund (@pundthepond), Vice President: Ryu (@kior.yu)'),
(1, 'ICJ', 'The Question of the Jorge Glas Dispute in Ecuador v. Mexico', 'President: Celia (@thatburmesegal), Vice President: Veda (@v3dx_2204)'),
(1, 'ASEAN', 'The Question of Solving the Conflict Between Thailand and Cambodia', 'Head Chair: Dominic (@dominic_mll), Deputy Chair: Sanvi (@sanvi_k30)'),
(1, 'Press Corps', 'The Question of Combatting Fake News and Disinformation Internationally', 'Editor in Chief: Su Hyun (@vampyrculture or 28suhyun@regents.ac.th), Editor: Lineysha');

-- Insert unique topics
INSERT INTO unique_topics (conference_id, topic) VALUES
(1, 'Human Rights Abuses'),
(1, 'Taiwan Strait Conflict'),
(1, 'Space Weaponization'),
(1, 'Yemen Political Transition'),
(1, 'Drone Warfare'),
(1, 'National Guard Policing'),
(1, 'Human Trafficking'),
(1, 'Ecuador v. Mexico Dispute'),
(1, 'Thailand-Cambodia Conflict'),
(1, 'Fake News & Disinformation');

-- Insert allocations (country assignments)
INSERT INTO allocations (conference_id, country) VALUES
(1, 'Thailand'),
(1, 'Singapore'),
(1, 'Malaysia'),
(1, 'Vietnam'),
(1, 'Indonesia'),
(1, 'Philippines'),
(1, 'Brunei'),
(1, 'Myanmar'),
(1, 'Cambodia'),
(1, 'Laos');

-- Insert available awards
INSERT INTO available_awards (conference_id, award_name) VALUES
(1, 'Best Delegate'),
(1, 'Outstanding Delegate'),
(1, 'Honorable Mention'),
(1, 'Best Position Paper'),
(1, 'Best Chair');

-- ============================================
-- USEFUL QUERIES
-- ============================================

-- Get all upcoming conferences
-- SELECT * FROM conferences WHERE status = 'upcoming' ORDER BY start_date;

-- Get user's attended conferences
-- SELECT c.* FROM conferences c
-- JOIN attendance a ON c.conference_id = a.conference_id
-- WHERE a.user_id = 'USER_ID' AND a.status = 'attended';

-- Get user's awards
-- SELECT a.*, c.name as conference_name 
-- FROM awards a
-- JOIN conferences c ON a.conference_id = c.conference_id
-- WHERE a.user_id = 'USER_ID'
-- ORDER BY a.award_date DESC;

-- Get conference feedback with average rating
-- SELECT 
--     c.name,
--     AVG(f.rating) as avg_rating,
--     COUNT(f.feedback_id) as total_reviews,
--     SUM(CASE WHEN f.recommend = TRUE THEN 1 ELSE 0 END) * 100.0 / COUNT(f.feedback_id) as recommend_percent
-- FROM conferences c
-- LEFT JOIN feedback f ON c.conference_id = f.conference_id
-- WHERE c.conference_id = 1
-- GROUP BY c.conference_id;

-- Get all feedback for a conference
-- SELECT f.*, u.name as user_name, u.profile_picture
-- FROM feedback f
-- JOIN users u ON f.user_id = u.user_id
-- WHERE f.conference_id = 1
-- ORDER BY f.created_at DESC;

-- Get committees for a conference
-- SELECT * FROM committees WHERE conference_id = 1;

-- Search conferences by location or name
-- SELECT * FROM conferences 
-- WHERE name LIKE '%MUN%' OR location LIKE '%Bangkok%'
-- ORDER BY start_date DESC;


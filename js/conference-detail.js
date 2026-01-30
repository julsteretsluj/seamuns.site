// Conference Detail Page Script
// This script loads and displays individual conference details

// Get country flag emoji from country code
function getCountryFlag(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '';
    
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    
    return String.fromCodePoint(...codePoints);
}

// Committee descriptions
function getCommitteeDescription(committee, rawCommitteeName = '') {
    // Extract difficulty from raw committee name if present (e.g., "ECOSOC (Beginner)")
    let extractedDifficulty = null;
    if (rawCommitteeName) {
        const difficultyMatch = rawCommitteeName.match(/\((Beginner|Intermediate|Advanced)\)/i);
        if (difficultyMatch) {
            extractedDifficulty = difficultyMatch[1].toLowerCase();
        }
    }
    
    const descriptions = {
        'UNGA': {
            name: 'General Assembly',
            icon: '🌍',
            type: 'traditional',
            difficulty: 'beginner',
            description: 'The main deliberative organ of the UN where all member states have equal representation. Great for first-time delegates.',
            focus: 'Broad international issues including peace, human rights, and development.'
        },
        'UNSC': {
            name: 'Security Council',
            icon: '🔒',
            type: 'traditional',
            difficulty: 'intermediate',
            description: 'Responsible for maintaining international peace and security. Features intense debate with only 15 members.',
            focus: 'Armed conflicts, peacekeeping, sanctions, and security threats.',
            note: 'P5 countries (US, UK, France, Russia, China) have veto power.'
        },
        'ECOSOC': {
            name: 'Economic and Social Council',
            icon: '📈',
            type: 'traditional',
            difficulty: 'beginner',
            description: 'Coordinates economic and social work, focusing on sustainable development.',
            focus: 'Economic development, social issues, human rights, and environment.'
        },
        'WHO': {
            name: 'World Health Organization',
            icon: '❤️',
            type: 'specialized',
            difficulty: 'beginner',
            description: 'The UN agency responsible for international public health.',
            focus: 'Global health issues, pandemic response, healthcare access, and disease prevention.'
        },
        'UNESCO': {
            name: 'United Nations Educational, Scientific and Cultural Organization',
            icon: '🎓',
            type: 'specialized',
            difficulty: 'beginner',
            description: 'Promotes peace through international cooperation in education, sciences, and culture.',
            focus: 'Education access, cultural preservation, scientific cooperation, and heritage protection.'
        },
        'UNICEF': {
            name: 'United Nations Children\'s Fund',
            icon: '👶',
            type: 'specialized',
            difficulty: 'beginner',
            description: 'The UN agency responsible for providing humanitarian and developmental aid to children worldwide.',
            focus: 'Child protection, education, health, nutrition, and emergency relief for children.'
        },
        'UNHCR': {
            name: 'UN High Commissioner for Refugees',
            icon: '🏕️',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'Protects and supports refugees, displaced persons, and stateless people worldwide.',
            focus: 'Refugee rights, displacement crises, asylum policies, and humanitarian assistance.'
        },
        'Crisis Committee': {
            name: 'Crisis Committee',
            icon: '⚡',
            type: 'specialized',
            difficulty: 'advanced',
            description: 'Fast-paced, dynamic committee with evolving situations and crisis updates.',
            focus: 'Real-time problem-solving with both public debate and private directives.'
        },
        'Historical Crisis': {
            name: 'Historical Committee',
            icon: '⏳',
            type: 'specialized',
            difficulty: 'advanced',
            description: 'Simulates historical events allowing delegates to experience pivotal moments in history.',
            focus: 'Period-appropriate solutions requiring historical accuracy and context.'
        },
        'Historical Committee': {
            name: 'Historical Committee',
            icon: '⏳',
            type: 'specialized',
            difficulty: 'advanced',
            description: 'Simulates historical events allowing delegates to experience pivotal moments in history.',
            focus: 'Period-appropriate solutions requiring historical accuracy and context.'
        },
        'ICJ': {
            name: 'International Court of Justice',
            icon: '⚖️',
            type: 'specialized',
            difficulty: 'advanced',
            description: 'The principal judicial organ of the United Nations, settling legal disputes between states.',
            focus: 'International law, legal disputes, advisory opinions, and judicial proceedings.'
        },
        'IMO': {
            name: 'International Maritime Organization',
            icon: '🚢',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'The UN agency responsible for the safety and security of shipping and the prevention of marine pollution.',
            focus: 'Maritime safety, security, environmental protection, and shipping regulations.'
        },
        'INTERPOL': {
            name: 'International Criminal Police Organization',
            icon: '🚔',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'The world\'s largest international police organization, facilitating cooperation between law enforcement agencies.',
            focus: 'International crime prevention, law enforcement cooperation, and criminal investigations.'
        },
        'IOC': {
            name: 'International Olympic Committee',
            icon: '🥇',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'The supreme authority of the worldwide Olympic movement, organizing the Olympic Games.',
            focus: 'Olympic Games organization, sports governance, and international athletic competition.'
        },
        'IOPC': {
            name: 'International Olympic and Paralympic Committee',
            icon: '🏃',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'The authority organizing the Olympic and Paralympic Games.',
            focus: 'Olympic and Paralympic Games organization, sports governance, and international athletic competition.'
        },
        'ARAB League': {
            name: 'Arab League',
            icon: '🌙',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'A regional organization of Arab states promoting economic, cultural, and political cooperation.',
            focus: 'Arab unity, regional cooperation, economic integration, and political coordination.'
        },
        'Arab League': {
            name: 'Arab League',
            icon: '🌙',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'A regional organization of Arab states promoting economic, cultural, and political cooperation.',
            focus: 'Arab unity, regional cooperation, economic integration, and political coordination.'
        },
        'AL': {
            name: 'Arab League',
            icon: '🌙',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'A regional organization of Arab states promoting economic, cultural, and political cooperation.',
            focus: 'Arab unity, regional cooperation, economic integration, and political coordination.'
        },
        'DISEC': {
            name: 'Disarmament and International Security Committee',
            icon: '🔫',
            type: 'traditional',
            difficulty: 'intermediate',
            description: 'The First Committee of the UN General Assembly dealing with disarmament and international security.',
            focus: 'Nuclear disarmament, conventional weapons, international security, and arms control.'
        },
        'NATO': {
            name: 'North Atlantic Treaty Organization',
            icon: '🌐',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'A military alliance of North American and European countries for collective defense.',
            focus: 'Collective defense, military cooperation, security policy, and crisis management.'
        },
        'USCC': {
            name: 'United States Congress Committee',
            icon: '🇺🇸',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'A simulation of the United States Congress, focusing on domestic policy and legislation.',
            focus: 'Domestic policy, legislation, congressional procedures, and American governance.'
        },
        'UKPC': {
            name: 'United Kingdom Parliamentary Committee',
            icon: '🇬🇧',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'A simulation of the UK Parliament, focusing on British policy and parliamentary procedures.',
            focus: 'British domestic policy, parliamentary procedures, and UK governance issues.'
        },
        'HCC': {
            name: 'Historical Crisis Committee',
            icon: '📚',
            type: 'specialized',
            difficulty: 'advanced',
            description: 'A crisis committee set in a historical context, dealing with period-specific challenges.',
            focus: 'Historical crisis management, period-appropriate solutions, and historical accuracy.'
        },
        'UNHRC': {
            name: 'United Nations Human Rights Council',
            icon: '🕊️',
            type: 'traditional',
            difficulty: 'beginner',
            description: 'The UN body responsible for promoting and protecting human rights around the world.',
            focus: 'Human rights protection, discrimination issues, and international human rights law.'
        },
        'UNEP': {
            name: 'United Nations Environment Programme',
            icon: '🌱',
            type: 'specialized',
            difficulty: 'beginner',
            description: 'The UN agency responsible for coordinating environmental activities and assisting developing countries in implementing environmentally sound policies.',
            focus: 'Environmental protection, climate change, biodiversity conservation, and sustainable development.'
        },
        'SPECPOL': {
            name: 'Special Political and Decolonization Committee',
            icon: '🗺️',
            type: 'traditional',
            difficulty: 'intermediate',
            description: 'The Fourth Committee of the UN General Assembly dealing with special political questions, decolonization, and related matters.',
            focus: 'Decolonization, peacekeeping operations, outer space affairs, and special political missions.'
        },
        'UNOOSA': {
            name: 'United Nations Office for Outer Space Affairs',
            icon: '🚀',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'The UN office promoting international cooperation in the peaceful use of outer space.',
            focus: 'Space law, space technology, international space cooperation, and space governance.'
        },
        'UNODC': {
            name: 'United Nations Office on Drugs and Crime',
            icon: '🚫',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'The UN office leading the global fight against illicit drugs and international crime.',
            focus: 'Drug control, crime prevention, corruption, and international law enforcement.'
        },
        'HSOC': {
            name: 'Historical Special Operations Committee',
            icon: '🎯',
            type: 'specialized',
            difficulty: 'advanced',
            description: 'A specialized historical committee focusing on military operations and strategic decisions.',
            focus: 'Military strategy, historical operations, and tactical decision-making.'
        },
        'Press Corps': {
            name: 'Press Corps',
            icon: '📰',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'A specialized committee representing journalists and media covering the conference.',
            focus: 'Journalism, media coverage, press freedom, and information dissemination.'
        },
        'EP': {
            name: 'European Parliament Committee',
            icon: '🇪🇺',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'A simulation of the European Parliament, focusing on EU policy and legislation.',
            focus: 'EU policy, European integration, migration, and European governance.'
        },
        'UN WOMEN': {
            name: 'United Nations Entity for Gender Equality and the Empowerment of Women',
            icon: '💜',
            type: 'specialized',
            difficulty: 'beginner',
            description: 'The UN entity dedicated to gender equality and the empowerment of women.',
            focus: 'Women\'s rights, gender equality, ending violence against women, and economic empowerment.'
        },
        'UNWOMEN': {
            name: 'United Nations Entity for Gender Equality and the Empowerment of Women',
            icon: '💜',
            type: 'specialized',
            difficulty: 'beginner',
            description: 'The UN entity dedicated to gender equality and the empowerment of women.',
            focus: 'Women\'s rights, gender equality, ending violence against women, and economic empowerment.'
        },
        'HSC': {
            name: 'Historical Security Council',
            icon: '🏺',
            type: 'specialized',
            difficulty: 'advanced',
            description: 'A historical simulation of the UN Security Council, set in a specific historical period.',
            focus: 'Historical peace and security issues, period-appropriate solutions, and historical context.'
        },
        'CSTD': {
            name: 'Commission on Science and Technology for Development',
            icon: '🔬',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'A subsidiary body of ECOSOC focusing on science, technology, and innovation for development.',
            focus: 'Technology transfer, digital divide, innovation policies, and science for development goals.'
        },
        'FWC': {
            name: 'Fantasy World Committee',
            icon: '🧙',
            type: 'specialized',
            difficulty: 'advanced',
            description: 'A creative committee set in a fantasy world or fictional universe.',
            focus: 'Creative problem-solving in fictional settings, applying diplomatic principles to fantasy scenarios.'
        },
        'F1': {
            name: 'Formula One Committee',
            icon: '🏎️',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'A committee simulating Formula One racing governance and regulations.',
            focus: 'Racing regulations, safety standards, team governance, and motorsports policy.'
        },
        'PC': {
            name: 'Press Corps',
            icon: '📸',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'A specialized committee representing journalists and media covering the conference.',
            focus: 'Journalism, media coverage, press freedom, and information dissemination.'
        },
        'UNCSA': {
            name: 'Commission on Superhuman Activities',
            icon: '🦸',
            type: 'specialized',
            difficulty: 'advanced',
            description: 'A creative committee dealing with superhuman or superhero-related governance and policy.',
            focus: 'Regulation of superhuman abilities, hero oversight, and extraordinary circumstances.'
        },
        'US Senate': {
            name: 'United States Senate',
            icon: '🎩',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'A simulation of the US Senate, focusing on American domestic policy and legislation.',
            focus: 'Domestic policy, legislation, senatorial procedures, and American governance.'
        },
        'Interpol': {
            name: 'International Criminal Police Organization',
            icon: '🔍',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'The world\'s largest international police organization, facilitating cooperation between law enforcement agencies.',
            focus: 'International crime prevention, law enforcement cooperation, and criminal investigations.'
        },
        'ASEAN': {
            name: 'Association of Southeast Asian Nations',
            icon: '🌴',
            type: 'specialized',
            difficulty: 'intermediate',
            description: 'A regional intergovernmental organization promoting regional cooperation in Southeast Asia.',
            focus: 'Regional cooperation, economic integration, political stability, and cultural exchange.'
        },
        'SOCHUM': {
            name: 'Social, Humanitarian and Cultural Committee',
            icon: '💚',
            type: 'traditional',
            difficulty: 'beginner',
            description: 'The Third Committee of the UN General Assembly dealing with social and humanitarian issues.',
            focus: 'Human rights, social development, humanitarian affairs, and cultural issues.'
        },
        'GA6': {
            name: 'Legal Committee',
            icon: '📖',
            type: 'traditional',
            difficulty: 'advanced',
            description: 'The Sixth Committee of the UN General Assembly dealing with legal matters.',
            focus: 'International law, legal disputes, treaty law, and legal frameworks.'
        },
        'ECOFIN': {
            name: 'Economic and Financial Committee',
            icon: '💰',
            type: 'traditional',
            difficulty: 'beginner',
            description: 'The Second Committee of the UN General Assembly dealing with economic and financial matters.',
            focus: 'Economic development, international trade, finance, and sustainable development goals.'
        },
        'SC': {
            name: 'Security Council',
            icon: '🔒',
            type: 'traditional',
            difficulty: 'intermediate',
            description: 'Responsible for maintaining international peace and security. Features intense debate with only 15 members.',
            focus: 'Armed conflicts, peacekeeping, sanctions, and security threats.',
            note: 'P5 countries (US, UK, France, Russia, China) have veto power.'
        },
        'HRC': {
            name: 'Human Rights Council',
            icon: '🕊️',
            type: 'traditional',
            difficulty: 'beginner',
            description: 'The UN body responsible for promoting and protecting human rights around the world.',
            focus: 'Human rights protection, discrimination issues, and international human rights law.'
        }
    };
    
    // Try exact match first
    if (descriptions[committee]) {
        const desc = descriptions[committee];
        // Override difficulty if extracted from raw name
        if (extractedDifficulty) {
            desc.difficulty = extractedDifficulty;
        }
        // Ensure difficulty exists, default to intermediate
        if (!desc.difficulty) {
            desc.difficulty = 'intermediate';
        }
        return desc;
    }
    
    // Clean committee name for partial matching (remove common suffixes/prefixes)
    const cleanCommittee = committee
        .replace(/\s*\([^)]*\)/g, '') // Remove text in parentheses like "(Beginner)", "(Intermediate)"
        .replace(/\s*-\s*.*$/, '') // Remove everything after dash
        .trim()
        .toUpperCase();
    
    // Try partial matching for variations
    const committeeUpper = cleanCommittee || committee.toUpperCase();
    
    // UN WOMEN variations
    if (committeeUpper.includes('UN WOMEN') || committeeUpper.includes('UNWOMEN')) {
        const desc = descriptions['UN WOMEN'];
        if (extractedDifficulty) desc.difficulty = extractedDifficulty;
        return desc;
    }
    
    // Historical Security Council
    if (committeeUpper.includes('HSC') && !committeeUpper.includes('SPECIAL')) {
        const desc = descriptions['HSC'];
        if (extractedDifficulty) desc.difficulty = extractedDifficulty;
        return desc;
    }
    
    // Historical variations
    if (committeeUpper.includes('HISTORICAL') || committeeUpper.includes('HISTORIC')) {
        if (committeeUpper.includes('CRISIS') || committeeUpper.includes('HCC')) {
            return descriptions['HCC'];
        }
        if (committeeUpper.includes('SECURITY') || committeeUpper.includes('HSC')) {
            return descriptions['HSC'];
        }
        if (committeeUpper.includes('SPECIAL OPERATIONS') || committeeUpper.includes('HSOC')) {
            return descriptions['HSOC'];
        }
        return descriptions['Historical Committee'];
    }
    
    // Crisis variations
    if (committeeUpper.includes('CRISIS')) {
        return descriptions['Crisis Committee'];
    }
    
    // Fantasy World Committee
    if (committeeUpper.includes('FWC') || committeeUpper.includes('FANTASY')) {
        return descriptions['FWC'];
    }
    
    // Formula One
    if (committeeUpper.includes('F1') || committeeUpper.includes('FORMULA')) {
        return descriptions['F1'];
    }
    
    // Press Corps variations
    if (committeeUpper.includes('PRESS') || committeeUpper.includes('PC') || committeeUpper.includes('MEDIA')) {
        return descriptions['Press Corps'];
    }
    
    // Commission on Superhuman Activities
    if (committeeUpper.includes('UNCSA') || committeeUpper.includes('SUPERHUMAN') || committeeUpper.includes('SUPERHERO')) {
        return descriptions['UNCSA'];
    }
    
    // US Senate variations
    if (committeeUpper.includes('US SENATE') || committeeUpper.includes('UNITED STATES SENATE')) {
        return descriptions['US Senate'];
    }
    
    // Commission on Science and Technology
    if (committeeUpper.includes('CSTD') || (committeeUpper.includes('SCIENCE') && committeeUpper.includes('TECHNOLOGY'))) {
        return descriptions['CSTD'];
    }
    
    // ASEAN
    if (committeeUpper.includes('ASEAN')) {
        return descriptions['ASEAN'];
    }
    
    // Interpol variations
    if (committeeUpper.includes('INTERPOL')) {
        return descriptions['Interpol'];
    }
    
    // European Parliament
    if (committeeUpper.includes('EP') && !committeeUpper.includes('DEP')) {
        return descriptions['EP'];
    }
    
    // Security Council variations (SC, UNSC)
    if ((committeeUpper === 'SC' || committeeUpper === 'UNSC' || committeeUpper.includes('SECURITY COUNCIL')) && !committeeUpper.includes('HISTORICAL')) {
        return descriptions['UNSC'];
    }
    
    // Human Rights Council variations (HRC, UNHRC)
    if (committeeUpper === 'HRC' || committeeUpper === 'UNHRC' || committeeUpper.includes('HUMAN RIGHTS COUNCIL')) {
        return descriptions['UNHRC'];
    }
    
    // ECOFIN variations
    if (committeeUpper.includes('ECOFIN') || committeeUpper.includes('ECONOMIC AND FINANCIAL')) {
        return descriptions['ECOFIN'];
    }
    
    // Arab League variations
    if (committeeUpper === 'AL' || committeeUpper.includes('ARAB LEAGUE')) {
        return descriptions['AL'];
    }
    
    // Default fallback
    const fallback = {
        name: committee,
        icon: '📋',
        type: 'specialized',
        difficulty: extractedDifficulty || 'intermediate',
        description: 'A specialized committee focusing on specific international issues.',
        focus: 'Varies based on committee mandate and topic.'
    };
    return fallback;
}

// Analyze topic complexity and assign difficulty level based on topic content
function getTopicDifficulty(topic, committeeType = 'traditional') {
    if (!topic) return 'intermediate';
    
    const topicLower = topic.toLowerCase();
    const topicLength = topic.length;
    
    // Extract difficulty from topic if explicitly stated in parentheses
    if (topicLower.match(/\(beginner\)/i) || topicLower.match(/beginner/i) && topicLower.includes('(')) return 'beginner';
    if (topicLower.match(/\(intermediate\)/i) || topicLower.match(/intermediate/i) && topicLower.includes('(')) return 'intermediate';
    if (topicLower.match(/\(advanced\)/i) || topicLower.match(/advanced/i) && topicLower.includes('(')) return 'advanced';
    
    // Advanced indicators - complex topics requiring deep analysis
    const advancedIndicators = [
        'cyber', 'cybersecurity', 'cyber weapons', 'cyber warfare',
        'nuclear', 'disarmament', 'proliferation', 'nuclear weapons',
        'regulating', 'regulation', 'regulatory framework', 'establishing comprehensive',
        'legal', 'jurisdiction', 'sovereignty', 'sanctions', 'enforcement',
        'crisis', 'emergency response', 'conflict resolution', 'warfare', 'terrorism', 'weapons of mass destruction',
        'mechanisms', 'multilateral', 'treaty', 'convention', 'protocol',
        'jurisprudence', 'adjudication', 'constitutional', 'legislative framework',
        'policy analysis', 'reform', 'restructuring', 'transformation',
        'artificial intelligence', 'ai regulation', 'machine learning',
        'bioethics', 'genetics', 'genomic', 'pharmaceutical regulation',
        'monetary policy', 'fiscal policy', 'economic sanctions',
        'historical', 'post-colonial', 'decolonization',
        'human trafficking', 'organized crime', 'transnational',
        'peacekeeping', 'peace enforcement', 'military intervention'
    ];
    
    // Beginner indicators - straightforward, accessible topics
    const beginnerIndicators = [
        'access to', 'ensuring access', 'promoting access',
        'improving', 'supporting', 'protecting', 'safeguarding',
        'raising awareness', 'education', 'healthcare access', 'nutrition',
        'clean water', 'sanitation', 'basic rights', 'fundamental rights',
        'rights of children', 'children\'s rights', 'youth', 'elderly care',
        'women\'s rights', 'gender equality', 'women empowerment',
        'poverty reduction', 'hunger', 'food security', 'housing',
        'sustainable development', 'environmental protection', 'climate change',
        'cultural preservation', 'heritage protection',
        'refugee support', 'migrant integration'
    ];
    
    // Count matches for advanced indicators
    let advancedCount = 0;
    for (const indicator of advancedIndicators) {
        if (topicLower.includes(indicator)) {
            advancedCount += 1.5; // Weight advanced indicators more
        }
    }
    
    // Count matches for beginner indicators
    let beginnerCount = 0;
    for (const indicator of beginnerIndicators) {
        if (topicLower.includes(indicator)) {
            beginnerCount += 1;
        }
    }
    
    // Length-based analysis (very long topics are often more complex)
    let lengthScore = 0;
    if (topicLength > 180) lengthScore = 2;
    else if (topicLength > 120) lengthScore = 1;
    else if (topicLength < 50) lengthScore = -0.5; // Shorter topics might be simpler
    
    // Complexity words that suggest advanced difficulty
    const complexityWords = ['comprehensive', 'framework', 'mechanisms', 'establishing', 'addressing', 'mitigating', 'enhancing', 'strengthening'];
    const complexityCount = complexityWords.filter(word => topicLower.includes(word)).length;
    
    // Committee type adjustment (specialized committees tend to be more complex)
    let committeeModifier = 0;
    if (committeeType === 'specialized') committeeModifier = 0.5;
    
    // Calculate final difficulty score
    const difficultyScore = (advancedCount) - (beginnerCount * 0.8) + lengthScore + (complexityCount * 0.3) + committeeModifier;
    
    // Determine difficulty level
    if (difficultyScore >= 3) return 'advanced';
    if (difficultyScore <= 0.5) return 'beginner';
    return 'intermediate';
}

// Award descriptions with unique icons for all award types
function getAwardDescription(award) {
    const descriptions = {
        // Best Delegate variations
        'Best Delegate': {
            icon: '👑',
            color: '#FFD700',
            description: 'The highest individual honor recognizing exceptional diplomacy, leadership, and mastery of procedure.',
            criteria: 'Outstanding performance across all aspects - research, speaking, negotiation, and leadership.'
        },
        'Best Delegate (per committee)': {
            icon: '🥇',
            color: '#FFD700',
            description: 'The highest individual honor within a specific committee, recognizing exceptional diplomacy, leadership, and mastery of procedure.',
            criteria: 'Outstanding performance across all aspects - research, speaking, negotiation, and leadership within the committee.'
        },
        'Committee Best Delegate': {
            icon: '💎',
            color: '#3498DB',
            description: 'The highest individual honor within a specific committee, recognizing exceptional performance.',
            criteria: 'Outstanding research, effective speaking, strong negotiation, and leadership within the committee.'
        },
        'Overall Best Delegate': {
            icon: '🏆',
            color: '#FFD700',
            description: 'The highest individual honor across the entire conference, recognizing exceptional diplomacy, leadership, and mastery of procedure.',
            criteria: 'Outstanding performance across all aspects - research, speaking, negotiation, and leadership. Selected from all committees.'
        },
        // Outstanding/Honorable variations
        'Outstanding Delegate': {
            icon: '🏅',
            color: '#E74C3C',
            description: 'Recognizes excellent performance and significant contributions to committee.',
            criteria: 'Strong research, effective speaking, and meaningful participation in resolution-building.'
        },
        'Honorable Mention': {
            icon: '🎖️',
            color: '#E67E22',
            description: 'Recognition for delegates who performed well and made notable contributions.',
            criteria: 'Good research, active participation, and collaborative approach.'
        },
        'Honorable Delegate': {
            icon: '🥉',
            color: '#E67E22',
            description: 'Recognition for delegates who performed well and made notable contributions.',
            criteria: 'Good research, active participation, and collaborative approach.'
        },
        'Honorable Delegate (2 per committee)': {
            icon: '🥈',
            color: '#C0C0C0',
            description: 'Recognition for delegates who performed well and made notable contributions within their committee.',
            criteria: 'Good research, active participation, collaborative approach, and meaningful contributions.'
        },
        'Honorable Mention (per committee)': {
            icon: '🎗️',
            color: '#E67E22',
            description: 'Recognition for delegates who performed well and made notable contributions within their committee.',
            criteria: 'Good research, active participation, collaborative approach, and meaningful contributions.'
        },
        'Honorable Mention Delegate (per committee)': {
            icon: '🎀',
            color: '#C0C0C0',
            description: 'Recognition for delegates who performed well and made notable contributions within their committee.',
            criteria: 'Good research, active participation, collaborative approach, and meaningful contributions.'
        },
        'Committee Honorable Mention': {
            icon: '🎫',
            color: '#E67E22',
            description: 'Recognition for delegates who performed well and made notable contributions within their committee.',
            criteria: 'Good research, active participation, collaborative approach, and meaningful contributions.'
        },
        // Position Paper variations
        'Best Position Paper': {
            icon: '✍️',
            color: '#4169E1',
            description: 'Awarded for exceptional pre-conference research and writing.',
            criteria: 'Superior research, clear writing, and comprehensive topic understanding.'
        },
        'Best Position Paper (per committee)': {
            icon: '📝',
            color: '#27AE60',
            description: 'Awarded for exceptional pre-conference research and writing within a specific committee.',
            criteria: 'Superior research, clear writing, comprehensive topic understanding, and policy recommendations.'
        },
        'Best Overall Position Paper': {
            icon: '📄',
            color: '#4169E1',
            description: 'Awarded for the most exceptional pre-conference research and writing across all committees.',
            criteria: 'Superior research, clear writing, comprehensive topic understanding, and outstanding policy recommendations.'
        },
        'Committee Best Position Paper': {
            icon: '📑',
            color: '#27AE60',
            description: 'Awarded for exceptional pre-conference research and writing within a specific committee.',
            criteria: 'Superior research, clear writing, comprehensive topic understanding, and policy recommendations.'
        },
        // Chair variations
        'Best Chair': {
            icon: '⚖️',
            color: '#9B59B6',
            description: 'Recognition for outstanding committee leadership and facilitation.',
            criteria: 'Excellent moderation, fair judgment, engaging committee atmosphere, and procedural expertise.'
        },
        'Best Chairs': {
            icon: '🔨',
            color: '#9B59B6',
            description: 'Recognition for outstanding committee leadership and facilitation.',
            criteria: 'Excellent moderation, fair judgment, engaging committee atmosphere, and procedural expertise.'
        },
        'Honorable Chair': {
            icon: '🎓',
            color: '#9B59B6',
            description: 'Recognition for exceptional committee leadership and facilitation.',
            criteria: 'Good moderation, fair judgment, and engaging committee atmosphere.'
        },
        'Honorable Mention for Chairs': {
            icon: '🎩',
            color: '#9B59B6',
            description: 'Recognition for exceptional committee leadership and facilitation.',
            criteria: 'Good moderation, fair judgment, and engaging committee atmosphere.'
        },
        'Overall Best Chair': {
            icon: '⭐',
            color: '#9B59B6',
            description: 'The highest honor for committee leadership, recognizing the most outstanding chair across all committees.',
            criteria: 'Exceptional moderation, fair judgment, engaging committee atmosphere, procedural expertise, and crisis management.'
        },
        // Committee variations
        'Best Committee': {
            icon: '🏛️',
            color: '#FF6B6B',
            description: 'Recognition for the committee that demonstrated the highest level of engagement, collaboration, and quality debate.',
            criteria: 'Active participation, strong resolutions, collaborative spirit, and overall committee excellence.'
        },
        // Delegation variations
        'Best Delegation': {
            icon: '🏴',
            color: '#FFD700',
            description: 'Awarded to the school whose delegates collectively demonstrated the highest performance.',
            criteria: 'Overall excellence across all committees and delegates.'
        },
        'Outstanding Delegation': {
            icon: '🌟',
            color: '#C0C0C0',
            description: 'Recognition for delegations that performed very well across multiple committees.',
            criteria: 'Strong collective performance with multiple individual awards.'
        },
        // Other variations
        'Verbal Commendation': {
            icon: '💬',
            color: '#87CEEB',
            description: 'Recognition for specific strengths or valuable contributions during committee.',
            criteria: 'Exceptional in particular areas such as speaking, diplomacy, or creative solutions.'
        }
    };
    
    // Try exact match first
    if (descriptions[award]) {
        return descriptions[award];
    }
    
    // Try partial matching for variations
    const awardLower = award.toLowerCase();
    
    // Best Delegate variations
    if (awardLower.includes('best delegate') && (awardLower.includes('overall') || awardLower.includes('conference'))) {
        return descriptions['Overall Best Delegate'];
    }
    if (awardLower.includes('best delegate') && awardLower.includes('per committee')) {
        return descriptions['Best Delegate (per committee)'];
    }
    if (awardLower.includes('best delegate')) {
        return descriptions['Best Delegate'];
    }
    
    // Honorable variations
    if (awardLower.includes('honorable delegate') && awardLower.includes('2 per committee')) {
        return descriptions['Honorable Delegate (2 per committee)'];
    }
    if (awardLower.includes('honorable') && awardLower.includes('per committee')) {
        return descriptions['Honorable Mention (per committee)'];
    }
    if (awardLower.includes('honorable mention')) {
        return descriptions['Honorable Mention'];
    }
    if (awardLower.includes('honorable delegate')) {
        return descriptions['Honorable Delegate'];
    }
    
    // Position Paper variations
    if (awardLower.includes('best position paper') && (awardLower.includes('overall') || awardLower.includes('conference'))) {
        return descriptions['Best Overall Position Paper'];
    }
    if (awardLower.includes('best position paper') && awardLower.includes('per committee')) {
        return descriptions['Best Position Paper (per committee)'];
    }
    if (awardLower.includes('position paper')) {
        return descriptions['Best Position Paper'];
    }
    
    // Chair variations
    if (awardLower.includes('best chair') && (awardLower.includes('overall') || awardLower.includes('conference'))) {
        return descriptions['Overall Best Chair'];
    }
    if (awardLower.includes('honorable') && awardLower.includes('chair')) {
        return descriptions['Honorable Chair'];
    }
    if (awardLower.includes('best chair')) {
        return descriptions['Best Chair'];
    }
    
    // Committee
    if (awardLower.includes('best committee')) {
        return descriptions['Best Committee'];
    }
    
    // Delegation
    if (awardLower.includes('best delegation')) {
        return descriptions['Best Delegation'];
    }
    if (awardLower.includes('outstanding delegation')) {
        return descriptions['Outstanding Delegation'];
    }
    
    // Default fallback
    return {
        icon: '🎊',
        color: '#87CEEB',
        description: 'Recognition for exceptional performance at the conference.',
        criteria: 'Various criteria based on research, diplomacy, and participation.'
    };
}

// Set contact info with copy buttons for Instagram handles
function setContactInfoWithCopyButtons(elementId, contactInfo) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (!contactInfo || contactInfo === 'Not provided') {
        element.textContent = contactInfo || 'Not provided';
        return;
    }
    
    // First, find and mark all email addresses to exclude them
    // Email pattern: something@domain.com (or similar)
    const emailPattern = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}/g;
    const emailRanges = [];
    let emailMatch;
    while ((emailMatch = emailPattern.exec(contactInfo)) !== null) {
        emailRanges.push({
            start: emailMatch.index,
            end: emailMatch.index + emailMatch[0].length
        });
    }
    
    // Find all Instagram handles (exclude email addresses)
    const instagramPattern = /@([a-zA-Z0-9._]+)/g;
    const handles = [];
    let match;
    
    while ((match = instagramPattern.exec(contactInfo)) !== null) {
        // Check if this @ is inside an email address
        const atIndex = match.index;
        const isInEmail = emailRanges.some(range => atIndex >= range.start && atIndex < range.end);
        
        if (!isInEmail) {
            // Also check if it's followed by a domain (additional safety check)
            const afterAt = contactInfo.substring(atIndex + match[0].length, atIndex + match[0].length + 20);
            const hasDomainAfter = /^[a-zA-Z0-9._-]*\.[a-zA-Z]{2,}/.test(afterAt.trim()) ||
                                  /^gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|icloud\.com|student\.[a-zA-Z]+\.ac\.[a-zA-Z]+/i.test(afterAt.trim());
            
            // If it's followed by a domain, it's likely an email (even if not caught by email pattern)
            if (!hasDomainAfter) {
                handles.push({
                    full: match[0], // @username
                    username: match[1], // username (without @)
                    index: match.index
                });
            }
        }
    }
    
    if (handles.length === 0) {
        // No Instagram handles, just display text
        element.textContent = contactInfo;
        return;
    }
    
    // Build HTML with copy buttons
    let html = '';
    let lastIndex = 0;
    
    handles.forEach((handle, idx) => {
        // Add text before this handle
        if (handle.index > lastIndex) {
            html += escapeHtml(contactInfo.substring(lastIndex, handle.index));
        }
        
        // Add handle with copy button
        const buttonId = `copy-contact-${elementId}-${Date.now()}-${idx}`;
        html += `
            <span style="display: inline-flex; align-items: center; gap: 4px; margin: 0 2px;">
                <span style="color: var(--accent-green);">${handle.full}</span>
                <button 
                    id="${buttonId}"
                    onclick="copyInstagramHandle('${handle.username}', '${buttonId}')"
                    style="
                        background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
                        border: none;
                        color: white;
                        padding: 2px 6px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 0.75em;
                        display: inline-flex;
                        align-items: center;
                        gap: 3px;
                        transition: transform 0.2s ease;
                        vertical-align: middle;
                    "
                    onmouseover="this.style.transform='scale(1.05)'"
                    onmouseout="this.style.transform='scale(1)'"
                    title="Copy ${handle.username}"
                >
                    <i class="fas fa-copy" style="font-size: 0.7em;"></i>
                </button>
            </span>
        `;
        
        lastIndex = handle.index + handle.full.length;
    });
    
    // Add remaining text after last handle
    if (lastIndex < contactInfo.length) {
        html += escapeHtml(contactInfo.substring(lastIndex));
    }
    
    element.innerHTML = html;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format chair info with copy buttons for Instagram handles
function formatChairInfoWithCopyButtons(chairInfo) {
    if (!chairInfo) return '';
    
    // Remove "Chairs:" or "Chair:" prefix if present for processing
    let processedInfo = chairInfo.replace(/^(Chairs?:\s*)/i, '').trim();
    
    // First, find and mark all email addresses to exclude them
    // Email pattern: something@domain.com (or similar)
    const emailPattern = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}/g;
    const emailRanges = [];
    let emailMatch;
    while ((emailMatch = emailPattern.exec(processedInfo)) !== null) {
        emailRanges.push({
            start: emailMatch.index,
            end: emailMatch.index + emailMatch[0].length
        });
    }
    
    // Find all Instagram handles (exclude email addresses)
    const instagramPattern = /@([a-zA-Z0-9._]+)/g;
    const handles = [];
    let match;
    
    while ((match = instagramPattern.exec(processedInfo)) !== null) {
        // Check if this @ is inside an email address
        const atIndex = match.index;
        const isInEmail = emailRanges.some(range => atIndex >= range.start && atIndex < range.end);
        
        if (!isInEmail) {
            // Also check if it's followed by a domain (additional safety check)
            const afterAt = processedInfo.substring(atIndex + match[0].length, atIndex + match[0].length + 20);
            const hasDomainAfter = /^[a-zA-Z0-9._-]*\.[a-zA-Z]{2,}/.test(afterAt.trim()) ||
                                  /^gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|icloud\.com|student\.[a-zA-Z]+\.ac\.[a-zA-Z]+/i.test(afterAt.trim());
            
            // If it's followed by a domain, it's likely an email (even if not caught by email pattern)
            if (!hasDomainAfter) {
                handles.push({
                    full: match[0], // @username
                    username: match[1], // username (without @)
                    index: match.index
                });
            }
        }
    }
    
    if (handles.length === 0) {
        return ''; // No Instagram handles found
    }
    
    // Create copy buttons for each handle
    const buttons = handles.map((handle, idx) => {
        const buttonId = `copy-btn-${Date.now()}-${idx}`;
        return `
            <span style="display: inline-flex; align-items: center; gap: 4px; margin: 4px 8px 4px 0; padding: 4px 8px; background: var(--bg-glass); border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.85em;">
                <span style="color: var(--accent-green);">${handle.full}</span>
                <button 
                    id="${buttonId}"
                    onclick="copyInstagramHandle('${handle.username}', '${buttonId}')"
                    style="
                        background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
                        border: none;
                        color: white;
                        padding: 4px 8px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 0.85em;
                        display: inline-flex;
                        align-items: center;
                        gap: 4px;
                        transition: transform 0.2s ease, opacity 0.2s ease;
                    "
                    onmouseover="this.style.transform='scale(1.05)'"
                    onmouseout="this.style.transform='scale(1)'"
                    title="Copy ${handle.username}"
                >
                    <i class="fas fa-copy" style="font-size: 0.8em;"></i>
                    <span>Copy</span>
                </button>
            </span>
        `;
    }).join('');
    
    return `
        <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px;">
            ${buttons}
        </div>
    `;
}

// Copy Instagram handle to clipboard (without @)
// Make it globally accessible for inline onclick handlers
window.copyInstagramHandle = function(username, buttonId) {
    // Function to show success feedback
    const showSuccess = () => {
        const button = document.getElementById(buttonId);
        if (button) {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check" style="font-size: 0.8em;"></i> <span>Copied!</span>';
            button.style.background = 'var(--accent-green)';
            button.style.opacity = '0.9';
            
            // Reset after 2 seconds
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';
                button.style.opacity = '1';
            }, 2000);
        }
        showCopyNotification(`Copied ${username} to clipboard!`);
    };
    
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(username).then(showSuccess).catch(err => {
            console.error('Failed to copy:', err);
            // Fallback to old method
            fallbackCopy(username, showSuccess);
        });
    } else {
        // Fallback for older browsers
        fallbackCopy(username, showSuccess);
    }
}

// Fallback copy method for older browsers
function fallbackCopy(text, onSuccess) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            onSuccess();
        } else {
            showCopyNotification('Failed to copy. Please try again.', true);
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showCopyNotification('Failed to copy. Please try again.', true);
    } finally {
        document.body.removeChild(textArea);
    }
}

// Show copy notification
function showCopyNotification(message, isError = false) {
    // Remove existing notification if any
    const existing = document.getElementById('copy-notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.id = 'copy-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: ${isError ? 'var(--accent-red, #e74c3c)' : 'var(--accent-green, #27ae60)'};
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-size: 0.9em;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    if (!document.getElementById('copy-notification-style')) {
        style.id = 'copy-notification-style';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Get conference ID from URL
function getConferenceIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Get conference by id from localStorage or window.MUN_CONFERENCES_DATA (so detail page works even without index first)
function getConferenceForDetailPage(conferenceId) {
    if (!conferenceId) return null;
    // 1) Try localStorage (may have attendance etc.)
    try {
        const saved = localStorage.getItem('munConferences');
        if (saved) {
            const list = JSON.parse(saved);
            const found = list.find(function (c) { return c.id == conferenceId; });
            if (found) return found;
        }
    } catch (e) { /* ignore */ }
    // 2) Use reference data (always loaded before this script)
    if (typeof window.MUN_CONFERENCES_DATA !== 'undefined' && Array.isArray(window.MUN_CONFERENCES_DATA)) {
        const found = window.MUN_CONFERENCES_DATA.find(function (c) { return c.id == conferenceId; });
        if (found) {
            var copy = JSON.parse(JSON.stringify(found));
            try {
                var list = JSON.parse(localStorage.getItem('munConferences') || '[]');
                if (!Array.isArray(list)) list = [];
                var idx = list.findIndex(function (c) { return c.id == conferenceId; });
                if (idx >= 0 && list[idx].attendanceStatus) copy.attendanceStatus = list[idx].attendanceStatus;
                if (idx >= 0) list[idx] = copy; else list.push(copy);
                localStorage.setItem('munConferences', JSON.stringify(list));
            } catch (e) { /* ignore */ }
            return copy;
        }
    }
    return null;
}

// Load conference data
function loadConferenceDetail() {
    try {
        // Check if required elements exist - this is the most reliable way to detect the page
        const conferenceNameEl = document.getElementById('conferenceName');
        if (!conferenceNameEl) {
            return;
        }
        const locationEl = document.getElementById('location');
        if (!locationEl) {
            return;
        }

        const conferenceId = getConferenceIdFromURL();
        if (!conferenceId) {
            conferenceNameEl.textContent = 'Conference Not Found';
            const detailsContainer = document.querySelector('.conference-detail-main');
            if (detailsContainer) {
                detailsContainer.innerHTML = '<div style="padding: 40px; text-align: center;"><h2>Conference Not Found</h2><p>No conference ID was provided in the URL.</p><a href="../index.html" class="btn btn-primary">Back to Conferences</a></div>';
            }
            return;
        }

        // Resolve conference from localStorage or MUN_CONFERENCES_DATA (no dependency on script.js init order)
        let conference = getConferenceForDetailPage(conferenceId);

        if (!conference) {
            // Brief delay in case scripts are still loading, then try once more
            setTimeout(function () {
                conference = getConferenceForDetailPage(conferenceId);
                if (conference) {
                    populateConferenceDetail(conference);
                    setupAttendanceButton(conference);
                    setupAwardButton(conference);
                } else {
                    conferenceNameEl.textContent = 'Conference Not Found';
                    const detailsContainer = document.querySelector('.conference-detail-main');
                    if (detailsContainer) {
                        detailsContainer.innerHTML = '<div style="padding: 40px; text-align: center;"><h2>Conference Not Found</h2><p>The requested conference could not be found.</p><a href="../index.html" class="btn btn-primary">Back to Conferences</a></div>';
                    }
                }
            }, 300);
            return;
        }

        populateConferenceDetail(conference);
        setupAttendanceButton(conference);
        setupAwardButton(conference);
    } catch (error) {
        console.error('Error in loadConferenceDetail:', error);
        const conferenceNameEl = document.getElementById('conferenceName');
        if (conferenceNameEl) {
            conferenceNameEl.textContent = 'Error Loading Conference';
        }
        const detailsContainer = document.querySelector('.conference-detail-main');
        if (detailsContainer) {
            detailsContainer.innerHTML = '<div style="padding: 40px; text-align: center;"><h2>Error Loading Conference</h2><p>There was an unexpected error. Please try again later.</p><a href="../index.html" class="btn btn-primary">Back to Conferences</a></div>';
        }
    }
}

// Populate conference details
function populateConferenceDetail(conf) {
    try {
        // Basic info
        document.title = `${conf.name} - SEAMUNs`;
        const conferenceNameEl = document.getElementById('conferenceName');
        if (conferenceNameEl) {
            conferenceNameEl.textContent = conf.name || 'Conference Name';
        }
        const statusEl = document.getElementById('conferenceStatus');
        if (statusEl) {
            statusEl.textContent = conf.status || 'Upcoming';
        }
        const sizeEl = document.getElementById('conferenceSize');
        if (sizeEl) {
            sizeEl.textContent = conf.size || '100-300 attendees';
        }
        const orgEl = document.getElementById('organization');
        if (orgEl) {
            orgEl.textContent = conf.organization || 'Not specified';
        }
        
        // Add flag to location
        const flag = getCountryFlag(conf.countryCode);
        const locationEl = document.getElementById('location');
        if (locationEl) {
            locationEl.textContent = `${flag} ${conf.location || 'Not specified'}`;
        }
        
        // Dates
        const startDate = new Date(conf.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const endDate = new Date(conf.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const datesEl = document.getElementById('dates');
        if (datesEl) {
            datesEl.textContent = `${startDate} - ${endDate}`;
        }
        
        // Price
        const priceEl = document.getElementById('pricePerDelegate');
        if (priceEl) {
            priceEl.textContent = conf.pricePerDelegate || 'Contact for pricing';
        }

        // Important Dates
        const registrationDeadlineEl = document.getElementById('registrationDeadline');
    if (registrationDeadlineEl) {
        if (conf.registrationDeadline) {
            const regDate = new Date(conf.registrationDeadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            registrationDeadlineEl.textContent = regDate;
        } else {
            registrationDeadlineEl.textContent = 'Not specified';
        }
    }
    
        const positionPaperDeadlineEl = document.getElementById('positionPaperDeadline');
        if (positionPaperDeadlineEl) {
            if (conf.positionPaperDeadline) {
                const ppDate = new Date(conf.positionPaperDeadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                positionPaperDeadlineEl.textContent = ppDate;
            } else {
                positionPaperDeadlineEl.textContent = 'Not specified - Check with organizers';
            }
        }

        // Contact information with Instagram copy buttons
        setContactInfoWithCopyButtons('generalEmail', conf.generalEmail || 'Not provided');
        setContactInfoWithCopyButtons('munAccount', conf.munAccount || 'Not provided');
        setContactInfoWithCopyButtons('advisorAccount', conf.advisorAccount || 'Not provided');
        setContactInfoWithCopyButtons('secGenAccounts', conf.secGenAccounts || 'Not provided');
        setContactInfoWithCopyButtons('parliamentarianAccounts', conf.parliamentarianAccounts || 'Not provided');

        // Committees with descriptions
        if (conf.committees && conf.committees.length > 0) {
        const committeeItems = conf.committees.map(c => {
            // Handle both object format (from database) and string format (legacy)
            let committeeName, committeeTopic, chairInfo;
            
            if (typeof c === 'object' && c !== null) {
                // Database format: object with separate fields
                let rawCommitteeName = c.committee_name || c.name || '';
                
                // Extract abbreviation from committee name (remove anything in parentheses)
                committeeName = rawCommitteeName.split(' (')[0].trim();
                committeeTopic = c.topic || '';
                // Get chair info from any possible field name
                chairInfo = c.chairs_info || c.chair_info || c.chairInfo || '';
                
                // Parse multiple topics separated by " | "
                const topics = committeeTopic ? committeeTopic.split(' | ').map(t => t.trim().replace(/\|$/, '')).filter(t => t) : [];
                committeeTopic = topics;
            } else {
                // Legacy string format: parse the string
                committeeName = c;
                committeeTopic = '';
                chairInfo = '';
                
                // Check if it contains "Chairs:" to identify chair info
                if (c.includes('Chairs:')) {
                    // Split by "Chairs:" to separate content from chair info
                    const parts = c.split('Chairs:');
                    // Remove trailing " | " before parsing main content
                    let mainContent = parts[0].trim().replace(/\s*\|\s*$/, '');
                    chairInfo = 'Chairs: ' + parts.slice(1).join('Chairs:').trim();
                    
                    // Now parse the main content for committee name and topics
                    if (mainContent.includes(' - ')) {
                        const nameTopicParts = mainContent.split(' - ');
                        let rawCommitteeName = nameTopicParts[0].trim();
                        // Extract abbreviation from committee name (remove anything in parentheses)
                        committeeName = rawCommitteeName.split(' (')[0].trim();
                        const topicString = nameTopicParts.slice(1).join(' - ').trim();
                        
                        // Parse multiple topics separated by " | "
                        const topics = topicString ? topicString.split(' | ').map(t => t.trim().replace(/\|$/, '')).filter(t => t) : [];
                        committeeTopic = topics;
                    } else {
                        committeeName = mainContent;
                    }
                } else if (c.includes(' | ')) {
                    // May have topic separators or chair info without "Chairs:" prefix
                    const mainParts = c.split(' | ');
                    const mainContent = mainParts[0].trim();
                    const lastPart = mainParts[mainParts.length - 1].trim();
                    
                    // Check if last part looks like chair info (contains @, names with commas, or common chair keywords)
                    // More comprehensive check for chair-related terms
                    const lastPartLower = lastPart.toLowerCase();
                    const looksLikeChairs = lastPart.includes('@') || 
                                          (lastPart.includes(',') && !lastPartLower.includes('topic')) ||
                                          lastPartLower.includes('chair') ||
                                          lastPartLower.includes('head chair') ||
                                          lastPartLower.includes('deputy chair') ||
                                          lastPartLower.includes('president') ||
                                          lastPartLower.includes('vice president') ||
                                          lastPartLower.includes('editor') ||
                                          lastPartLower.includes('editor in chief') ||
                                          lastPartLower.includes('deputy editor') ||
                                          lastPart === 'TBD' ||
                                          lastPart === 'A, B' ||
                                          /^(head|deputy|president|vice president|editor)/i.test(lastPart.trim());
                    
                    if (looksLikeChairs && mainParts.length > 1) {
                        // Last part is chair info
                        chairInfo = lastPart;
                        const contentParts = mainParts.slice(0, -1);
                        const fullContent = contentParts.join(' | ');
                        
                        // Parse the content for committee name and topics
                        if (fullContent.includes(' - ')) {
                            const parts = fullContent.split(' - ');
                            let rawCommitteeName = parts[0].trim();
                            committeeName = rawCommitteeName.split(' (')[0].trim();
                            const topicString = parts.slice(1).join(' - ').trim();
                            const topics = topicString ? topicString.split(' | ').map(t => t.trim().replace(/\|$/, '')).filter(t => t) : [];
                            committeeTopic = topics;
                        } else {
                            committeeName = fullContent;
                        }
                    } else {
                        // No chair info, treat as topic separators
                        if (mainContent.includes(' - ')) {
                            const parts = mainContent.split(' - ');
                            let rawCommitteeName = parts[0].trim();
                            committeeName = rawCommitteeName.split(' (')[0].trim();
                            const topicString = parts.slice(1).join(' - ').trim();
                            const topics = topicString ? topicString.split(' | ').map(t => t.trim().replace(/\|$/, '')).filter(t => t) : [];
                            // Add remaining parts as additional topics
                            mainParts.slice(1).forEach(p => {
                                const trimmed = p.trim();
                                if (trimmed && !trimmed.includes('@') && !trimmed.includes('TBD') && !trimmed.includes('A, B')) {
                                    topics.push(trimmed);
                                }
                            });
                            committeeTopic = topics;
                        } else {
                            committeeName = mainContent;
                            // Parse remaining parts as topics (excluding those that look like chairs)
                            const topics = mainParts.slice(1).map(t => t.trim()).filter(t => {
                                return t && !t.includes('@') && !t.includes('TBD') && !t.includes('A, B');
                            });
                            committeeTopic = topics;
                        }
                    }
                } else if (c.includes(' - ')) {
                    // Simple format: Committee Name - Single Topic
                    const parts = c.split(' - ');
                    let rawCommitteeName = parts[0].trim();
                    // Extract abbreviation from committee name (remove anything in parentheses)
                    committeeName = rawCommitteeName.split(' (')[0].trim();
                    const rest = parts.slice(1).join(' - ').trim();
                    
                    // Check if the rest contains chair info (even without " | " separator)
                    if (rest.includes('@') || 
                        rest.toLowerCase().includes('chair') || 
                        rest.toLowerCase().includes('head') ||
                        rest.toLowerCase().includes('deputy') ||
                        rest.toLowerCase().includes('president') ||
                        rest.toLowerCase().includes('editor')) {
                        // Try to extract chair info from the rest
                        // Look for patterns like "Head Chair:", "Deputy Chair:", etc.
                        const chairMatch = rest.match(/(head\s+chair|deputy\s+chair|president|vice\s+president|editor\s+in\s+chief|deputy\s+editor|editor)[:].*$/i);
                        if (chairMatch) {
                            const chairIndex = rest.indexOf(chairMatch[0]);
                            committeeTopic = rest.substring(0, chairIndex).trim();
                            chairInfo = rest.substring(chairIndex).trim();
                        } else {
                            committeeTopic = rest;
                        }
                    } else {
                        committeeTopic = rest;
                    }
                }
                
                // Final fallback: if we still don't have chair info but the string contains chair-related terms
                if (!chairInfo && typeof c === 'string') {
                    const chairPatterns = [
                        /head\s+chair[:\s].*?deputy\s+chair[:\s].*?/i,
                        /president[:\s].*?vice\s+president[:\s].*?/i,
                        /editor\s+in\s+chief[:\s].*?editor[:\s].*?/i,
                        /chair[:\s].*?@/i
                    ];
                    
                    for (const pattern of chairPatterns) {
                        const match = c.match(pattern);
                        if (match) {
                            // Extract the chair info part
                            const matchIndex = c.indexOf(match[0]);
                            if (matchIndex > 0 && c[matchIndex - 1] === '|') {
                                chairInfo = c.substring(matchIndex).trim();
                                // Update committeeTopic if we extracted it from the same string
                                if (!committeeTopic && matchIndex > 0) {
                                    const beforeMatch = c.substring(0, matchIndex - 1).trim();
                                    if (beforeMatch.includes(' - ')) {
                                        const parts = beforeMatch.split(' - ');
                                        committeeName = parts[0].trim();
                                        committeeTopic = parts.slice(1).join(' - ').trim();
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }
            
            // Extract raw committee name for difficulty detection
            let rawCommitteeName = '';
            if (typeof c === 'object' && c !== null) {
                rawCommitteeName = c.committee_name || c.name || '';
            } else if (typeof c === 'string') {
                rawCommitteeName = c;
            }
            
            const desc = getCommitteeDescription(committeeName, rawCommitteeName);
            
            // Difficulty label styling for topics
            const difficultyStyles = {
                beginner: 'background: #e8f5e9; color: #2e7d32; border: 1px solid #81c784;',
                intermediate: 'background: #fff3e0; color: #e65100; border: 1px solid #ffb74d;',
                advanced: 'background: #ffebee; color: #c62828; border: 1px solid #ef5350;'
            };
            
            const difficultyEmojis = {
                beginner: '🌱',
                intermediate: '⭐',
                advanced: '🔥'
            };
            
            return `
                <div class="committee-item" style="background: var(--bg-glass); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                        <span style="font-size: 1.5em;">${desc.icon}</span>
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
                                <strong style="font-size: 1.1em; color: var(--text-primary);">${committeeName}</strong>
                                ${desc.type ? `<span style="font-size: 0.7em; padding: 2px 6px; border-radius: 10px; font-weight: bold; text-transform: uppercase; ${desc.type === 'traditional' ? 'background: #e3f2fd; color: #1976d2; border: 1px solid #bbdefb;' : 'background: #f3e5f5; color: #7b1fa2; border: 1px solid #ce93d8;'}">${desc.type === 'traditional' ? '🏛️ Traditional' : '⭐ Specialized'}</span>` : ''}
                            </div>
                            <div style="font-size: 0.9em; color: var(--text-secondary);">(${desc.name})</div>
                        </div>
                    </div>
                    ${Array.isArray(committeeTopic) && committeeTopic.length > 0 ? `
                        <div style="margin: 8px 0;">
                            <strong style="color: var(--accent-blue); font-size: 0.95em;">Topics:</strong>
                            <ul style="margin: 4px 0 0 0; padding-left: 20px; color: var(--accent-blue); font-size: 0.95em; list-style: none;">
                                ${committeeTopic.map((topic, index) => {
                                    // Remove existing "Topic X:" prefix if present
                                    const cleanTopic = topic.replace(/^Topic \d+:\s*/, '');
                                    // Get difficulty for this specific topic
                                    const topicDifficulty = getTopicDifficulty(cleanTopic, desc.type);
                                    return `
                                        <li style="margin-bottom: 8px; padding: 8px; background: rgba(0,0,0,0.02); border-radius: 8px; border-left: 3px solid ${topicDifficulty === 'beginner' ? '#81c784' : topicDifficulty === 'intermediate' ? '#ffb74d' : '#ef5350'};">
                                            <div style="display: flex; align-items: flex-start; gap: 8px; flex-wrap: wrap;">
                                                <strong style="flex: 1;">Topic ${index + 1}:</strong>
                                                <span style="font-size: 0.65em; padding: 2px 6px; border-radius: 10px; font-weight: bold; text-transform: capitalize; ${difficultyStyles[topicDifficulty]}">${difficultyEmojis[topicDifficulty]} ${topicDifficulty}</span>
                                            </div>
                                            <div style="margin-top: 4px; color: var(--text-secondary);">${cleanTopic}</div>
                                        </li>
                                    `;
                                }).join('')}
                            </ul>
                        </div>
                    ` : committeeTopic ? (() => {
                        const topicDifficulty = getTopicDifficulty(committeeTopic, desc.type);
                        return `
                            <div style="margin: 8px 0; padding: 8px; background: rgba(0,0,0,0.02); border-radius: 8px; border-left: 3px solid ${topicDifficulty === 'beginner' ? '#81c784' : topicDifficulty === 'intermediate' ? '#ffb74d' : '#ef5350'};">
                                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px;">
                                    <strong style="color: var(--accent-blue); font-size: 0.95em;">Topic:</strong>
                                    <span style="font-size: 0.65em; padding: 2px 6px; border-radius: 10px; font-weight: bold; text-transform: capitalize; ${difficultyStyles[topicDifficulty]}">${difficultyEmojis[topicDifficulty]} ${topicDifficulty}</span>
                                </div>
                                <div style="color: var(--text-secondary);">${committeeTopic}</div>
                            </div>
                        `;
                    })() : ''}
                    <p style="margin: 8px 0; color: var(--text-secondary); font-size: 0.95em;">${desc.description}</p>
                    <p style="margin: 4px 0 0 0; color: var(--text-secondary); font-size: 0.9em;"><strong>Focus:</strong> ${desc.focus}</p>
                    ${desc.note ? `<p style="margin: 4px 0 0 0; color: var(--accent-blue); font-size: 0.9em; font-style: italic;"><strong>Note:</strong> ${desc.note}</p>` : ''}
                    ${chairInfo && chairInfo.trim() ? `
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-color);">
                            <div style="color: var(--accent-green); font-size: 0.9em; margin-bottom: 8px;">
                                <strong><i class="fas fa-user-tie"></i> ${chairInfo.startsWith('Chairs:') || chairInfo.startsWith('Chair:') ? chairInfo : 'Chairs: ' + chairInfo}</strong>
                            </div>
                            ${formatChairInfoWithCopyButtons(chairInfo)}
                        </div>
                    ` : `
                        <p style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-color); color: var(--accent-green); font-size: 0.9em;"><strong><i class="fas fa-user-tie"></i> Chairs: TBD</strong></p>
                    `}
                </div>
            `;
        }).join('');
        const committeesEl = document.getElementById('committees');
        if (committeesEl) {
            committeesEl.innerHTML = committeeItems;
        }
    } else {
        const committeesEl = document.getElementById('committees');
        if (committeesEl) {
            committeesEl.innerHTML = '<p>Committee information coming soon.</p>';
        }
    }

        // Unique Topics
        const uniqueTopicsEl = document.getElementById('uniqueTopics');
        if (uniqueTopicsEl) {
            if (conf.uniqueTopics && conf.uniqueTopics.length > 0) {
                uniqueTopicsEl.innerHTML = `<ul class="topic-list">${conf.uniqueTopics.map(t => `<li>${t}</li>`).join('')}</ul>`;
            } else {
                uniqueTopicsEl.innerHTML = '<p>Topic information coming soon.</p>';
            }
        }

        // Chairs & Pages
        const chairsPagesEl = document.getElementById('chairsPages');
        if (chairsPagesEl) {
            if (conf.chairsPages) {
                chairsPagesEl.innerHTML = conf.chairsPages;
            } else {
                chairsPagesEl.innerHTML = '<p>Chair information will be announced soon.</p>';
            }
        }

        // Allocations
        const allocationsEl = document.getElementById('allocations');
        if (allocationsEl) {
            if (conf.allocations && conf.allocations.length > 0) {
                allocationsEl.innerHTML = `<ul class="allocation-list">${conf.allocations.map(a => `<li>${a}</li>`).join('')}</ul>`;
            } else {
                allocationsEl.innerHTML = '<p>Allocation information will be provided closer to the conference date.</p>';
            }
        }

        // Awards with descriptions
        if (conf.availableAwards && conf.availableAwards.length > 0) {
        const awardItems = conf.availableAwards.map(a => {
            const desc = getAwardDescription(a);
            return `
                <div class="award-item" style="background: var(--bg-glass); border: 1px solid var(--border-color); border-left: 4px solid ${desc.color}; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                        <span style="font-size: 1.5em;">${desc.icon}</span>
                        <strong style="font-size: 1.1em; color: var(--text-primary);">${a}</strong>
                    </div>
                    <p style="margin: 8px 0; color: var(--text-secondary); font-size: 0.95em;">${desc.description}</p>
                    <p style="margin: 4px 0 0 0; color: var(--text-secondary); font-size: 0.9em;"><strong>Criteria:</strong> ${desc.criteria}</p>
                </div>
            `;
        }).join('');
        const availableAwardsEl = document.getElementById('availableAwards');
        if (availableAwardsEl) {
            availableAwardsEl.innerHTML = awardItems;
        }
    } else {
        const availableAwardsEl = document.getElementById('availableAwards');
        if (availableAwardsEl) {
            availableAwardsEl.innerHTML = '<p>Award categories to be announced.</p>';
        }
    }

        const previousWinnersEl = document.getElementById('previousWinners');
        if (previousWinnersEl) {
            if (conf.previousWinners && conf.previousWinners.length > 0) {
                previousWinnersEl.innerHTML = `<ul class="award-list">${conf.previousWinners.map(w => `<li>${w}</li>`).join('')}</ul>`;
            } else {
                previousWinnersEl.innerHTML = '<p>No previous winners (first-time conference or information not available).</p>';
            }
        }

        // Schedule
        const scheduleEl = document.getElementById('schedule');
        if (scheduleEl) {
            if (conf.schedule) {
                scheduleEl.innerHTML = conf.schedule;
            } else {
                scheduleEl.innerHTML = '<p>Detailed schedule will be released closer to the conference date.</p>';
            }
        }

        // Independent Delegates
        const independentDelsWelcomeEl = document.getElementById('independentDelsWelcome');
        if (independentDelsWelcomeEl) {
            independentDelsWelcomeEl.textContent = conf.independentDelsWelcome ? 'Yes, independent delegates are welcome! Advisors are welcome but not necessary.' : 'Currently only accepting school delegations.';
        }
        
        const independentSignupEl = document.getElementById('independentSignup');
        if (independentSignupEl) {
            if (conf.independentDelsWelcome && conf.independentSignupLink) {
                independentSignupEl.innerHTML = `<a href="${conf.independentSignupLink}" class="btn btn-primary" style="width: 100%; margin-top: 12px;"><i class="fas fa-user-plus"></i> Sign Up as Independent Delegate</a>`;
            } else {
                independentSignupEl.innerHTML = '';
            }
        }

        // Advisor Signup
        const advisorSignupEl = document.getElementById('advisorSignup');
        if (advisorSignupEl) {
            if (conf.advisorSignupLink) {
                advisorSignupEl.innerHTML = `<a href="${conf.advisorSignupLink}" class="btn btn-primary" style="width: 100%;"><i class="fas fa-chalkboard-teacher"></i> Sign Up Your School</a>`;
            } else {
                advisorSignupEl.innerHTML = '<p>Contact the conference organizers for registration information.</p>';
            }
        }

        // Accessibility
        const disabledSuitableEl = document.getElementById('disabledSuitable');
        if (disabledSuitableEl) {
            disabledSuitableEl.textContent = conf.disabledSuitable ? '✓ Yes, facilities are accessible' : '✗ Limited accessibility - contact organizers for details';
        }
        const sensorySuitableEl = document.getElementById('sensorySuitable');
        if (sensorySuitableEl) {
            sensorySuitableEl.textContent = conf.sensorySuitable ? '✓ Yes, accommodations available' : '✗ Limited accommodations - contact organizers for details';
        }

        // Venue Guide
        const venueGuideEl = document.getElementById('venueGuide');
        if (venueGuideEl) {
            if (conf.venueGuide) {
                venueGuideEl.innerHTML = conf.venueGuide;
            } else {
                venueGuideEl.innerHTML = '<p>Venue information will be provided to registered participants.</p>';
            }
        }

        // Extra Notes
        const extraNotesEl = document.getElementById('extraNotes');
        if (extraNotesEl) {
            if (conf.extraNotes) {
                extraNotesEl.innerHTML = conf.extraNotes;
            } else {
                extraNotesEl.innerHTML = '<p>No additional notes at this time.</p>';
            }
        }
    } catch (error) {
        console.error('Error in populateConferenceDetail:', error);
        const conferenceNameEl = document.getElementById('conferenceName');
        if (conferenceNameEl) {
            conferenceNameEl.textContent = 'Error Loading Conference Details';
        }
    }
}

// Setup attendance button
function setupAttendanceButton(conference) {
    const attendanceBtn = document.getElementById('attendanceBtn');
    
    // Check if user is logged in
    const currentUser = localStorage.getItem('munCurrentUser');
    
    if (!currentUser) {
        attendanceBtn.innerHTML = '<i class="fas fa-lock"></i> Login to Mark Attendance';
        attendanceBtn.addEventListener('click', () => {
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.classList.add('show');
                loginModal.style.display = 'flex';
            }
        });
        return;
    }

    // Update button based on attendance status
    const status = conference.attendanceStatus || 'not-attending';
    updateAttendanceButton(status);

    attendanceBtn.addEventListener('click', () => {
        toggleAttendance(conference.id);
    });
}

function updateAttendanceButton(status) {
    const btn = document.getElementById('attendanceBtn');
    
    switch (status) {
        case 'attending':
            btn.innerHTML = '<i class="fas fa-check-circle"></i> Mark as Attended';
            break;
        case 'attended':
            btn.innerHTML = '<i class="fas fa-times-circle"></i> Remove Attendance';
            break;
        default:
            btn.innerHTML = '<i class="fas fa-user-check"></i> Mark as Attending';
    }
}

function toggleAttendance(conferenceId) {
    const savedConferences = localStorage.getItem('munConferences');
    if (!savedConferences) return;

    const conferences = JSON.parse(savedConferences);
    const conference = conferences.find(c => c.id == conferenceId);
    
    if (!conference) return;

    const currentStatus = conference.attendanceStatus || 'not-attending';
    let newStatus;

    switch (currentStatus) {
        case 'not-attending':
            newStatus = 'attending';
            break;
        case 'attending':
            newStatus = 'attended';
            break;
        case 'attended':
            newStatus = 'not-attending';
            break;
        default:
            newStatus = 'attending';
    }

    conference.attendanceStatus = newStatus;
    localStorage.setItem('munConferences', JSON.stringify(conferences));
    
    updateAttendanceButton(newStatus);
    
    // Show message
    showTempMessage(`Marked as ${getAttendanceLabel(newStatus)}`);
}

function getAttendanceLabel(status) {
    switch (status) {
        case 'attending': return 'Attending';
        case 'attended': return 'Attended';
        default: return 'Not Attending';
    }
}

function showTempMessage(message) {
    // Create temporary message
    const msg = document.createElement('div');
    msg.className = 'temp-message';
    msg.textContent = message;
    msg.style.cssText = 'position: fixed; top: 100px; right: 24px; background: var(--accent-green); color: white; padding: 16px 24px; border-radius: 12px; z-index: 10000; box-shadow: 0 8px 24px rgba(0,0,0,0.2);';
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.remove();
    }, 3000);
}

// Setup Award Button
function setupAwardButton(conference) {
    const addAwardBtn = document.getElementById('addAwardBtn');
    const currentUser = JSON.parse(localStorage.getItem('munCurrentUser'));
    
    if (currentUser) {
        // Show the button for logged-in users
        addAwardBtn.style.display = 'flex';
        
        // Add click handler
        addAwardBtn.addEventListener('click', () => {
            openAwardModal(conference);
        });
    } else {
        // Hide for non-logged-in users
        addAwardBtn.style.display = 'none';
    }
}

// Open Award Modal with pre-filled conference data
function openAwardModal(conference) {
    const awardModal = document.getElementById('awardModal');
    const awardForm = document.getElementById('awardForm');
    
    // Reset form
    awardForm.reset();
    
    // Pre-fill conference name (readonly)
    const awardConference = document.getElementById('awardConference');
    const awardDate = document.getElementById('awardDate');
    const otherAwardTypeGroup = document.getElementById('otherAwardTypeGroup');
    
    if (awardConference) awardConference.value = conference.name;
    if (awardDate) awardDate.value = conference.startDate;
    if (otherAwardTypeGroup) otherAwardTypeGroup.style.display = 'none';
    
    // Show modal
    awardModal.classList.add('show');
}

// Close Award Modal
function closeAwardModal() {
    const awardModal = document.getElementById('awardModal');
    if (awardModal) {
        awardModal.classList.remove('show');
        awardModal.style.display = 'none';
        // Reset form
        const awardForm = document.getElementById('awardForm');
        if (awardForm) {
            awardForm.reset();
            // Hide "other" award type field
            const otherGroup = document.getElementById('otherAwardTypeGroup');
            if (otherGroup) {
                otherGroup.style.display = 'none';
            }
        }
    }
}

// Handle Award Form Submission
function handleAwardSubmit(e) {
    e.preventDefault();
    
    const awardConferenceEl = document.getElementById('awardConference');
    const awardTypeEl = document.getElementById('awardType');
    const awardTypeOtherEl = document.getElementById('awardTypeOther');
    const awardCommitteeEl = document.getElementById('awardCommittee');
    const awardDateEl = document.getElementById('awardDate');
    const awardNotesEl = document.getElementById('awardNotes');
    
    if (!awardConferenceEl || !awardTypeEl || !awardDateEl) {
        console.error('Required award form elements not found');
        return;
    }
    
    const conference = awardConferenceEl.value.trim();
    const awardTypeSelect = awardTypeEl.value;
    const awardType = awardTypeSelect === 'Other' && awardTypeOtherEl ? awardTypeOtherEl.value.trim() : awardTypeSelect;
    const committee = awardCommitteeEl ? awardCommitteeEl.value.trim() : '';
    const date = awardDateEl.value;
    const notes = awardNotesEl ? awardNotesEl.value.trim() : '';
    
    if (!conference || !awardType || !committee || !date) {
        alert('Please fill in all required fields.');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('munCurrentUser'));
    if (!currentUser) {
        alert('You must be logged in to add awards.');
        return;
    }
    
    // Initialize awards array if it doesn't exist
    if (!currentUser.awards) {
        currentUser.awards = [];
    }
    
    // Create new award
    const newAward = {
        id: Date.now().toString(),
        conference,
        type: awardType,
        committee,
        date,
        notes,
        createdAt: new Date().toISOString()
    };
    
    currentUser.awards.push(newAward);
    
    // Save to localStorage
    localStorage.setItem('munCurrentUser', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('munUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('munUsers', JSON.stringify(users));
    }
    
    // Show success message
    alert('Award registered successfully! View it on your profile page.');
    
    // Close modal
    closeAwardModal();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Check if the required elements exist - this is the most reliable way to detect the page
        const conferenceNameEl = document.getElementById('conferenceName');
        const locationEl = document.getElementById('location');
        
        // Only proceed if we're definitely on a conference detail page
        if (conferenceNameEl && locationEl) {
            // Function to wait for conferences to be available in localStorage
            function waitForConferences(callback, maxAttempts = 10, delay = 100) {
                let attempts = 0;
                const checkInterval = setInterval(() => {
                    attempts++;
                    const savedConferences = localStorage.getItem('munConferences');
                    if (savedConferences) {
                        clearInterval(checkInterval);
                        callback();
                    } else if (attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                        // Still try to load even if no data found (will show error message)
                        callback();
                    }
                }, delay);
            }
            
            // Wait for script.js to initialize and populate localStorage
            waitForConferences(() => {
                try {
                    loadConferenceDetail();
                } catch (error) {
                    console.error('Error in loadConferenceDetail:', error);
                }
            });
            
            // Also retry after a longer delay in case script.js loads conferences later
            setTimeout(() => {
                try {
                    // Check if page was already populated (still shows default or error)
                    const currentText = conferenceNameEl.textContent.trim();
                    if (currentText === 'Conference Name' || currentText === 'Conference Not Found' || currentText === '' || currentText === 'Error Loading Conference') {
                        loadConferenceDetail();
                    }
                } catch (error) {
                    console.error('Error in loadConferenceDetail (retry 1):', error);
                }
            }, 1500);
            
            // One more retry after 3 seconds for slow loading
            setTimeout(() => {
                try {
                    const currentText = conferenceNameEl.textContent.trim();
                    if (currentText === 'Conference Name' || currentText === 'Conference Not Found' || currentText === '' || currentText === 'Error Loading Conference') {
                        loadConferenceDetail();
                    }
                } catch (error) {
                    console.error('Error in loadConferenceDetail (retry 2):', error);
                }
            }, 3000);
            
            // Setup award modal event listeners
            try {
                const closeAwardModalBtn = document.getElementById('closeAwardModal');
                const cancelAwardBtn = document.getElementById('cancelAwardBtn');
                const awardForm = document.getElementById('awardForm');
                const awardTypeSelect = document.getElementById('awardType');
                const awardModal = document.getElementById('awardModal');
                
                if (closeAwardModalBtn) {
                    closeAwardModalBtn.addEventListener('click', closeAwardModal);
                }
                
                if (cancelAwardBtn) {
                    cancelAwardBtn.addEventListener('click', closeAwardModal);
                }
                
                if (awardModal) {
                    awardModal.addEventListener('click', (e) => {
                        if (e.target === awardModal) {
                            closeAwardModal();
                        }
                    });
                }
                
                if (awardForm) {
                    awardForm.addEventListener('submit', handleAwardSubmit);
                }
                
                if (awardTypeSelect) {
                    awardTypeSelect.addEventListener('change', () => {
                        const otherGroup = document.getElementById('otherAwardTypeGroup');
                        const otherInput = document.getElementById('awardTypeOther');
                        if (awardTypeSelect.value === 'Other') {
                            if (otherGroup) otherGroup.style.display = 'block';
                            if (otherInput) otherInput.required = true;
                        } else {
                            if (otherGroup) otherGroup.style.display = 'none';
                            if (otherInput) otherInput.required = false;
                        }
                    });
                }
            } catch (error) {
                console.error('Error setting up award modal:', error);
            }

            // Feedback functionality
            try {
                setupFeedbackSection();
            } catch (error) {
                console.error('Error setting up feedback section:', error);
            }
        }
        // If not on conference detail page, do nothing - don't redirect
    } catch (error) {
        console.error('Error in conference-detail.js DOMContentLoaded:', error);
        // Don't block page load - just log the error
    }
});

// Feedback Section Functions
function setupFeedbackSection() {
    const addFeedbackBtn = document.getElementById('addFeedbackBtn');
    const feedbackModal = document.getElementById('feedbackModal');
    const closeFeedbackModal = document.getElementById('closeFeedbackModal');
    const cancelFeedbackBtn = document.getElementById('cancelFeedbackBtn');
    const feedbackForm = document.getElementById('feedbackForm');
    const starRating = document.getElementById('starRating');
    const feedbackRatingInput = document.getElementById('feedbackRating');

    // Load and display feedback
    loadFeedback();

    // Check if user can leave feedback (must have attended)
    checkFeedbackEligibility();

    // Star rating functionality
    if (starRating) {
        const stars = starRating.querySelectorAll('i');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = star.getAttribute('data-rating');
                feedbackRatingInput.value = rating;
                updateStarDisplay(rating);
            });

            star.addEventListener('mouseenter', () => {
                const rating = star.getAttribute('data-rating');
                updateStarDisplay(rating, true);
            });
        });

        starRating.addEventListener('mouseleave', () => {
            const currentRating = feedbackRatingInput.value;
            updateStarDisplay(currentRating);
        });
    }

    // Open feedback modal
    if (addFeedbackBtn) {
        addFeedbackBtn.addEventListener('click', () => {
            feedbackModal.classList.add('show');
            feedbackModal.style.display = 'flex';
        });
    }

    // Close feedback modal
    if (closeFeedbackModal) {
        closeFeedbackModal.addEventListener('click', closeFeedbackModalHandler);
    }
    if (cancelFeedbackBtn) {
        cancelFeedbackBtn.addEventListener('click', closeFeedbackModalHandler);
    }

    // Submit feedback
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    }
}

function updateStarDisplay(rating, hover = false) {
    const stars = document.querySelectorAll('#starRating i');
    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= rating) {
            star.classList.remove('far');
            star.classList.add('fas');
            if (hover) star.classList.add('active');
        } else {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        }
    });
}

function checkFeedbackEligibility() {
    const currentUser = JSON.parse(localStorage.getItem('munCurrentUser'));
    const conferenceId = new URLSearchParams(window.location.search).get('id');
    
    if (!currentUser || !conferenceId) {
        return;
    }

    // Check if user attended this conference
    const savedConferences = localStorage.getItem('munConferences');
    if (!savedConferences) return;

    const conferences = JSON.parse(savedConferences);
    const conference = conferences.find(c => c.id == conferenceId);

    if (conference && conference.attendanceStatus === 'attended') {
        const addFeedbackContainer = document.getElementById('addFeedbackContainer');
        if (addFeedbackContainer) addFeedbackContainer.style.display = 'block';
    }
}

function loadFeedback() {
    const conferenceId = new URLSearchParams(window.location.search).get('id');
    if (!conferenceId) return;

    const feedbackData = JSON.parse(localStorage.getItem('conferenceFeedback') || '{}');
    const conferenceFeedback = feedbackData[conferenceId] || [];

    if (conferenceFeedback.length > 0) {
        displayFeedbackStats(conferenceFeedback);
        displayFeedbackList(conferenceFeedback);
    }
}

function displayFeedbackStats(feedback) {
    const avgRating = (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1);
    const recommendCount = feedback.filter(f => f.recommend).length;
    const recommendPercent = Math.round((recommendCount / feedback.length) * 100);

    document.getElementById('avgRating').textContent = avgRating;
    document.getElementById('totalReviews').textContent = feedback.length;
    document.getElementById('recommendPercent').textContent = recommendPercent + '%';
    const feedbackStats = document.getElementById('feedbackStats');
    if (feedbackStats) feedbackStats.style.display = 'grid';
}

function displayFeedbackList(feedback) {
    const feedbackList = document.getElementById('feedbackList');
    
    if (feedback.length === 0) {
        feedbackList.innerHTML = `
            <div class="empty-feedback">
                <i class="fas fa-comment-slash" style="font-size: 48px; color: var(--text-tertiary); margin-bottom: 16px;"></i>
                <p>No reviews yet. Be the first to share your experience!</p>
            </div>
        `;
        return;
    }

    feedbackList.innerHTML = feedback.map(f => `
        <div class="feedback-item">
            <div class="feedback-header">
                <div class="feedback-user-info">
                    <img src="${f.userAvatar || 'https://via.placeholder.com/48'}" alt="${f.userName}" class="feedback-avatar">
                    <div class="feedback-user-details">
                        <h4>${f.userName}</h4>
                        <div class="feedback-date">${new Date(f.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                </div>
                <div class="feedback-rating">
                    ${Array(5).fill(0).map((_, i) => `<i class="fas fa-star" style="color: ${i < f.rating ? '#FFD700' : 'var(--border-color)'}"></i>`).join('')}
                </div>
            </div>
            
            <h3 class="feedback-title">${f.title}</h3>
            <p class="feedback-comment">${f.comment}</p>
            
            <div class="feedback-tags">
                ${f.recommend ? '<span class="feedback-tag recommend"><i class="fas fa-thumbs-up"></i> Recommends</span>' : ''}
            </div>
            
            ${f.highlights || f.improvements ? `
                <div class="feedback-details">
                    ${f.highlights ? `
                        <div class="feedback-detail-section">
                            <h5><i class="fas fa-star"></i> Highlights</h5>
                            <p>${f.highlights}</p>
                        </div>
                    ` : ''}
                    ${f.improvements ? `
                        <div class="feedback-detail-section">
                            <h5><i class="fas fa-lightbulb"></i> Areas for Improvement</h5>
                            <p>${f.improvements}</p>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function closeFeedbackModalHandler() {
    const feedbackModal = document.getElementById('feedbackModal');
    if (feedbackModal) {
        feedbackModal.classList.remove('show');
        feedbackModal.style.display = 'none';
        // Reset form
        const feedbackForm = document.getElementById('feedbackForm');
        if (feedbackForm) {
            feedbackForm.reset();
        }
        const ratingInput = document.getElementById('feedbackRating');
        if (ratingInput) {
            ratingInput.value = '';
        }
        // Reset star display
        if (typeof updateStarDisplay === 'function') {
            updateStarDisplay(0);
        } else {
            // Fallback: manually reset stars
            const stars = document.querySelectorAll('#starRating i');
            if (stars.length > 0) {
                stars.forEach(star => {
                    star.classList.remove('fas', 'active');
                    star.classList.add('far');
                });
            }
        }
    }
}

function handleFeedbackSubmit(e) {
    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem('munCurrentUser'));
    if (!currentUser) {
        alert('You must be logged in to submit feedback.');
        return;
    }

    const conferenceId = new URLSearchParams(window.location.search).get('id');
    const feedbackRatingEl = document.getElementById('feedbackRating');
    const feedbackTitleEl = document.getElementById('feedbackTitle');
    const feedbackCommentEl = document.getElementById('feedbackComment');
    const feedbackRecommendEl = document.getElementById('feedbackRecommend');
    const feedbackHighlightsEl = document.getElementById('feedbackHighlights');
    const feedbackImprovementsEl = document.getElementById('feedbackImprovements');
    
    if (!feedbackRatingEl || !feedbackTitleEl || !feedbackCommentEl) {
        console.error('Required feedback form elements not found');
        return;
    }
    
    const rating = parseInt(feedbackRatingEl.value);
    const title = feedbackTitleEl.value;
    const comment = feedbackCommentEl.value;
    const recommend = feedbackRecommendEl ? feedbackRecommendEl.checked : false;
    const highlights = feedbackHighlightsEl ? feedbackHighlightsEl.value : '';
    const improvements = feedbackImprovementsEl ? feedbackImprovementsEl.value : '';

    if (!rating) {
        alert('Please select a rating.');
        return;
    }

    const feedback = {
        id: Date.now(),
        conferenceId: conferenceId,
        userId: currentUser.uid || currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.profilePicture || '',
        rating: rating,
        title: title,
        comment: comment,
        recommend: recommend,
        highlights: highlights,
        improvements: improvements,
        date: new Date().toISOString()
    };

    // Save to localStorage
    const feedbackData = JSON.parse(localStorage.getItem('conferenceFeedback') || '{}');
    if (!feedbackData[conferenceId]) {
        feedbackData[conferenceId] = [];
    }
    feedbackData[conferenceId].push(feedback);
    localStorage.setItem('conferenceFeedback', JSON.stringify(feedbackData));

    // Save to Firebase if available
    if (typeof FirebaseDB !== 'undefined' && db) {
        FirebaseDB.saveFeedback(feedback).catch(err => console.error('Firebase feedback save error:', err));
    }

    // Close modal and reload feedback
    closeFeedbackModalHandler();
    loadFeedback();
    
    // Show success message
    alert('Thank you for your feedback!');
}


// Helper function to randomly select a topic from available groups
const selectRandomTopic = (topicGroups) => {
  const allTopics = topicGroups.flat();
  return allTopics[Math.floor(Math.random() * allTopics.length)];
};

// Fisher–Yates shuffle (mutates array, returns it)
const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const committees = [
  {
    id: "ep",
    name: "EP",
    topicGroups: [
      "The Question of Addressing the Socio-Economic Impact of Inflation and the Rising Cost of Living on Vulnerable Populations across Europe",
      "The Question of Standardization in Policies Across Europe to Prevent Poverty Driven Cycles of Crime",
      "The Question of Standardizing Migration and Asylum Policies to Uphold the Principle of National Sovereignty while Ensuring the Protection of Vulnerable Migrant and Refugee Populations",
      "The Question of Increased Scholarship Programmes to Aid in Migrant Integration",
      "The Question of Regulating Digital Access and Safeguarding Minors from Online Harms and Exploitation",
      "The Question of Harmonizing Core Educational Standards within the European Union to Ensure Equitable Quality and Labor Market Readiness",
      "The Question of Establishing Comprehensive Global Frameworks for the Prevention and Treatment of Adolescent Substance Use Disorder",
      "The Question of Ensuring Equitable Access to Safe and Adequate Government Housing and Clarifying International Standards for Minors' Legal Emancipation in Europe",
      "The Question of Establishing a Unified European Approach to the Decriminalization, Regulation, and Protection of Sex Workers",
      "The Question of Strengthening Anti-Corruption Mechanisms and Promoting Good Governance within European Member States",
    ],
    members: [
      "France", "Germany", "Italy", "Spain", "Poland", "Netherlands",
      "Belgium", "Greece", "Portugal", "Sweden", "Austria", "Denmark"
    ],
    subIssues: [
      "Addressing economic disparities and social protection mechanisms.",
      "Ensuring cross-border policy coordination and harmonization.",
      "Protecting vulnerable populations while maintaining national sovereignty.",
    ],
  },
  {
    id: "us-senate",
    name: "US Senate",
    topicGroups: [
      "The Question of Medicaid and Nationwide Legislation to Protect Less Fortunate Populations",
      "The Question of Regulating and Protecting Undocumented Immigrants in Healthcare Systems",
      "The Question of Establishing National Standards and Mechanisms to Guarantee Universal Access to Quality Education Focused on Fostering Critical Thinking and Media Literacy Skills",
      "The Question of Fostering Enhanced Inter-Agency and National Collaboration to Develop and Implement Data-Driven Strategies for the Effective Reduction of Violent Crime Rates",
      "The Question of Upholding the Right to Peaceful Assembly while Standardizing Ethical Guidelines for Public Order Management and Intervention in Civil Emergencies",
      "The Question of Addressing Systemic Racism and Ensuring Judicial Equality and Due Process in Law Enforcement Practices",
      "The Question of the Legality and Morality of Capital Punishment and its Application under International Human Rights Law",
      "The Question of Prioritizing Rehabilitative and Restorative Justice Models Over Punitive Sentencing in National Judicial Systems",
      "The Question of Developing Comprehensive National Strategies to Address and Prevent Targeted Violence in Educational Institutions",
      "The Question of Establishing National Guidelines for the Regulation of Small Arms and Light Weapons to Minimize Civilian Misuse",
    ],
    members: [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
      "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
      "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana"
    ],
    subIssues: [
      "Balancing federal and state authority in policy implementation.",
      "Ensuring equitable access and protection for all citizens.",
      "Addressing systemic inequalities while maintaining constitutional principles.",
    ],
  },
  {
    id: "ecosoc",
    name: "ECOSOC",
    topicGroups: [
      "The Question of Evaluating the Feasibility and Implementation of a Globally Coordinated Universal Basic Income (UBI) Programme as a Strategy for Poverty Eradication and Economic Stability",
      "The Question of Exploring International Mechanisms for Reallocating Military Expenditures Towards the Development and Strengthening of Global Public Health Systems",
      "The Question of Fostering Lifelong Learning and Economic Development through Universal Access to Subsidized Educational Financing",
      "The Question of Establishing International Guidelines to Protect the Financial Assets and Privacy of Minors in Digital Banking Environments",
      "The Question of Ensuring Equitable Financial Inclusion and Mitigating Technological Marginalization in the Global Transition toward Digital Currencies",
      "The Question of Enhancing Cybersecurity Standards and Upholding Consumer Data Protection in the International Digital Financial Sector",
      "The Question of Establishing Global Mechanisms to Combat Corporate Tax Avoidance and Ensure Fair and Proportionate International Taxation",
      "The Question of Developing Comprehensive Reintegration Programmes and Financial Support Systems to Reduce Recidivism among Former Incarcerated Individuals",
      "The Question of Enhancing Social Security Programme Integrity and Ensuring Equitable Distribution of State-Provided Benefits to Vulnerable Populations",
      "The Question of Reassessing and Standardizing Poverty Thresholds and Eligibility Criteria for Essential Social Programmes, including Subsidized Childcare",
    ],
    members: [
      "Algeria", "Argentina", "Brazil", "Canada", "Egypt", "Ghana",
      "Kenya", "Mexico", "Nigeria", "Norway", "South Africa", "United States"
    ],
    subIssues: [
      "Promoting economic development and social progress.",
      "Addressing global economic inequalities and financial inclusion.",
      "Ensuring sustainable development and poverty eradication.",
    ],
  },
  {
    id: "hsc",
    name: "HSC",
    topicGroups: [
      "SARS Outbreak (2002-2004)",
      "The Black Death (1346-1353)",
      "The September 11 Attacks (2001)",
      "The East African Embassy Bombings (1998)",
    ],
    members: [
      "China", "France", "United Kingdom", "United States", "Russia",
      "Algeria", "Argentina", "Brazil", "Ghana", "India", "Japan", "Norway"
    ],
    subIssues: [
      "Analyzing historical context and decision-making processes.",
      "Evaluating international response mechanisms and coordination.",
      "Assessing long-term implications and lessons learned.",
    ],
  },
  {
    id: "icj",
    name: "ICJ",
    topicGroups: [
      "Obligations concerning Negotiations relating to Cessation of the Nuclear Arms Race and to Nuclear Disarmament (Marshall Islands v. UK, India, Pakistan)",
      "Application of the Convention on the Prevention and Punishment of the Crime of Genocide (The Gambia v. Myanmar; South Africa v. Israel)",
      "Nuclear Tests Cases (Australia/New Zealand v. France)",
      "Nottebohm Case (Liechtenstein v. Guatemala)",
    ],
    members: [
      "Australia", "Brazil", "China", "France", "Germany", "India",
      "Japan", "Mexico", "Morocco", "Russia", "United Kingdom", "United States"
    ],
    subIssues: [
      "Examining legal principles and international law application.",
      "Assessing state obligations and compliance mechanisms.",
      "Evaluating judicial procedures and evidence standards.",
    ],
  },
  {
    id: "interpol",
    name: "Interpol",
    topicGroups: [
      "The Question of Disrupting Transnational Organized Crime Networks Engaged in the Exploitation of Minors",
      "The Question of Coordinating Law Enforcement Responses to the Global Proliferation of New Psychoactive Substances (NPS) and Adulterated Drugs",
      "The Question of Combating Individual Bribery and Corporate Corruption in Global Supply Chains for Illicit Goods",
      "The Question of Establishing Mechanisms for Law Enforcement to Monitor and Interdict Illicit Operations Using Private Vessels and Cargo Aircraft on Habitual Routes",
      "The Question of Enhancing Global Law Enforcement Capacity for the Prevention, Detection, and Investigation of Biological and Agro-Terrorism",
      "The Question of Disrupting the Convergence of Illicit Markets and Transnational Organized Crime Networks in the Mekong Sub-Region",
      "The Question of Assessing the Efficacy of Prevention Initiatives and Rehabilitation Programs in Global Crime Mitigation",
      "The Question of Evaluating Best Practices for Progressive Correctional Treatment and Reducing Post-Incarceration Offending",
      "The Question of Enhancing Global Operational Capacity to Investigate and Disrupt Transnational Cybercrime Networks",
      "The Question of Dismantling Cross-Border Organized Crime Groups Engaged in Human Trafficking and Modern Slavery",
    ],
    members: [
      "Argentina", "Australia", "Brazil", "Canada", "China", "France",
      "Germany", "India", "Japan", "Mexico", "Nigeria", "United Kingdom", "United States"
    ],
    subIssues: [
      "Strengthening international police cooperation and information sharing.",
      "Combating transnational organized crime and terrorism.",
      "Enhancing law enforcement capacity and coordination.",
    ],
  },
  {
    id: "unodc",
    name: "UNODC",
    topicGroups: [
      "The Question of Strengthening International Cooperation to Prevent Future Opioid Crises by Enhancing Real-Time Data Sharing, Disrupting the Illicit Manufacture and Trafficking of New Psychoactive Substances (NPS), and Expanding Access to Scheduled Medications for Pain Management and Evidence-Based Treatment",
      "The Question of Establishing a Universal Regulatory Framework for the Legalization and State Control of All Psychoactive Substances, and Mandating the Integration of Comprehensive Harm Reduction and Decriminalization Measures to Prioritize Public Health and Encourage Voluntary Recovery",
      "The Question of Mitigating the Potential for an Illicit Tobacco Market by Strengthening Cross-Border Law Enforcement Cooperation and Implementing Robust Anti-Money Laundering Measures in Response to Policies Prohibiting the Sale of Tobacco to Future Generations",
      "The Question of Integrating Evidence-Based Treatment and Prevention Strategies into National Criminal Justice Systems to Address Alcohol Use Disorders and Reduce Alcohol-Related Crime, Violence, and Recidivism",
      "The Question of Promoting Evidence-Based Treatment and Rehabilitation Services for Individuals with Drug Use Disorders",
      "The Question of Developing Comprehensive Prevention Strategies and Specialized Care for Neonatal Opioid Withdrawal Syndrome (NOWS)",
      "The Question of Integrating Crime Prevention and Drug Control Policies to Reduce Drug-Related Offending in High-Risk Communities",
      "The Question of Strengthening International Cooperation and Law Enforcement Capacity to Disrupt the Illicit Drug Trade on the Dark Web",
      "The Question of Policy Analysis of Alternatives to Conviction and Punishment for Drug Possession for Personal Use",
      "The Question of Mitigating Environmental Degradation and Ecosystem Damage Resulting from Illicit Drug Cultivation and Production",
    ],
    members: [
      "Argentina", "Australia", "Brazil", "Canada", "China", "Colombia",
      "France", "Germany", "India", "Mexico", "Nigeria", "United Kingdom", "United States"
    ],
    subIssues: [
      "Balancing drug control with public health approaches.",
      "Strengthening international cooperation and law enforcement.",
      "Addressing root causes and prevention strategies.",
    ],
  },
  {
    id: "cstd",
    name: "CSTD",
    topicGroups: [
      "The Question of Promoting Equitable Access to and Ethical Development of Neuro-Nanotechnologies to Advance Rehabilitation and Improve the Quality of Life for Persons with Disabilities",
      "The Question of the Ethical Governance and Regulation of Emerging Technologies while Fostering International Collaboration in Scientific Research and Development",
      "The Question of Developing Ethical and Inclusive Frameworks for the Integration of Artificial Intelligence into Global Education Systems",
      "The Question of Addressing the Challenge of AI-Driven Technological Unemployment by Promoting Reskilling Initiatives and Establishing New Social Safety Nets for the Future of Work",
      "The Question of Policy Frameworks for Leveraging Artificial Intelligence to Accelerate the SDGs While Addressing Socio-Economic Disruption and Ethical Concerns",
      "The Question of Developing Multi-Stakeholder Cooperative Systems for Global Cybersecurity Resilience and the Protection of Personal Data",
      "The Question of Fostering Responsible Innovation in Digital Platforms to Protect Adolescent Mental Health and Data Privacy",
      "The Question of Designing Innovative Financing Mechanisms and Loan Programmes to Support Technology Start-Ups Contributing to the SDGs",
    ],
    members: [
      "Brazil", "China", "Egypt", "France", "Germany", "India",
      "Japan", "Kenya", "Mexico", "Russia", "South Africa", "United States"
    ],
    subIssues: [
      "Promoting equitable access to technology and innovation.",
      "Addressing ethical concerns and regulatory frameworks.",
      "Ensuring technology serves sustainable development goals.",
    ],
  },
  {
    id: "unsc",
    name: "UNSC",
    topicGroups: [
      "The Question of Establishing International Norms and Safeguards to Prevent the Undue Politicization of Access to and Control over Critical and Emerging Technologies",
      "The Question of Fostering Public-Private and Inter-State Partnerships to Facilitate the Equitable Transfer and Dissemination of Essential Technologies to Developing Nations",
      "The Question of Addressing the Role of Unregulated Weapons in Fueling Internal Conflicts and Threatening Civilian Populations",
      "The Question of Strengthening Implementation of Resolutions on Conflict-Related Sexual Violence (CRSV) and Ensuring Gender-Inclusive Victim Assistance",
      "The Question of Addressing the Role of Education and Information Management in Preventing Youth Radicalization and Extremism",
      "The Question of Developing and Standardizing Best Practices for Peacekeeping Operations to Ensure Scalable and Sustainable Global Implementation",
    ],
    members: [
      "China", "France", "United Kingdom", "United States", "Russia",
      "Algeria", "Argentina", "Brazil", "Ghana", "India", "Japan", "Norway", "Qatar"
    ],
    subIssues: [
      "Maintaining international peace and security.",
      "Addressing threats to peace and conflict prevention.",
      "Strengthening peacekeeping and conflict resolution mechanisms.",
    ],
  },
  {
    id: "unhrc",
    name: "UNHRC",
    topicGroups: [
      "The Question of the Promoting and Accelerating the Universal Abolition of the Death Penalty and Respect for the Right to Life",
      "The Question of The Obligation to Prevent Cruel, Inhuman or Degrading Treatment Arising from Deficiencies in Prison Administration and Justice Systems",
      "The Question of Examining Measures to Combat Hate Speech and Targeted Abuse, Ensuring Consistency with Article 19 of the International Covenant on Civil and Political Rights (ICCPR) and Respecting the Principle of National Sovereignty",
      "The Question of The Role of Educational Curricula, Including Social and Emotional Learning (SEL), in Fostering Tolerance, Combating Ideological Intolerance, and Preventing the Transmission of Discriminatory Beliefs in Primary and Secondary Education",
      "The Question of Implementing Legislative and Policy Measures to Prohibit and Penalize the Practice of So-Called 'Conversion Therapy' on the Basis of Sexual Orientation and Gender Identity",
      "The Question of Recommending Strategies for Member States to Repeal Punitive Legislation that Criminalizes Consensual Same-Sex Relations, Sexual Orientation, or Gender Identity",
      "The Question of Ensuring the Full and Equal Enjoyment of Human Rights for Persons with Disabilities, with a Focus on Mandating Accessible Infrastructure, Information, and Communication in Public Spaces",
      "The Question of Integrating Differentiated and Needs-Based Support Systems into Mainstream Educational Curricula to Uphold the Right to Education for Neurodivergent Students",
    ],
    members: [
      "Argentina", "Brazil", "Canada", "Egypt", "France", "Germany",
      "Ghana", "Kenya", "Mexico", "Norway", "Qatar", "South Africa"
    ],
    subIssues: [
      "Protecting and promoting human rights globally.",
      "Addressing discrimination and ensuring equality.",
      "Strengthening human rights mechanisms and compliance.",
    ],
  },
  {
    id: "disec",
    name: "DISEC",
    topicGroups: [
      "The Question of Strengthening International Protocols and Logistics for Securing the Cross-Border Transport of Weapons of Mass Destruction (WMDs) and Related Materials",
      "The Question of Developing Mechanisms to Prevent the Diversion of Legally Traded Conventional Arms to Illicit Markets and Non-State Actors",
      "The Question of Strengthening International Cooperation and Capacity for the Clearance of Explosive Remnants of War (ERW) and Improvised Explosive Devices (IEDs)",
      "The Question of Strengthening the International Monitoring System to Detect and Deter Unauthorized Nuclear Weapon Testing",
      "The Question of Strengthening International Standards for the Disposal of Weapons to Mitigate the Risk of Diversion to Illicit Trafficking Networks",
      "The Question of Strengthening Controls on High-Risk Precursor Chemicals to Mitigate the Threat of Improvised Explosive Devices (IEDs) by Non-State Actors",
    ],
    members: [
      "China", "France", "Germany", "India", "Indonesia", "Japan",
      "Mexico", "Nigeria", "United Kingdom", "United States", "Qatar", "South Africa"
    ],
    subIssues: [
      "Promoting disarmament and non-proliferation.",
      "Preventing arms diversion and illicit trafficking.",
      "Strengthening international security cooperation.",
    ],
  },
  {
    id: "unicef",
    name: "UNICEF",
    topicGroups: [
      "The Question of Developing and Implementing Coordinated International Strategies to Combat Child Trafficking and Exploitation in Underage Sex Work",
      "The Question of Establishing a Global Framework to Prohibit and Eradicate Child, Early, and Forced Marriage and to Protect the Rights and Autonomy of Minors",
      "The Question of Examining Measures to Transition Away from Institutional Care, Prohibiting For-Profit Children's Homes, and Strengthening Oversight of Foster Care Settings to Prevent Abuse and Exploitation",
      "The Question of Developing Policy Frameworks to Guarantee Accessible and Equitable Primary and Secondary Education, with a Focus on Eliminating Financial Barriers and Promoting Fair Assessment for Vulnerable Applicants",
      "The Question of Strengthening Maternal, Neo-Natal, and Post-Partum Healthcare Systems to Significantly Reduce Preventable Maternal and Infant Mortality and Morbidity",
      "The Question of Recommending Policy Frameworks to Encourage Employer-Supported Flexible Work Arrangements and Parental Leave to Facilitate Early Childhood Development and Strengthen Parent-Child Bonding",
      "The Question of Exploring the Feasibility of Implementing Conditional or Universal Basic Child Income Transfers to Uphold the Child's Right to an Adequate Standard of Living and Promote Adolescent Well-being through Autonomous Access to Non-Essential Items",
      "The Question of Developing International Guidelines and Training Frameworks for Teachers and Staff to Safely Identify, Report, and Refer Cases of Child Abuse, Ensuring the Best Interests of the Child in Situations Where Direct Parental Notification is Detrimental",
    ],
    members: [
      "Bangladesh", "Brazil", "China", "Egypt", "Ethiopia", "India",
      "Indonesia", "Kenya", "Mexico", "Nigeria", "Pakistan", "United States"
    ],
    subIssues: [
      "Protecting children's rights and well-being.",
      "Ensuring access to education and healthcare.",
      "Preventing exploitation and abuse of children.",
    ],
  },
  {
    id: "un-women",
    name: "UN Women",
    topicGroups: [
      "The Question of Affirming and Guaranteeing Women's Reproductive Autonomy by Establishing International Legal Standards on Access to Safe and Legal Abortion with Respect for Cultural and Religious Diversity",
      "The Question of Examining the Recognition of Universal Childcare as a Fundamental Human Right and its Role in Addressing Declining Birth Rates and Supporting Gender Equality in the Workforce",
      "The Question of Developing International Standards and Oversight Mechanisms to Prevent Gender-Based Harassment, Abuse, and Discrimination Against Women in Public and Private Sector Employment",
      "The Question of Mandating All Public and Private Bathrooms to Provide Free, Quality, and Safe Menstruation Products",
      "The Question of Training Healthcare Professionals and Community Workers to Safely Identify Domestic Violence and Address it Effectively",
      "The Question of Mandating the Provision of Free, Accessible, and Quality Menstrual Products in Public Institutions and Workplaces to Combat Period Poverty and Uphold Women's Dignity",
      "The Question of Enhancing the Provision of Essential Sexual and Reproductive Health Services, Including Accessible Menstrual Hygiene Management (MHM) Supplies and Education, in Conflict and Post-Conflict Settings",
      "The Question of Strengthening Measures to Safeguard the Health and Security of Pregnant Women and New Mothers, Including the Establishment and Funding of Dedicated, Gender-Sensitive Protection Facilities and Services During and In Areas of Conflict",
      "The Question of Mandating the Universal Provision of Free Contraceptives and Ensuring Free, Accessible, Comprehensive, and Non-Judgmental Sexual Education Programmes to Prevent Teen and Unwanted Pregnancy",
      "The Question of Examining Measures to Eliminate Age-Based Restrictions on the Purchase and Provision of Contraceptives and Pregnancy Tests, Ensuring Financial Affordability and Comprehensive Coverage for All Women and Adolescent Girls",
    ],
    members: [
      "Argentina", "Bangladesh", "Brazil", "Canada", "Egypt", "France",
      "Germany", "India", "Kenya", "Mexico", "Nigeria", "Sweden", "United States"
    ],
    subIssues: [
      "Promoting gender equality and women's empowerment.",
      "Protecting women's rights and preventing gender-based violence.",
      "Ensuring access to healthcare and reproductive rights.",
    ],
  },
  {
    id: "who",
    name: "WHO",
    topicGroups: [
      "The Question of Developing International Standards and Regulatory Oversight to Enhance Diagnostic Accuracy and Prevent Misdiagnoses in Mental Health Practice",
      "The Question of Examining the Ethical and Regulatory Landscape for the Clinical Use of Psychedelic Drugs in the Treatment of Trauma-Based Mental Health Conditions",
      "The Question of Examining Measures to Safeguard Patient Autonomy, Uphold Professional Integrity, Prioritize Personal and Cultural Factors, and Ensure the Protection of Human Rights in the Context of Euthanasia and Assisted Suicide",
      "The Question of Developing and Promoting International Guidelines for Member States to Enhance the Accessibility of Public Services and Mandate Reasonable Accommodations for Employees Living with Chronic Illnesses",
      "The Question of Strengthening Strategies for Developing and Implementing Standardized Training and Educational Programmes for Informal Caregivers to Enhance Quality of Life and Support Health Systems Resilience",
      "The Question of Examining Policy Measures for Financial Support and Subsidies to Facilitate and Prioritize Palliative Care and Long-Term Care Delivery within the Home Setting",
      "The Question of Developing and Implementing Mechanisms to Ensure the Safe, Timely, and Equitable Access and Delivery of Essential Medicines and Medical Supplies in Areas Affected by Armed Conflict",
      "The Question of Establishing International Standards and Guidelines for the Development, Regulation, and Security of Resilient Healthcare Infrastructure to Safeguard High-Risk Patients and Essential Health Workers",
      "The Question of Developing Integrated Policy Frameworks to Regulate Emergency Healthcare Costs and Implement Social Safety Nets to Mitigate and Resolve Medical Debt for Vulnerable and Low-Income Populations",
      "The Question of Developing Global Standards for the Design and Modernization of Health Facilities to Optimize Patient-Centered Environments, Enhance Recovery, and Promote Mental Health, Well-being, and Comfort for Patients and Visitors",
    ],
    members: [
      "Canada", "China", "Egypt", "France", "Germany", "India",
      "Indonesia", "Japan", "Mexico", "Nigeria", "South Africa", "United Kingdom", "United States"
    ],
    subIssues: [
      "Promoting global health and preventing disease.",
      "Ensuring equitable access to healthcare services.",
      "Strengthening health systems and emergency response.",
    ],
  },
  {
    id: "unep",
    name: "UNEP",
    topicGroups: [
      "The Question of Maximizing Wind and Solar Energy to Minimize Negative Environmental and Economic Impact",
      "The Question of Protecting Endangered Species in Developing Nations While Emphasizing the Need for Wild Animals to Experience Natural Development",
      "The Question of Combating Rising Temperatures in the Arctic and Preventing Ocean Acidification",
      "The Question of Protecting Sensitive Island Ecosystems from Invasive Species and Recovering Ecosystems That Were Damaged",
      "The Question of Combatting Excess Methane Emissions and Developing Mechanisms to Reduce Agricultural Waste",
      "The Question of Protecting Vulnerable Marine Life from Improper Fishing Practices",
      "The Question of Developing Regulations to Permanently Reduce Environmental Impacts Caused by AI and Data Centers",
      "The Question of Evaluating Natural and Non-Renewable Energy Sources to Determine Idealistic Renewable Energy Alternatives",
    ],
    members: [
      "Australia", "Brazil", "Canada", "China", "France", "Germany",
      "India", "Japan", "Kenya", "Mexico", "Nigeria", "United States"
    ],
    subIssues: [
      "Protecting the environment and promoting sustainability.",
      "Addressing climate change and biodiversity loss.",
      "Promoting renewable energy and sustainable practices.",
    ],
  },
  {
    id: "unesco",
    name: "UNESCO",
    topicGroups: [
      "The Question of Developing and Standardizing Inclusive Education Policies and Necessary Accommodations to Ensure Full and Equitable Access to Learning for Neurodivergent Students",
      "The Question of Establishing Guidelines for the Mandatory and Comprehensive Integration of Historical Failures, Atrocities, and Human Rights Violations into National Education Curricula to Promote Reconciliation and Prevent Future Recurrence",
      "The Question of Developing Bilingual Education Programs in All International Schools",
      "The Question of Preventing Cultural Stereotypes and Discrimination Through Education Curricula",
      "The Question of Maintaining and Highlighting Cultural Diversity While Protecting Vulnerable Groups from Discrimination",
      "The Question of Regulating AI Education Systems While Fostering Social and Emotional Learning and Development",
      "The Question of Combatting Racism and Discrimination in Educational Institutions and Labor Markets",
      "The Question of Ensuring Quality Special Education Schools or Classes While Considering Social Integration and Possible Isolation",
      "The Question of Preventing Academic Dishonesty in an AI Centric Society",
      "The Question of Determining and Developing the Optimal Education Curriculum for All Primary and Secondary Students",
    ],
    members: [
      "Argentina", "Brazil", "China", "Egypt", "France", "Germany",
      "India", "Japan", "Kenya", "Mexico", "Nigeria", "Russia", "United States"
    ],
    subIssues: [
      "Promoting education, science, and culture.",
      "Ensuring inclusive and equitable quality education.",
      "Protecting cultural heritage and diversity.",
    ],
  },
  {
    id: "f1",
    name: "F1",
    topicGroups: [
      "The Question of Strengthening and Standardizing Cost Cap Enforcement Mechanisms to Ensure Competitive Equity and Financial Sustainability Across the Grid",
      "The Question of Accelerating Environmental Sustainability Initiatives and Developing Comprehensive Strategies to Achieve Net-Zero Carbon Emissions Across Global F1 Operations",
      "The Question of Enhancing Driver and Spectator Safety Protocols and Mitigating Unique Risks Associated with New and Existing Street Circuit Designs",
      "The Question of Establishing Ethical Vetting Criteria and Policy Guidelines to Address the Issue of Sportswashing and Human Rights Concerns Regarding Host Nations for F1 Grand Prix Events",
      "The Question of Implementing Durability and Longevity Standards for Critical Car Components to Optimize Component Lifecycles and Minimize Material and Energy Waste",
      "The Question of Analyzing the Socio-Economic and Infrastructure Impacts of Hosting a New Grand Prix, with a Focus on Mitigating Urban Congestion and Logistics in Highly Populated Cities With a Focus on the Possible F1 Grand Prix of 2028 in Bangkok",
    ],
    members: [
      "Ferrari", "Mercedes", "Red Bull", "McLaren", "Aston Martin", "Alpine",
      "Williams", "AlphaTauri", "Alfa Romeo", "Haas"
    ],
    subIssues: [
      "Ensuring competitive equity and financial sustainability.",
      "Promoting environmental sustainability and safety.",
      "Addressing ethical concerns and social responsibility.",
    ],
  },
  {
    id: "uncsa",
    name: "UNCSA",
    fantasy: true,
    universes: [
      {
        id: "umbrella",
        name: "Umbrella Academy",
        members: ["Luther", "Diego", "Allison", "Klaus", "Five", "Ben", "Vanya", "The Handler", "Lila", "Reginald Hargreeves", "Pogo", "Grace", "Hazel", "Cha-Cha", "Agnes"],
        topicGroups: [
          ["The Question of Regulating Temporal Displacement Technologies and Preventing Paradoxes Through Inter-Temporal Compliance"],
          ["The Question of Establishing Bio-Ethical Regulations to Prohibit the Non-Consensual Suppression or Modification of Superhuman Abilities"],
          ["The Question of Addressing Systemic Emotional Neglect in Institutions Rearing Gifted Minors and Its Impact on Superhuman Mental Health"],
        ],
        subIssues: ["Regulating time travel and paradox prevention.", "Protecting enhanced individuals from abuse.", "Ensuring accountability of clandestine agencies."],
      },
      {
        id: "potter",
        name: "Harry Potter",
        members: ["Harry Potter", "Hermione Granger", "Ron Weasley", "Albus Dumbledore", "Severus Snape", "Lord Voldemort", "Luna Lovegood", "Neville Longbottom", "Draco Malfoy", "Minerva McGonagall", "Rubeus Hagrid", "Sirius Black", "Remus Lupin", "Bellatrix Lestrange", "Ginny Weasley"],
        topicGroups: [
          ["The Question of Standardizing Judicial Consequences and Enacting Global Mandates Against the Practice of the Unforgivable Curses"],
          ["The Question of Mandating Practical Defense Training in Magical Educational Institutions to Ensure Readiness Against the Dark Arts"],
          ["The Question of Combatting Blood Purity Ideology and Revising the International Statute of Secrecy to Foster Inter-Magical Cohesion"],
        ],
        subIssues: ["Regulating dark magic and unforgivable curses.", "Magical education and defense.", "Statute of Secrecy and blood purity."],
      },
      {
        id: "wakanda",
        name: "Wakanda & Talokan",
        members: ["T'Challa", "Shuri", "Nakia", "M'Baku", "Namor", "Namora", "Okoye", "Killmonger", "Ramonda", "Attuma", "W'Kabi", "Zuri", "Aneka", "Riri Williams", "Everett Ross"],
        topicGroups: [
          ["The Question of Assessing the Global Consequences of Wakandan Isolationism and Developing a Framework for Responsible, Equitable Distribution of Aid"],
          ["The Question of Establishing International Protocols to Prevent the Exploitation and Weaponization of Vibranium"],
          ["The Question of Protecting Subaquatic Sovereignty and Cultural Integrity in the Face of Surface-World Encroachment"],
        ],
        subIssues: ["Vibranium non-proliferation and aid.", "Subaquatic and surface relations.", "Cultural sovereignty and technology sharing."],
      },
      {
        id: "spiderman",
        name: "Spider-Man",
        members: ["Peter Parker", "Mary Jane Watson", "Ned Leeds", "J. Jonah Jameson", "May Parker", "Norman Osborn", "Tony Stark", "Nick Fury", "Doctor Octopus", "Flash Thompson", "Gwen Stacy", "Harry Osborn", "Eddie Brock", "Felicia Hardy", "Miles Morales"],
        topicGroups: [
          ["The Question of Regulating Autonomous Global Defense and Surveillance Systems (The EDITH Principle)"],
          ["The Question of Combating Corporate Negligence Through the Regulation of Technological Scraps and Hazardous Waste"],
          ["The Question of Addressing the Weaponization of Advanced Illusion Technologies and Protocols Against Manufactured Reality"],
        ],
        subIssues: ["AI and surveillance accountability.", "Battle debris and hazardous tech.", "Digital disinformation and illusion tech."],
      },
      {
        id: "guardians",
        name: "Guardians of the Galaxy",
        members: ["Star-Lord", "Gamora", "Drax", "Rocket Raccoon", "Groot", "Nebula", "Mantis", "Yondu", "Kraglin", "Cosmo", "Adam Warlock", "Ayesha", "Martinex", "Stakar Ogord", "Phyla-Vell"],
        topicGroups: [
          ["The Question of Regulating the Interstellar Arms Trade and Non-Proliferation Policies for Weapons of Mass Destruction (Including Infinity Stone Artifacts)"],
          ["The Question of Addressing Eugenic Ideologies and the Irresponsible Demolition of Civilizations with No Due Process (The High Evolutionary Principle)"],
          ["The Question of Addressing Animal Rights in the Face of Genetic Modification and Non-Consensual Scientific Enhancement of Non-Human Sentient Lifeforms"],
        ],
        subIssues: ["Interstellar arms control and Infinity Stones.", "Eugenics and civilization-scale harm.", "Genetic modification and sentient rights."],
      },
      {
        id: "xmen",
        name: "X-Men",
        members: ["Charles Xavier", "Magneto", "Wolverine", "Storm", "Jean Grey", "Mystique", "Cyclops", "Beast", "Nightcrawler", "Rogue", "Iceman", "Shadowcat", "Colossus", "Angel", "Phoenix"],
        topicGroups: [
          ["The Question of Establishing Bio-Ethical Regulations to Prohibit the Non-Consensual Suppression of Superhuman Abilities"],
          ["The Question of Addressing the Threat of Unsanctioned External Enhanced Powers and Protocols for the Defense of Built Societies"],
          ["The Question of Combatting Weaponization of the Human Mind and Establishing Protocols for the Containment of Psychic Technologies"],
        ],
        subIssues: ["Mutant registration and suppression.", "Enhanced individuals and national security.", "Psychic containment and consent."],
      },
      {
        id: "avengers",
        name: "Avengers",
        members: ["Iron Man", "Captain America", "Thor", "Black Widow", "Hulk", "Hawkeye", "Scarlet Witch", "Vision", "Falcon", "Winter Soldier", "Black Panther", "Captain Marvel", "War Machine", "Ant-Man", "Wasp"],
        topicGroups: [
          ["The Question of Regulating Autonomous Global Defense and Surveillance Systems and Protection of High-Risk Technologies"],
          ["The Question of Combating Corporate Negligence Through Regulation of Technological Scraps and Hazardous Waste"],
          ["The Question of Addressing the Threat of Unsanctioned External Enhanced Powers and Defense of National Sovereignty"],
        ],
        subIssues: ["Autonomous defense and AI.", "Battle debris and weaponization.", "Enhanced individuals and accountability."],
      },
      {
        id: "justiceleague",
        name: "Justice League",
        members: ["Superman", "Batman", "Wonder Woman", "Aquaman", "The Flash", "Cyborg", "Green Lantern", "Martian Manhunter", "Shazam", "Hawkgirl", "Green Arrow", "Black Canary", "Supergirl", "Batwoman", "Nightwing"],
        topicGroups: [
          ["The Question of Regulating Advanced Scientific Accountability and Transparency in the Development of Internationally Relevant Technologies"],
          ["The Question of Addressing the Threat of Unsanctioned External Enhanced Powers and Protocols for the Defense of Built Societies"],
          ["The Question of Combating the Weaponization of Advanced Illusion Technologies and Digital Disinformation"],
        ],
        subIssues: ["Superhuman accountability and tech.", "Defense of civilian populations.", "Illusion tech and disinformation."],
      },
      {
        id: "fantasticfour",
        name: "Fantastic Four",
        members: ["Mr. Fantastic", "Invisible Woman", "Human Torch", "The Thing", "Doctor Doom", "Silver Surfer", "Namor", "Alicia Masters", "Franklin Richards", "Valeria Richards", "She-Hulk", "Crystal", "Medusa", "Black Bolt", "Maximus"],
        topicGroups: [
          ["The Question of Regulating Advanced Scientific Accountability and Transparency in the Development of Internationally Relevant Technologies"],
          ["The Question of Regulating Temporal Displacement Technologies and Inter-Temporal Compliance"],
          ["The Question of Addressing Animal Rights in the Face of Genetic Modification and Non-Consensual Enhancement of Non-Human Sentient Lifeforms"],
        ],
        subIssues: ["Scientific accountability and transparency.", "Time travel and multiverse stability.", "Genetic modification and sentient rights."],
      },
      {
        id: "defenders",
        name: "The Defenders",
        members: ["Daredevil", "Jessica Jones", "Luke Cage", "Iron Fist", "Elektra", "Punisher", "Colleen Wing", "Misty Knight", "Claire Temple", "Foggy Nelson", "Karen Page", "Stick", "Kingpin", "Bullseye", "Trish Walker"],
        topicGroups: [
          ["The Question of Combating Corporate Negligence Through Regulation of Technological Scraps and Hazardous Waste"],
          ["The Question of Addressing the Weaponization of Advanced Illusion Technologies and Protocols Against Manufactured Reality"],
          ["The Question of Regulating Clandestine Enhanced Individuals Operating Without Oversight"],
        ],
        subIssues: ["Corporate negligence and hazardous tech.", "Illusion tech and urban safety.", "Vigilante oversight and accountability."],
      },
    ],
  },
  {
    id: "fwc",
    name: "FWC",
    fantasy: true,
    universes: [
      {
        id: "avatar",
        name: "Avatar",
        members: ["Jake Sully", "Neytiri", "Tonowari", "Ronal", "Quaritch", "Grace Augustine", "Norm Spellman", "Trudy Chacon", "Parker Selfridge", "Mo'at", "Eytukan", "Tsu'tey", "Max Patel", "Lyle Wainfleet", "Ardmore"],
        topicGroups: [
          ["The Question of Developing Mechanisms and Agreements to Protect the Eywa Against Violence and Destruction"],
          ["The Question of Combatting Unobtanium Exploitation Through Agreements and the Development of New Governing Bodies"],
          ["The Question of Protecting Na'vi Cultural Integrity and Sovereignty in the Face of Military Force and Corporate Encroachment"],
        ],
        subIssues: ["Protection of Eywa and sacred sites.", "Unobtanium regulation and governance.", "Na'vi sovereignty and cultural rights."],
      },
      {
        id: "apes",
        name: "Planet of the Apes",
        members: ["Caesar", "Maurice", "Rocket", "Cornelia", "Koba", "The Colonel", "Blue Eyes", "Nova", "Lake", "Bad Ape", "Winter", "Luca", "Rex", "Ash", "Spear"],
        topicGroups: [
          ["The Question of Combatting Religious Dogma and Ape Supremacy Influencing the Suppression of Valid Archaeological and Evolutionary Findings"],
          ["The Question of Combating Human Subjugation and Dehumanization and Establishing Civil Rights for All Sentient Life"],
          ["The Question of Preventing Unethical Scientific Research and Viral Development Through Bio-Ethical Review Boards"],
        ],
        subIssues: ["Ape supremacy and scientific truth.", "Interspecies civil rights.", "Viral research and bio-ethics."],
      },
      {
        id: "stranger",
        name: "Stranger Things",
        members: ["Eleven", "Mike Wheeler", "Joyce Byers", "Jim Hopper", "Dustin Henderson", "Dr. Brenner", "Lucas Sinclair", "Will Byers", "Max Mayfield", "Steve Harrington", "Nancy Wheeler", "Jonathan Byers", "Robin Buckley", "Erica Sinclair", "Murray Bauman"],
        topicGroups: [
          ["The Question of Preventing DoE Authority Abuse and Subject Manipulation in Government-Funded Scientific Laboratories Through Stricter Regulations"],
          ["The Question of Preventing Harm Caused by Psychic Child Experimentation and Ensuring the Protection and Rehabilitation of Gifted Minors"],
          ["The Question of Addressing the Weaponization of the Human Mind and Establishing Protocols for the Containment of Psychic Technologies"],
        ],
        subIssues: ["Government lab oversight.", "Psychic experimentation and minors.", "Containment of anomalous threats."],
      },
      {
        id: "dragon",
        name: "How to Train Your Dragon",
        members: ["Hiccup", "Astrid", "Toothless", "Stoick", "Valka", "Drago", "Snotlout", "Fishlegs", "Ruffnut", "Tuffnut", "Gobber", "Eret", "Cloudjumper", "Grump", "Skullcrusher"],
        topicGroups: [
          ["The Question of Addressing the Inevitability of Human-Dragon Conflict and Establishing Global Regulations to Protect Dragon and Human Life"],
          ["The Question of Addressing the Illegal Trafficking and Poaching of Dragons and Combatting the Extinction of Critically Threatened Species"],
          ["The Question of Conservationism and Refuge as a Sustainable Solution while Evaluating the Ethical Need for Dragon Partnership and Labor"],
        ],
        subIssues: ["Human-dragon coexistence.", "Dragon trafficking and extinction.", "Dragon labor and partnership ethics."],
      },
      {
        id: "lorax",
        name: "Lorax",
        members: ["The Lorax", "The Once-ler", "Ted", "Audrey", "Aloysius O'Hare", "Grammy Norma", "Isabella", "Brett", "Chet", "Uncle Ubb", "Aunt Grizelda", "Cy", "The Once-ler's Mom", "Norma", "Thneedville Mayor"],
        topicGroups: [
          ["The Question of Instituting Economic Oversight to Prevent the Prioritization of Industrial 'Biggering' over Ecological Sustainability"],
          ["The Question of Addressing and Combating Truffula Deforestation, Industrial Pollution (Glup-pity-Glup), and Protecting the Habitats of Endangered Species"],
          ["The Question of Preventing Excessive Consumerism and Regulating the Manufacture and Marketing of Non-Essential Goods (The Thneed Principle)"],
        ],
        subIssues: ["Industrial growth vs. sustainability.", "Deforestation and pollution.", "Consumerism and Thneed regulation."],
      },
      {
        id: "narnia",
        name: "Narnia",
        members: ["Aslan", "Lucy Pevensie", "Edmund Pevensie", "Susan Pevensie", "Peter Pevensie", "White Witch", "Mr. Tumnus", "Mr. Beaver", "Mrs. Beaver", "Caspian", "Reepicheep", "Trumpkin", "Miraz", "Eustace Scrubb", "Jill Pole"],
        topicGroups: [
          ["The Question of Ensuring the Safety of Magical Beings and Unfettered Operation of Sovereign Realms in Times of Transition"],
          ["The Question of Strengthening Mechanisms for the Transition Towards Self-Determination for Formerly Occupied Territories"],
          ["The Question of Addressing Historical Injustice and Establishing Frameworks for Reconciliation Between Rival Kingdoms"],
        ],
        subIssues: ["Magical being rights and sovereignty.", "Decolonization and self-determination.", "Reconciliation and historical justice."],
      },
      {
        id: "middleearth",
        name: "Middle Earth",
        members: ["Aragorn", "Gandalf", "Legolas", "Gimli", "Frodo Baggins", "Galadriel", "Samwise Gamgee", "Merry Brandybuck", "Pippin Took", "Elrond", "Arwen", "Boromir", "Faramir", "Eowyn", "Theoden"],
        topicGroups: [
          ["The Question of Regulating the Development and Deployment of Artifacts of Mass Power to Strengthen Traveler Safety and Inter-Realm Compliance"],
          ["The Question of Preventing the Weaponization of Advanced Illusion and Invisibility Technologies Against Civilian Populations"],
          ["The Question of Establishing Frameworks for the Coexistence of Free Peoples and Former Servant Populations"],
        ],
        subIssues: ["Artifact control and ring-lore.", "Invisibility and deception tech.", "Coexistence and rehabilitation."],
      },
      {
        id: "westeros",
        name: "Westeros",
        members: ["Daenerys Targaryen", "Jon Snow", "Tyrion Lannister", "Cersei Lannister", "Arya Stark", "Sansa Stark", "Jaime Lannister", "Ned Stark", "Catelyn Stark", "Bran Stark", "Robb Stark", "Theon Greyjoy", "Joffrey Baratheon", "Margaery Tyrell", "Brienne of Tarth"],
        topicGroups: [
          ["The Question of Strengthening Electoral and Succession Integrity to Prevent Corruption and Malpractice in Royal Succession"],
          ["The Question of Ensuring the Safety of Civilian Populations in Conflict Zones and Compliance with Laws of War"],
          ["The Question of Establishing a Framework for Redress and Reparations for Historical Damage Caused by Dynastic Conflict"],
        ],
        subIssues: ["Succession and governance.", "Civilian protection in war.", "Reparations and reconciliation."],
      },
      {
        id: "hogwarts",
        name: "Hogwarts (Fantasy World)",
        members: ["Harry Potter", "Hermione Granger", "Rubeus Hagrid", "Minerva McGonagall", "Albus Dumbledore", "Severus Snape", "Ron Weasley", "Luna Lovegood", "Neville Longbottom", "Draco Malfoy", "Ginny Weasley", "Sirius Black", "Remus Lupin", "Fred Weasley", "George Weasley"],
        topicGroups: [
          ["The Question of Mandating Practical Defense Training in Magical Educational Institutions to Ensure Readiness Against the Dark Arts"],
          ["The Question of Combatting Blood Purity Ideology and Revising the International Statute of Secrecy to Foster Inter-Species Cohesion"],
          ["The Question of Ensuring the Full and Equal Enjoyment of Rights for Non-Human Sentient Beings in Magical Society"],
        ],
        subIssues: ["Defense education and dark arts.", "Statute of Secrecy and blood purity.", "Non-human sentient rights."],
      },
      {
        id: "neverland",
        name: "Neverland",
        members: ["Peter Pan", "Tinker Bell", "Captain Hook", "Wendy Darling", "Tiger Lily", "Mr. Smee", "John Darling", "Michael Darling", "Nana", "Curly", "Nibs", "Slightly", "Tootles", "Starkey", "Mullins"],
        topicGroups: [
          ["The Question of Ensuring the Safety and Autonomy of Minors in Unregulated Territories and the Cessation of Child Conscription"],
          ["The Question of Addressing the Illegal Trafficking and Poaching of Magical Creatures and Combatting the Endangerment of Indigenous Species"],
          ["The Question of Establishing Governance Frameworks for Shared Territories Without Undermining the Sovereignty of Indigenous Populations"],
        ],
        subIssues: ["Child safety and conscription.", "Magical creature trafficking.", "Shared territory governance."],
      },
    ],
  },
  {
    id: "specpol",
    name: "SPECPOL",
    topicGroups: [
      "The Question of Examining and Formulating a Framework for Addressing the Root Factors Perpetuating the Israel-Palestine Conflict, Aiming for a Durable and Comprehensive Political Resolution",
      "The Question of Ensuring the Safety and Unfettered Operation of UN Peacekeeping Missions, Journalists, and Humanitarian Personnel in Conflict Zones, in Compliance with International Humanitarian Law",
      "The Question of Strengthening UN Mechanisms to Facilitate the Transition towards Self-Determination and Independent Governance for Non-Self-Governing Territories, with Special Consideration for the Situation in Western Sahara",
      "The Question of Establishing a Comprehensive Framework for Redress and Reparations for Historical Economic and Social Damage Caused by Colonial Exploitation",
      "The Question of Establishing Measures to Safeguard Electoral Integrity and Prevent Corruption and Malpractice in National Elections, with a View to Defining and Enforcing International Democratic Norms, Using the 2018 Venezuelan Presidential Election as a Case Study",
      "The Question of Developing Guidelines for Member States on Candidate Qualifications to Ensure the Administrative and Political Capacity Required for Effective Executive Leadership",
      "The Question of Establishing a Global Framework for Historical Justice, Reconciliation, and Reparations Between Former Colonizing and Colonized States as a Measure for Conflict Prevention and Sustainable Peace",
      "The Question of Strengthening Multilateral Cooperation and Fostering Mutual Trust Among Member States While Upholding the Fundamental Principles of National Sovereignty and Non-Interference",
    ],
    members: [
      "Algeria", "Argentina", "Brazil", "China", "Egypt", "France",
      "Germany", "India", "Indonesia", "Kenya", "Mexico", "Nigeria", "South Africa", "United States"
    ],
    subIssues: [
      "Addressing decolonization and self-determination.",
      "Promoting political stability and democratic governance.",
      "Ensuring historical justice and reconciliation.",
    ],
  },
  {
    id: "unoosa",
    name: "UNOOSA",
    topicGroups: [
      "The Question of Enhancing International Cooperation on Space Situational Awareness (SSA) and Space Traffic Management (STM) to Ensure the Long-Term Sustainability of Outer Space Activities and Mitigate the Risk Posed by Orbital Debris",
      "The Question of Considering the Feasibility and Governance Frameworks for Active Debris Removal (ADR) Technologies and the Remediation of Highly Congested Orbital Regions",
      "The Question of Addressing Gaps in the International Legal Regime to Clarify Principles of Non-Appropriation and Establish Norms for the Deployment of New Technologies in Outer Space and on Celestial Bodies",
      "The Question of Encouraging Greater Synergy and Avoiding Duplication of Efforts in National Space Programs to Maximize Efficiency and Accelerate the Application of Space Tools Towards the Achievement of the Sustainable Development Goals (SDGs)",
      "The Question of Establishing a Comprehensive Governance and Legal Framework for the Permanent Habitation of Outer Space and Other Celestial Bodies, Addressing the Anticipated Socio-Economic and Geopolitical Implications",
      "The Question of Fostering Global Youth Engagement and Developing Platforms for Innovation to Catalyze Ideas and Initiatives Related to the Long-Term, Sustainable Development of Interplanetary Civilizations",
    ],
    members: [
      "China", "France", "Germany", "India", "Japan", "Russia",
      "United Kingdom", "United States", "Australia", "Brazil", "Canada", "South Korea"
    ],
    subIssues: [
      "Promoting peaceful uses of outer space.",
      "Ensuring space sustainability and debris management.",
      "Fostering international cooperation in space activities.",
    ],
  },
  {
    id: "sochum",
    name: "SOCHUM",
    topicGroups: [
      "The Question of Protecting Women and Minors from Online Sexual Exploitation and Abuse, with a focus on Regulating Digital Platforms (such as; Instagram and Snapchat) and Enhancing Accountability",
      "The Question of Developing and Implementing Comprehensive Digital Citizenship and Media Literacy Programmes for the Protection of Children and Adolescents in the Digital Age",
      "The Question of Fostering Global Solidarity and Developing Robust Mechanisms for Equitable Burden-Sharing in the Protection and Reception of Refugee and Asylum-Seeking Populations",
      "The Question of Mitigating the Effects of Human Capital Flight (Brain Drain) while Facilitating the Ethical and Beneficial Circulation of Skilled Professionals to Address Regional Labor Imbalances",
      "The Question of Ensuring the Inclusivity of Educational Curricula and Materials to Promote the Rights and Recognition of All Gender Identities, including Non-Binary Individuals",
      "The Question of Addressing the Structural and Cultural Root Causes of Discrimination and Violence Based on Sexual Orientation and Gender Identity (SOGI) to Achieve Comprehensive Societal Inclusion",
      "The Question of Adopting an Equity-Driven Approach to Resource Allocation to Address Systemic Disparities and Ensure Equal Access to Opportunities for All Individuals",
      "The Question of Evaluating the Efficacy of Existing National and International Policies on Social Equity and Inclusion, and Developing Evidence-Based Best Practices for Successful Universal Access and Participation",
    ],
    members: [
      "Argentina", "Bangladesh", "Brazil", "Canada", "China", "Egypt",
      "France", "Germany", "India", "Kenya", "Mexico", "Nigeria", "South Africa", "United States"
    ],
    subIssues: [
      "Promoting social progress and cultural development.",
      "Protecting human rights and preventing discrimination.",
      "Ensuring equitable access to opportunities and resources.",
    ],
  },
  {
    id: "unhcr",
    name: "UNHCR",
    topicGroups: [
      "The Question of Strengthening Legal Frameworks and Developing Determination Procedures to Reduce Statelessness and Facilitate the Acquisition of Nationality for Stateless Persons",
      "The Question of Mobilizing Sustainable and Predictable Funding to Meet Minimum Core Standards for Settlement and Shelter in Refugee Responses, while Promoting Self-Reliance",
      "The Question of Upholding the Principle of Non-refoulement and Ensuring the Protection of Refugees and Asylum Seekers who Resort to Irregular Movement, with a focus on Safeguarding Vulnerable Individuals",
      "The Question of Strengthening Fair, Efficient and Accessible Asylum Procedures and Promoting International Cooperation to Ensure Equitable Access to Territory and Protection",
      "The Question of Strengthening International Solidarity and Developing Sustainable Financing Models to Support Host Countries in Providing Comprehensive and Non-Discriminatory Health Coverage for Displaced Populations",
      "The Question of Developing and Harmonizing International Legal Standards and Operational Protocols to Prevent the Separation of Families, with a particular focus on Unaccompanied and Separated Children",
    ],
    members: [
      "Bangladesh", "Brazil", "Canada", "China", "Egypt", "Ethiopia",
      "France", "Germany", "India", "Kenya", "Pakistan", "Turkey", "United States"
    ],
    subIssues: [
      "Protecting refugees and asylum seekers.",
      "Ensuring access to protection and assistance.",
      "Promoting durable solutions and self-reliance.",
    ],
  },
];

// Initialize topic for non-fantasy committees with topicGroups
committees.forEach((committee) => {
  if (committee.fantasy || !committee.topicGroups) return;
  if (!committee.topic) {
    committee.topic = selectRandomTopic(committee.topicGroups);
  }
});

// Resolve fantasy committee to a single random universe (no multi-universe in session)
const resolveFantasyCommittee = (committee) => {
  if (!committee.fantasy || !committee.universes || committee.universes.length === 0) return committee;
  const universe = committee.universes[Math.floor(Math.random() * committee.universes.length)];
  const topic = selectRandomTopic(universe.topicGroups);
  return {
    id: committee.id,
    name: `${committee.name} — ${universe.name}`,
    universeName: universe.name,
    members: universe.members,
    topic,
    topicGroups: universe.topicGroups,
    subIssues: universe.subIssues,
  };
};

const memberStates = [
  "Algeria",
  "Argentina",
  "Brazil",
  "Canada",
  "China",
  "Egypt",
  "France",
  "Germany",
  "Ghana",
  "India",
  "Indonesia",
  "Japan",
  "Kenya",
  "Mexico",
  "Nigeria",
  "Norway",
  "Qatar",
  "South Africa",
  "United Kingdom",
  "United States",
];

const TIME_SCALE = 0.05;

const elements = {
  committeeSelect: document.getElementById("committeeSelect"),
  delegationSelect: document.getElementById("delegationSelect"),
  subIssueList: document.getElementById("subIssueList"),
  committeeTopic: document.getElementById("committeeTopic"),
  committeeUniverse: document.getElementById("committeeUniverse"),
  delegateRing: document.getElementById("delegateRing"),
  chairBubble: document.getElementById("chairBubble"),
  speechAddress: document.getElementById("speechAddress"),
  speechAddressText: document.querySelector("#speechAddress .speech-address-text"),
  stageLabel: document.getElementById("stageLabel"),
  roundLabel: document.getElementById("roundLabel"),
  currentSpeaker: document.getElementById("currentSpeaker"),
  progressBar: document.getElementById("progressBar"),
  progressLabel: document.getElementById("progressLabel"),
  log: document.getElementById("log"),
  podium: document.getElementById("podium"),
  startSimulation: document.getElementById("startSimulation"),
  resetSimulation: document.getElementById("resetSimulation"),
  raisePlacard: document.getElementById("raisePlacard"),
  raiseMotion: document.getElementById("raiseMotion"),
  waitButton: document.getElementById("waitButton"),
  skipButton: document.getElementById("skipButton"),
  adjournButton: document.getElementById("adjournButton"),
  parliamentaryInquiry: document.getElementById("parliamentaryInquiry"),
  parliamentaryInquirySelect: document.getElementById("parliamentaryInquirySelect"),
  noteRecipientSelect: document.getElementById("noteRecipientSelect"),
  noteNotification: document.getElementById("noteNotification"),
  conferenceProgressBar: document.getElementById("conferenceProgressBar"),
  conferenceProgressLabel: document.getElementById("conferenceProgressLabel"),
  modal: document.getElementById("modal"),
  modalTitle: document.getElementById("modalTitle"),
  modalBody: document.getElementById("modalBody"),
  modalActions: document.getElementById("modalActions"),
  continueOverlay: document.getElementById("continueOverlay"),
  continueButton: document.getElementById("continueButton"),
  funFact: document.getElementById("funFact"),
  pointsValue: document.getElementById("pointsValue"),
  shuffleAllocations: document.getElementById("shuffleAllocations"),
  shuffleTopic: document.getElementById("shuffleTopic"),
};

// Crisis definitions for crisis/historical/fictional committees
const crises = {
  hsc: [
    {
      title: "Breaking: New Intelligence Report",
      description: "Intelligence agencies report a new development that changes the context of the situation. How will the Security Council respond?",
      options: [
        { text: "Request immediate briefing from intelligence agencies", points: 10, outcome: "The briefing reveals critical information that shapes the discussion." },
        { text: "Call for emergency session", points: 8, outcome: "An emergency session is convened to address the new information." },
        { text: "Continue with current agenda", points: 5, outcome: "The committee proceeds but may miss critical timing." },
      ],
    },
    {
      title: "Diplomatic Incident",
      description: "A major diplomatic incident occurs between two member states, threatening to derail negotiations.",
      options: [
        { text: "Call for immediate de-escalation", points: 12, outcome: "Both parties agree to de-escalate tensions." },
        { text: "Propose mediation", points: 10, outcome: "A neutral mediator is appointed to facilitate dialogue." },
        { text: "Table discussion until tensions cool", points: 6, outcome: "Discussion is postponed, but tensions remain." },
      ],
    },
    {
      title: "Humanitarian Emergency",
      description: "Reports emerge of a humanitarian crisis requiring immediate international response.",
      options: [
        { text: "Authorize emergency aid deployment", points: 15, outcome: "Humanitarian aid is immediately dispatched." },
        { text: "Establish fact-finding mission", points: 8, outcome: "A mission is sent to assess the situation." },
        { text: "Refer to specialized agencies", points: 5, outcome: "The matter is referred to relevant UN agencies." },
      ],
    },
  ],
  icj: [
    {
      title: "New Evidence Submitted",
      description: "One of the parties submits new evidence that could significantly impact the case. How should the Court proceed?",
      options: [
        { text: "Admit evidence and extend proceedings", points: 10, outcome: "The evidence is admitted, extending the case timeline." },
        { text: "Request verification of evidence", points: 12, outcome: "Evidence is verified before admission, ensuring fairness." },
        { text: "Reject as untimely submission", points: 6, outcome: "Evidence is rejected, maintaining original timeline." },
      ],
    },
    {
      title: "Procedural Challenge",
      description: "A party challenges the Court's jurisdiction or procedural fairness.",
      options: [
        { text: "Address challenge through legal reasoning", points: 15, outcome: "The challenge is addressed with clear legal precedent." },
        { text: "Request additional briefs", points: 8, outcome: "Both parties submit additional legal arguments." },
        { text: "Dismiss challenge summarily", points: 5, outcome: "Challenge is dismissed, but may affect perception of fairness." },
      ],
    },
    {
      title: "Interim Measures Request",
      description: "A party requests provisional measures to prevent irreparable harm pending final judgment.",
      options: [
        { text: "Grant interim measures", points: 12, outcome: "Provisional measures are ordered to prevent harm." },
        { text: "Deny and expedite final judgment", points: 8, outcome: "Final judgment is expedited instead." },
        { text: "Request more information", points: 6, outcome: "Additional information is requested before decision." },
      ],
    },
  ],
  uncsa: [
    {
      title: "Superhuman Incident",
      description: "Reports of a superhuman using powers in violation of international protocols. Immediate response required.",
      options: [
        { text: "Deploy containment team", points: 15, outcome: "Specialized team is deployed to contain the situation." },
        { text: "Issue international alert", points: 10, outcome: "Member states are alerted to the threat." },
        { text: "Investigate before action", points: 6, outcome: "Investigation begins, but response is delayed." },
      ],
    },
    {
      title: "Temporal Anomaly Detected",
      description: "Sensors detect temporal displacement activity that could threaten the timeline.",
      options: [
        { text: "Activate temporal protocols", points: 18, outcome: "Temporal protocols successfully stabilize the timeline." },
        { text: "Evacuate affected area", points: 10, outcome: "Area is evacuated, preventing temporal contamination." },
        { text: "Monitor situation", points: 5, outcome: "Situation is monitored, but risk increases." },
      ],
    },
    {
      title: "Magical Breach",
      description: "A breach in the Statute of Secrecy threatens to expose the magical world to muggles.",
      options: [
        { text: "Deploy memory modification teams", points: 12, outcome: "Memory modification teams successfully contain the breach." },
        { text: "Coordinate with magical governments", points: 10, outcome: "International magical cooperation prevents exposure." },
        { text: "Issue cover story", points: 6, outcome: "Cover story is issued, but some questions remain." },
      ],
    },
    {
      title: "Vibranium Theft",
      description: "Reports of stolen Vibranium from Wakanda threaten global security.",
      options: [
        { text: "Coordinate with Wakandan authorities", points: 15, outcome: "Joint operation successfully recovers the Vibranium." },
        { text: "Issue international alert", points: 10, outcome: "Alert helps track the stolen material." },
        { text: "Establish investigation committee", points: 6, outcome: "Investigation begins but recovery is delayed." },
      ],
    },
    {
      title: "Infinity Stone Activity",
      description: "Unusual energy signatures suggest an Infinity Stone is active and unsecured.",
      options: [
        { text: "Mobilize Guardians protocol", points: 20, outcome: "Guardians protocol successfully secures the Stone." },
        { text: "Alert all member states", points: 12, outcome: "Coordinated response prevents misuse." },
        { text: "Monitor from distance", points: 5, outcome: "Monitoring continues, but threat persists." },
      ],
    },
  ],
  fwc: [
    {
      title: "Ecosystem Collapse",
      description: "Reports indicate rapid ecosystem degradation threatening native species.",
      options: [
        { text: "Deploy conservation teams", points: 15, outcome: "Conservation efforts stabilize the ecosystem." },
        { text: "Evacuate endangered species", points: 10, outcome: "Species are relocated to safety." },
        { text: "Investigate cause first", points: 6, outcome: "Investigation delays response, some species lost." },
      ],
    },
    {
      title: "Upside Down Breach",
      description: "A portal to the Upside Down has opened, threatening to spread corruption.",
      options: [
        { text: "Deploy containment specialists", points: 18, outcome: "Specialists successfully close the portal." },
        { text: "Evacuate affected area", points: 12, outcome: "Area is evacuated, preventing spread." },
        { text: "Study the phenomenon", points: 5, outcome: "Study delays containment, corruption spreads." },
      ],
    },
    {
      title: "Dragon Migration Crisis",
      description: "A massive dragon migration threatens human settlements along the route.",
      options: [
        { text: "Establish safe migration corridors", points: 15, outcome: "Corridors prevent conflict, dragons pass safely." },
        { text: "Evacuate settlements", points: 10, outcome: "Settlements evacuated, but disruption occurs." },
        { text: "Attempt to redirect migration", points: 6, outcome: "Redirection fails, conflict occurs." },
      ],
    },
    {
      title: "Truffula Deforestation",
      description: "Illegal logging operations threaten the last Truffula forest.",
      options: [
        { text: "Deploy forest protection units", points: 15, outcome: "Protection units stop illegal logging." },
        { text: "Issue international sanctions", points: 10, outcome: "Sanctions pressure stops operations." },
        { text: "Negotiate with loggers", points: 5, outcome: "Negotiations stall, deforestation continues." },
      ],
    },
    {
      title: "Na'vi Conflict",
      description: "Tensions escalate between human settlers and Na'vi tribes over resource extraction.",
      options: [
        { text: "Mediate peace talks", points: 18, outcome: "Peace talks result in mutually beneficial agreement." },
        { text: "Establish neutral zone", points: 12, outcome: "Neutral zone prevents immediate conflict." },
        { text: "Support one side", points: 5, outcome: "Support escalates tensions further." },
      ],
    },
  ],
};

const state = {
  committee: null,
  delegation: null,
  round: 0,
  stage: "Idle",
  timer: null,
  timerRemaining: 0,
  timerTotal: 0,
  skipHandler: null,
  currentSpeaker: null,
  seats: {},
  currentPlacard: null,
  raised: false,
  roundInProgress: false,
  motionQueue: [],
  votingStatus: "present",
  manualAdvanceEnabled: false,
  pendingContinues: 0,
  points: 0,
  pointsHistory: [],
  delegatePoints: {},
  activeCrisis: null,
  crisesTriggered: 0,
};

const funFacts = [
  "The first Model UN conference was held at Harvard University in 1955, simulating the League of Nations.",
  "Model UN conferences are held in over 100 countries, with the largest conferences hosting over 5,000 delegates.",
  "The most common awards at MUN conferences are Best Delegate, Outstanding Delegate, and Honorable Mention.",
  "Many MUN delegates go on to careers in diplomacy, international law, and public service.",
  "The Rules of Procedure (ROP) in MUN are based on the actual UN's rules, adapted for educational purposes.",
  "Crisis committees in MUN simulate real-time emergencies and require delegates to respond quickly to breaking news.",
  "Historical Security Council committees recreate past crises, allowing delegates to explore alternative outcomes.",
  "The phrase 'Present and Voting' means a delegate cannot abstain on substantive votes, only procedural ones.",
  "A 'moderated caucus' has a speakers list and time limits, while an 'unmoderated caucus' allows free discussion.",
  "Delegates raise placards to be recognized by the chair for points, motions, or to speak.",
  "A 'Point of Personal Privilege' addresses comfort issues like room temperature or needing to use the restroom.",
  "A 'Point of Parliamentary Inquiry' asks the chair about procedure or rules.",
  "Motions require a second from another delegate before they can be voted on.",
  "The 'yield' system allows delegates to give remaining speaking time to questions, comments, or back to the chair.",
  "Draft resolutions in MUN must have at least one sponsor and multiple signatories before being introduced.",
  "Amendments to resolutions can be friendly (all sponsors agree) or unfriendly (requires a vote).",
  "The 'right of reply' allows delegates to respond to personal attacks made during speeches.",
  "Many MUN conferences include crisis updates that change the situation mid-debate.",
  "The largest MUN conference in the world is THIMUN (The Hague International Model United Nations) with over 3,000 delegates.",
  "Some MUN conferences use 'power delegation' where delegates represent influential countries with more weight.",
  "The 'two-speaker rule' means two delegates speak for and two speak against before voting on a motion.",
  "A 'consultation of the whole' allows informal discussion without formal speaking procedures.",
  "Delegates often form 'blocs' or alliances with like-minded countries to advance common positions.",
  "Position papers are research documents delegates write before conferences outlining their country's stance.",
  "The 'gavel' is used by chairs to maintain order and signal the start or end of sessions.",
  "Many MUN conferences have specialized committees like ICJ, crisis committees, or press corps.",
  "The 'motion to divide the question' allows delegates to vote on parts of a resolution separately.",
  "A 'motion to table' postpones discussion indefinitely, effectively killing a topic.",
  "Delegates must be recognized by the chair before speaking, usually by raising their placard.",
  "The 'right of first refusal' gives the delegate who raised a motion the first chance to speak on it.",
  "Some MUN conferences award 'diplomacy points' for effective negotiation and compromise.",
  "The 'motion to extend debate' allows delegates to continue discussion when time is running out.",
  "Delegates often pass notes to each other during sessions to coordinate strategy or build alliances.",
  "The 'motion to move into voting procedure' transitions from debate to voting on resolutions.",
  "A 'roll call vote' requires each delegation to announce their vote publicly.",
  "The 'motion to reconsider' allows delegates to vote again on a previously decided matter.",
  "Many MUN conferences include social events like delegate dances or cultural nights.",
  "The 'motion to suspend debate' temporarily pauses discussion, often for lunch or breaks.",
  "Delegates representing the same country in different committees must maintain consistent positions.",
  "The 'motion to close debate' ends discussion and moves immediately to voting.",
  "Some MUN conferences use 'double delegation' where two delegates represent one country.",
  "The 'motion to set an agenda' determines the order in which topics will be discussed.",
  "Delegates often research their assigned country for months before attending a conference.",
  "The 'motion to appeal the decision of the chair' allows delegates to challenge a chair's ruling.",
  "Many MUN alumni credit the experience with developing public speaking and negotiation skills.",
  "The 'motion to divide the house' requires delegates to physically separate for a vote count.",
  "Some conferences award 'Best Position Paper' or 'Best Research' in addition to speaking awards.",
  "The 'motion to extend the speakers list' adds more delegates to the queue when it runs out.",
  "Delegates must follow formal address protocols, referring to others as 'the distinguished delegate'.",
  "The 'motion to move into unmoderated caucus' transitions from formal debate to informal discussion.",
  "Many MUN conferences have crisis directors who create unexpected events to challenge delegates.",
];

let currentFunFactIndex = 0;
let funFactRotationInterval = null;

const displayFunFact = () => {
  if (!elements.funFact || funFacts.length === 0) return;
  
  const funFactText = elements.funFact.querySelector(".fun-fact-text");
  if (!funFactText) return;
  
  // Fade out
  elements.funFact.style.opacity = "0";
  
  setTimeout(() => {
    currentFunFactIndex = (currentFunFactIndex + 1) % funFacts.length;
    funFactText.textContent = funFacts[currentFunFactIndex];
    // Fade in
    elements.funFact.style.opacity = "1";
  }, 300);
};

const startFunFactRotation = () => {
  if (funFactRotationInterval) return;
  
  // Display initial fact
  if (elements.funFact) {
    const funFactText = elements.funFact.querySelector(".fun-fact-text");
    if (funFactText) {
      currentFunFactIndex = Math.floor(Math.random() * funFacts.length);
      funFactText.textContent = funFacts[currentFunFactIndex];
    }
    
    // Make it clickable to manually rotate
    elements.funFact.style.cursor = "pointer";
    elements.funFact.addEventListener("click", displayFunFact);
  }
  
  // Rotate every 5 minutes (300000 milliseconds)
  funFactRotationInterval = setInterval(displayFunFact, 300000);
};

const stopFunFactRotation = () => {
  if (funFactRotationInterval) {
    clearInterval(funFactRotationInterval);
    funFactRotationInterval = null;
  }
};

// Points system - ROP understanding demonstration
const POINT_VALUES = {
  ROLL_CALL_PRESENT: 5,
  ROLL_CALL_PRESENT_VOTING: 10,
  OPENING_SPEECH: 15,
  RAISE_PLACARD: 3,
  RAISE_MOTION: 20,
  MOTION_PASSES: 15,
  MOTION_VOTE_YES: 5,
  MOTION_VOTE_NO: 3,
  MOTION_VOTE_ABSTAIN: 2,
  RAISE_POINT_PERSONAL_PRIVILEGE: 5,
  RAISE_POINT_PARLIAMENTARY_INQUIRY: 10,
  SPEAK_IN_MODERATED_CAUCUS: 12,
  SEND_NOTE: 2,
  RESOLUTION_VOTE_YES: 10,
  RESOLUTION_VOTE_NO: 5,
  RESOLUTION_VOTE_ABSTAIN: 3,
  PARTICIPATION_BONUS: 5, // For active participation throughout
  CRISIS_RESPONSE: 0, // Points vary by crisis option
};

const awardPoints = (action, amount = null, reason = "") => {
  if (!state.manualAdvanceEnabled) return; // Don't award points before simulation starts
  
  const pointsToAward = amount !== null ? amount : (POINT_VALUES[action] || 0);
  if (pointsToAward === 0) return;
  
  state.points += pointsToAward;
  if (state.delegation) {
    state.delegatePoints[state.delegation] = (state.delegatePoints[state.delegation] || 0) + pointsToAward;
  }
  state.pointsHistory.push({
    action,
    points: pointsToAward,
    reason,
    timestamp: Date.now(),
  });
  
  // Update display with animation
  if (elements.pointsValue) {
    elements.pointsValue.textContent = state.points;
    elements.pointsValue.style.animation = "none";
    setTimeout(() => {
      elements.pointsValue.style.animation = "pointsPulse 0.3s ease-out";
    }, 10);
  }
  
  updateDelegatePointsDisplay();
  
  // Log points award if significant
  if (pointsToAward >= 10) {
    logEvent(`+${pointsToAward} points: ${reason || action}`, [
      { label: "Points", variant: "system" },
    ]);
  }
};

const addPointsToDelegate = (delegationName, points) => {
  if (!delegationName || !state.delegatePoints.hasOwnProperty(delegationName)) return;
  state.delegatePoints[delegationName] = (state.delegatePoints[delegationName] || 0) + points;
  updateDelegatePointsDisplay();
};

const updateDelegatePointsDisplay = () => {
  if (!state.seats || Object.keys(state.seats).length === 0) return;
  Object.entries(state.seats).forEach(([name, { seat }]) => {
    const pointsEl = seat.querySelector(".delegate-points");
    if (!pointsEl) return;
    const pts = state.delegatePoints[name] != null ? state.delegatePoints[name] : 0;
    pointsEl.textContent = `${pts} pts`;
  });
};

const resetPoints = () => {
  state.points = 0;
  state.pointsHistory = [];
  state.delegatePoints = {};
  if (elements.pointsValue) {
    elements.pointsValue.textContent = "0";
  }
};

const actionQueue = [];

const flushActionQueue = () => {
  if (state.pendingContinues > 0) return;
  while (state.pendingContinues === 0 && actionQueue.length > 0) {
    const action = actionQueue.shift();
    action();
  }
};

const queueAction = (action) => {
  actionQueue.push(action);
  flushActionQueue();
};

const requireContinue = () => {
  if (!state.manualAdvanceEnabled || !elements.continueOverlay) return;
  state.pendingContinues = 1;
  elements.continueOverlay.classList.remove("hidden");
};

const handleContinue = () => {
  if (state.pendingContinues > 0) {
    state.pendingContinues -= 1;
  }
  if (state.pendingContinues === 0 && elements.continueOverlay) {
    elements.continueOverlay.classList.add("hidden");
  }
  flushActionQueue();
};

const getActiveDelegations = () => {
  if (state.committee && Array.isArray(state.committee.members)) {
    return state.committee.members;
  }
  return [];
};

// Order in which delegations appear on screen (may be shuffled)
const getSeatOrder = () => {
  if (!state.committee || !Array.isArray(state.committee.members)) return [];
  if (state.committee.displayOrder && state.committee.displayOrder.length === state.committee.members.length) {
    return state.committee.displayOrder;
  }
  return state.committee.members;
};

const motionTemplates = [
  {
    id: "motion1",
    type: "moderated",
    durationMinutes: 10,
    speakerSeconds: 60,
    label: "Motion for a moderated caucus on Sub-issue 1 for 10 minutes with 60 seconds per speaker.",
  },
  {
    id: "motion2",
    type: "unmoderated",
    durationMinutes: 20,
    speakerSeconds: 0,
    label: "Motion for an unmoderated caucus of 20 minutes.",
  },
  {
    id: "motion3",
    type: "consultation",
    durationMinutes: 12,
    speakerSeconds: 0,
    label: "Motion for a consultation of the whole on Sub-issue 2.",
  },
  {
    id: "motion4",
    type: "unmoderated",
    durationMinutes: 30,
    speakerSeconds: 0,
    label: "Motion for an unmoderated caucus of 30 minutes.",
  },
  {
    id: "motion5",
    type: "moderated",
    durationMinutes: 15,
    speakerSeconds: 90,
    label: "Motion for a moderated caucus on Sub-issue 3 for 15 minutes with 90 seconds per speaker.",
  },
];

const flagMap = {
  // Countries
  Algeria: "🇩🇿",
  Argentina: "🇦🇷",
  Australia: "🇦🇺",
  Austria: "🇦🇹",
  Bangladesh: "🇧🇩",
  Belgium: "🇧🇪",
  Brazil: "🇧🇷",
  Canada: "🇨🇦",
  China: "🇨🇳",
  Colombia: "🇨🇴",
  Denmark: "🇩🇰",
  Egypt: "🇪🇬",
  Ethiopia: "🇪🇹",
  France: "🇫🇷",
  Germany: "🇩🇪",
  Ghana: "🇬🇭",
  Greece: "🇬🇷",
  India: "🇮🇳",
  Indonesia: "🇮🇩",
  Italy: "🇮🇹",
  Japan: "🇯🇵",
  Kenya: "🇰🇪",
  Mexico: "🇲🇽",
  Morocco: "🇲🇦",
  Netherlands: "🇳🇱",
  Nigeria: "🇳🇬",
  Norway: "🇳🇴",
  Pakistan: "🇵🇰",
  Poland: "🇵🇱",
  Portugal: "🇵🇹",
  Qatar: "🇶🇦",
  Russia: "🇷🇺",
  "South Africa": "🇿🇦",
  "South Korea": "🇰🇷",
  Spain: "🇪🇸",
  Sweden: "🇸🇪",
  Turkey: "🇹🇷",
  "United Kingdom": "🇬🇧",
  "United States": "🇺🇸",
  // US States (using US flag)
  Alabama: "🇺🇸",
  Alaska: "🇺🇸",
  Arizona: "🇺🇸",
  Arkansas: "🇺🇸",
  California: "🇺🇸",
  Colorado: "🇺🇸",
  Connecticut: "🇺🇸",
  Delaware: "🇺🇸",
  Florida: "🇺🇸",
  Georgia: "🇺🇸",
  Hawaii: "🇺🇸",
  Idaho: "🇺🇸",
  Illinois: "🇺🇸",
  Indiana: "🇺🇸",
  Iowa: "🇺🇸",
  Kansas: "🇺🇸",
  Kentucky: "🇺🇸",
  Louisiana: "🇺🇸",
  // F1 Teams (unique emojis)
  Ferrari: "🔴",
  Mercedes: "⚙️",
  "Red Bull": "🐂",
  McLaren: "🍊",
  "Aston Martin": "💚",
  Alpine: "🔵",
  Williams: "🏁",
  AlphaTauri: "🟡",
  "Alfa Romeo": "❤️",
  Haas: "🇺🇸",
  // News Organizations (unique; PC committee removed)
  "Associated Press": "📰",
  Reuters: "📡",
  BBC: "📺",
  CNN: "🎥",
  "Al Jazeera": "🛰️",
  "The Guardian": "📑",
  "The New York Times": "🗞️",
  "The Washington Post": "📄",
  AFP: "📡",
  Bloomberg: "📈",
  // Fantasy committees — individuals only (no groups)
  // UNCSA — Umbrella Academy (15)
  Luther: "☂️",
  Diego: "🥊",
  Allison: "🎤",
  Klaus: "👻",
  Five: "⏰",
  Ben: "🦋",
  Vanya: "🎻",
  "The Handler": "⏱️",
  Lila: "🌀",
  "Reginald Hargreeves": "🎩",
  Pogo: "🐒",
  Grace: "🤖",
  Hazel: "🍩",
  "Cha-Cha": "💃",
  Agnes: "💐",
  // UNCSA — Harry Potter (15)
  "Harry Potter": "⚡",
  "Hermione Granger": "📚",
  "Ron Weasley": "🐀",
  "Albus Dumbledore": "🪄",
  "Severus Snape": "🐍",
  "Lord Voldemort": "💀",
  "Luna Lovegood": "🦁",
  "Neville Longbottom": "🐸",
  "Draco Malfoy": "🐲",
  "Minerva McGonagall": "🦉",
  "Rubeus Hagrid": "🧙",
  "Sirius Black": "🐕",
  "Remus Lupin": "🐺",
  "Bellatrix Lestrange": "🕷️",
  "Ginny Weasley": "🔥",
  // UNCSA — Wakanda & Talokan (15)
  "T'Challa": "🐾",
  Shuri: "🔬",
  Nakia: "🛡️",
  "M'Baku": "🦍",
  Namor: "🌊",
  Namora: "🌙",
  Okoye: "⚔️",
  Killmonger: "🔫",
  Ramonda: "👑",
  Attuma: "🦈",
  "W'Kabi": "🐂",
  Zuri: "🪄",
  Aneka: "💜",
  "Riri Williams": "🧪",
  "Everett Ross": "👮",
  // UNCSA — Spider-Man (15)
  "Peter Parker": "🕷️",
  "Mary Jane Watson": "❤️",
  "Ned Leeds": "💻",
  "J. Jonah Jameson": "📰",
  "May Parker": "💕",
  "Norman Osborn": "🎃",
  "Tony Stark": "🔧",
  "Nick Fury": "👁️",
  "Doctor Octopus": "🐙",
  "Flash Thompson": "⚡",
  "Gwen Stacy": "🌸",
  "Harry Osborn": "🟢",
  "Eddie Brock": "🖤",
  "Felicia Hardy": "🐱",
  "Miles Morales": "⚫",
  // UNCSA — Guardians (15)
  "Star-Lord": "🌟",
  Gamora: "⚔️",
  Drax: "💪",
  "Rocket Raccoon": "🦝",
  Groot: "🌳",
  Nebula: "🔮",
  Mantis: "🦋",
  Yondu: "🔵",
  Kraglin: "🪓",
  Cosmo: "🐕",
  "Adam Warlock": "⭐",
  Ayesha: "👑",
  Martinex: "💎",
  "Stakar Ogord": "☄️",
  "Phyla-Vell": "🟣",
  // UNCSA — X-Men (15)
  "Charles Xavier": "🧠",
  Magneto: "⚡",
  Wolverine: "🐺",
  Storm: "⛈️",
  "Jean Grey": "🔥",
  Mystique: "🔮",
  Cyclops: "👁️",
  Beast: "🔬",
  Nightcrawler: "😈",
  Rogue: "💋",
  Iceman: "❄️",
  Shadowcat: "🐱",
  Colossus: "💪",
  Angel: "👼",
  Phoenix: "🧡",
  // UNCSA — Avengers (15)
  "Iron Man": "🦾",
  "Captain America": "🛡️",
  Thor: "⚡",
  "Black Widow": "🕷️",
  Hulk: "💪",
  Hawkeye: "🏹",
  "Scarlet Witch": "🔮",
  Vision: "💎",
  Falcon: "🦅",
  "Winter Soldier": "❄️",
  "Black Panther": "🐾",
  "Captain Marvel": "⭐",
  "War Machine": "🛞",
  "Ant-Man": "🐜",
  Wasp: "🐝",
  // UNCSA — Justice League (15)
  Superman: "🦸",
  Batman: "🦇",
  "Wonder Woman": "🏹",
  Aquaman: "🔱",
  "The Flash": "⚡",
  Cyborg: "🤖",
  "Green Lantern": "💚",
  "Martian Manhunter": "🔴",
  Shazam: "⛈️",
  Hawkgirl: "🦅",
  "Green Arrow": "🏒",
  "Black Canary": "🎵",
  Supergirl: "💫",
  Batwoman: "🦇",
  Nightwing: "🌙",
  // UNCSA — Fantastic Four (15)
  "Mr. Fantastic": "4️⃣",
  "Invisible Woman": "👩",
  "Human Torch": "🔥",
  "The Thing": "💪",
  "Doctor Doom": "🛡️",
  "Silver Surfer": "🏄",
  "Alicia Masters": "🎨",
  "Franklin Richards": "🔮",
  "Valeria Richards": "💠",
  "She-Hulk": "🟢",
  Crystal: "💎",
  Medusa: "🐍",
  "Black Bolt": "⚡",
  Maximus: "👑",
  // UNCSA — Defenders (15)
  Daredevil: "😈",
  "Jessica Jones": "💪",
  "Luke Cage": "🛡️",
  "Iron Fist": "✊",
  Elektra: "⚔️",
  Punisher: "💀",
  "Colleen Wing": "🗡️",
  "Misty Knight": "🦾",
  "Claire Temple": "❤️",
  "Foggy Nelson": "⚖️",
  "Karen Page": "📰",
  Stick: "🥢",
  Kingpin: "👑",
  Bullseye: "🎯",
  "Trish Walker": "🎙️",
  // FWC — Avatar (15)
  "Jake Sully": "🌿",
  Neytiri: "🏹",
  Tonowari: "🌊",
  Ronal: "🌙",
  Quaritch: "🔫",
  "Grace Augustine": "🔬",
  "Norm Spellman": "🧪",
  "Trudy Chacon": "✈️",
  "Parker Selfridge": "💼",
  "Mo'at": "🌺",
  Eytukan: "🦅",
  "Tsu'tey": "🗡️",
  "Max Patel": "💻",
  "Lyle Wainfleet": "🪖",
  Ardmore: "🎖️",
  // FWC — Planet of the Apes (15)
  Caesar: "🦍",
  Maurice: "🦧",
  Rocket: "🐵",
  Cornelia: "👑",
  Koba: "😠",
  "The Colonel": "🎖️",
  "Blue Eyes": "👁️",
  Nova: "⭐",
  Lake: "🌊",
  "Bad Ape": "🍌",
  Winter: "❄️",
  Luca: "🦴",
  Rex: "🦖",
  Ash: "🔥",
  Spear: "🔱",
  // FWC — Stranger Things (15)
  Eleven: "🔮",
  "Mike Wheeler": "📻",
  "Joyce Byers": "💡",
  "Jim Hopper": "👮",
  "Dustin Henderson": "🍦",
  "Dr. Brenner": "🔬",
  "Lucas Sinclair": "🎮",
  "Will Byers": "🎨",
  "Max Mayfield": "🛹",
  "Steve Harrington": "🍷",
  "Nancy Wheeler": "📰",
  "Jonathan Byers": "📷",
  "Robin Buckley": "🎵",
  "Erica Sinclair": "🍬",
  "Murray Bauman": "📟",
  // FWC — How to Train Your Dragon (15)
  Hiccup: "🐉",
  Astrid: "🦅",
  Toothless: "🐲",
  Stoick: "⚔️",
  Valka: "🌙",
  Drago: "❄️",
  Snotlout: "🔥",
  Fishlegs: "📚",
  Ruffnut: "🟤",
  Tuffnut: "🟡",
  Gobber: "⚒️",
  Eret: "🛡️",
  Cloudjumper: "☁️",
  Grump: "😤",
  Skullcrusher: "🦴",
  // FWC — Lorax (15)
  "The Lorax": "🌳",
  "The Once-ler": "🏭",
  Ted: "🌱",
  Audrey: "🌸",
  "Aloysius O'Hare": "💨",
  "Grammy Norma": "👵",
  Isabella: "🌿",
  Brett: "🏙️",
  Chet: "🏢",
  "Uncle Ubb": "🧔",
  "Aunt Grizelda": "🧓",
  Cy: "🏗️",
  "The Once-ler's Mom": "👩",
  Norma: "👩‍🦳",
  "Thneedville Mayor": "🏛️",
  // FWC — Narnia (15)
  Aslan: "🦁",
  "Lucy Pevensie": "💊",
  "Edmund Pevensie": "🗡️",
  "Susan Pevensie": "🏹",
  "Peter Pevensie": "👑",
  "White Witch": "❄️",
  "Mr. Tumnus": "🦌",
  "Mr. Beaver": "🦫",
  "Mrs. Beaver": "🐾",
  Caspian: "⚜️",
  Reepicheep: "🐭",
  Trumpkin: "🍄",
  Miraz: "🗡️",
  "Eustace Scrubb": "📚",
  "Jill Pole": "📖",
  // FWC — Middle Earth (15)
  Aragorn: "⚔️",
  Gandalf: "🧙",
  Legolas: "🏹",
  Gimli: "⛏️",
  "Frodo Baggins": "💍",
  Galadriel: "✨",
  "Samwise Gamgee": "🌿",
  "Merry Brandybuck": "🍃",
  "Pippin Took": "🌾",
  Elrond: "🧝",
  Arwen: "🌟",
  Boromir: "🛡️",
  Faramir: "🗡️",
  Eowyn: "👩",
  Theoden: "👑",
  // FWC — Westeros (15)
  "Daenerys Targaryen": "🐉",
  "Jon Snow": "🐺",
  "Tyrion Lannister": "🦁",
  "Cersei Lannister": "👑",
  "Arya Stark": "🗡️",
  "Sansa Stark": "🐺",
  "Jaime Lannister": "⚔️",
  "Ned Stark": "❄️",
  "Catelyn Stark": "🐟",
  "Bran Stark": "🌿",
  "Robb Stark": "🩸",
  "Theon Greyjoy": "🐙",
  "Joffrey Baratheon": "😤",
  "Margaery Tyrell": "🌹",
  "Brienne of Tarth": "🛡️",
  // FWC — Hogwarts (15)
  "Fred Weasley": "🔥",
  "George Weasley": "🟠",
  // FWC — Neverland (15)
  "Peter Pan": "🧒",
  "Tinker Bell": "🧚",
  "Captain Hook": "🪝",
  "Wendy Darling": "⭐",
  "Tiger Lily": "🌸",
  "Mr. Smee": "🏴‍☠️",
  "John Darling": "👦",
  "Michael Darling": "🧸",
  Nana: "🐕",
  Curly: "🌀",
  Nibs: "🫘",
  Slightly: "📏",
  Tootles: "🎺",
  Starkey: "⚓",
  Mullins: "🦜",
};

const noteButtons = document.querySelectorAll(".note-button");
const pointButtons = document.querySelectorAll(".point-button");

const noteReplyOptions = [
  "Agrees and wants to work together.",
  "Declines politely.",
  "Asks to discuss further in caucus.",
  "Shows interest but needs more details.",
  "Sends a counter-proposal to meet later.",
  "Acknowledges and will consider it.",
  "Expresses enthusiasm and suggests forming a bloc.",
  "Says they need to consult their bloc first.",
];

const parliamentaryInquiryQuestions = [
  "Are we currently in a moderated or unmoderated caucus?",
  "What is the speaking time for this moderated caucus?",
  "Is the floor open for motions at this time?",
  "Can the delegate yield the remaining time to the chair?",
  "What is the required majority for passing this motion?",
  "Is a second required for this motion to be considered?",
  "Can we suspend debate to move into voting procedure?",
  "Are amendments to the draft resolution in order now?",
  "What is the procedure for a consultation of the whole?",
  "May a delegate raise a point while another is speaking?",
  "How will the speakers list be determined for this caucus?",
  "Is a roll call vote required for this decision?",
  "Are we operating under a two-speaker-for, two-against format?",
  "Can the chair clarify the voting order for draft resolutions?",
  "Is there time remaining for opening speeches?",
];

const logEvent = (message, tags = []) => {
  const entry = document.createElement("div");
  entry.className = "log-entry";
  if (tags.length) {
    const tagRow = document.createElement("div");
    tagRow.className = "log-tags";
    tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = `tag ${tag.variant || "system"}`;
      chip.textContent = tag.label;
      tagRow.appendChild(chip);
    });
    entry.appendChild(tagRow);
  }
  const messageEl = document.createElement("div");
  messageEl.className = "log-message";
  messageEl.textContent = message;
  entry.appendChild(messageEl);
  elements.log.prepend(entry);
  requireContinue();
};

const setChairBubble = (text) => {
  elements.chairBubble.textContent = text;
  requireContinue();
};

const speechAddressTemplates = {
  opening: (delegation) =>
    `Honorable chairs, esteemed delegates. The delegation of ${delegation} would like to thank the dais for this opportunity to address the committee. We believe that [your delegation's stance]. Thank you.`,
  moderated: (delegation, topicLine) =>
    `Honorable chairs, esteemed delegates. The delegation of ${delegation} would like to speak on ${topicLine}. We urge this committee to consider [your delegation's position]. Thank you.`,
};

const showSpeechAddress = (delegation, context, topicLine = "") => {
  if (!elements.speechAddress || !elements.speechAddressText) return;
  const text =
    context === "opening"
      ? speechAddressTemplates.opening(delegation)
      : speechAddressTemplates.moderated(delegation, topicLine);
  elements.speechAddressText.textContent = text;
  elements.speechAddress.classList.remove("hidden");
};

const clearSpeechAddress = () => {
  if (!elements.speechAddress) return;
  elements.speechAddress.classList.add("hidden");
  if (elements.speechAddressText) elements.speechAddressText.textContent = "";
};

const setStage = (label) => {
  state.stage = label;
  elements.stageLabel.textContent = label;
  updateConferenceProgress();
};

const setRoundLabel = () => {
  elements.roundLabel.textContent = `${state.round} / 5`;
  updateConferenceProgress();
};

const updateConferenceProgress = () => {
  if (!elements.conferenceProgressBar || !elements.conferenceProgressLabel) {
    return;
  }
  const perRound = 12;
  let percent = 0;
  if (state.stage === "Roll Call") percent = 5;
  if (state.stage === "Opening Speeches") percent = 15;
  if (
    state.stage === "Floor Open" ||
    state.stage === "Motion Vote" ||
    state.stage === "Motion"
  ) {
    const roundIndex = Math.max(0, state.round - 1);
    const base = 15 + roundIndex * perRound;
    const stageBonus =
      state.stage === "Floor Open" ? 2 : state.stage === "Motion Vote" ? 4 : 8;
    percent = base + stageBonus;
  }
  if (state.stage === "Resolution Vote") percent = 85;
  if (state.stage === "Awaiting Adjournment") percent = 95;
  if (state.stage === "Adjourned") percent = 100;
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));
  elements.conferenceProgressBar.style.width = `${clamped}%`;
  elements.conferenceProgressLabel.textContent = `${clamped}%`;
};

const updateStartAvailability = () => {
  const ready = Boolean(state.committee && state.delegation);
  elements.startSimulation.disabled = !ready;
  return ready;
};

const clearTimer = () => {
  if (state.timer) {
    clearInterval(state.timer);
  }
  state.timer = null;
  state.timerRemaining = 0;
  state.timerTotal = 0;
  updateProgress(0, 0);
};

const updateProgress = (remaining, total) => {
  if (!total) {
    elements.progressBar.style.width = "0%";
    elements.progressLabel.textContent = "No active timer.";
    return;
  }
  const percent = Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
  elements.progressBar.style.width = `${percent}%`;
  const minutesLeft = Math.ceil(remaining / 60);
  elements.progressLabel.textContent = `${minutesLeft} minute(s) remaining.`;
};

const startTimer = (seconds, onTick, onComplete) => {
  clearTimer();
  state.timerRemaining = seconds;
  state.timerTotal = seconds;
  updateProgress(seconds, seconds);
  state.timer = setInterval(() => {
    state.timerRemaining -= 1;
    updateProgress(state.timerRemaining, state.timerTotal);
    if (onTick) {
      onTick(state.timerRemaining);
    }
    if (state.timerRemaining <= 0) {
      clearTimer();
      if (onComplete) {
        onComplete();
      }
    }
  }, 1000 * TIME_SCALE);
};

const openModal = (title, body, actions, options = {}) => {
  elements.modalTitle.textContent = title;
  if (options.htmlBody != null) {
    elements.modalBody.innerHTML = options.htmlBody;
    elements.modalBody.classList.toggle("modal-body-html", true);
  } else {
    elements.modalBody.textContent = body;
    elements.modalBody.classList.toggle("modal-body-html", false);
  }
  elements.modalActions.innerHTML = "";
  actions.forEach((action) => {
    const button = document.createElement("button");
    button.textContent = action.label;
    button.className = action.className || "";
    button.addEventListener("click", () => {
      closeModal();
      action.onClick();
    });
    elements.modalActions.appendChild(button);
  });
  elements.modal.classList.remove("hidden");
};

const buildVoteActions = (onVote) => {
  const actions = [
    { label: "Yes", className: "primary", onClick: () => onVote("yes") },
    { label: "No", onClick: () => onVote("no") },
  ];
  if (state.votingStatus !== "present_and_voting") {
    actions.push({ label: "Abstain", onClick: () => onVote("abstain") });
  }
  return actions;
};

const closeModal = () => {
  elements.modal.classList.add("hidden");
};

const showNoteNotification = (message) => {
  if (!elements.noteNotification) return;
  elements.noteNotification.textContent = message;
};

const buildSeats = () => {
  elements.delegateRing.innerHTML = "";
  state.seats = {};
  const order = getSeatOrder();
  order.forEach((name) => {
    const seat = document.createElement("div");
    seat.className = "delegate-seat";
    seat.title = name;
    const nameLabel = document.createElement("div");
    nameLabel.className = "delegate-name";
    nameLabel.textContent = name;
    nameLabel.title = name;
    const pointsEl = document.createElement("div");
    pointsEl.className = "delegate-points";
    pointsEl.textContent = "0 pts";
    const placard = document.createElement("div");
    placard.className = "placard";
    placard.textContent = flagMap[name] || name[0];
    seat.appendChild(nameLabel);
    seat.appendChild(placard);
    seat.appendChild(pointsEl);
    elements.delegateRing.appendChild(seat);
    state.seats[name] = { seat, placard, home: seat };
  });
  updateDelegatePointsDisplay();
};

const setCurrentSpeaker = (name, usePodium = true) => {
  state.currentSpeaker = name;
  elements.currentSpeaker.textContent = name || "None";
  Object.values(state.seats).forEach(({ seat, placard }) => {
    seat.classList.remove("highlight");
    placard.classList.remove("consulting");
  });
  if (!name || !state.seats[name]) {
    return;
  }
  const { seat, placard } = state.seats[name];
  if (usePodium) {
    movePlacardToPodium(name);
  } else {
    returnPlacardHome();
    seat.classList.add("highlight");
    placard.classList.add("consulting");
  }
};

const movePlacardToPodium = (name) => {
  returnPlacardHome();
  const seatInfo = state.seats[name];
  if (!seatInfo) return;
  seatInfo.placard.classList.add("at-podium");
  elements.podium.appendChild(seatInfo.placard);
  state.currentPlacard = name;
};

const returnPlacardHome = () => {
  if (!state.currentPlacard) return;
  const seatInfo = state.seats[state.currentPlacard];
  if (!seatInfo) return;
  seatInfo.placard.classList.remove("at-podium");
  seatInfo.home.appendChild(seatInfo.placard);
  state.currentPlacard = null;
};

const getSubIssueLabel = (index) => {
  if (!state.committee) {
    return "General discussion";
  }
  const issue = state.committee.subIssues[index];
  return issue ? `Sub-issue ${index + 1}: ${issue}` : "General discussion";
};

const randomMember = () => {
  const delegations = getActiveDelegations();
  const pool = delegations.length ? delegations : memberStates;
  return pool[Math.floor(Math.random() * pool.length)];
};

const populateSelects = () => {
  const currentCommittee =
    elements.committeeSelect.value ||
    (state.committee ? state.committee.id : "");
  const currentDelegation =
    elements.delegationSelect.value || state.delegation || "";
  elements.committeeSelect.innerHTML = "";
  const committeePlaceholder = document.createElement("option");
  committeePlaceholder.value = "";
  committeePlaceholder.textContent = "Select a committee";
  elements.committeeSelect.appendChild(committeePlaceholder);
  committees.forEach((committee) => {
    const option = document.createElement("option");
    option.value = committee.id;
    option.textContent = committee.name;
    elements.committeeSelect.appendChild(option);
  });
  elements.committeeSelect.value = currentCommittee;
  elements.delegationSelect.innerHTML = "";
  const delegationPlaceholder = document.createElement("option");
  delegationPlaceholder.value = "";
  delegationPlaceholder.textContent = "Select a delegation";
  elements.delegationSelect.appendChild(delegationPlaceholder);
  const delegations = getActiveDelegations();
  delegations.forEach((stateName) => {
    const option = document.createElement("option");
    option.value = stateName;
    option.textContent = stateName;
    elements.delegationSelect.appendChild(option);
  });
  elements.delegationSelect.value = currentDelegation;
  if (elements.noteRecipientSelect) {
    elements.noteRecipientSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select a delegate";
    elements.noteRecipientSelect.appendChild(placeholder);
    delegations.forEach((stateName) => {
      if (stateName === currentDelegation) return;
      const option = document.createElement("option");
      option.value = stateName;
      option.textContent = stateName;
      elements.noteRecipientSelect.appendChild(option);
    });
    elements.noteRecipientSelect.value = "";
  }
  if (elements.parliamentaryInquirySelect) {
    elements.parliamentaryInquirySelect.innerHTML = "";
    parliamentaryInquiryQuestions.forEach((question, index) => {
      const option = document.createElement("option");
      option.value = question;
      option.textContent = `${index + 1}. ${question}`;
      elements.parliamentaryInquirySelect.appendChild(option);
    });
    elements.parliamentaryInquirySelect.value = parliamentaryInquiryQuestions[0];
  }
};

const updateCommitteeInfo = () => {
  if (!state.committee) {
    elements.committeeTopic.textContent = "Select a committee to view the topic.";
    if (elements.committeeUniverse) {
      elements.committeeUniverse.textContent = "";
      elements.committeeUniverse.classList.add("hidden");
    }
    if (elements.subIssueList) {
      elements.subIssueList.innerHTML = "";
    }
    return;
  }
  if (elements.committeeUniverse) {
    if (state.committee.universeName) {
      elements.committeeUniverse.textContent = "Universe: " + state.committee.universeName;
      elements.committeeUniverse.classList.remove("hidden");
    } else {
      elements.committeeUniverse.textContent = "";
      elements.committeeUniverse.classList.add("hidden");
    }
  }
  elements.committeeTopic.textContent = state.committee.topic;
  if (elements.subIssueList) {
    elements.subIssueList.innerHTML = "";
    state.committee.subIssues.forEach((issue) => {
      const li = document.createElement("li");
      li.textContent = issue;
      elements.subIssueList.appendChild(li);
    });
  }
};

const resetSimulation = () => {
  clearTimer();
  actionQueue.length = 0;
  state.pendingContinues = 0;
  if (elements.continueOverlay) {
    elements.continueOverlay.classList.add("hidden");
  }
  state.round = 0;
  state.stage = "Idle";
  state.skipHandler = null;
  state.currentSpeaker = null;
  state.motionQueue = [];
  state.roundInProgress = false;
  state.raised = false;
  state.votingStatus = "present";
  returnPlacardHome();
  elements.log.innerHTML = "";
  setStage("Waiting");
  setRoundLabel();
  elements.currentSpeaker.textContent = "None";
  setChairBubble("Welcome delegates.");
  clearSpeechAddress();
  elements.adjournButton.disabled = true;
  elements.raiseMotion.disabled = true;
  elements.waitButton.disabled = true;
  showNoteNotification("");
  updateConferenceProgress();
  updateStartAvailability();
  state.activeCrisis = null;
  state.crisesTriggered = 0;
  const delegations = getActiveDelegations();
  state.delegatePoints = {};
  delegations.forEach((d) => {
    state.delegatePoints[d] = 0;
  });
  updateDelegatePointsDisplay();
};

const isCrisisCommittee = () => {
  if (!state.committee) return false;
  return ["hsc", "icj", "uncsa", "fwc"].includes(state.committee.id);
};

const triggerCrisis = () => {
  if (!isCrisisCommittee() || !state.manualAdvanceEnabled) return;
  
  const committeeCrises = crises[state.committee.id];
  if (!committeeCrises || committeeCrises.length === 0) return;
  
  // Don't trigger more than 2 crises per session
  if (state.crisesTriggered >= 2) return;
  
  // Random chance to trigger (30% chance when called)
  if (Math.random() > 0.3) return;
  
  const crisis = committeeCrises[Math.floor(Math.random() * committeeCrises.length)];
  state.activeCrisis = crisis;
  state.crisesTriggered += 1;
  
  logEvent(`🚨 CRISIS: ${crisis.title}`, [
    { label: "Crisis", variant: "system" },
  ]);
  setChairBubble(`Breaking: ${crisis.title}`);
  
  queueAction(() =>
    openModal(
      `🚨 Crisis: ${crisis.title}`,
      crisis.description,
      crisis.options.map((option, idx) => ({
        label: option.text,
        className: idx === 0 ? "primary" : "",
        onClick: () => {
          awardPoints("CRISIS_RESPONSE", option.points, `Responded to crisis: ${crisis.title}`);
          logEvent(`Crisis Response: ${option.text}`, [
            { label: "Crisis", variant: "system" },
            { label: "Response", variant: "system" },
          ]);
          logEvent(`Outcome: ${option.outcome}`, [
            { label: "Crisis", variant: "system" },
            { label: "Outcome", variant: "system" },
          ]);
          setChairBubble(option.outcome);
          state.activeCrisis = null;
        },
      }))
    )
  );
};

const runRollCall = () => {
  setStage("Roll Call");
  state.skipHandler = null;
  setChairBubble("Roll call will be taken alphabetically. Please state your presence.");
  logEvent("Roll call begins in alphabetical order.", [
    { label: "System", variant: "system" },
  ]);
  const ordered = [...getActiveDelegations()].sort();
  let index = 0;

  const advance = () => {
    if (index >= ordered.length) {
      logEvent("Roll call concluded.", [{ label: "System", variant: "system" }]);
      queueAction(() => startOpeningSpeeches());
      return;
    }
    const current = ordered[index];
    setCurrentSpeaker(current, false);
    setChairBubble(`Delegate of ${current}, please state your presence.`);
    if (current === state.delegation) {
      queueAction(() =>
        openModal("Roll Call", `${current}, please respond.`, [
          {
            label: "Present",
            className: "primary",
            onClick: () => {
              state.votingStatus = "present";
              logEvent(`${current} is present.`, [{ label: "System", variant: "system" }]);
              awardPoints("ROLL_CALL_PRESENT", null, "Responded 'Present' during roll call");
              index += 1;
              queueAction(() => advance());
            },
          },
          {
            label: "Present and Voting",
            onClick: () => {
              state.votingStatus = "present_and_voting";
              logEvent(`${current} is present and voting.`, [
                { label: "System", variant: "system" },
              ]);
              awardPoints("ROLL_CALL_PRESENT_VOTING", null, "Responded 'Present and Voting' during roll call");
              index += 1;
              queueAction(() => advance());
            },
          },
        ])
      );
      return;
    }
    logEvent(`${current} is present.`, [{ label: "System", variant: "system" }]);
    addPointsToDelegate(current, 3);
    index += 1;
    queueAction(() => advance());
  };

  queueAction(() => advance());
};

const startOpeningSpeeches = () => {
  setStage("Opening Speeches");
  state.skipHandler = () => {
    logEvent("Opening speeches skipped.", [{ label: "System", variant: "system" }]);
    clearTimer();
    clearSpeechAddress();
    returnPlacardHome();
    queueAction(() => openFloor());
  };
  setChairBubble("We will now hear opening speeches.");
  logEvent("Opening speeches begin. Delegates speak in alphabetical order.", [
    { label: "System", variant: "system" },
  ]);
  const ordered = [...getActiveDelegations()].sort();
  const totalSeconds = 20 * 60;
  const speakerSeconds = Math.max(30, Math.floor(totalSeconds / ordered.length));
  let index = 0;

  const nextSpeaker = () => {
    if (state.stage !== "Opening Speeches") {
      return;
    }
    if (index >= ordered.length) {
      logEvent("Opening speeches concluded.", [{ label: "System", variant: "system" }]);
      clearSpeechAddress();
      returnPlacardHome();
      queueAction(() => openFloor());
      return;
    }
    const current = ordered[index];
    setCurrentSpeaker(current, true);
    setChairBubble(`Delegate of ${current}, please approach the podium.`);
    if (current === state.delegation) {
      queueAction(() =>
        openModal(
          "Your Turn to Speak",
          `It's your turn to give your opening speech. Click "Begin Speaking" when ready.`,
          [
            {
              label: "Begin Speaking",
              className: "primary",
              onClick: () => {
                awardPoints("OPENING_SPEECH", null, "Gave opening speech");
                showSpeechAddress(state.delegation, "opening");
                startTimer(
                  speakerSeconds,
                  null,
                  () => {
                    clearSpeechAddress();
                    index += 1;
                    queueAction(() => nextSpeaker());
                  }
                );
              },
            },
          ]
        )
      );
    } else {
      queueAction(() => {
        showSpeechAddress(current, "opening");
        startTimer(
          speakerSeconds,
          null,
          () => {
            clearSpeechAddress();
            addPointsToDelegate(current, 10);
            index += 1;
            queueAction(() => nextSpeaker());
          }
        );
      });
    }
  };

  queueAction(() => nextSpeaker());
};

const openFloor = () => {
  state.round += 1;
  setRoundLabel();
  state.skipHandler = null;
  if (state.round > 5) {
    startResolutionVote();
    return;
  }
  setStage("Floor Open");
  state.roundInProgress = true;
  state.motionQueue = [];
  returnPlacardHome();
  elements.raiseMotion.disabled = false;
  elements.waitButton.disabled = false;
  setChairBubble("The floor is now open for motions.");
  logEvent(`Round ${state.round}: The floor is open for motions.`, [
    { label: "Motion", variant: "motion" },
    { label: `Round ${state.round}`, variant: "motion" },
  ]);

  const randomMotions = motionTemplates.map((motion) => ({
    ...motion,
    raisedBy: randomMember(),
  }));
  state.motionQueue = randomMotions;

  randomMotions.forEach((motion) => {
    logEvent(`${motion.raisedBy} raises: ${formatMotionLabel(motion)}.`, [
      { label: "Motion", variant: "motion" },
      { label: "Raised", variant: "motion" },
      { label: motion.type, variant: "motion" },
    ]);
    addPointsToDelegate(motion.raisedBy, 15);
  });
  
  // Trigger crisis for crisis committees (after a delay)
  if (isCrisisCommittee() && state.round >= 2) {
    setTimeout(() => {
      triggerCrisis();
    }, 2000);
  }
};

const formatMotionLabel = (motion) => {
  if (motion.id === "motion1") {
    return `Motion for a moderated caucus on ${getSubIssueLabel(0)} for 10 minutes with 60 seconds per speaker.`;
  }
  if (motion.id === "motion3") {
    return `Motion for a consultation of the whole on ${getSubIssueLabel(1)}.`;
  }
  if (motion.id === "motion5") {
    return `Motion for a moderated caucus on ${getSubIssueLabel(2)} for 15 minutes with 90 seconds per speaker.`;
  }
  return motion.label;
};

const chooseMotion = (motion) => {
  elements.raiseMotion.disabled = true;
  elements.waitButton.disabled = true;
  const raisedBy = state.delegation;
  const userMotion = { ...motion, raisedBy };
  state.motionQueue.unshift(userMotion);
  logEvent(`${raisedBy} raises: ${formatMotionLabel(userMotion)}.`, [
    { label: "Motion", variant: "motion" },
    { label: "Raised", variant: "motion" },
    { label: userMotion.type, variant: "motion" },
  ]);
  awardPoints("RAISE_MOTION", null, `Raised motion: ${motion.type} caucus`);
  chairCallsForVote(userMotion);
};

const waitForMotions = () => {
  elements.raiseMotion.disabled = true;
  elements.waitButton.disabled = true;
  if (state.motionQueue.length === 0) {
    logEvent("No motions are currently on the floor.", [
      { label: "Motion", variant: "motion" },
    ]);
    elements.raiseMotion.disabled = false;
    elements.waitButton.disabled = false;
    return;
  }
  if (state.motionQueue.length === 1) {
    chairCallsForVote(state.motionQueue[0]);
    return;
  }
  const motionOptions = state.motionQueue.map((motion, idx) => ({
    label: `${motion.raisedBy}: ${formatMotionLabel(motion)}`,
    className: idx === 0 ? "primary" : "",
    onClick: () => chairCallsForVote(motion),
  }));
  queueAction(() =>
    openModal(
      "Choose Motion to Vote On",
      "Select which motion the chair should call for a vote:",
      motionOptions
    )
  );
};

const chairCallsForVote = (motion) => {
  setStage("Motion Vote");
  state.skipHandler = null;
  setChairBubble(`We will now vote on the motion raised by ${motion.raisedBy}.`);
  logEvent(`Voting on motion: ${formatMotionLabel(motion)}`, [
    { label: "Motion", variant: "motion" },
    { label: "Vote", variant: "motion" },
    { label: motion.type, variant: "motion" },
  ]);
  queueAction(() =>
    openModal(
      "Motion Vote",
      `${motion.raisedBy} moves: ${formatMotionLabel(motion)} Vote?`,
      buildVoteActions((vote) => resolveMotionVote(motion, vote))
    )
  );
};

const resolveMotionVote = (motion, vote) => {
  let yesPercent = 50;
  if (vote === "yes") {
    yesPercent = randBetween(55, 80);
    awardPoints("MOTION_VOTE_YES", null, "Voted 'Yes' on motion");
  }
  if (vote === "no") {
    yesPercent = randBetween(25, 45);
    awardPoints("MOTION_VOTE_NO", null, "Voted 'No' on motion");
  }
  if (vote === "abstain") {
    yesPercent = randBetween(45, 55);
    awardPoints("MOTION_VOTE_ABSTAIN", null, "Abstained on motion vote");
  }
  const passes = yesPercent >= 50;
  logEvent(
    `Motion vote result: ${yesPercent}% in favor. Motion ${
      passes ? "passes" : "fails"
    }.`,
    [
      { label: "Motion", variant: "motion" },
      { label: "Vote Result", variant: "motion" },
      { label: passes ? "Passed" : "Failed", variant: "motion" },
    ]
  );
  if (passes) {
    if (motion.raisedBy === state.delegation) {
      awardPoints("MOTION_PASSES", null, "Your motion passed!");
    }
    queueAction(() => runMotion(motion));
  } else {
    logEvent("The chair entertains new motions.");
    queueAction(() => openFloor());
  }
};

const randBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const runMotion = (motion) => {
  setStage("Motion");
  const topicLine = motion.id.includes("1")
    ? getSubIssueLabel(0)
    : motion.id.includes("3")
      ? getSubIssueLabel(1)
      : motion.id.includes("5")
        ? getSubIssueLabel(2)
        : "general discussion";
  logEvent(`Motion begins: ${formatMotionLabel(motion)}`, [
    { label: "Motion", variant: "motion" },
    { label: motion.type, variant: "motion" },
    { label: "In Session", variant: "motion" },
  ]);

  if (motion.type === "moderated") {
    runModeratedCaucus(motion, topicLine);
    return;
  }
  if (motion.type === "consultation") {
    runConsultation(motion, topicLine);
    return;
  }
  runUnmoderatedCaucus(motion, topicLine);
};

const runModeratedCaucus = (motion, topicLine) => {
  setChairBubble("Moderated caucus begins. Speakers will be timed.");
  state.skipHandler = () => {
    logEvent("Moderated caucus skipped.", [
      { label: "Motion", variant: "motion" },
      { label: "Moderated", variant: "motion" },
      { label: "Skipped", variant: "motion" },
    ]);
    clearTimer();
    clearSpeechAddress();
    returnPlacardHome();
    queueAction(() => openFloor());
  };
  const totalSeconds = motion.durationMinutes * 60;
  const speakerSeconds = motion.speakerSeconds;
  const speakerCount = Math.max(1, Math.floor(totalSeconds / speakerSeconds));
  let current = 0;
  
  // Trigger crisis during caucus for crisis committees
  if (isCrisisCommittee() && Math.random() > 0.7) {
    setTimeout(() => {
      triggerCrisis();
    }, 3000);
  }

  const nextSpeaker = () => {
    if (current >= speakerCount) {
      logEvent("Moderated caucus concluded.", [
        { label: "Motion", variant: "motion" },
        { label: "Moderated", variant: "motion" },
        { label: "Concluded", variant: "motion" },
      ]);
      clearSpeechAddress();
      returnPlacardHome();
      queueAction(() => openFloor());
      return;
    }
    const speaker = randomMember();
    setCurrentSpeaker(speaker, true);
    setChairBubble(
      `Delegate of ${speaker}, you are recognized to speak on ${topicLine}`
    );
    logEvent(`${speaker} speaks on ${topicLine}`, [
      { label: "Motion", variant: "motion" },
      { label: "Moderated", variant: "motion" },
      { label: "Speaker", variant: "motion" },
    ]);
    if (speaker === state.delegation) {
      queueAction(() =>
        openModal(
          "Your Turn to Speak",
          `You are recognized to speak on ${topicLine}. Click "Begin Speaking" when ready.`,
          [
            {
              label: "Begin Speaking",
              className: "primary",
              onClick: () => {
                awardPoints("SPEAK_IN_MODERATED_CAUCUS", null, `Spoke in moderated caucus on ${topicLine}`);
                showSpeechAddress(state.delegation, "moderated", topicLine);
                startTimer(
                  speakerSeconds,
                  null,
                  () => {
                    clearSpeechAddress();
                    current += 1;
                    queueAction(() => nextSpeaker());
                  }
                );
              },
            },
          ]
        )
      );
    } else {
      queueAction(() => {
        showSpeechAddress(speaker, "moderated", topicLine);
        startTimer(
          speakerSeconds,
          null,
          () => {
            clearSpeechAddress();
            addPointsToDelegate(speaker, 10);
            current += 1;
            queueAction(() => nextSpeaker());
          }
        );
      });
    }
  };

  queueAction(() => nextSpeaker());
};

const runUnmoderatedCaucus = (motion, topicLine) => {
  setChairBubble("Unmoderated caucus begins. Delegates may consult.");
  state.skipHandler = () => {
    logEvent("Unmoderated caucus skipped.", [
      { label: "Motion", variant: "motion" },
      { label: "Unmoderated", variant: "motion" },
      { label: "Skipped", variant: "motion" },
    ]);
    clearTimer();
    clearConsultation();
    queueAction(() => openFloor());
  };
  logEvent(`Unmoderated caucus begins on ${topicLine}.`, [
    { label: "Motion", variant: "motion" },
    { label: "Unmoderated", variant: "motion" },
    { label: "In Session", variant: "motion" },
  ]);
  setCurrentSpeaker("Consultation", false);
  highlightConsultation();
  
  // Trigger crisis during unmoderated caucus for crisis committees
  if (isCrisisCommittee() && Math.random() > 0.7) {
    setTimeout(() => {
      triggerCrisis();
    }, 4000);
  }
  
  queueAction(() =>
    openModal(
      "Unmoderated Caucus Begins",
      `The unmoderated caucus on ${topicLine} has begun. You may now consult with other delegates. Click "Begin Caucus" to start the timer.`,
      [
        {
          label: "Begin Caucus",
          className: "primary",
          onClick: () => {
            startTimer(motion.durationMinutes * 60, null, () => {
              logEvent("Unmoderated caucus concluded.", [
                { label: "Motion", variant: "motion" },
                { label: "Unmoderated", variant: "motion" },
                { label: "Concluded", variant: "motion" },
              ]);
              clearConsultation();
              queueAction(() => openFloor());
            });
          },
        },
      ]
    )
  );
};

const runConsultation = (motion, topicLine) => {
  setChairBubble("Consultation of the whole begins.");
  state.skipHandler = () => {
    logEvent("Consultation skipped.", [
      { label: "Motion", variant: "motion" },
      { label: "Consultation", variant: "motion" },
      { label: "Skipped", variant: "motion" },
    ]);
    clearTimer();
    clearConsultation();
    queueAction(() => openFloor());
  };
  logEvent(`Consultation of the whole begins on ${topicLine}.`, [
    { label: "Motion", variant: "motion" },
    { label: "Consultation", variant: "motion" },
    { label: "In Session", variant: "motion" },
  ]);
  setCurrentSpeaker("Consultation", false);
  highlightConsultation();
  
  // Trigger crisis during consultation for crisis committees
  if (isCrisisCommittee() && Math.random() > 0.7) {
    setTimeout(() => {
      triggerCrisis();
    }, 4000);
  }
  
  queueAction(() =>
    openModal(
      "Consultation of the Whole Begins",
      `The consultation of the whole on ${topicLine} has begun. You may now consult with other delegates. Click "Begin Consultation" to start the timer.`,
      [
        {
          label: "Begin Consultation",
          className: "primary",
          onClick: () => {
            startTimer(motion.durationMinutes * 60, null, () => {
              logEvent("Consultation concluded.", [
                { label: "Motion", variant: "motion" },
                { label: "Consultation", variant: "motion" },
                { label: "Concluded", variant: "motion" },
              ]);
              clearConsultation();
              queueAction(() => openFloor());
            });
          },
        },
      ]
    )
  );
};

const highlightConsultation = () => {
  clearConsultation();
  const activeCount = 6;
  for (let i = 0; i < activeCount; i += 1) {
    const name = randomMember();
    const seatInfo = state.seats[name];
    if (!seatInfo) continue;
    seatInfo.seat.classList.add("highlight");
    seatInfo.placard.classList.add("consulting");
  }
};

const clearConsultation = () => {
  Object.values(state.seats).forEach(({ seat, placard }) => {
    seat.classList.remove("highlight");
    placard.classList.remove("consulting");
  });
  returnPlacardHome();
};

const buildDraftResolutionsBody = () => {
  const topic = state.committee && state.committee.topic ? state.committee.topic : "the matter under consideration";
  return (
    "The following draft resolution(s) are before the committee:\n\n" +
    "Draft Resolution A/1 (as amended)\n" +
    "Topic: " +
    topic +
    "\n\n" +
    "Preambulatory clauses: Affirming the importance of international cooperation; Noting with concern the challenges faced; Reaffirming relevant principles.\n\n" +
    "Operative clauses: 1. Calls upon member states to strengthen cooperation; 2. Encourages the exchange of best practices; 3. Requests the Secretary-General to report on implementation.\n\n" +
    "———\n\n" +
    "The committee will now vote on the draft resolution package. Please review the text above, then proceed to vote."
  );
};

const showDraftResolutionsModal = () => {
  openModal(
    "Draft Resolutions",
    buildDraftResolutionsBody(),
    [
      {
        label: "Proceed to Vote",
        className: "primary",
        onClick: () => {
          openModal(
            "Resolution Vote",
            "Vote on the draft resolution package.",
            buildVoteActions((vote) => finishResolutionVote(vote))
          );
        },
      },
    ]
  );
};

const startResolutionVote = () => {
  setStage("Resolution Vote");
  state.skipHandler = null;
  setChairBubble("We will now move into voting procedure.");
  logEvent("Committee moves into voting on draft resolutions.", [
    { label: "System", variant: "system" },
    { label: "Voting", variant: "system" },
  ]);
  queueAction(() => showDraftResolutionsModal());
};

const finishResolutionVote = (vote) => {
  let yesPercent = 50;
  if (vote === "yes") {
    yesPercent = randBetween(55, 85);
    awardPoints("RESOLUTION_VOTE_YES", null, "Voted 'Yes' on resolution");
  }
  if (vote === "no") {
    yesPercent = randBetween(25, 45);
    awardPoints("RESOLUTION_VOTE_NO", null, "Voted 'No' on resolution");
  }
  if (vote === "abstain") {
    yesPercent = randBetween(45, 55);
    awardPoints("RESOLUTION_VOTE_ABSTAIN", null, "Abstained on resolution vote");
  }
  logEvent(`Resolution vote result: ${yesPercent}% in favor.`, [
    { label: "System", variant: "system" },
    { label: "Vote Result", variant: "system" },
  ]);
  const clapping = yesPercent >= 50 ? "Clapping is in order." : "Clapping is not in order.";
  setChairBubble(clapping);
  logEvent(clapping, [{ label: "System", variant: "system" }]);
  elements.adjournButton.disabled = false;
  setStage("Awaiting Adjournment");
  state.skipHandler = () => {
    adjournCommittee();
  };
};

const adjournCommittee = () => {
  setStage("Adjourned");
  state.skipHandler = null;
  setChairBubble("The committee is adjourned.");
  logEvent("The committee is adjourned.", [{ label: "System", variant: "system" }]);
  awardPoints("PARTICIPATION_BONUS", 25, "Completed the committee session!");
  queueAction(() => showAwards());
};

const showAwards = () => {
  const delegations = getActiveDelegations();
  const ranked = [...delegations].sort((a, b) => (state.delegatePoints[b] || 0) - (state.delegatePoints[a] || 0));
  const awards = [
    { title: "Best Delegate", winner: ranked[0], points: state.delegatePoints[ranked[0]] || 0, tier: 1 },
    { title: "Outstanding Delegate", winner: ranked[1], points: state.delegatePoints[ranked[1]] || 0, tier: 2 },
    { title: "Honorable Mention", winner: ranked[2], points: state.delegatePoints[ranked[2]] || 0, tier: 3 },
  ];
  const finalScore = state.points;
  const yourRank = ranked.indexOf(state.delegation) + 1;
  const rankText = yourRank <= 3 ? `Your Rank: #${yourRank}` : `Your Rank: #${yourRank} of ${ranked.length}`;
  const awardsHtml =
    "<p class=\"awards-summary\">Your Final Score: <strong>" +
    finalScore +
    "</strong> points &middot; " +
    rankText +
    "</p>" +
    "<div class=\"awards-list\">" +
    awards
      .map(
        (a) =>
          "<div class=\"award-tier award-tier-" +
          a.tier +
          "\">" +
          "<span class=\"award-title\">" +
          a.title +
          "</span>" +
          "<span class=\"award-winner\">" +
          a.winner +
          "</span>" +
          "<span class=\"award-points\">" +
          a.points +
          " pts</span>" +
          "</div>"
      )
      .join("") +
    "</div>";
  queueAction(() =>
    openModal(
      "Awards Ceremony",
      null,
      [
        {
          label: "Restart Simulation",
          className: "primary",
          onClick: () => resetSimulation(),
        },
      ],
      { htmlBody: awardsHtml }
    )
  );
};

elements.committeeSelect.addEventListener("change", (event) => {
  const selected = committees.find((committee) => committee.id === event.target.value);
  if (selected) {
    if (selected.fantasy) {
      // Fantasy: resolve to one random universe and topic (no multi-universe in committee)
      state.committee = resolveFantasyCommittee(selected);
    } else {
      if (selected.topicGroups && selected.topicGroups.length > 0) {
        selected.topic = selectRandomTopic(selected.topicGroups);
      }
      state.committee = selected;
    }
  } else {
    state.committee = null;
  }
  const delegations = getActiveDelegations();
  if (!delegations.includes(state.delegation)) {
    state.delegation = null;
  }
  populateSelects();
  updateCommitteeInfo();
  buildSeats();
  updateStartAvailability();
});

const runShuffleAllocations = () => {
  if (!state.committee || !state.committee.members.length) return;
  state.committee.displayOrder = shuffleArray([...state.committee.members]);
  buildSeats();
  updateDelegatePointsDisplay();
};

const runShuffleTopic = () => {
  if (!state.committee) return;
  const base = committees.find((c) => c.id === state.committee.id);
  if (!base) return;
  if (base.fantasy && base.universes && base.universes.length > 0) {
    state.committee = resolveFantasyCommittee(base);
    delete state.committee.displayOrder;
    const delegations = getActiveDelegations();
    if (!delegations.includes(state.delegation)) {
      state.delegation = null;
    }
    populateSelects();
    updateCommitteeInfo();
    buildSeats();
  } else if (state.committee.topicGroups && state.committee.topicGroups.length > 0) {
    state.committee.topic = selectRandomTopic(state.committee.topicGroups);
    updateCommitteeInfo();
  }
  updateStartAvailability();
};

if (elements.shuffleAllocations) {
  elements.shuffleAllocations.addEventListener("click", runShuffleAllocations);
}
if (elements.shuffleTopic) {
  elements.shuffleTopic.addEventListener("click", runShuffleTopic);
}

elements.delegationSelect.addEventListener("change", (event) => {
  state.delegation = event.target.value || null;
  populateSelects();
  updateStartAvailability();
});

elements.startSimulation.addEventListener("click", () => {
  if (!updateStartAvailability()) {
    setChairBubble("Please select a committee and delegation before starting.");
    logEvent("Select a committee and delegation before starting.", [
      { label: "Setup", variant: "system" },
    ]);
    return;
  }
  state.manualAdvanceEnabled = true;
  resetPoints();
  resetSimulation();
  queueAction(() => runRollCall());
});

elements.resetSimulation.addEventListener("click", () => {
  state.manualAdvanceEnabled = false;
  resetSimulation();
});

const raisePointOfPersonalPrivilege = (pointText) => {
  logEvent(`${state.delegation} raises ${pointText}`, [
    { label: "Point", variant: "point" },
    { label: "Personal Privilege", variant: "point" },
  ]);
  setChairBubble("Point acknowledged. Please proceed respectfully.");
  awardPoints("RAISE_POINT_PERSONAL_PRIVILEGE", null, "Raised Point of Personal Privilege");
};

const raisePointOfParliamentaryInquiry = () => {
  const question =
    elements.parliamentaryInquirySelect?.value ||
    parliamentaryInquiryQuestions[0];
  logEvent(`${state.delegation} raises a Point of Parliamentary Inquiry: ${question}`, [
    { label: "Point", variant: "point" },
    { label: "Parliamentary Inquiry", variant: "point" },
  ]);
  setChairBubble("The chair clarifies: Please refer to the rules of procedure.");
  awardPoints("RAISE_POINT_PARLIAMENTARY_INQUIRY", null, "Raised Point of Parliamentary Inquiry");
};

elements.raisePlacard.addEventListener("click", () => {
  state.raised = !state.raised;
  const seatInfo = state.seats[state.delegation];
  if (seatInfo) {
    seatInfo.seat.classList.toggle("highlight", state.raised);
  }
  if (!state.raised) {
    logEvent(
      `${state.delegation} lowers placard.`,
      [{ label: "Placard", variant: "system" }]
    );
    return;
  }
  logEvent(
    `${state.delegation} raises placard.`,
    [{ label: "Placard", variant: "system" }]
  );
  awardPoints("RAISE_PLACARD", null, "Raised placard");
  openModal(
    "You raised your placard. What would you like to do?",
    "Choose an action:",
    [
      {
        label: "Raise a motion",
        className: "primary",
        onClick: () => {
          if (state.stage !== "Floor Open") {
            logEvent("The floor is not open for motions yet.", [
              { label: "Motion", variant: "motion" },
              { label: "Not in Order", variant: "motion" },
            ]);
            return;
          }
          openModal("Raise a Motion", "Select a motion to raise.", motionTemplates.map((motion) => ({
            label: formatMotionLabel(motion),
            className: "primary",
            onClick: () => chooseMotion(motion),
          })));
        },
      },
      {
        label: "Raise a point",
        onClick: () => {
          const personalPrivilegeOptions = [
            { text: "Point of Personal Privilege: Aircon temperature change.", short: "Aircon temp change" },
            { text: "Point of Personal Privilege: Bathroom trip.", short: "Bathroom trip" },
            { text: "Point of Personal Privilege: Water bottle refill.", short: "Water bottle refill" },
            { text: "Point of Personal Privilege: Charger, getting up to plug in a device.", short: "Charger" },
          ];
          openModal(
            "Raise a point",
            "Choose type of point:",
            [
              {
                label: "Point of Personal Privilege",
                onClick: () => {
                  openModal(
                    "Point of Personal Privilege",
                    "Choose one:",
                    personalPrivilegeOptions.map((opt) => ({
                      label: opt.short,
                      onClick: () => raisePointOfPersonalPrivilege(opt.text),
                    }))
                  );
                },
              },
              {
                label: "Point of Parliamentary Inquiry",
                onClick: () => {
                  raisePointOfParliamentaryInquiry();
                },
              },
            ]
          );
        },
      },
    ]
  );
});

elements.raiseMotion.addEventListener("click", () => {
  if (state.stage !== "Floor Open") {
    logEvent("The floor is not open for motions yet.", [
      { label: "Motion", variant: "motion" },
      { label: "Not in Order", variant: "motion" },
    ]);
    return;
  }
  openModal("Raise a Motion", "Select a motion to raise.", motionTemplates.map((motion) => ({
    label: formatMotionLabel(motion),
    className: "primary",
    onClick: () => chooseMotion(motion),
  })));
});

elements.waitButton.addEventListener("click", () => {
  if (state.stage !== "Floor Open") {
    logEvent("The chair is not entertaining motions right now.", [
      { label: "Motion", variant: "motion" },
      { label: "Not in Order", variant: "motion" },
    ]);
    return;
  }
  waitForMotions();
});

elements.skipButton.addEventListener("click", () => {
  if (state.skipHandler) {
    state.skipHandler();
  } else if (state.timer) {
    clearTimer();
    logEvent("Timer skipped.", [{ label: "System", variant: "system" }]);
  } else {
    logEvent("Nothing to skip right now.", [{ label: "System", variant: "system" }]);
  }
});

elements.adjournButton.addEventListener("click", () => {
  if (state.stage === "Awaiting Adjournment") {
    adjournCommittee();
  } else {
    logEvent("Adjournment is only available after voting procedure.", [
      { label: "System", variant: "system" },
    ]);
  }
});

if (elements.continueButton && elements.continueOverlay) {
  elements.continueButton.addEventListener("click", handleContinue);
  elements.continueOverlay.addEventListener("click", (event) => {
    if (event.target === elements.continueOverlay) {
      handleContinue();
    }
  });
}

noteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const note = button.dataset.note;
    const recipient = elements.noteRecipientSelect?.value;
    if (!recipient) {
      logEvent("Select a delegate before sending a note.", [
        { label: "Note", variant: "note" },
        { label: "Action Needed", variant: "note" },
      ]);
      return;
    }
    logEvent(`${state.delegation} passes a note to ${recipient}: "${note}"`, [
      { label: "Note", variant: "note" },
      { label: "Sent", variant: "note" },
    ]);
    awardPoints("SEND_NOTE", null, `Sent note to ${recipient}`);
    showNoteNotification(`Note sent to ${recipient}. Choose how they respond.`);

    const replyActions = noteReplyOptions.map((replyText, idx) => ({
      label: replyText,
      className: idx === 0 ? "primary" : "",
      onClick: () => {
        const replyLog = `${recipient} replies: "${replyText}"`;
        showNoteNotification(replyLog);
        logEvent(replyLog, [
          { label: "Note", variant: "note" },
          { label: "Reply", variant: "note" },
        ]);
      },
    }));

    openModal(
      `Reply from ${recipient}`,
      `How does ${recipient} respond to your note?`,
      replyActions
    );
  });
});

pointButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const point = button.dataset.point;
    raisePointOfPersonalPrivilege(point);
  });
});

elements.parliamentaryInquiry.addEventListener("click", () => {
  raisePointOfParliamentaryInquiry();
});

populateSelects();
updateCommitteeInfo();
buildSeats();
resetSimulation();
startFunFactRotation();

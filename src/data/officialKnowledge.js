export const officialKnowledge = [
  {
    id: 'voter-registration',
    title: 'Voter Registration',
    keywords: ['register', 'enrollment', 'form 6', 'voter list', 'electoral roll'],
    category: 'Registration',
    summary:
      'Any Indian citizen aged 18 or above can register as a general voter using Form 6 through the official Voter Service Portal.',
    steps: [
      'Visit voters.eci.gov.in or use the Voter Helpline App.',
      'Fill Form 6 with required details.',
      'Upload proof of identity and residence.',
      'The Booth Level Officer (BLO) will conduct verification.',
    ],
    officialReminder: 'Verification of your name in the electoral roll is mandatory to vote.',
    sourceName: 'Voter Service Portal (ECI)',
    sourceUrl: 'https://voters.eci.gov.in/',
  },
  {
    id: 'vvpat',
    title: 'VVPAT',
    keywords: ['vvpat', 'paper slip', 'vote verification', 'evm verification'],
    category: 'Voting Technology',
    summary:
      'VVPAT (Voter Verifiable Paper Audit Trail) is a system that lets voters visually verify their vote through a printed slip shown briefly behind a transparent window.',
    steps: [
      'The voter presses the button on the EVM.',
      'A paper slip is generated inside the VVPAT unit.',
      'The slip is visible for 7 seconds for verification.',
      'The slip drops into a sealed box automatically.',
    ],
    officialReminder: 'VVPAT ensures transparency and accountability in the voting process.',
    sourceName: 'Election Commission of India',
    sourceUrl: 'https://www.eci.gov.in/',
  },
  {
    id: 'epic',
    title: 'Voter ID (EPIC)',
    keywords: ['epic', 'voter id card', 'voter card', 'photo identity card'],
    category: 'Identity',
    summary:
      'EPIC is the Electoral Photo Identity Card issued by the ECI. It serves as identity and residence proof for voting.',
    steps: [
      'Apply for registration via Form 6.',
      'Once enrolled, EPIC is issued.',
      'Download e-EPIC from the portal using OTP.',
      'Physical cards are delivered via speed post.',
    ],
    officialReminder:
      'Possession of EPIC does not guarantee the right to vote; your name must be in the electoral roll.',
    sourceName: 'ECI / SVEEP',
    sourceUrl: 'https://ecisveep.nic.in/',
  },
  {
    id: 'mcc',
    title: 'Model Code of Conduct (MCC)',
    keywords: ['mcc', 'model code', 'campaign rules', 'code of conduct'],
    category: 'Election Rules',
    summary:
      'MCC is a set of guidelines issued by the ECI for political parties and candidates to ensure free and fair elections.',
    steps: [
      'Applicable from the announcement of election dates.',
      'Prevents misuse of official machinery by the ruling party.',
      'Regulates campaign speeches, processions, and polling day conduct.',
      'Violations can be reported via cVIGIL app.',
    ],
    officialReminder: 'MCC helps maintain a level playing field for all candidates.',
    sourceName: 'ECI Guidelines',
    sourceUrl: 'https://www.eci.gov.in/',
  },
  {
    id: 'cvigil',
    title: 'cVIGIL App',
    keywords: ['cvigil', 'report violation', 'complaint', 'election monitoring'],
    category: 'Citizen Tools',
    summary:
      'cVIGIL is an app for citizens to report Model Code of Conduct violations by political parties or candidates.',
    steps: [
      'Record a photo or video of the violation.',
      'Upload with GPS location through the app.',
      'Flying Squads investigate within 100 minutes.',
      'Complainant remains anonymous if requested.',
    ],
    officialReminder: 'Always report election violations through official ECI channels.',
    sourceName: 'cVIGIL Portal',
    sourceUrl: 'https://cvigil.eci.gov.in/',
  },
  {
    id: 'polling-station',
    title: 'Polling Station',
    keywords: ['polling station', 'booth', 'where to vote', 'polling booth'],
    category: 'Voting Day',
    summary:
      'A polling station is the designated building where voters cast their ballots. It is typically a school or government office near your residence.',
    steps: [
      'Check your assigned station on the Voter Portal.',
      'Carry your EPIC or an approved identity document.',
      'The First Polling Officer verifies your identity in the roll.',
      "Queue responsibly and follow the officer's instructions.",
    ],
    officialReminder: 'Check your assigned polling station well before the polling day.',
    sourceName: 'ECI Voter Search',
    sourceUrl: 'https://voters.eci.gov.in/',
  },
  {
    id: 'nota',
    title: 'NOTA (None of the Above)',
    keywords: ['nota', 'none of the above', 'rejection'],
    category: 'Voting Rights',
    summary:
      'NOTA allows voters to express that they do not support any of the candidates in the fray.',
    steps: [
      'Located as the last button on the EVM.',
      'Represented by a specific symbol.',
      'NOTA votes are counted but do not affect the winner.',
      'If NOTA gets the most votes, the candidate with the next highest votes wins.',
    ],
    officialReminder: 'NOTA is a tool for expressing democratic dissent.',
    sourceName: 'Election Commission of India',
    sourceUrl: 'https://www.eci.gov.in/',
  },
  {
    id: 'kyc',
    title: 'Know Your Candidate (KYC)',
    keywords: ['kyc', 'candidate info', 'affidavit', 'criminal records'],
    category: 'Voter Awareness',
    summary:
      'KYC app allows voters to check the criminal antecedents and assets of candidates contesting elections.',
    steps: [
      'Search by candidate name or constituency.',
      'View uploaded affidavits (Form 26).',
      'Check education, assets, and criminal cases.',
      'Informed choices lead to better governance.',
    ],
    officialReminder: 'Voters have a right to know the background of candidates.',
    sourceName: 'ECI Affidavit Portal',
    sourceUrl: 'https://affidavit.eci.gov.in/',
  },
  {
    id: 'misinformation',
    title: 'Election Misinformation',
    keywords: ['fake news', 'deepfake', 'misinformation', 'verify news', 'rumors'],
    category: 'Safety',
    summary:
      'Election misinformation can mislead voters about polling dates, candidates, or processes. Always verify through official channels.',
    steps: [
      'Do not share unverified WhatsApp messages.',
      "Check the 'Myth vs Reality' portal on ECI website.",
      'Report deepfakes to official grievance officers.',
      'Trust only verified handles of ECI and state election offices.',
    ],
    officialReminder:
      'Critical details should only be trusted if verified by the Election Commission.',
    sourceName: 'ECI Myth vs Reality',
    sourceUrl: 'https://www.eci.gov.in/',
  },
  {
    id: 'evm-detail',
    title: 'Electronic Voting Machine (EVM)',
    keywords: ['evm', 'voting machine', 'ballot unit', 'control unit'],
    category: 'Voting Technology',
    summary:
      'EVM is a tamper-proof electronic device used to record votes. It consists of a Control Unit and a Ballot Unit.',
    steps: [
      'The Control Unit stays with the Presiding Officer.',
      'The Ballot Unit is placed inside the voting compartment.',
      'Voters press the blue button next to their choice.',
      'EVMs are standalone and not connected to any network.',
    ],
    officialReminder:
      'EVMs are secure and subjected to multi-level mock polls before actual voting.',
    sourceName: 'Election Commission of India',
    sourceUrl: 'https://www.eci.gov.in/',
  },
  {
    id: 'nomination',
    title: 'Candidate Nomination',
    keywords: ['nomination', 'filing papers', 'candidate filing', 'contest election'],
    category: 'Electoral Process',
    summary:
      'Nomination is the formal process of a candidate filing papers to contest an election.',
    steps: [
      'File Form 2A or 2B with the Returning Officer.',
      'Deposit the required security amount.',
      'Submit affidavits regarding assets and criminal cases.',
      'The Returning Officer scrutinizes the papers.',
    ],
    officialReminder: 'Nomination deadlines are strictly enforced by the ECI.',
    sourceName: 'Election Commission of India',
    sourceUrl: 'https://www.eci.gov.in/',
  },
  {
    id: 'counting',
    title: 'Counting of Votes',
    keywords: ['counting', 'results', 'declaration of result', 'voter turnout'],
    category: 'Electoral Process',
    summary:
      'Counting of votes happens on a designated day at secure counting centers under strict supervision.',
    steps: [
      'EVM seals are checked in front of candidate agents.',
      'Results are recorded for each round of counting.',
      'VVPAT slips are matched for randomly selected stations.',
      'The winner is officially declared after completion.',
    ],
    officialReminder: 'Counting processes are transparent and monitored by ECI observers.',
    sourceName: 'Election Commission of India',
    sourceUrl: 'https://www.eci.gov.in/',
  },
];

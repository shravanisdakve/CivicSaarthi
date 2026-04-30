// Official sources — matches Sources page reference screenshot
export const officialSources = [
  {
    id: 'eci',
    name: 'Election Commission of India (ECI)',
    description:
      'The supreme constitutional authority responsible for administering election processes in India.',
    category: 'Governing Body',
    url: 'https://eci.gov.in',
    icon: 'account_balance',
    action: 'Visit Portal',
    accent: true,
  },
  {
    id: 'nvsp',
    name: "National Voters' Service Portal",
    description:
      'Register to vote, correct details, track application status, and search your name in the electoral roll.',
    category: 'Voter Services',
    url: 'https://nvsp.in',
    icon: 'how_to_reg',
    action: 'Visit Portal',
    accent: true,
  },
  {
    id: 'sveep',
    name: 'SVEEP Portal',
    description:
      "Systematic Voters' Education and Electoral Participation program for voter awareness and literacy.",
    category: 'Education',
    url: 'https://sveep.eci.gov.in',
    icon: 'school',
    action: 'Visit Portal',
    accent: true,
  },
  {
    id: 'kyc',
    name: 'Know Your Candidate (KYC)',
    description:
      'Official ECI application to view details of candidates contesting elections, including criminal antecedents.',
    category: 'Mobile App',
    url: 'https://eci.gov.in/candidate-information-1/',
    icon: 'person_search',
    action: 'Download App',
    accent: false,
  },
  {
    id: 'cvigil',
    name: 'cVIGIL',
    description:
      'Report Model Code of Conduct violations directly to the Election Commission for fast-track resolution.',
    category: 'Mobile App',
    url: 'https://cvigil.eci.gov.in',
    icon: 'report',
    action: 'Download App',
    accent: false,
  },
];

export const verificationChecklist = [
  'URL ends in .gov.in or .nic.in',
  'Site uses HTTPS protocol',
  'Information matches ECI press notes',
];

export const misinfoWarnings = [
  'Do not rely on forwarded messages for polling booth changes.',
  'Be wary of unofficial voter registration links requiring payment.',
];

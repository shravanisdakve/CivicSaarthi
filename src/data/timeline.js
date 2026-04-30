export const timelineStages = [
  {
    id: 1,
    step: 'STEP 1',
    title: 'Election Announcement',
    date: 'Phase 1',
    shortDesc:
      'The Election Commission officially announces the schedule, starting the democratic journey.',
    detail:
      'The ECI releases an official press note announcing election dates for all phases. This marks the formal start of the election process across the country.',
    keyPoints: [
      'Schedule is legally binding.',
      'Dates for polling and counting are fixed.',
      'Triggers the Model Code of Conduct.',
    ],
    icon: 'campaign',
    status: 'completed',
  },
  {
    id: 2,
    step: 'STEP 2',
    title: 'Model Code of Conduct',
    date: 'Phase 1 – Active',
    shortDesc:
      'Guidelines issued by ECI to regulate political parties and ensure a level playing field.',
    detail:
      'The Model Code of Conduct (MCC) comes into effect immediately after the announcement. it ensures that political parties and candidates behave ethically and that the ruling party does not misuse official machinery.',
    keyPoints: [
      'Prevents misuse of government resources.',
      'Ensures fair campaigning rules.',
      'Citizens can report violations via cVIGIL.',
    ],
    icon: 'gavel',
    status: 'active',
  },
  {
    id: 3,
    step: 'STEP 3',
    title: 'Candidate Nominations',
    date: 'Phase 2',
    shortDesc: 'Candidates file their papers and affidavits with the Returning Officer.',
    detail:
      'Candidates submit their formal applications (nomination papers). They must also disclose assets, education, and criminal records via an affidavit (Form 26).',
    keyPoints: [
      'Affidavits are public for voter scrutiny.',
      'Candidates must meet eligibility criteria.',
      'Security deposit is required.',
    ],
    icon: 'assignment',
    status: 'upcoming',
  },
  {
    id: 4,
    step: 'STEP 4',
    title: 'Scrutiny of Nominations',
    date: 'Phase 2',
    shortDesc: 'Election officials review submitted documents for legal validity.',
    detail:
      'The Returning Officer examines every nomination to ensure they are legally valid and complete. Candidates can raise objections during this time.',
    keyPoints: [
      'RO reviews eligibility per law.',
      'Incomplete forms lead to rejection.',
      'Final list of valid nominations published.',
    ],
    icon: 'fact_check',
    status: 'upcoming',
  },
  {
    id: 5,
    step: 'STEP 5',
    title: 'Withdrawal of Candidature',
    date: 'Phase 2',
    shortDesc: 'Valid candidates have a window to withdraw from the contest.',
    detail:
      'Candidates who have been declared valid have a fixed time window to withdraw their names if they choose not to contest.',
    keyPoints: [
      'Final ballot paper/EVM list is decided.',
      'Withdrawal is voluntary but final.',
      'Contesting candidates notified after deadline.',
    ],
    icon: 'exit_to_app',
    status: 'upcoming',
  },
  {
    id: 6,
    step: 'STEP 6',
    title: 'Campaigning',
    date: 'Phase 3',
    shortDesc: 'Parties reach out to voters to explain manifestos and seek support.',
    detail:
      'Candidates and parties engage in rallies and outreach. Campaigning ends 48 hours before polling (Silence Period).',
    keyPoints: [
      'Focus on manifestos and promises.',
      'Campaign silence period enforced.',
      'Monitoring of election expenditure.',
    ],
    icon: 'record_voice_over',
    status: 'upcoming',
  },
  {
    id: 7,
    step: 'STEP 7',
    title: 'Polling Day',
    date: 'Phase 4',
    shortDesc: 'Citizens cast their votes at designated booths using EVMs.',
    detail:
      'Registered voters cast their votes in a secure environment. EVMs and VVPATs are used for transparency.',
    keyPoints: [
      'Carry EPIC or 12 alternative IDs.',
      'VVPAT slip verification (7 seconds).',
      'Secrecy of vote is maintained.',
    ],
    icon: 'how_to_vote',
    status: 'upcoming',
  },
  {
    id: 8,
    step: 'STEP 8',
    title: 'Counting of Votes',
    date: 'Phase 5',
    shortDesc: 'Votes from EVMs are counted under transparent supervision.',
    detail:
      'EVMs are opened and votes are counted in the presence of candidates and their agents at counting centers.',
    keyPoints: [
      'Transparent counting process.',
      'Supervised by Returning Officers.',
      'Real-time updates on ECI website.',
    ],
    icon: 'calculate',
    status: 'upcoming',
  },
  {
    id: 9,
    step: 'STEP 9',
    title: 'Result Declaration',
    date: 'Phase 5',
    shortDesc: 'The winning candidate is officially declared and issued a certificate.',
    detail:
      'After counting, the Returning Officer officially declares the winner and issues a Certificate of Election.',
    keyPoints: [
      'Certificate issued to the successful candidate.',
      'Formal conclusion of the process.',
      'Formation of government follows.',
    ],
    icon: 'emoji_events',
    status: 'upcoming',
  },
];

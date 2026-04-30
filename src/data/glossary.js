// Glossary terms — categories: Voting, Process, Security, Legal
export const glossaryTerms = [
  {
    id: 'evm',
    term: 'EVM',
    fullForm: 'Electronic Voting Machine',
    category: 'Voting',
    definition:
      'Electronic Voting Machine. A device used to record votes electronically instead of using traditional paper ballots, ensuring faster counting and reducing invalid votes.',
    relatedTerms: ['vvpat', 'ballot-unit', 'control-unit'],
  },
  {
    id: 'vvpat',
    term: 'VVPAT',
    fullForm: 'Voter Verifiable Paper Audit Trail',
    category: 'Security',
    definition:
      'An independent verification system attached to EVMs that allows voters to verify that their vote was cast correctly. It generates a paper slip bearing the serial number, name, and symbol of the candidate for whom the vote has been cast.',
    howItWorks: [
      {
        step: 'Cast Vote',
        detail:
          'The voter presses the button against the candidate of their choice on the EVM Ballot Unit.',
      },
      {
        step: 'Paper Slip Prints',
        detail:
          "A paper slip is generated inside the VVPAT machine, displaying the candidate's name and symbol.",
      },
      {
        step: 'Verification Window',
        detail:
          'The slip remains visible behind a transparent glass window for 7 seconds for the voter to verify.',
      },
      {
        step: 'Secure Storage',
        detail:
          'The slip automatically cuts and falls into a sealed drop box within the VVPAT, maintaining secrecy.',
      },
    ],
    whyItMatters:
      'The VVPAT system acts as a crucial secondary audit mechanism, ensuring institutional reliability. In the event of a dispute regarding the EVM results, the paper slips contained in the sealed drop box can be manually counted to verify the electronic tally, thereby bolstering voter confidence in the democratic process.',
    relatedTerms: ['evm', 'ballot-unit', 'control-unit'],
    suggestedQuestions: ['Are VVPATs used everywhere?', 'Can I take the slip home?'],
  },
  {
    id: 'mcc',
    term: 'MCC',
    fullForm: 'Model Code of Conduct',
    category: 'Legal',
    definition:
      'A set of guidelines issued by the Election Commission to regulate political parties and candidates prior to elections, ensuring free and fair polling.',
    relatedTerms: ['eci', 'returning-officer'],
  },
  {
    id: 'epic',
    term: 'EPIC',
    fullForm: 'Electoral Photo Identity Card',
    category: 'Voting',
    definition:
      'Electoral Photo Identity Card. The official voter ID card issued by the Election Commission, serving as proof of identity and electoral roll registration.',
    relatedTerms: ['electoral-roll', 'nvsp'],
  },
  {
    id: 'nota',
    term: 'NOTA',
    fullForm: 'None Of The Above',
    category: 'Voting',
    definition:
      'A ballot option allowing voters to officially register their rejection of all contesting candidates in an election. Introduced by the Supreme Court in 2013.',
    relatedTerms: ['evm', 'vvpat'],
  },
  {
    id: 'polling-station',
    term: 'Polling Station',
    fullForm: 'Polling Booth',
    category: 'Process',
    definition:
      'The designated location where registered voters cast their ballots under the supervision of presiding officers and polling agents.',
    relatedTerms: ['returning-officer', 'epic'],
  },
  {
    id: 'eci',
    term: 'ECI',
    fullForm: 'Election Commission of India',
    category: 'Process',
    definition:
      'The supreme constitutional authority responsible for directing, controlling, and superintending the preparation of electoral rolls and the conduct of elections to Parliament and State Legislatures.',
    relatedTerms: ['mcc', 'returning-officer'],
  },
  {
    id: 'electoral-roll',
    term: 'Electoral Roll',
    fullForm: 'Voters List',
    category: 'Process',
    definition:
      'The official list of all registered voters in a constituency. Your name must appear here to be eligible to vote. Updated periodically by the ECI.',
    relatedTerms: ['eci', 'epic', 'nvsp'],
  },
  {
    id: 'returning-officer',
    term: 'Returning Officer',
    fullForm: 'RO',
    category: 'Process',
    definition:
      'The designated official responsible for conducting elections in a constituency. They manage nominations, scrutiny, withdrawal, polling, counting, and declaration of results.',
    relatedTerms: ['eci', 'mcc'],
  },
  {
    id: 'counting',
    term: 'Counting',
    fullForm: 'Vote Counting',
    category: 'Process',
    definition:
      'The process of tabulating the votes recorded in EVMs at designated counting centers on counting day, under strict supervision with party agents present.',
    relatedTerms: ['evm', 'returning-officer', 'vvpat'],
  },
];

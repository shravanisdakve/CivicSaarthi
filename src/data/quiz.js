// 5 quiz questions — 4 options each, correct is 0-indexed
export const quizQuestions = [
  {
    id: 1,
    question: 'What is the minimum age required to vote in Indian elections?',
    options: ['16 years', '18 years', '21 years', '25 years'],
    correct: 1,
    explanation:
      'As per Article 326 of the Indian Constitution, every citizen who is 18 years of age or above is eligible to vote.',
  },
  {
    id: 2,
    question: 'What does VVPAT stand for?',
    options: [
      'Voter Verified Paper Audit Trail',
      'Voter Verifiable Paper Audit Trail',
      'Verified Voter Paper Audit Trail',
      'Verified Voter Privacy Audit Trail',
    ],
    correct: 1,
    explanation:
      'VVPAT stands for Voter Verifiable Paper Audit Trail — an independent verification system attached to EVMs.',
  },
  {
    id: 3,
    question: 'What should a voter check before polling day?',
    options: [
      'The latest political polls on social media.',
      'Their polling location and voter registration status.',
      'Who won the previous election in their district.',
      "The candidates' social media profiles.",
    ],
    correct: 1,
    explanation:
      "It's crucial to verify your registration on the electoral roll and know exactly where your polling booth is located before polling day.",
  },
  {
    id: 4,
    question: 'What does NOTA stand for?',
    options: [
      'No Official Transfer Allowed',
      'None Of The Above',
      'National Objective To Abstain',
      'No Other Transfer Available',
    ],
    correct: 1,
    explanation:
      'NOTA stands for None Of The Above. It allows voters to officially reject all candidates without abstaining from voting.',
  },
  {
    id: 5,
    question: 'When does the Model Code of Conduct (MCC) come into effect?',
    options: [
      'On the day of polling',
      'One week before polling day',
      'On the date of election announcement',
      'On nomination filing day',
    ],
    correct: 2,
    explanation:
      'The MCC comes into effect immediately on the date of election announcement and remains active until the election process is complete.',
  },
];

/**
 * Local fallback assistant — used when Gemini API is unavailable.
 * Provides keyword-matched, factual electoral information.
 * Returns a refusal message for political persuasion queries.
 */

const POLITICAL_PATTERNS = [
  /who should i vote/i,
  /which party is best/i,
  /convince me to vote/i,
  /best candidate/i,
  /vote for (party|candidate|bjp|congress|aap|sp|bsp)/i,
  /who will win/i,
  /which party should/i,
  /endorse/i,
  /support.*party/i,
];

const REFUSAL_MESSAGE =
  "I'm designed to provide non-partisan, factual information about the electoral process. I cannot offer opinions on candidates, parties, or voting choices. I can help you understand voting procedures, eligibility, how to find your polling station, or explain terms like VVPAT and MCC. What would you like to know?";

const FAQ = [
  {
    patterns: [/register|registration|sign up|enroll/i],
    response:
      'To register as a voter in India, visit the National Voters\' Service Portal at nvsp.in and fill out Form 6. You must be 18 years or older, an Indian citizen, and ordinarily resident at the address you are registering from. You can also register through the Voter Helpline App.',
  },
  {
    patterns: [/polling station|polling booth|where.*vote|find.*booth|booth.*find/i],
    response:
      'You can find your polling station by visiting nvsp.in or the Voter Helpline App. Enter your EPIC number or name to locate your designated polling booth address and timing.',
  },
  {
    patterns: [/vvpat/i],
    response:
      'VVPAT stands for Voter Verifiable Paper Audit Trail. After you press the button on the EVM, a paper slip showing your candidate\'s name and symbol appears behind a glass window for 7 seconds. The slip then automatically drops into a sealed box. This lets you verify your vote was recorded correctly.',
  },
  {
    patterns: [/evm/i],
    response:
      'An EVM (Electronic Voting Machine) consists of two units: a Control Unit operated by polling staff, and a Ballot Unit with candidate buttons that the voter uses. EVMs are tamper-resistant, battery-operated, and have been used in Indian elections since 1999.',
  },
  {
    patterns: [/mcc|model code/i],
    response:
      'The Model Code of Conduct (MCC) is a set of guidelines issued by the Election Commission that comes into effect on the date of election announcement. It prohibits political parties and candidates from using government resources for campaigns, making promises that may influence voters, and causing communal disharmony.',
  },
  {
    patterns: [/nota/i],
    response:
      'NOTA stands for None Of The Above. It appears as the last option on the EVM, allowing you to officially register your rejection of all candidates without abstaining. NOTA votes are counted separately and do not affect who wins the seat.',
  },
  {
    patterns: [/epic|voter id|voter card/i],
    response:
      'EPIC (Electors Photo Identity Card) is your official voter ID. At the polling booth, you can present EPIC or any of the 12 ECI-approved alternative photo IDs including Aadhaar, PAN card, passport, driving licence, and service identity cards.',
  },
  {
    patterns: [/eligib|age.*vote|vote.*age|18/i],
    response:
      'To vote in India, you must be: (1) at least 18 years old as of January 1 of the qualifying year, (2) an Indian citizen, and (3) ordinarily resident at the address in your constituency. You must also be registered on the electoral roll.',
  },
  {
    patterns: [/eci|election commission/i],
    response:
      'The Election Commission of India (ECI) is an independent constitutional authority that oversees all elections to Parliament, State Legislatures, and the offices of President and Vice-President. It is headed by the Chief Election Commissioner and operates under Article 324 of the Constitution.',
  },
  {
    patterns: [/absentee|postal.*vote|vote.*postal/i],
    response:
      'In India, postal ballots are available to service voters (armed forces, government employees posted outside constituency), voters with disabilities, and senior citizens (80+). You must apply in advance using Form 12D through your Returning Officer.',
  },
  {
    patterns: [/checklist|prepare|ready|election day/i],
    response:
      'Before election day: (1) Confirm your name on the voter list at nvsp.in, (2) Know your polling booth address, (3) Carry a valid photo ID, (4) Arrive during polling hours (usually 7 AM–6 PM), (5) Do not carry mobile phones inside the voting compartment.',
  },
  {
    patterns: [/hello|hi |hey |namaste/i],
    response:
      "Hello! I'm your Civic Assistant. I can help you understand India's voting process, find your polling station, explain electoral terms, or guide you through voter registration. What would you like to know?",
  },
];

/**
 * Returns a local fallback response for a given user message.
 * @param {string} message - The user's question
 * @returns {string} - A factual, non-partisan response
 */
export function getLocalResponse(message) {
  if (!message || typeof message !== 'string') {
    return 'Please ask a question about the electoral process.';
  }

  // Check for political persuasion first
  for (const pattern of POLITICAL_PATTERNS) {
    if (pattern.test(message)) {
      return REFUSAL_MESSAGE;
    }
  }

  // Match FAQ patterns
  for (const entry of FAQ) {
    for (const pattern of entry.patterns) {
      if (pattern.test(message)) {
        return entry.response;
      }
    }
  }

  // Generic fallback
  return "I can help with questions about voter registration, polling booths, EVMs, VVPATs, the Model Code of Conduct, candidate information, and election day procedures. Could you rephrase or ask something more specific about the electoral process?";
}

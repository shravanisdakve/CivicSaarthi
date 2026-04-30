import { searchKnowledge, getKnowledgeContext, getSourceBadges } from '../src/utils/knowledgeSearch.js';

// Mock the officialKnowledge data for predictable testing
jest.mock('../src/data/officialKnowledge.js', () => ({
  officialKnowledge: [
    {
      id: 'voter-reg-test',
      title: 'Voter Registration',
      keywords: ['register', 'enroll', 'new voter'],
      summary: 'How to register as a new voter.',
      steps: ['Visit NVSP', 'Fill Form 6'],
      sourceName: 'Election Commission of India',
      sourceUrl: 'https://voters.eci.gov.in',
    },
    {
      id: 'evm-test',
      title: 'EVM Checks',
      keywords: ['evm', 'machine', 'vote cast'],
      summary: 'Understanding Electronic Voting Machines.',
      steps: ['Press button', 'Listen for beep', 'Check VVPAT'],
      sourceName: 'ECI Manual',
      sourceUrl: 'https://eci.gov.in/evm',
    }
  ]
}));

describe('knowledgeSearch Utility', () => {
  describe('searchKnowledge', () => {
    test('returns empty array if message is empty', () => {
      expect(searchKnowledge('')).toEqual([]);
      expect(searchKnowledge(null)).toEqual([]);
    });

    test('finds correct entry based on keyword', () => {
      const results = searchKnowledge('how do i register to vote?');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe('voter-reg-test');
    });

    test('finds correct entry based on title match', () => {
      const results = searchKnowledge('tell me about evm checks');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe('evm-test');
    });
  });

  describe('getKnowledgeContext', () => {
    test('returns formatted string for AI context', () => {
      const context = getKnowledgeContext('register');
      expect(context).toContain('OFFICIAL KNOWLEDGE CONTEXT');
      expect(context).toContain('Voter Registration');
      expect(context).toContain('Visit NVSP');
    });

    test('returns empty string if no matches', () => {
      const context = getKnowledgeContext('random nonsense word 123456');
      expect(context).toBe('');
    });
  });

  describe('getSourceBadges', () => {
    test('returns mapped array of badge objects', () => {
      const badges = getSourceBadges('register');
      expect(badges).toHaveLength(1);
      expect(badges[0]).toHaveProperty('id', 'voter-reg-test');
      expect(badges[0]).toHaveProperty('sourceName', 'Election Commission of India');
    });
  });
});

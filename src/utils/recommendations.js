export function getSmartRecommendation(personaId, checklistProgress = 0) {
  const recommendations = {
    'first-time': [
      'Verify your name in the electoral roll',
      'Learn what to carry on polling day',
      'Understand how VVPAT verification works'
    ],
    'student': [
      'Explore the election timeline',
      'Learn MCC, EVM, VVPAT, EPIC',
      'Review official source links'
    ],
    'candidate': [
      'Review nomination and MCC guidance',
      'Understand campaign rules',
      'Verify requirements from official sources'
    ],
    'observer': [
      'Understand polling day protocols',
      'Learn how to report issues',
      'Review official source guidance'
    ],
    'citizen': [
      'Explore timeline',
      'Check readiness',
      'Verify important details'
    ]
  };

  const defaultPersona = 'first-time';
  const selected = recommendations[personaId] || recommendations[defaultPersona];

  return selected;
}

import CivicTerm from './CivicTerm.jsx';

const TERMS_TO_WRAP = [
  { id: 'evm', regex: /\bEVMs?\b/gi, label: 'EVM' },
  { id: 'vvpat', regex: /\bVVPATs?\b/gi, label: 'VVPAT' },
  { id: 'electoral-roll', regex: /\belectoral rolls?\b/gi, label: 'electoral roll' },
  { id: 'polling-booth', regex: /\bpolling booths?\b/gi, label: 'polling booth' },
  { id: 'epic', regex: /\bEPIC\b/g, label: 'EPIC' },
  { id: 'voter-id', regex: /\bVoter IDs?\b/gi, label: 'Voter ID' },
  { id: 'mcc', regex: /\bModel Code of Conduct\b/gi, label: 'Model Code of Conduct' },
  { id: 'mcc', regex: /\bMCC\b/g, label: 'MCC' },
  { id: 'returning-officer', regex: /\bReturning Officers?\b/gi, label: 'Returning Officer' },
  { id: 'affidavit', regex: /\baffidavits?\b/gi, label: 'affidavit' },
  { id: 'form-26', regex: /\bForm 26\b/gi, label: 'Form 26' },
  { id: 'cvigil', regex: /\bcVIGIL\b/g, label: 'cVIGIL' },
];

export default function FormattedText({ text }) {
  if (!text) return null;

  let parts = [text];

  TERMS_TO_WRAP.forEach(term => {
    let newParts = [];
    parts.forEach(part => {
      if (typeof part !== 'string') {
        newParts.push(part);
        return;
      }

      const pieces = part.split(term.regex);
      const matches = part.match(term.regex);

      pieces.forEach((piece, i) => {
        newParts.push(piece);
        if (i < pieces.length - 1 && matches && matches[i]) {
          newParts.push(
            <CivicTerm key={`${term.id}-${i}`} termId={term.id}>
              {matches[i]}
            </CivicTerm>
          );
        }
      });
    });
    parts = newParts;
  });

  return <>{parts}</>;
}

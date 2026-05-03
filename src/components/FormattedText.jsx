import CivicTerm from './CivicTerm.jsx';

const TERMS_TO_WRAP = [
  { id: 'evm', regex: /\b(EVMs?)\b/gi, label: 'EVM' },
  { id: 'vvpat', regex: /\b(VVPATs?)\b/gi, label: 'VVPAT' },
  { id: 'electoral-roll', regex: /\b(electoral rolls?)\b/gi, label: 'electoral roll' },
  { id: 'polling-booth', regex: /\b(polling booths?)\b/gi, label: 'polling booth' },
  { id: 'epic', regex: /\b(EPIC)\b/g, label: 'EPIC' },
  { id: 'voter-id', regex: /\b(Voter IDs?)\b/gi, label: 'Voter ID' },
  { id: 'mcc', regex: /\b(Model Code of Conduct)\b/gi, label: 'Model Code of Conduct' },
  { id: 'mcc', regex: /\b(MCC)\b/g, label: 'MCC' },
  { id: 'returning-officer', regex: /\b(Returning Officers?)\b/gi, label: 'Returning Officer' },
  { id: 'affidavit', regex: /\b(affidavits?)\b/gi, label: 'affidavit' },
  { id: 'form-26', regex: /\b(Form 26)\b/gi, label: 'Form 26' },
  { id: 'cvigil', regex: /\b(cVIGIL)\b/g, label: 'cVIGIL' },
];

export default function FormattedText({ text }) {
  if (!text) return null;
  if (typeof text !== 'string') return <>{text}</>;

  let parts = [text];

  TERMS_TO_WRAP.forEach(term => {
    let newParts = [];
    parts.forEach(part => {
      if (typeof part !== 'string') {
        newParts.push(part);
        return;
      }

      const pieces = part.split(term.regex);
      pieces.forEach((piece, i) => {
        if (i % 2 === 1) { // It's a match
          newParts.push(
            <CivicTerm key={`${term.id}-${i}-${Math.random()}`} termId={term.id}>
              {piece}
            </CivicTerm>
          );
        } else if (piece) {
          newParts.push(piece);
        }
      });
    });
    parts = newParts;
  });

  return <>{parts}</>;
}

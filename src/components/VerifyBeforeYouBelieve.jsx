import { useNavigate, useCallback } from 'react-router-dom';
import Card from './Card.jsx';
import Button from './Button.jsx';
import Badge from './Badge.jsx';

export default function VerifyBeforeYouBelieve() {
  const navigate = useNavigate();

  const checklist = [
    'Voting date',
    'Polling station',
    'Registration status',
    'Candidate information',
    'MCC violation reporting',
  ];

  return (
    <Card className="p-6 md:p-8 bg-error-container/30 border border-red-200 shadow-sm relative overflow-hidden">
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
        <span className="material-symbols-outlined text-9xl text-red-600">gpp_maybe</span>
      </div>

      <div className="relative z-10">
        <Badge variant="error" className="mb-4">
          Safety & Misinformation
        </Badge>
        <h3 className="text-2xl font-bold font-['Public_Sans'] mb-3 text-red-900">
          Verify Before You Believe
        </h3>

        <p className="text-sm text-red-900/80 mb-6 leading-relaxed max-w-2xl">
          During elections, misinformation can spread quickly. Do not rely only on forwarded
          messages for polling dates, polling booth changes, registration deadlines, candidate
          details, or voting rules. Always verify critical information from official election
          sources.
        </p>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 mb-6 max-w-xl border border-red-100">
          <p className="text-xs font-bold text-red-800 uppercase tracking-widest mb-3">
            Always verify:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {checklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-[18px]">
                  verified_user
                </span>
                <span className="text-sm font-medium text-red-900">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={useCallback(() => navigate('/sources'), [navigate])}
          className="bg-white border-red-200 text-red-700 hover:bg-red-50"
        >
          Open Official Sources
        </Button>
      </div>
    </Card>
  );
}

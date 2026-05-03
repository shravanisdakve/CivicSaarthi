import Card from '../components/Card.jsx';

export default function Safety() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-primary text-2xl icon-fill">shield</span>
        </div>
        <h1 className="font-['Public_Sans'] text-3xl md:text-4xl font-bold text-on-surface mb-4">
          Commitment to Neutrality & Safety
        </h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto">
          CivicSaarthi is built on a foundation of strict non-partisanship and user privacy. We do
          not endorse candidates, parties, or specific legislative outcomes.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full border border-amber-100 text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">balance</span>
            Non-Partisan Verified
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-100 text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">shield_lock</span>
            Privacy Hardened
          </div>
        </div>
      </div>

      {/* Principles Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="p-6 md:p-8" hover={false}>
          <span className="material-symbols-outlined text-primary text-3xl mb-4">balance</span>
          <h2 className="font-['Public_Sans'] text-xl font-bold text-on-surface mb-3">
            Political Neutrality
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Our AI models are explicitly instructed to avoid expressing opinions or bias toward any
            political entity. Responses are strictly informational, sourced from official government
            data and verified non-partisan organizations.
          </p>
        </Card>
        <Card className="p-6 md:p-8" hover={false}>
          <span className="material-symbols-outlined text-primary text-3xl mb-4">security</span>
          <h2 className="font-['Public_Sans'] text-xl font-bold text-on-surface mb-3">
            Privacy & Data Safety
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            CivicSaarthi does not store or log your queries on its own servers. If Gemini is used,
            requests are processed by Google&apos;s AI services according to Google&apos;s applicable terms
            and privacy policies. Avoid entering sensitive personal information. CivicSaarthi does
            not collect Aadhaar, voter ID, phone number, address, live location, or political
            preferences.
          </p>
        </Card>
        <Card className="p-6 md:p-8" hover={false}>
          <span className="material-symbols-outlined text-primary text-3xl mb-4">fact_check</span>
          <h2 className="font-['Public_Sans'] text-xl font-bold text-on-surface mb-3">
            Misinformation Handling
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            When presented with contested claims or known misinformation, the Assistant will
            prioritize official electoral commission statements and verified factual databases,
            declining to validate unverified rumors.
          </p>
        </Card>
      </div>

      {/* Example Interaction Box */}
      <div className="bg-surface-container-low rounded-2xl border border-slate-200 p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-['Public_Sans'] text-2xl font-bold text-on-surface mb-4">
              How our AI handles biased prompts
            </h2>
            <p className="text-on-surface-variant text-sm mb-6">
              To maintain absolute neutrality, CivicSaarthi is designed to gracefully refuse prompts
              that ask for opinions, endorsements, or subjective analysis of political candidates or
              policies.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-on-surface font-medium">
                <span className="material-symbols-outlined text-red-500 icon-fill text-base">
                  cancel
                </span>
                &quot;Who is the best candidate for Mayor?&quot;
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface font-medium">
                <span className="material-symbols-outlined text-red-500 icon-fill text-base">
                  cancel
                </span>
                &quot;Why is Policy X bad?&quot;
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface font-medium">
                <span className="material-symbols-outlined text-red-500 icon-fill text-base">
                  cancel
                </span>
                &quot;Write a speech supporting Candidate Y.&quot;
              </li>
            </ul>
          </div>

          {/* Chat Mockup */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden border border-slate-100">
            <div className="bg-slate-100 px-4 py-2 flex items-center gap-2 border-b border-slate-200">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-2">
                Example Interaction
              </span>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="self-end bg-secondary text-white p-3 rounded-2xl rounded-tr-sm text-sm max-w-[90%]">
                Based on current polls, who should I vote for in the upcoming city council election
                to ensure lower taxes?
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
                </div>
                <div className="bg-surface-container text-on-surface p-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed">
                  <p className="mb-2">
                    I cannot provide endorsements or advice on who to vote for, nor can I interpret
                    which candidate might best achieve specific policy outcomes like lower taxes.
                  </p>
                  <p>
                    I can, however, provide you with the official platforms of the candidates
                    currently running for city council, or point you to independent voter guides
                    detailing their public stances on taxation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

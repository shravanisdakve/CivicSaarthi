import Card from '../components/Card.jsx';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-primary text-2xl">privacy_tip</span>
        </div>
        <h1 className="font-['Public_Sans'] text-3xl md:text-4xl font-bold text-on-surface mb-4">
          Privacy & Data Policy
        </h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto">
          At CivicSaarthi, your privacy is not just a feature&mdash;it&apos;s our foundation. We believe in 
          empowering citizens without compromising their personal data.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="p-8 border-0 shadow-sm" hover={false}>
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary">no_accounts</span>
            <h2 className="font-['Public_Sans'] text-xl font-bold">Zero-PII Collection</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            We do not collect or store **Personally Identifiable Information (PII)**. This includes:
          </p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-2 text-xs text-red-600 font-medium">
              <span className="material-symbols-outlined text-sm">cancel</span> Voter ID / EPIC Numbers
            </li>
            <li className="flex items-center gap-2 text-xs text-red-600 font-medium">
              <span className="material-symbols-outlined text-sm">cancel</span> Aadhaar or National ID
            </li>
            <li className="flex items-center gap-2 text-xs text-red-600 font-medium">
              <span className="material-symbols-outlined text-sm">cancel</span> Phone Numbers & Emails
            </li>
            <li className="flex items-center gap-2 text-xs text-red-600 font-medium">
              <span className="material-symbols-outlined text-sm">cancel</span> Home Addresses
            </li>
          </ul>
        </Card>

        <Card className="p-8 border-0 shadow-sm" hover={false}>
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary">database</span>
            <h2 className="font-['Public_Sans'] text-xl font-bold">Local-First Storage</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Your progress, such as your checklist status and earned badges, is stored **locally on your device** 
            using browser storage. We do not sync this data to a central server unless you explicitly 
            opt-in via authenticated services.
          </p>
        </Card>

        <Card className="p-8 border-0 shadow-sm" hover={false}>
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary">analytics</span>
            <h2 className="font-['Public_Sans'] text-xl font-bold">Anonymous Insights</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            We use anonymous, aggregate events to understand how users interact with the app. 
            This data is used solely to improve the user experience and is never tied to a 
            specific individual. No political profiling is ever performed.
          </p>
        </Card>

        <Card className="p-8 border-0 shadow-sm" hover={false}>
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary">psychology</span>
            <h2 className="font-['Public_Sans'] text-xl font-bold">AI Data Handling</h2>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Interactions with the AI Assistant are processed securely. We instruct our AI models 
            to never request sensitive data. If you accidentally provide personal information, 
            the AI is designed to warn you and skip processing that data.
          </p>
        </Card>
      </div>

      {/* Trust Banner */}
      <div className="bg-primary text-white rounded-2xl p-8 md:p-12 text-center">
        <h2 className="font-['Public_Sans'] text-2xl font-bold mb-4">Our Commitment</h2>
        <p className="max-w-2xl mx-auto text-primary-fixed opacity-90 leading-relaxed text-sm">
          CivicSaarthi is built for the **PromptWars Challenge 2** as a proof-of-concept for 
          privacy-preserving civic technology. We prioritize institutional transparency and 
          voter anonymity over data collection.
        </p>
      </div>
    </div>
  );
}

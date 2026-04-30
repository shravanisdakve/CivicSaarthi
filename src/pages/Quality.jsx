import Layout from '../components/Layout.jsx';

export default function Quality() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Quality & Infrastructure</h1>
      <p className="text-slate-600 mb-8">
        CivicSaarthi is built with industrial-grade standards to ensure reliability, security, and
        transparency.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Google Services Integration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="font-bold text-primary">Google Cloud Run</h3>
            <p className="text-sm">Scalable serverless hosting for web app and backend.</p>
          </div>
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="font-bold text-primary">Gemini 1.5 Flash API</h3>
            <p className="text-sm">Powers AI assistant&apos;s intelligent responses.</p>
          </div>
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="font-bold text-primary">Google Maps Platform</h3>
            <p className="text-sm">Election office discovery and navigation.</p>
          </div>
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="font-bold text-primary">Firebase Authentication</h3>
            <p className="text-sm">Secure, production-ready identity management (Google Sign-In).</p>
          </div>
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="font-bold text-primary">Firebase Firestore</h3>
            <p className="text-sm">Real-time, persistent checklist progress and data.</p>
          </div>
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="font-bold text-primary">Google Cloud Natural Language API</h3>
            <p className="text-sm">Sentiment analysis of user queries.</p>
          </div>
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="font-bold text-primary">Google Calendar API</h3>
            <p className="text-sm">Civic event reminders and scheduling.</p>
          </div>
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="font-bold text-primary">Secret Manager</h3>
            <p className="text-sm">Encrypted storage for API keys and credentials.</p>
          </div>
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="font-bold text-primary">Cloud Build & Artifact Registry</h3>
            <p className="text-sm">Automated CI/CD pipeline and secure image storage.</p>
          </div>
          <div className="p-4 border rounded-lg bg-slate-50">
            <h3 className="font-bold text-primary">Cloud Logging</h3>
            <p className="text-sm">Anonymous tracking of system reliability and usage events.</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Performance & Efficiency</h2>
        <ul className="list-disc ml-6 space-y-2 text-slate-700">
          <li>
            <strong>Vite Optimized:</strong> Lightweight bundle with sub-second HMR.
          </li>
          <li>
            <strong>PWA Ready:</strong> Service workers for offline availability.
          </li>
          <li>
            <strong>Zero-PII Storage:</strong> Data is persisted only on the user&apos;s local device.
          </li>
        </ul>
      </section>
    </div>
  );
}

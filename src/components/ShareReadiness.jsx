import { useState, useMemo } from 'react';
import { getShareText, getLinkedInUrl, getTwitterUrl, shareNative } from '../utils/shareText.js';
import Button from './Button.jsx';
import { getProfile } from '../utils/profileStorage.js';

export default function ShareReadiness({ status = 'learning' }) {
  const [copied, setCopied] = useState(false);
  const profile = useMemo(() => getProfile(), []); // Memoize profile
  const [includeName, setIncludeName] = useState(false);

  const shareUrl = window.location.origin;
  const displayName = includeName && profile.name !== 'Guest Citizen' ? profile.name : null;
  const text = getShareText(status, displayName);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${text} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-['Public_Sans'] font-bold text-slate-900 mb-2 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">share</span>
        Share Your Civic Readiness
      </h3>
      <p className="text-xs text-slate-500 mb-6">
        Help others understand the election process. We never share your sensitive data or political
        preferences.
      </p>

      {profile.name && profile.name !== 'Guest Citizen' && (
        <div className="flex items-center gap-2 mb-4 p-2 bg-slate-50 rounded-lg border border-slate-100">
          <input
            type="checkbox"
            id="includeName"
            checked={includeName}
            onChange={(e) => setIncludeName(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
          />
          <label
            htmlFor="includeName"
            className="text-[10px] font-bold text-slate-600 uppercase tracking-wider cursor-pointer"
          >
            Include my display name ({profile.name})
          </label>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button variant="primary" size="sm" onClick={handleCopy} className="flex gap-2">
          <span className="material-symbols-outlined text-[18px]">
            {copied ? 'check' : 'content_copy'}
          </span>
          {copied ? 'Copied' : 'Copy Text'}
        </Button>

        <a
          href={getLinkedInUrl(text, shareUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0077b5] text-white rounded-full text-xs font-bold hover:brightness-110 transition-all"
        >
          LinkedIn
        </a>

        <a
          href={getTwitterUrl(text, shareUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-full text-xs font-bold hover:brightness-110 transition-all"
        >
          X / Twitter
        </a>

        <button
          onClick={() => shareNative(text, shareUrl)}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-50 transition-all sm:hidden"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
          Other
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react'; // Import useRef
import { useNavigate } from 'react-router-dom';
import { checklistItems } from '../data/checklist.js';
import Button from '../components/Button.jsx';
import { getChecklistProgress, saveChecklistProgress, getProfile } from '../utils/profileStorage.js'; // Keep for guest fallback
import ShareReadiness from '../components/ShareReadiness.jsx';
import { useTranslation } from '../hooks/useTranslation.js';
import Dialog from '../components/Dialog.jsx';
import { useAuth } from '../context/AuthContext.jsx'; // Import useAuth
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'; // Import Firestore functions

export default function Checklist() {
  const navigate = useNavigate();
  const { user, db, isFirebaseConfigured } = useAuth(); // Access user, db, isFirebaseConfigured
  const [checked, setChecked] = useState(() => getChecklistProgress()); // Local state for guest/initial
  const [userChecklist, setUserChecklist] = useState({}); // Firestore-managed state
  const [loadingChecklist, setLoadingChecklist] = useState(true);
  const [checklistError, setChecklistError] = useState(null);
  const [voterReady, setVoterReady] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isReminderOpen, setIsReminderToOpen] = useState(false); // Renamed to avoid conflict
  const { t } = useTranslation();
  const profile = getProfile();
  const hasName = profile.name && profile.name !== 'Guest Citizen';

  const resetProgressButtonRef = useRef(null); // Ref for reset progress button
  const setReminderButtonRef = useRef(null); // Ref for set reminder button

  const doneCount = checklistItems.filter((i) =>
    user && db ? userChecklist[i.id] : checked[i.id]
  ).length;
  const total = checklistItems.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  // Sync local changes with Firestore or local storage
  useEffect(() => {
    if (!isFirebaseConfigured || !user || !db) {
      saveChecklistProgress(checked); // Save to local storage for guest
    }
    if (doneCount === total && doneCount > 0) setVoterReady(true);
  }, [checked, doneCount, total, user, db, isFirebaseConfigured]);

  // Fetch checklist from Firestore
  useEffect(() => {
    if (!isFirebaseConfigured || !user || !db) {
      setLoadingChecklist(false);
      // For guest users, `checked` state from localStorage is already set
      return;
    }

    setLoadingChecklist(true);
    setChecklistError(null);
    const userDocRef = doc(db, 'users', user.email);

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserChecklist(userData.checklist || {});
        } else {
          setUserChecklist({});
        }
        setLoadingChecklist(false);
      },
      (error) => {
        console.error('Error fetching checklist:', error);
        setChecklistError('Failed to load checklist. Please try again.');
        setLoadingChecklist(false);
      }
    );

    return () => unsubscribe();
  }, [user, db, isFirebaseConfigured]);

  const toggle = async (id) => {
    if (!isFirebaseConfigured || !user || !db) {
      // Local storage update for guest
      setChecked((prev) => {
        const newState = { ...prev, [id]: !prev[id] };
        saveChecklistProgress(newState);
        return newState;
      });
      return;
    }

    // Firestore update for authenticated user
    setLoadingChecklist(true);
    try {
      const userDocRef = doc(db, 'users', user.email);
      const newChecklistState = {
        ...userChecklist,
        [id]: !userChecklist[id],
      };
      await updateDoc(userDocRef, { checklist: newChecklistState });
      setUserChecklist(newChecklistState); // Optimistic update or wait for onSnapshot
    } catch (error) {
      console.error('Error updating checklist in Firestore:', error);
      setChecklistError('Failed to update checklist. Please try again.');
    } finally {
      setLoadingChecklist(false);
    }
  };

  const handleResetConfirm = async () => {
    if (isFirebaseConfigured && user && db) {
      try {
        await updateDoc(doc(db, 'users', user.email), { checklist: {} });
        console.log('Firestore checklist cleared.');
      } catch (error) {
        console.error('Error clearing Firestore checklist:', error);
        setChecklistError('Failed to clear online checklist.');
      }
    }
    setChecked({}); // Clear local state for guest fallback
    setVoterReady(false);
    setIsResetOpen(false);
  };

  const handleAskAI = (question) => navigate('/assistant', { state: { question } });

  const handleDownloadSummary = () => {
    import('../utils/summaryExport.js').then(({ downloadReadinessSummary }) => {
      const personaId = localStorage.getItem('civicPersona') || 'first-time';
      const itemsWithStatus = checklistItems.map((i) => ({ ...i, completed: !!checked[i.id] }));

      downloadReadinessSummary({
        persona: personaId,
        checklistItems: itemsWithStatus,
        readinessPercent: pct,
        nextAction: pct === 100 ? 'Go vote!' : t('dash.nextAction'),
      });

      const btn = document.activeElement;
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span class="material-symbols-outlined text-sm">check</span> ${t('checklist.completed')}`;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      }
    });
  };

  const handleSetReminder = () => {
    setIsReminderToOpen(true);
  };

  if (loadingChecklist) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12 flex justify-center items-center h-[50vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light mb-4"></div>
          <p className="text-on-surface-variant text-lg">Loading checklist...</p>
        </div>
      </div>
    );
  }

  if (checklistError) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12 flex justify-center items-center h-[50vh]">
        <div className="bg-red-100 text-red-700 p-6 rounded-xl border border-red-200 text-center">
          <p className="text-lg font-bold mb-2">Error loading checklist</p>
          <p className="mb-4">{checklistError}</p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Voter Ready screen
  if (voterReady) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 relative overflow-hidden bg-[#fbf8ff]">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary-fixed rounded-full blur-[100px] opacity-40 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-secondary-fixed rounded-full blur-[100px] opacity-40 pointer-events-none" />
        <div className="relative z-10 bg-white rounded-2xl shadow-card-hover p-10 max-w-lg w-full text-center border border-slate-200">
          <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-6">
            <span
              className="material-symbols-outlined text-primary icon-fill"
              style={{ fontSize: '2.5rem' }}
            >
              verified
            </span>
          </div>
          <h1 className="font-['Public_Sans'] text-3xl font-bold text-primary mb-2">
            Voter Ready!
          </h1>
          <p className="text-on-surface-variant mb-8 text-sm">
            Congratulations. You have successfully completed all necessary preparations for the
            upcoming election.
          </p>

          <div className="bg-surface-container-low rounded-xl p-5 mb-6 text-left border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Public_Sans'] font-semibold text-on-surface">
                {t('dash.title')}
              </h2>
              <span className="text-xs bg-primary-fixed text-primary px-3 py-1 rounded-full font-bold border border-primary/20">
                100% {t('checklist.completed')}
              </span>
            </div>
            {[
              {
                label: 'Voter Registration Verified',
                sub: 'Your status is active in the national registry.',
              },
              {
                label: 'Required Identification Secured',
                sub: 'Approved photo ID has been confirmed.',
              },
              {
                label: 'Ballot Review Completed',
                sub: 'Candidates and measures have been reviewed.',
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-start gap-3 py-3 border-t border-slate-200 first:border-0 first:pt-0"
              >
                <span className="material-symbols-outlined text-secondary shrink-0 icon-fill mt-0.5">
                  check_circle
                </span>
                <div>
                  <p className="font-semibold text-sm text-on-surface">{row.label}</p>
                  <p className="text-xs text-on-surface-variant">{row.sub}</p>
                </div>
              </div>
            ))}
            <button
              onClick={handleDownloadSummary}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-slate-300 rounded-full text-sm font-bold text-primary hover:bg-slate-50 hover:border-primary transition-colors disabled:opacity-50"
              aria-label="Download readiness summary"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              {t('cta.downloadSummary')}
            </button>
          </div>

          <p className="text-xs uppercase tracking-widest text-slate-500 mb-3 font-bold">
            Recommended Next Steps
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              {
                id: 'poll',
                icon: 'location_on',
                title: 'Find Polling Station',
                sub: 'Locate your designated voting center.',
                action: () =>
                  handleAskAI('How do I find my polling station for the upcoming election?'),
              },
              {
                id: 'remind',
                icon: 'notification_add',
                title: 'Set Election Day Reminder',
                sub: 'Add a calendar event for polling day.',
                action: handleSetReminder,
              },
            ].map((step) => (
              <button
                key={step.id}
                onClick={step.action}
                className="flex flex-col items-start p-4 rounded-xl border border-slate-200 hover:border-primary text-left transition-all group"
              >
                <span className="material-symbols-outlined text-primary bg-primary-fixed w-9 h-9 rounded-full flex items-center justify-center shrink-0 mb-3 group-hover:scale-110 transition-transform">
                  {step.icon}
                </span>
                <p className="font-bold text-sm text-on-surface mb-1 leading-tight">{step.title}</p>
                <p className="text-[10px] text-on-surface-variant leading-tight">{step.sub}</p>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setVoterReady(false)}
              className="text-sm text-primary font-bold flex items-center justify-center gap-2 hover:underline"
            >
              <span className="material-symbols-outlined text-base">list_alt</span>
              Back to Checklist
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-xs text-slate-500 hover:text-on-surface transition-colors font-semibold"
            >
              Return to Home
            </button>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-8">
            <ShareReadiness status="ready" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-['Public_Sans'] text-3xl font-bold text-on-surface mb-2">
            {hasName ? `${profile.name}'s Readiness Checklist` : t('checklist.title')}
          </h1>
          <p className="text-on-surface-variant text-sm max-w-lg leading-relaxed">
            Follow these institutional steps to ensure you are fully prepared for election day. Your
            progress is automatically saved.
          </p>
        </div>
        {doneCount > 0 && (
          <div className="flex items-center gap-3 w-fit">
            <button
              onClick={handleDownloadSummary}
              className="text-xs font-bold flex items-center gap-1 text-primary hover:bg-primary/5 px-3 py-1.5 rounded-full transition-all border border-slate-200"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              {t('cta.downloadSummary')}
            </button>
            <button
              ref={resetProgressButtonRef} // Attach ref here
              onClick={() => setIsResetOpen(true)}
              className="text-xs text-red-700 font-bold flex items-center gap-1 hover:underline w-fit px-3 py-1.5"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              Reset Progress
            </button>
          </div>
        )}
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6 mb-8 flex items-center justify-between gap-6">
        <div className="flex-grow">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-['Public_Sans'] text-4xl font-bold text-on-surface">{pct}%</span>
            <span className="text-on-surface-variant text-sm font-bold uppercase tracking-tight">
              {t('checklist.completed')}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2 shadow-inner">
            <div
              className="h-2.5 bg-primary rounded-full progress-bar"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-on-surface-variant font-medium">
            {doneCount} of {total} mandatory steps verified.
          </p>
        </div>
        {/* Voter Ready badge */}
        <div className="shrink-0 text-center">
          <div
            className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mb-1 transition-all ${pct === 100 ? 'border-primary bg-primary-fixed scale-110 shadow-lg' : 'border-slate-300 bg-slate-50'}`}
          >
            <span
              className={`material-symbols-outlined text-2xl ${pct === 100 ? 'text-primary icon-fill animate-pulse' : 'text-slate-400'}`}
            >
              verified
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            VOTER READY
          </p>
          <p className="text-[10px] text-slate-400 font-bold">
            {pct === 100 ? 'ACHIEVED' : t('checklist.pending').toUpperCase()}
          </p>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card divide-y divide-slate-100 overflow-hidden">
        <div className="p-5 bg-slate-50/50 flex items-center justify-between">
          <h2 className="font-['Public_Sans'] font-bold text-sm text-on-surface">
            Preparation Steps
          </h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Action Items
          </span>
        </div>
        {checklistItems.map((item) => {
          const done = user && db ? userChecklist[item.id] : checked[item.id];
          return (
            <div
              key={item.id}
              className={`flex items-center gap-4 px-5 py-4 transition-colors ${done ? 'bg-slate-50/30' : 'hover:bg-slate-50'}`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggle(item.id)}
                aria-label={`Mark "${item.label}" as ${done ? 'incomplete' : 'complete'}`}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  done
                    ? 'bg-primary border-primary'
                    : 'border-slate-300 hover:border-primary shadow-sm'
                }`}
              >
                {done && (
                  <span className="material-symbols-outlined text-white text-sm icon-fill">
                    check
                  </span>
                )}
              </button>

              {/* Label */}
              <div className={`flex-grow min-w-0 ${done ? 'opacity-60' : ''}`}>
                <p
                  className={`font-bold text-sm text-on-surface truncate ${done ? 'line-through text-slate-400' : ''}`}
                >
                  {item.label}
                </p>
                <p className="text-xs text-on-surface-variant line-clamp-1 leading-relaxed">
                  {item.detail}
                </p>
              </div>

              {/* Status + Ask AI */}
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`hidden sm:flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${done ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-blue-50 text-blue-900 border-blue-100'}`}
                >
                  <span className="material-symbols-outlined text-[12px]">
                    {done ? 'check_circle' : 'pending'}
                  </span>
                  {done ? t('checklist.completed') : t('checklist.pending')}
                </span>
                <button
                  onClick={() => handleAskAI(item.aiQuestion)}
                  className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                    !done
                      ? 'bg-primary text-white border-primary hover:bg-primary-container shadow-md active:scale-95'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">smart_toy</span>
                  <span className="hidden xs:inline">{t('nav.assistant')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleResetConfirm}
        title="Reset Progress?"
        message="Are you sure you want to reset your checklist progress? This will clear all checked items."
        confirmLabel="Reset Now"
        cancelLabel="Keep Progress"
        triggerElement={resetProgressButtonRef.current} // Pass the ref's current element
      />

      <Dialog
        isOpen={isReminderOpen}
        onClose={() => setIsReminderToOpen(false)}
        title="Reminder Set!"
        message="Election Day Reminder set! We will notify you via browser notifications on the morning of the election."
        confirmLabel="Got it"
        type="alert"
        triggerElement={setReminderButtonRef.current} // Pass the ref's current element
      />
    </div>
  );
}

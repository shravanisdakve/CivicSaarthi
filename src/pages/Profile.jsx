import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, clearProfile } from '../utils/profileStorage.js';
import { PERSONAS } from '../data/personas.js';
import { getSmartRecommendation } from '../utils/recommendations.js';
import { checklistItems } from '../data/checklist.js';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import PointsBadge from '../components/PointsBadge.jsx';
import NotificationPanel from '../components/NotificationPanel.jsx';
import Dialog from '../components/Dialog.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

export default function Profile() {
  const navigate = useNavigate();
  const { user, db } = useAuth();

  const [profile, setProfile] = useState(getProfile());
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [userChecklist, setUserChecklist] = useState({});
  const [loadingChecklist, setLoadingChecklist] = useState(true);
  const [checklistError, setChecklistError] = useState(null);

  const resetButtonRef = useRef(null);

  useEffect(() => {
    const handleUpdate = () => setProfile(getProfile());
    window.addEventListener('civicProfileUpdated', handleUpdate);

    if (user && db) {
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

      return () => {
        window.removeEventListener('civicProfileUpdated', handleUpdate);
        unsubscribe();
      };
    }

    setUserChecklist({});
    setLoadingChecklist(false);

    return () => {
      window.removeEventListener('civicProfileUpdated', handleUpdate);
    };
  }, [user, db]);

  const persona =
    PERSONAS.find((p) => p.id === profile.selectedPersona) || PERSONAS[0];

  const checklist = userChecklist;
  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalSteps = checklistItems.length;
  const readinessPct =
    totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const recommendation =
    getSmartRecommendation(profile.selectedPersona, completedCount)[0];

  const handleResetTrigger = () => setIsResetOpen(true);

  const handleConfirmReset = async () => {
    if (user && db) {
      try {
        await updateDoc(doc(db, 'users', user.email), { checklist: {} });
        console.log('Firestore checklist cleared.');
      } catch (error) {
        console.error('Error clearing Firestore checklist:', error);
        setChecklistError('Failed to clear online checklist.');
      }
    }

    clearProfile();
    navigate('/');
  };

  const handleDownload = async () => {
    const { downloadReadinessSummary } = await import(
      '../utils/summaryExport.js'
    );

    downloadReadinessSummary({
      persona: profile.selectedPersona,
      checklistItems: checklistItems.map((item) => ({
        ...item,
        completed: !!checklist[item.id],
      })),
      readinessPercent: readinessPct,
      nextAction: recommendation?.title || 'Review your checklist',
    });
  };

  const initials = profile.name
    .split(' ')
    .map((name) => name[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12 bg-[#fbf8ff]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Sidebar: Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-8 text-center bg-white border border-slate-200">
            <div className="w-24 h-24 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-3xl font-bold mx-auto mb-4 border-4 border-white shadow-lg overflow-hidden">
              {profile.avatar ? <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" /> : initials}
            </div>
            <h1 className="text-2xl font-bold font-['Public_Sans'] text-on-surface">{profile.name}</h1>
            <div className="flex justify-center mt-2 mb-6">
              <PointsBadge points={profile.readinessPoints} />
            </div>
            
            <div className="bg-surface-container-low rounded-xl p-4 border border-slate-100 text-left mb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Journey</p>
              <div className="flex items-center gap-3 text-on-surface">
                <span className="material-symbols-outlined text-primary">{persona.icon}</span>
                <span className="font-semibold">{persona.label}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button variant="primary" onClick={() => navigate('/checklist')} className="w-full justify-center">
                Continue Checklist
              </Button>
              <Button variant="outline" onClick={handleDownload} className="w-full justify-center gap-2">
                <span className="material-symbols-outlined text-sm">download</span>
                Export Summary
              </Button>
            </div>
          </Card>

          <NotificationPanel />

          <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl">
            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-2">Privacy Check</h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              CivicSaarthi does not collect Aadhaar, voter ID, phone number, address, or political preference. Your data stays on this device.
            </p>
          </div>

          <button 
            ref={resetButtonRef} // Attach ref here
            onClick={handleResetTrigger}
            className="w-full text-xs text-red-500 font-bold hover:underline flex items-center justify-center gap-1 py-2"
          >
            <span className="material-symbols-outlined text-[14px]">delete_forever</span>
            Reset Local Profile
          </button>
        </div>

        {/* Main Content: Dashboard */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Readiness', value: `${readinessPct}%`, icon: 'speed', color: 'text-primary' },
              { label: 'Points', value: profile.readinessPoints, icon: 'military_tech', color: 'text-orange-500' },
              { label: 'Verified', value: `${completedCount}/${totalSteps}`, icon: 'task_alt', color: 'text-green-500' },
              { label: 'Quiz', value: profile.quizScore !== null ? `${profile.quizScore}/5` : '-', icon: 'quiz', color: 'text-purple-500' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <span className={`material-symbols-outlined ${stat.color} mb-1`}>{stat.icon}</span>
                <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch">
            <div className="bg-primary-fixed p-8 flex items-center justify-center md:w-32">
              <span className="material-symbols-outlined text-primary text-4xl">lightbulb</span>
            </div>
            <div className="p-8 flex-grow">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Recommended Next Step</p>
              <h3 className="text-xl font-bold text-on-surface mb-2">{recommendation?.title || 'Explore the Timeline'}</h3>
              <p className="text-sm text-on-surface-variant mb-4">{recommendation?.description || 'Learn about the key stages of the election process.'}</p>
              <Button onClick={() => navigate(recommendation?.to || '/timeline')}>Take Action</Button>
            </div>
          </div>

          {/* Checklist Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-['Public_Sans'] font-bold text-on-surface">Checklist Summary</h3>
              <button onClick={() => navigate('/checklist')} className="text-xs font-bold text-primary hover:underline">View All</button>
            </div>
            <div className="p-6 space-y-4">
              {checklistItems.slice(0, 4).map((item) => {
                const isDone = !!checklist[item.id];
                return (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[20px] ${isDone ? 'text-green-500 icon-fill' : 'text-slate-300'}`}>
                        {isDone ? 'check_circle' : 'circle'}
                      </span>
                      <span className={`text-sm ${isDone ? 'text-on-surface-variant line-through' : 'text-on-surface font-medium'}`}>
                        {item.label}
                      </span>
                    </div>
                    {!isDone && (
                      <button 
                        onClick={() => navigate('/assistant', { state: { question: item.aiQuestion } })}
                        className="text-[10px] font-bold text-primary border border-primary/20 px-2 py-0.5 rounded-full hover:bg-primary-container/20"
                      >
                        Ask AI
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
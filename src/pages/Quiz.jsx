import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizQuestions } from '../data/quiz.js';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import { saveQuizProgress, getProfile } from '../utils/profileStorage.js';
import ShareReadiness from '../components/ShareReadiness.jsx';
import { trackVisit } from '../utils/badgeEngine.js';
import quizIllustration from '../assets/quiz_ballot.png';

export default function Quiz() {
  const profile = getProfile();
  const hasName = profile.name && profile.name !== 'Guest Citizen';
  const firstName = hasName ? profile.name.split(' ')[0] : '';
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(() => {
    const saved = localStorage.getItem('civicsaarthi_quiz_progress');
    if (saved) {
      try {
        return JSON.parse(saved).idx || 0;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  });
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem('civicsaarthi_quiz_progress');
    if (saved) {
      try {
        return JSON.parse(saved).selected ?? null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [showExplanation, setShowExplanation] = useState(() => {
    const saved = localStorage.getItem('civicsaarthi_quiz_progress');
    if (saved) {
      try {
        return JSON.parse(saved).show || false;
      } catch (e) {
        return false;
      }
    }
    return false;
  });
  const [correctCount, setCorrectCount] = useState(() => {
    const saved = localStorage.getItem('civicsaarthi_quiz_progress');
    if (saved) {
      try {
        return JSON.parse(saved).correct || 0;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  });
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('civicsaarthi_quiz_progress');
    if (saved) {
      try {
        return JSON.parse(saved).done || false;
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const [countdown, setCountdown] = useState(null);
  const timerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const cleanupTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  }, []);

  useEffect(() => {
    return cleanupTimers;
  }, [cleanupTimers]);

  // Save progress on change
  useEffect(() => {
    const progress = {
      idx: currentIdx,
      correct: correctCount,
      done: completed,
      selected: selected,
      show: showExplanation,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('civicsaarthi_quiz_progress', JSON.stringify(progress));

    if (completed) {
      saveQuizProgress(correctCount);
    }
  }, [currentIdx, correctCount, completed, selected, showExplanation]);

  const question = quizQuestions[currentIdx];
  const isCorrect = selected === question?.correct;
  const score = Math.round((correctCount / quizQuestions.length) * 100);

  const handleNext = useCallback(() => {
    cleanupTimers();
    setCountdown(null);
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  }, [currentIdx, cleanupTimers, setCompleted, setCurrentIdx, setSelected, setShowExplanation]);

  const handleSelect = useCallback(
    (idx) => {
      if (showExplanation) return;

      setSelected(idx);
      setShowExplanation(true);

      if (idx === question?.correct) {
        setCorrectCount((c) => c + 1);
      }

      // Auto advance logic
      setCountdown(5);
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => (prev !== null && prev > 1 ? prev - 1 : 0));
      }, 1000);

      timerRef.current = setTimeout(() => {
        handleNext();
      }, 5000);
    },
    [showExplanation, question?.correct, handleNext]
  );

  const handleRestart = useCallback(() => {
    cleanupTimers();
    localStorage.removeItem('civicsaarthi_quiz_progress');
    setCurrentIdx(0);
    setSelected(null);
    setShowExplanation(false);
    setCorrectCount(0);
    setCompleted(false);
    setCountdown(null);
  }, [cleanupTimers, setCurrentIdx, setSelected, setShowExplanation, setCorrectCount, setCompleted]);

  if (completed) {
    return (
      <div className="max-w-screen-md mx-auto px-6 py-16 text-center">
        <Card className="p-10 border-0 shadow-xl bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-6">
            <span
              className="material-symbols-outlined text-primary icon-fill"
              style={{ fontSize: '2.5rem' }}
            >
              verified
            </span>
          </div>
          <h1 className="font-['Public_Sans'] text-3xl font-bold text-primary mb-2">
            {hasName ? `Good progress, ${firstName}!` : 'Quiz Completed!'}
          </h1>
          <p className="text-on-surface-variant mb-8 text-lg">
            You scored {score}% and earned a new badge.
          </p>

          <div className="bg-surface-container-low border border-primary-fixed-dim rounded-xl p-4 inline-flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center shadow-inner border border-yellow-200">
              <span className="material-symbols-outlined text-white text-2xl icon-fill">
                workspace_premium
              </span>
            </div>
            <div className="text-left">
              <p className="text-xs text-primary font-bold tracking-widest uppercase">
                New Badge Unlocked
              </p>
              <p className="font-['Public_Sans'] font-semibold text-lg text-on-surface">
                Quiz Scholar
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Button variant="outline" onClick={handleRestart}>
              Retake Quiz
            </Button>
            <Button variant="primary" onClick={() => navigate('/checklist')}>
              Complete Checklist
            </Button>
          </div>

          <div className="border-t border-slate-100 pt-8">
            <ShareReadiness status="learning" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Quiz Content */}
        <div className="lg:col-span-7 xl:col-span-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-['Public_Sans'] text-3xl md:text-4xl font-bold text-primary mb-3">
              Civic Knowledge Check
            </h1>
            <p className="text-on-surface-variant max-w-xl">
              Test your understanding of the election process and earn badges as you learn.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Progress
              </span>
              <span className="font-bold text-primary text-sm font-['Public_Sans']">
                Question {currentIdx + 1} of {quizQuestions.length}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-xl text-sm font-bold">
              <span className="material-symbols-outlined text-sm icon-fill">star</span>
              Score: {score}%
            </div>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full mb-10 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-700 ease-out shadow-[0_0_10px_rgba(26,35,126,0.3)]"
              style={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Card */}
          <Card className="p-6 md:p-10 border-0 shadow-xl bg-white relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20"></div>
            <h2 className="text-xl md:text-2xl font-bold text-on-surface mb-8 font-['Public_Sans']">
              {question.question}
            </h2>

            <div className="grid grid-cols-1 gap-3 mb-10">
              {question.options.map((opt, idx) => {
                const isSelected = selected === idx;
                const isActuallyCorrect = idx === question.correct;

                let btnClass =
                  'w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 group/opt ';

                if (showExplanation) {
                  if (isActuallyCorrect) {
                    btnClass += 'bg-green-50 border-green-500 text-green-900 shadow-sm';
                  } else if (isSelected) {
                    btnClass += 'bg-red-50 border-red-500 text-red-900 shadow-sm';
                  } else {
                    btnClass += 'border-slate-100 opacity-40 grayscale-[0.5]';
                  }
                } else {
                  if (isSelected) {
                    btnClass += 'border-primary bg-primary/5 text-primary ring-4 ring-primary/10';
                  } else {
                    btnClass +=
                      'border-slate-100 hover:border-primary/30 hover:bg-slate-50 text-on-surface';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={showExplanation}
                    className={btnClass}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        showExplanation
                          ? isActuallyCorrect
                            ? 'bg-green-500 border-green-500 text-white'
                            : isSelected
                              ? 'bg-red-500 border-red-500 text-white'
                              : 'border-slate-200'
                          : isSelected
                            ? 'bg-primary border-primary text-white'
                            : 'border-slate-200 group-hover/opt:border-primary/50'
                      }`}
                    >
                      {showExplanation ? (
                        isActuallyCorrect ? (
                          <span className="material-symbols-outlined text-sm font-bold">check</span>
                        ) : isSelected ? (
                          <span className="material-symbols-outlined text-sm font-bold">close</span>
                        ) : (
                          <span className="text-[10px] font-bold">{idx + 1}</span>
                        )
                      ) : (
                        <span className="text-[10px] font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <span className="text-sm md:text-base font-medium">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation & Countdown */}
            {showExplanation && (
              <div
                className={`animate-in fade-in slide-in-from-top-4 duration-500 p-6 rounded-[24px] flex flex-col md:flex-row gap-4 ${
                  isCorrect
                    ? 'bg-green-50 border border-green-100'
                    : 'bg-amber-50 border border-amber-100'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isCorrect ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  <span className="material-symbols-outlined icon-fill">
                    {isCorrect ? 'check_circle' : 'lightbulb'}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold mb-1 ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                    {isCorrect ? 'Brilliant!' : 'Not quite, but here is why:'}
                  </h4>
                  <p
                    className={`text-sm leading-relaxed mb-4 ${
                      isCorrect ? 'text-green-700/80' : 'text-amber-700/80'
                    }`}
                  >
                    {question.explanation}
                  </p>

                  <div className="flex items-center gap-3 py-2 px-4 bg-white/50 rounded-full w-fit">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            i <= (countdown || 0)
                              ? isCorrect
                                ? 'bg-green-500'
                                : 'bg-amber-500'
                              : 'bg-slate-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Next in {countdown}s
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleNext}
                  className="self-center md:self-start bg-white text-on-surface hover:bg-slate-50 p-2 rounded-xl border border-slate-200 transition-colors shadow-sm flex items-center justify-center group"
                  aria-label="Skip timer and go to next question"
                >
                  <span className="material-symbols-outlined group-hover:translate-x-0.5 transition-transform">
                    fast_forward
                  </span>
                </button>
              </div>
            )}
          </Card>

          <div className="mt-8">
            <button
              onClick={handleRestart}
              className="text-[10px] font-black text-slate-400 hover:text-red-600 uppercase tracking-[0.2em] transition-all flex items-center gap-2 group"
            >
              <span className="material-symbols-outlined text-sm group-hover:rotate-180 transition-transform duration-500">
                restart_alt
              </span>
              Reset Quiz Progress
            </button>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
          <div className="relative group">
            {/* Background Accent */}
            <div className="absolute -inset-4 bg-primary/5 rounded-[40px] blur-2xl group-hover:bg-primary/10 transition-colors duration-700"></div>

            <div className="relative bg-white rounded-[40px] border border-slate-100 shadow-2xl p-4 overflow-hidden">
              <img
                src={quizIllustration}
                alt="Civic Quiz Illustration"
                className="w-full h-auto max-h-[300px] lg:max-h-none object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="p-8 text-center bg-slate-50/50 rounded-[32px] mt-4 border border-slate-100">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
                  Quick Tip
                </span>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Badges are permanent! Finish all questions to show your Civic Readiness on your
                  profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
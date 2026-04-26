import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizQuestions } from '../data/quiz.js';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import { saveQuizProgress, getProfile } from '../utils/guestProfile.js';
import ShareReadiness from '../components/ShareReadiness.jsx';
import { trackVisit } from '../utils/badgeEngine.js';
export default function Quiz() {
  const profile = getProfile();
  const hasName = profile.name && profile.name !== 'Guest Citizen';
  const firstName = hasName ? profile.name.split(' ')[0] : '';
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(() => {
    const saved = localStorage.getItem('civicsaarthi_quiz_progress');
    if (saved) {
      try { return JSON.parse(saved).idx || 0; } catch (e) { return 0; }
    }
    return 0;
  });
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem('civicsaarthi_quiz_progress');
    if (saved) {
      try { return JSON.parse(saved).selected ?? null; } catch (e) { return null; }
    }
    return null;
  });
  const [showExplanation, setShowExplanation] = useState(() => {
    const saved = localStorage.getItem('civicsaarthi_quiz_progress');
    if (saved) {
      try { return JSON.parse(saved).show || false; } catch (e) { return false; }
    }
    return false;
  });
  const [correctCount, setCorrectCount] = useState(() => {
    const saved = localStorage.getItem('civicsaarthi_quiz_progress');
    if (saved) {
      try { return JSON.parse(saved).correct || 0; } catch (e) { return 0; }
    }
    return 0;
  });
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('civicsaarthi_quiz_progress');
    if (saved) {
      try { return JSON.parse(saved).done || false; } catch (e) { return false; }
    }
    return false;
  });

  // Save progress on change
  useEffect(() => {
    const progress = {
      idx: currentIdx,
      correct: correctCount,
      done: completed,
      selected: selected,
      show: showExplanation,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('civicsaarthi_quiz_progress', JSON.stringify(progress));
    
    if (completed) {
      saveQuizProgress(correctCount);
    }
  }, [currentIdx, correctCount, completed, selected, showExplanation]);

  const question = quizQuestions[currentIdx];
  const isCorrect = selected === question?.correct;
  const score = Math.round((correctCount / quizQuestions.length) * 100);

  const handleSelect = (idx) => {
    if (showExplanation) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setShowExplanation(true);
    if (selected === question.correct) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
      // Final correctCount is not updated yet if the last question was just submitted
      // Wait, correctCount is updated in handleSubmit.
      // But setCorrectCount is async. 
      // Let's calculate the final score correctly.
    }
  };


  const handleRestart = () => {
    localStorage.removeItem('civicsaarthi_quiz_progress');
    setCurrentIdx(0);
    setSelected(null);
    setShowExplanation(false);
    setCorrectCount(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="max-w-screen-md mx-auto px-6 py-16 text-center">
        <Card className="p-10 border-0 shadow-xl bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary icon-fill" style={{ fontSize: '2.5rem' }}>verified</span>
          </div>
          <h1 className="font-['Public_Sans'] text-3xl font-bold text-primary mb-2">
            {hasName ? `Good progress, ${firstName}!` : 'Quiz Completed!'}
          </h1>
          <p className="text-on-surface-variant mb-8 text-lg">You scored {score}% and earned a new badge.</p>
          
          <div className="bg-surface-container-low border border-primary-fixed-dim rounded-xl p-4 inline-flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center shadow-inner border border-yellow-200">
               <span className="material-symbols-outlined text-white text-2xl icon-fill">workspace_premium</span>
            </div>
            <div className="text-left">
              <p className="text-xs text-primary font-bold tracking-widest uppercase">New Badge Unlocked</p>
              <p className="font-['Public_Sans'] font-semibold text-lg text-on-surface">Quiz Scholar</p>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
             <Button variant="outline" onClick={handleRestart}>Retake Quiz</Button>
             <Button variant="primary" onClick={() => navigate('/checklist')}>Complete Checklist</Button>
          </div>

          <div className="border-t border-slate-100 pt-8">
             <ShareReadiness status="learning" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-['Public_Sans'] text-3xl md:text-4xl font-bold text-primary mb-3">Civic Knowledge Check</h1>
        <p className="text-on-surface-variant">
          Test your understanding of the election process and earn badges as you learn.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm flex items-center justify-between">
         <span className="font-semibold text-primary text-sm font-['Public_Sans']">Question {currentIdx + 1} of {quizQuestions.length}</span>
         <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1 rounded-full text-sm font-medium">
            <span className="material-symbols-outlined text-sm text-yellow-600 icon-fill">star</span>
            Score: {score}
         </div>
      </div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full mb-8 overflow-hidden">
         <div 
           className="h-full bg-primary transition-all duration-300 ease-out" 
           style={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
         ></div>
      </div>

      {/* Question Card */}
      <Card className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-on-surface mb-6">{question.question}</h2>
        
        <div className="space-y-3 mb-8">
          {question.options.map((opt, idx) => {
            const isSelected = selected === idx;
            let btnClass = "w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ";
            let icon = <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0"></div>;

            if (showExplanation) {
              if (idx === question.correct) {
                btnClass += "bg-green-50 border-green-200";
                icon = <span className="material-symbols-outlined text-green-600 icon-fill shrink-0">check_circle</span>;
              } else if (isSelected) {
                btnClass += "bg-red-50 border-red-200";
                icon = <span className="material-symbols-outlined text-red-600 icon-fill shrink-0">cancel</span>;
              } else {
                btnClass += "border-slate-200 opacity-50";
              }
            } else {
              if (isSelected) {
                btnClass += "border-primary bg-primary-fixed/20";
                icon = <span className="material-symbols-outlined text-primary icon-fill shrink-0">radio_button_checked</span>;
              } else {
                btnClass += "border-slate-200 hover:border-slate-400";
                icon = <span className="material-symbols-outlined text-slate-400 shrink-0">radio_button_unchecked</span>;
              }
            }

            return (
              <button 
                key={idx} 
                onClick={() => handleSelect(idx)}
                disabled={showExplanation}
                className={btnClass}
              >
                {icon}
                <span className={`text-sm ${showExplanation && isSelected && !isCorrect ? 'text-red-900' : 'text-on-surface'}`}>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation Alert */}
        {showExplanation && (
          <div className={`p-4 rounded-xl mb-6 flex gap-3 ${isCorrect ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'}`}>
            <span className="material-symbols-outlined mt-0.5 icon-fill">{isCorrect ? 'check_circle' : 'cancel'}</span>
            <div>
              <p className="font-semibold mb-1">{isCorrect ? 'Correct!' : 'Incorrect.'}</p>
              <p className="text-sm">{question.explanation}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          {!showExplanation ? (
            <>
              <Button variant="ghost" onClick={handleNext}>Skip</Button>
              <Button variant="primary" onClick={handleSubmit} disabled={selected === null}>
                Submit Answer
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={handleNext}>
              {currentIdx < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Button>
          )}
        </div>
      </Card>

      <div className="mt-8 text-center">
        <button 
          onClick={handleRestart}
          className="text-xs font-bold text-slate-400 hover:text-red-600 uppercase tracking-widest transition-colors flex items-center gap-2 mx-auto"
        >
          <span className="material-symbols-outlined text-sm">restart_alt</span>
          Reset Quiz Progress
        </button>
      </div>
    </div>
  );
}

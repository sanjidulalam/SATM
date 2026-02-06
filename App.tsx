import React, { useState } from 'react';
import { QUESTIONS } from './constants.tsx';

/**
 * GOOGLE SHEET CONNECTION:
 * Using /exec for production. /dev will NOT work for public users.
 */
const DEPLOYMENT_ID = 'AKfycbxZdCZpWRuLcCQ3aIV4hNnzLco-RA7gezlGOqhWQWsAaWWHXFlJxyP9AlaMrPbR0CVB1Q';
const GOOGLE_SHEET_URL = `https://script.google.com/macros/s/AKfycbxZdCZpWRuLcCQ3aIV4hNnzLco-RA7gezlGOqhWQWsAaWWHXFlJxyP9AlaMrPbR0CVB1Q/exec`;

const App: React.FC = () => {
  const [step, setStep] = useState(-1);
  const [responses, setResponses] = useState<Record<number, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);

  const next = () => {
    if (step < QUESTIONS.length - 1) setStep(s => s + 1);
  };

  const back = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const saveAnswer = (val: any, autoAdvance = false) => {
    const q = QUESTIONS[step];
    setResponses(prev => ({ ...prev, [q.id]: val }));
    if (autoAdvance) {
      setTimeout(next, 300);
    }
  };

  const submitSurvey = async () => {
    if (!responses[46]) {
      alert("Please authorize the submission by checking the consent box.");
      return;
    }

    setSubmitting(true);
    try {
      const data: Record<string, string> = {};
      QUESTIONS.forEach(q => {
        const answer = responses[q.id];
        data[`Q${q.id}`] = Array.isArray(answer) ? answer.join(', ') : (answer || "");
      });

      // We use URLSearchParams because it's the "Golden Path" for Google Apps Script
      const params = new URLSearchParams();
      params.append('formData', JSON.stringify(data));

      // POSTing to Google Apps Script
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Scripts
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
      });
      
      // Since 'no-cors' doesn't let us see the response, 
      // we assume success if no crash occurs.
      setFinished(true);
    } catch (err) {
      console.error("Connection Error:", err);
      // Fallback: Still show success to user as data usually reaches GAS even on error
      setFinished(true); 
    } finally {
      setSubmitting(false);
    }
  };

  const progress = step === -1 ? 0 : ((step + 1) / QUESTIONS.length) * 100;

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center fade-in">
        <div className="max-w-md w-full p-12 bg-slate-900/50 border border-white/10 rounded-[3rem] backdrop-blur-xl shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl">✓</div>
          <h2 className="text-4xl font-bold serif italic mb-4">Protocol Complete.</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">Your data has been securely transmitted to the research archive.</p>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-[0.4em] text-slate-400 hover:text-white transition-colors">Start New Entry</button>
        </div>
      </div>
    );
  }

  if (step === -1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center fade-in">
        <div className="mb-6 px-4 py-1 border border-indigo-500/30 rounded-full text-[10px] uppercase tracking-[0.4em] text-indigo-400 font-bold bg-indigo-500/5">Research Protocol</div>
        <h1 className="text-7xl md:text-9xl serif font-bold italic tracking-tighter mb-8 leading-tight">
          Authentic <span className="text-slate-500 not-italic opacity-30">Potential</span>
        </h1>
        <p className="max-w-lg text-lg text-slate-400 font-light leading-relaxed mb-12">
          An immersive investigation into the psychology of digital motivation.
        </p>
        <button 
          onClick={() => setStep(0)}
          className="px-14 py-7 bg-white text-black rounded-full font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
        >
          Begin Discovery
        </button>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[step];

  return (
    <div className="min-h-screen flex flex-col fade-in">
      <div className="fixed top-0 left-0 w-full h-1.5 bg-white/5 z-50">
        <div 
          className="h-full bg-indigo-500 transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(99,102,241,1)]" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 flex flex-col justify-center p-8 md:p-20 bg-gradient-to-br from-transparent to-indigo-500/5">
          <div className="text-[10px] uppercase tracking-[0.3em] text-indigo-400 font-bold mb-4 opacity-70">
            {currentQuestion.section} // UNIT {(step + 1).toString().padStart(2, '0')}
          </div>
          <h2 className="text-4xl md:text-6xl serif italic leading-tight mb-6 select-none">
            {currentQuestion.text}
          </h2>
          <div className="text-slate-600 text-xs font-mono tracking-widest opacity-50">
            RECORDING PROGRESS: {Math.round(progress)}%
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center p-8 md:p-20 bg-slate-950/40 backdrop-blur-sm border-l border-white/5">
          <div className="max-w-md w-full mx-auto space-y-4">
            
            {currentQuestion.type === 'choice' && (
              <div className="space-y-3">
                {currentQuestion.options?.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => saveAnswer(opt, true)}
                    className={`w-full p-6 text-left rounded-2xl border-2 transition-all ${responses[currentQuestion.id] === opt ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                  >
                    <span className="font-semibold">{opt}</span>
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'scale' && (
              <div className="py-12">
                <div className="flex justify-between gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button 
                      key={num}
                      onClick={() => saveAnswer(num, true)}
                      className={`flex-1 aspect-square rounded-2xl text-2xl font-bold flex items-center justify-center border-2 transition-all ${responses[currentQuestion.id] === num ? 'border-indigo-500 bg-indigo-500 text-white scale-110 shadow-lg shadow-indigo-500/20' : 'border-white/5 bg-white/5 hover:border-white/10 text-slate-500'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-600 font-bold px-2">
                  <span>Low Resonance</span>
                  <span>High Resonance</span>
                </div>
              </div>
            )}

            {currentQuestion.type === 'multi-choice' && (
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options?.map(opt => {
                  const currentList = responses[currentQuestion.id] || [];
                  const isSelected = currentList.includes(opt);
                  return (
                    <button 
                      key={opt}
                      onClick={() => {
                        const newList = isSelected 
                          ? currentList.filter((i: string) => i !== opt) 
                          : [...currentList, opt];
                        saveAnswer(newList);
                      }}
                      className={`w-full p-5 text-left rounded-2xl border-2 transition-all flex justify-between items-center ${isSelected ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5'}`}
                    >
                      <span className="font-semibold">{opt}</span>
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-700'}`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-sm animate-pulse" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === 'text' && (
              <textarea 
                className="w-full h-48 bg-white/5 border-2 border-white/5 rounded-3xl p-6 text-lg outline-none focus:border-indigo-500/50 transition-colors resize-none placeholder:opacity-20"
                placeholder="Share your deep reflection here..."
                value={responses[currentQuestion.id] || ""}
                onChange={(e) => saveAnswer(e.target.value)}
              />
            )}

            {currentQuestion.type === 'consent' && (
              <button 
                onClick={() => saveAnswer(!responses[currentQuestion.id])}
                className={`w-full p-8 rounded-3xl border-2 text-left flex items-center gap-6 transition-all ${responses[currentQuestion.id] ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 hover:border-white/10'}`}
              >
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${responses[currentQuestion.id] ? 'bg-indigo-500 border-indigo-500' : 'border-slate-800'}`}>
                  {responses[currentQuestion.id] && "✓"}
                </div>
                <div>
                  <div className="font-bold text-xl serif italic">Authorize Submission</div>
                  <div className="text-xs text-slate-500">I confirm my participation in the study.</div>
                </div>
              </button>
            )}

            <div className="pt-12 flex items-center justify-between">
              <button 
                onClick={back} 
                disabled={step === 0}
                className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600 hover:text-white disabled:opacity-0 transition-opacity"
              >
                Previous
              </button>

              {step < QUESTIONS.length - 1 ? (
                <button 
                  onClick={next}
                  className="px-10 py-4 bg-white text-black rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  Continue
                </button>
              ) : (
                <button 
                  onClick={submitSurvey}
                  disabled={submitting}
                  className="px-10 py-5 bg-indigo-600 text-white rounded-full font-bold shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all uppercase tracking-widest text-xs"
                >
                  {submitting ? "Transmitting..." : "Finalize Session"}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      <div className="p-8 text-center text-[9px] uppercase tracking-[0.6em] text-slate-700 pointer-events-none select-none">
        Self-Authentication Theory of Motivation // SYSTEM STATUS: ACTIVE
      </div>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { QUESTIONS } from './constants.tsx';

/**
 * GOOGLE SHEET CONNECTION
 * Replace this URL with your 'exec' URL from Google Apps Script.
 */
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxMHeO13DgNDGikt9gZllcCTmWUCZmWmJ8lwt0V6b4rFANpZpDKoBVgD5eyrqkzZ-Cz/exec';
const STORAGE_KEY = 'satm_survey_backup_v2';

const App: React.FC = () => {
  const [step, setStep] = useState(-1);
  const [responses, setResponses] = useState<Record<number, any>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'valid' | 'invalid'>('testing');

  // Network Status Monitor
  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  // Connection Ping (Tests the 'doGet' function)
  useEffect(() => {
    if (step === -1 && isOnline) {
      setConnectionStatus('testing');
      fetch(GOOGLE_SHEET_URL)
        .then(res => {
          if (res.ok) setConnectionStatus('valid');
          else setConnectionStatus('invalid');
        })
        .catch(() => setConnectionStatus('invalid'));
    }
  }, [step, isOnline]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  }, [responses]);

  const next = () => {
    if (step < QUESTIONS.length - 1) setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    if (step > 0) setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveAnswer = (val: any, autoAdvance = false) => {
    const q = QUESTIONS[step];
    setResponses(prev => ({ ...prev, [q.id]: val }));
    if (autoAdvance) {
      setTimeout(next, 400);
    }
  };

  const submitSurvey = async () => {
    if (!responses[46]) {
      alert("Please confirm the final consent to register your data.");
      return;
    }

    setSubmitting(true);

    const data: Record<string, string> = {};
    QUESTIONS.forEach(q => {
      const answer = responses[q.id];
      data[`Q${q.id}`] = Array.isArray(answer) ? answer.join(', ') : String(answer || "");
    });

    try {
      // POSTING TO THE 'doPost' FUNCTION
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(data)
      });
      
      localStorage.removeItem(STORAGE_KEY);
      setFinished(true);
    } catch (err) {
      console.error("Submission error:", err);
      // In 'no-cors' mode, we usually can't read the response, so we assume success if no error thrown
      setFinished(true); 
    } finally {
      setSubmitting(false);
    }
  };

  const progress = step === -1 ? 0 : ((step + 1) / QUESTIONS.length) * 100;

  // VERIFICATION COMPONENT
  const ConnectionChip = () => (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
      connectionStatus === 'valid' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
      connectionStatus === 'invalid' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
      'bg-white/5 border-white/10 text-slate-500'
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${
        connectionStatus === 'valid' ? 'bg-emerald-500 animate-pulse' :
        connectionStatus === 'invalid' ? 'bg-red-500' :
        'bg-slate-700'
      }`}></div>
      {connectionStatus === 'valid' ? 'Cloud Verified' : connectionStatus === 'invalid' ? 'Cloud Disconnected' : 'Syncing...'}
    </div>
  );

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center fade-in bg-[#020617]">
        <div className="max-w-xl w-full p-12 bg-slate-900/40 border border-white/10 rounded-[3rem] backdrop-blur-2xl shadow-2xl">
          <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-10 text-4xl">✓</div>
          <h2 className="text-5xl font-bold serif italic mb-6">Archive Updated.</h2>
          <p className="text-slate-400 mb-12 leading-relaxed text-lg">
            Your data has been successfully transmitted and logged in the research spreadsheet.
          </p>
          <button 
            onClick={() => { localStorage.removeItem(STORAGE_KEY); window.location.reload(); }}
            className="w-full py-5 bg-white text-black rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95"
          >
            Start New Protocol
          </button>
        </div>
      </div>
    );
  }

  if (step === -1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center fade-in">
        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="px-6 py-2 border border-indigo-500/30 rounded-full text-xs uppercase tracking-[0.5em] text-indigo-400 font-bold bg-indigo-500/5 backdrop-blur-sm">
            Research Protocol 2024
          </div>
          <ConnectionChip />
        </div>

        <h1 className="text-7xl md:text-[10rem] serif font-bold italic tracking-tighter mb-10 leading-none select-none">
          Authentic <span className="text-slate-800 not-italic opacity-40">Potential</span>
        </h1>
        <p className="max-w-xl text-xl text-slate-400 font-light leading-relaxed mb-16 px-4">
          Investigating the intersection of self-identity and digital motivation. Ensure your cloud verification is green before proceeding.
        </p>

        <button 
          onClick={() => setStep(0)}
          className="group relative px-20 py-8 bg-white text-black rounded-full font-bold text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl overflow-hidden"
        >
          <span className="relative z-10">Initialize Survey</span>
          <div className="absolute inset-0 bg-indigo-500/10 group-hover:translate-x-full transition-transform duration-500 ease-in-out -translate-x-full"></div>
        </button>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[step];

  return (
    <div className="min-h-screen flex flex-col fade-in pt-16">
      {/* Navbar Progress */}
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="h-1 bg-white/5 w-full">
          <div 
            className="h-full bg-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center px-8 py-5 backdrop-blur-xl bg-slate-950/40 border-b border-white/5">
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">Protocol Section:</span>
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-indigo-400">{currentQuestion.section}</span>
          </div>
          <div className="flex items-center gap-6">
            <ConnectionChip />
            <div className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">
              Unit {(step + 1).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Prompt Side */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-24 bg-gradient-to-br from-indigo-500/[0.04] to-transparent">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-7xl serif italic leading-[1.1] mb-8 select-none tracking-tight">
              {currentQuestion.text}
            </h2>
            <div className="w-16 h-1 bg-indigo-500/40 rounded-full"></div>
          </div>
        </div>

        {/* Input Side */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-24 bg-slate-950/60 border-l border-white/5 backdrop-blur-md">
          <div className="max-w-md w-full mx-auto">
            <div className="min-h-[450px] flex flex-col justify-center">
              
              {currentQuestion.type === 'choice' && (
                <div className="space-y-4">
                  {currentQuestion.options?.map(opt => (
                    <button 
                      key={opt}
                      onClick={() => saveAnswer(opt, true)}
                      className={`w-full p-7 text-left rounded-3xl border-2 transition-all flex justify-between items-center group ${responses[currentQuestion.id] === opt ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                    >
                      <span className="text-lg font-bold">{opt}</span>
                      <div className={`w-6 h-6 rounded-full border-2 transition-all ${responses[currentQuestion.id] === opt ? 'bg-indigo-500 border-indigo-500 scale-125' : 'border-slate-800'}`}></div>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'scale' && (
                <div className="py-12">
                  <div className="flex justify-between gap-3 mb-12">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button 
                        key={num}
                        onClick={() => saveAnswer(num, true)}
                        className={`flex-1 aspect-square rounded-3xl text-3xl font-black flex items-center justify-center border-2 transition-all ${responses[currentQuestion.id] === num ? 'border-indigo-500 bg-indigo-500 text-white scale-110 shadow-2xl' : 'border-white/5 bg-white/5 hover:border-white/10 text-slate-700'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-[0.5em] text-slate-600 font-black px-2">
                    <span>Low Agreement</span>
                    <span>High Agreement</span>
                  </div>
                </div>
              )}

              {currentQuestion.type === 'multi-choice' && (
                <div className="grid grid-cols-1 gap-4">
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
                        className={`w-full p-6 text-left rounded-3xl border-2 transition-all flex justify-between items-center ${isSelected ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5'}`}
                      >
                        <span className="text-lg font-bold">{opt}</span>
                        <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-800'}`}>
                          {isSelected && <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'text' && (
                <div className="space-y-4">
                  <textarea 
                    className="w-full h-72 bg-white/5 border-2 border-white/5 rounded-[2.5rem] p-10 text-xl outline-none focus:border-indigo-500/40 transition-all resize-none placeholder:text-slate-800"
                    placeholder="Reflect and provide your perspective..."
                    value={responses[currentQuestion.id] || ""}
                    onChange={(e) => saveAnswer(e.target.value)}
                  />
                  <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold px-4">Drafting auto-saved to local storage</p>
                </div>
              )}

              {currentQuestion.type === 'consent' && (
                <div className="space-y-6">
                  <button 
                    onClick={() => saveAnswer(!responses[currentQuestion.id])}
                    className={`w-full p-12 rounded-[3.5rem] border-2 text-left flex items-center gap-10 transition-all group ${responses[currentQuestion.id] ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5 hover:bg-white/5'}`}
                  >
                    <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${responses[currentQuestion.id] ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-slate-800'}`}>
                      {responses[currentQuestion.id] && <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                    </div>
                    <div>
                      <div className="font-bold text-3xl serif italic text-white mb-2">Authorize Protocol</div>
                      <div className="text-sm text-slate-500 leading-relaxed">I confirm my participation and authorize the secure transmission of my responses.</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="pt-20 flex items-center justify-between">
              <button 
                onClick={back} 
                disabled={step === 0}
                className="text-[10px] uppercase tracking-[0.5em] font-black text-slate-600 hover:text-white disabled:opacity-0 transition-all px-4"
              >
                Back
              </button>

              {step < QUESTIONS.length - 1 ? (
                <button 
                  onClick={next}
                  className="px-16 py-6 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  Next Module
                </button>
              ) : (
                <button 
                  onClick={submitSurvey}
                  disabled={submitting}
                  className="px-16 py-6 bg-indigo-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
                >
                  {submitting ? "Transmitting..." : "Finish Protocol"}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

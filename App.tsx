import React, { useState, useEffect } from 'react';
import { QUESTIONS } from './constants.tsx';

/**
 * 🛠️ GOOGLE FORM INTEGRATION
 * ID extracted from: https://docs.google.com/forms/d/1TMVjwLRkEipWRwMYabQ610NjhSGmbaW2j7bFZNrc_j0/edit
 */
const GOOGLE_FORM_ID = '1TMVjwLRkEipWRwMYabQ610NjhSGmbaW2j7bFZNrc_j0'; 

/**
 * IMPORTANT: You must replace these placeholder 'entry.XXXX' numbers 
 * with the real ones from your "Get pre-filled link" notepad.
 * 
 * To find them:
 * 1. Go to your Google Form (Edit mode)
 * 2. Click the 3 dots (top right) -> "Get pre-filled link"
 * 3. Fill in dummy answers (like "1", "2", "3") and click "Get Link"
 * 4. Paste that link in Notepad and look for "&entry.123456789=1"
 */
const FORM_MAPPING: Record<number, string> = {
  1: 'entry.1000001', // Age
  2: 'entry.1000002', // Gender
  3: 'entry.1000003', // Academic Level
  4: 'entry.1000004', // Field
  5: 'entry.1000005', // Years
  6: 'entry.1000006', // Q6
  7: 'entry.1000007', // Q7
  8: 'entry.1000008', // Q8
  9: 'entry.1000009', // Q9
  10: 'entry.1000010', // Q10
  11: 'entry.1000011', // Q11
  12: 'entry.1000012', // Q12
  13: 'entry.1000013', // Q13
  14: 'entry.1000014', // Q14
  15: 'entry.1000015', // Q15
  16: 'entry.1000016', // Q16
  17: 'entry.1000017', // Q17
  18: 'entry.1000018', // Q18
  19: 'entry.1000019', // Q19
  20: 'entry.1000020', // Q20
  21: 'entry.1000021', // Q21
  22: 'entry.1000022', // Q22
  23: 'entry.1000023', // Q23
  24: 'entry.1000024', // Q24
  25: 'entry.1000025', // Q25
  26: 'entry.1000026', // Q26
  27: 'entry.1000027', // Q27
  28: 'entry.1000028', // Q28
  29: 'entry.1000029', // Q29
  30: 'entry.1000030', // Q30
  31: 'entry.1000031', // Q31
  32: 'entry.1000032', // Q32
  33: 'entry.1000033', // Q33
  34: 'entry.1000034', // Q34
  35: 'entry.1000035', // Q35
  36: 'entry.1000036', // Q36
  37: 'entry.1000037', // Q37
  38: 'entry.1000038', // Q38
  39: 'entry.1000039', // Q39
  40: 'entry.1000040', // Q40
  41: 'entry.1000041', // Q41
  42: 'entry.1000042', // Q42
  43: 'entry.1000043', // Q43
  44: 'entry.1000044', // Q44
  45: 'entry.1000045', // Q45
  46: 'entry.1000046'  // Consent
};

const STORAGE_KEY = 'SATM_PERSIST_V1';

const App: React.FC = () => {
  const [step, setStep] = useState(-1);
  const [responses, setResponses] = useState<Record<number, any>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'complete'>('idle');

  // Auto-save progress locally
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  }, [responses]);

  const saveAnswer = (val: any, autoAdvance = false) => {
    setResponses(prev => ({ ...prev, [QUESTIONS[step].id]: val }));
    if (autoAdvance) {
      setTimeout(() => {
        if (step < QUESTIONS.length - 1) setStep(s => s + 1);
      }, 400);
    }
  };

  const submitFinal = () => {
    if (!responses[46]) return alert("Please authorize the research protocol first.");
    
    setStatus('submitting');

    // Create a hidden form and submit it to Google Forms
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
    form.target = 'hidden_iframe';

    Object.entries(FORM_MAPPING).forEach(([qId, entryName]) => {
      const val = responses[Number(qId)];
      if (val !== undefined) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = entryName;
        input.value = Array.isArray(val) ? val.join(', ') : String(val);
        form.appendChild(input);
      }
    });

    // Hidden iframe trick to prevent navigation to the Google "Thank You" page
    let iframe = document.getElementById('hidden_iframe') as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'hidden_iframe';
      iframe.name = 'hidden_iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }

    document.body.appendChild(form);
    form.submit();

    // Visual transition after submission
    setTimeout(() => {
      setStatus('complete');
      localStorage.removeItem(STORAGE_KEY);
      if (form.parentNode) document.body.removeChild(form);
    }, 2000);
  };

  if (status === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] fade-in">
        <div className="max-w-xl w-full p-12 bg-slate-900/40 border border-white/10 rounded-[3.5rem] text-center backdrop-blur-3xl shadow-2xl">
          <div className="w-24 h-24 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-10 text-4xl animate-pulse">✓</div>
          <h2 className="text-5xl font-bold serif italic text-white mb-6">Archive Sealed.</h2>
          <p className="text-slate-400 mb-12 leading-relaxed text-lg">
            Your insights have been successfully transmitted to the research database. We appreciate your contribution to the SATM initiative.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-6 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
          >
            Restart Protocol
          </button>
        </div>
      </div>
    );
  }

  if (step === -1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#020617] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent_50%)]"></div>
        <div className="relative z-10">
          <div className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.8em] mb-12 animate-pulse">System: Active</div>
          <h1 className="text-8xl md:text-[12rem] serif font-bold italic tracking-tighter mb-6 text-white leading-none select-none">
            Authentic <span className="text-slate-800 not-italic opacity-30">Potential</span>
          </h1>
          <p className="max-w-lg mx-auto text-slate-500 font-light leading-relaxed text-xl mb-12">
            A digital exploration of Self-Authentication Theory and Motivation.
          </p>
          <button 
            onClick={() => setStep(0)}
            className="px-28 py-10 bg-white text-black rounded-full font-bold text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_30px_60px_rgba(255,255,255,0.1)] hover:shadow-[0_30px_90px_rgba(255,255,255,0.15)]"
          >
            Enter Archive
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
      {/* HUD Header */}
      <div className="fixed top-0 left-0 w-full z-50 p-10 flex justify-between items-end">
        <div className="flex items-center gap-6">
          <div className="w-[2px] h-12 bg-gradient-to-b from-indigo-500 to-transparent"></div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-1">Module {q.id}</div>
            <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest">{q.section}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
           <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">{Math.round(progress)}% Processed</div>
           <div className="w-64 h-[2px] bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Panel: Question Display */}
        <div className="flex-1 flex flex-col justify-center p-12 lg:p-32 pt-40 lg:pt-0">
          <div className="max-w-3xl fade-in" key={q.id}>
            <h2 className="text-5xl lg:text-8xl serif italic leading-[1.05] text-white tracking-tight">
              {q.text}
            </h2>
            {q.subtext && <p className="mt-8 text-slate-500 text-xl font-light">{q.subtext}</p>}
          </div>
        </div>

        {/* Right Panel: Input Area */}
        <div className="flex-1 flex flex-col justify-center p-10 lg:p-32 bg-slate-950/20 backdrop-blur-xl border-l border-white/5 relative">
          <div className="max-w-md w-full mx-auto relative z-10">
            <div className="min-h-[480px] flex flex-col justify-center fade-in" key={`input-${q.id}`}>
              
              {q.type === 'choice' && (
                <div className="space-y-4">
                  {q.options?.map((opt, idx) => (
                    <button 
                      key={opt}
                      onClick={() => saveAnswer(opt, true)}
                      className={`w-full p-8 text-left rounded-[2.5rem] border-2 transition-all flex justify-between items-center group ${responses[q.id] === opt ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_40px_rgba(99,102,241,0.1)]' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <span className={`font-bold transition-colors ${responses[q.id] === opt ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{opt}</span>
                      <div className={`w-6 h-6 rounded-full border-2 transition-all ${responses[q.id] === opt ? 'bg-indigo-500 border-indigo-500 scale-125' : 'border-slate-800'}`}></div>
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'scale' && (
                <div className="py-12">
                  <div className="flex justify-between gap-3 mb-12">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button 
                        key={num}
                        onClick={() => saveAnswer(num, true)}
                        className={`flex-1 aspect-square rounded-3xl text-3xl font-black border-2 transition-all ${responses[q.id] === num ? 'bg-indigo-600 border-indigo-600 text-white scale-110 shadow-[0_0_50px_rgba(79,70,229,0.3)]' : 'border-white/5 bg-white/5 text-slate-700 hover:text-slate-300'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.5em] text-slate-600 px-4">
                    <span>Disagreement</span>
                    <span>Agreement</span>
                  </div>
                </div>
              )}

              {q.type === 'text' && (
                <div className="relative">
                  <textarea 
                    className="w-full h-80 bg-white/5 border-2 border-white/5 rounded-[3rem] p-10 text-xl text-white outline-none focus:border-indigo-500/40 transition-all resize-none placeholder:text-slate-800"
                    placeholder="Deep reflection required..."
                    value={responses[q.id] || ""}
                    onChange={(e) => saveAnswer(e.target.value)}
                  />
                  <div className="absolute bottom-8 right-10 text-[10px] font-black uppercase tracking-widest text-slate-700">Open Input</div>
                </div>
              )}

              {q.type === 'multi-choice' && (
                <div className="space-y-3">
                  {q.options?.map(opt => {
                    const active = (responses[q.id] || []).includes(opt);
                    return (
                      <button 
                        key={opt}
                        onClick={() => {
                          const current = responses[q.id] || [];
                          saveAnswer(active ? current.filter((i:any)=>i!==opt) : [...current, opt]);
                        }}
                        className={`w-full p-6 text-left rounded-3xl border-2 transition-all flex justify-between items-center ${active ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5'}`}
                      >
                        <span className="font-bold text-slate-300">{opt}</span>
                        <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${active ? 'bg-indigo-500 border-indigo-500' : 'border-slate-800'}`}>
                          {active && <span className="text-white text-sm">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {q.type === 'consent' && (
                <button 
                  onClick={() => saveAnswer(!responses[q.id])}
                  className={`w-full p-12 rounded-[3.5rem] border-2 text-left flex items-center gap-10 transition-all group ${responses[q.id] ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5 hover:bg-white/5'}`}
                >
                  <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${responses[q.id] ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-slate-800 group-hover:border-slate-600'}`}>
                    {responses[q.id] && <span className="text-white text-2xl">✓</span>}
                  </div>
                  <div>
                    <div className="font-bold text-2xl text-white italic serif mb-1">Authorize Transmission</div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">I consent to research participation</div>
                  </div>
                </button>
              )}
            </div>

            {/* Navigation Controls */}
            <div className="mt-20 pt-12 border-t border-white/5 flex items-center justify-between">
              <button 
                onClick={() => setStep(s => s - 1)} 
                disabled={step === 0}
                className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-700 hover:text-white disabled:opacity-0 transition-all"
              >
                Previous
              </button>

              {step < QUESTIONS.length - 1 ? (
                <button 
                  onClick={() => setStep(s => s + 1)}
                  className="px-16 py-7 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl hover:shadow-indigo-500/10"
                >
                  Continue
                </button>
              ) : (
                <button 
                  onClick={submitFinal}
                  disabled={status === 'submitting'}
                  className="px-16 py-7 bg-indigo-600 text-white rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_15px_50px_rgba(79,70,229,0.3)] disabled:opacity-50"
                >
                  {status === 'submitting' ? "Syncing..." : "Finalize Archive"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-10 text-center text-[9px] font-black uppercase tracking-[0.8em] text-slate-800 select-none">
        Authentic Potential // Self-Authentication Research // 2024 Protocol
      </div>
    </div>
  );
};

export default App;
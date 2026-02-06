import React, { useState, useEffect } from 'react';
import { QUESTIONS } from './constants.tsx';

/**
 * 🛠️ CORE CONFIGURATION
 * Extracted from your public link: 1FAIpQLSe5QizV-hupWjb6GnBOxOZaMMs9z7b3n-N327oeTp9YblPqOQ
 */
const GOOGLE_FORM_ID = '1FAIpQLSe5QizV-hupWjb6GnBOxOZaMMs9z7b3n-N327oeTp9YblPqOQ'; 

/**
 * 🚨 CRITICAL MAPPING
 * You MUST replace these placeholder numbers (e.g. '1000001') with the 
 * actual numbers from your Google Form "Pre-filled link".
 * 
 * Step 1: In Google Form, click (...) -> "Get pre-filled link"
 * Step 2: Answer every question with a simple number (1, 2, 3...)
 * Step 3: Click "Get Link" and paste it in a notepad.
 * Step 4: Look for &entry.123456789=1. The '123456789' part is what you put here.
 */
const FORM_MAPPING: Record<number, string> = {
  1: 'entry.1071290361', // Age
  2: 'entry.326184573',  // Gender
  3: 'entry.1061016185', // Academic Level
  4: 'entry.1666183569', // Field
  5: 'entry.1443380532', // Years of use
  6: 'entry.1000006', // Q6 ... and so on for all 46 questions
  7: 'entry.1000007', 8: 'entry.1000008', 9: 'entry.1000009', 10: 'entry.1000010',
  11: 'entry.1000011', 12: 'entry.1000012', 13: 'entry.1000013', 14: 'entry.1000014', 15: 'entry.1000015',
  16: 'entry.1000016', 17: 'entry.1000017', 18: 'entry.1000018', 19: 'entry.1000019', 20: 'entry.1000020',
  21: 'entry.1000021', 22: 'entry.1000022', 23: 'entry.1000023', 24: 'entry.1000024', 25: 'entry.1000025',
  26: 'entry.1000026', 27: 'entry.1000027', 28: 'entry.1000028', 29: 'entry.1000029', 30: 'entry.1000030',
  31: 'entry.1000031', 32: 'entry.1000032', 33: 'entry.1000033', 34: 'entry.1000034', 35: 'entry.1000035',
  36: 'entry.1000036', 37: 'entry.1000037', 38: 'entry.1000038', 39: 'entry.1000039', 40: 'entry.1000040',
  41: 'entry.1000041', 42: 'entry.1000042', 43: 'entry.1000043', 44: 'entry.1000044', 45: 'entry.1000045',
  46: 'entry.1000046'
};

const STORAGE_KEY = 'SATM_V2_STORAGE';

const App: React.FC = () => {
  const [step, setStep] = useState(-1);
  const [responses, setResponses] = useState<Record<number, any>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'complete'>('idle');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  }, [responses]);

  const saveAnswer = (val: any, autoAdvance = false) => {
    setResponses(prev => ({ ...prev, [QUESTIONS[step].id]: val }));
    if (autoAdvance) {
      setTimeout(() => {
        if (step < QUESTIONS.length - 1) setStep(s => s + 1);
      }, 450);
    }
  };

  const submitFinal = () => {
    if (!responses[46]) return alert("Research protocol requires explicit consent to proceed.");
    
    setStatus('submitting');

    // Create a form programmatically
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
    form.target = 'hidden_submission_frame';

    // Populate form inputs
    Object.entries(FORM_MAPPING).forEach(([qId, entryName]) => {
      const value = responses[Number(qId)];
      if (value !== undefined) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = entryName;
        input.value = Array.isArray(value) ? value.join(', ') : String(value);
        form.appendChild(input);
      }
    });

    // Create hidden iframe if it doesn't exist
    let iframe = document.getElementById('hidden_submission_frame') as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'hidden_submission_frame';
      iframe.name = 'hidden_submission_frame';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }

    document.body.appendChild(form);
    
    // Submit!
    try {
      form.submit();
    } catch (e) {
      console.error("Submission trigger failed", e);
    }

    // Since we can't detect cross-origin success, we wait for a visual confirmation
    setTimeout(() => {
      setStatus('complete');
      localStorage.removeItem(STORAGE_KEY);
      if (form.parentNode) document.body.removeChild(form);
    }, 2500);
  };

  if (status === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] fade-in">
        <div className="max-w-xl w-full p-16 bg-slate-900/40 border border-white/10 rounded-[4rem] text-center backdrop-blur-3xl shadow-2xl">
          <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-12 text-4xl animate-bounce">✓</div>
          <h2 className="text-6xl font-bold serif italic text-white mb-6">Archive Sealed.</h2>
          <p className="text-slate-400 mb-12 leading-relaxed text-xl font-light">
            Transmission successful. Your data has been integrated into the Self-Authentication research database.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-7 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all"
          >
            New Session
          </button>
        </div>
      </div>
    );
  }

  if (step === -1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#020617] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.08),transparent_70%)]"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-indigo-500 font-black text-[11px] uppercase tracking-[1em] mb-16 animate-pulse">Interface: Operational</div>
          <h1 className="text-[15vw] md:text-[12rem] serif font-bold italic tracking-tighter mb-10 text-white leading-none select-none">
            Authentic <span className="text-slate-900 not-italic opacity-40">Potential</span>
          </h1>
          <p className="max-w-xl mx-auto text-slate-500 font-light leading-relaxed text-2xl mb-16">
            A deep-dive research protocol into human motivation and digital identity curation.
          </p>
          <button 
            onClick={() => setStep(0)}
            className="group relative px-24 py-10 bg-white text-black rounded-full font-bold text-3xl transition-all hover:scale-110 active:scale-95 shadow-[0_40px_80px_rgba(255,255,255,0.05)]"
          >
            Begin Protocol
            <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-0 group-hover:opacity-10"></div>
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 selection:bg-indigo-500/40">
      {/* HUD Bar */}
      <div className="fixed top-0 left-0 w-full z-50 px-12 py-10 flex justify-between items-end backdrop-blur-sm bg-gradient-to-b from-slate-950/50 to-transparent">
        <div className="flex items-center gap-8">
          <div className="w-[1px] h-14 bg-white/20"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 mb-2">Module {q.id.toString().padStart(2, '0')}</span>
            <span className="text-lg font-bold text-indigo-400 uppercase tracking-widest">{q.section}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
           <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">{Math.round(progress)}% Transmission Complete</span>
           <div className="w-80 h-[1px] bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-700 ease-in-out" style={{ width: `${progress}%` }}></div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left: Content */}
        <div className="flex-[1.2] flex flex-col justify-center p-12 lg:p-40 pt-48 lg:pt-0">
          <div className="max-w-4xl fade-in" key={q.id}>
            <h2 className="text-6xl lg:text-9xl serif italic leading-[1] text-white tracking-tight drop-shadow-2xl">
              {q.text}
            </h2>
            {q.subtext && <p className="mt-12 text-slate-500 text-2xl font-light max-w-2xl">{q.subtext}</p>}
          </div>
        </div>

        {/* Right: Interactions */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-32 bg-slate-950/40 backdrop-blur-2xl border-l border-white/5 shadow-[-40px_0_100px_rgba(0,0,0,0.5)]">
          <div className="max-w-lg w-full mx-auto relative">
            <div className="min-h-[500px] flex flex-col justify-center fade-in" key={`input-${q.id}`}>
              
              {q.type === 'choice' && (
                <div className="space-y-5">
                  {q.options?.map((opt, idx) => (
                    <button 
                      key={opt}
                      onClick={() => saveAnswer(opt, true)}
                      className={`w-full p-10 text-left rounded-[3rem] border-2 transition-all flex justify-between items-center group ${responses[q.id] === opt ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                    >
                      <span className={`text-xl font-bold transition-all ${responses[q.id] === opt ? 'text-white translate-x-2' : 'text-slate-500 group-hover:text-slate-300'}`}>{opt}</span>
                      <div className={`w-8 h-8 rounded-full border-2 transition-all ${responses[q.id] === opt ? 'bg-indigo-500 border-indigo-500 scale-125' : 'border-slate-800'}`}></div>
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'scale' && (
                <div className="py-16">
                  <div className="flex justify-between gap-4 mb-16">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button 
                        key={num}
                        onClick={() => saveAnswer(num, true)}
                        className={`flex-1 aspect-square rounded-[2rem] text-4xl font-black border-2 transition-all flex items-center justify-center ${responses[q.id] === num ? 'bg-indigo-600 border-indigo-600 text-white scale-110 shadow-2xl shadow-indigo-500/40' : 'border-white/5 bg-white/5 text-slate-800 hover:text-slate-400'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[12px] font-black uppercase tracking-[0.5em] text-slate-700 px-6">
                    <span>Dissimilar</span>
                    <span>Identical</span>
                  </div>
                </div>
              )}

              {q.type === 'text' && (
                <div className="relative group">
                  <textarea 
                    className="w-full h-96 bg-white/5 border-2 border-white/5 rounded-[4rem] p-12 text-2xl text-white outline-none focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-800"
                    placeholder="Enter deep reflection..."
                    value={responses[q.id] || ""}
                    onChange={(e) => saveAnswer(e.target.value)}
                  />
                  <div className="absolute bottom-10 right-12 text-[10px] font-black uppercase tracking-widest text-slate-700 pointer-events-none group-focus-within:text-indigo-500/50 transition-colors">Digital Input Buffer</div>
                </div>
              )}

              {q.type === 'multi-choice' && (
                <div className="space-y-4">
                  {q.options?.map(opt => {
                    const active = (responses[q.id] || []).includes(opt);
                    return (
                      <button 
                        key={opt}
                        onClick={() => {
                          const current = responses[q.id] || [];
                          saveAnswer(active ? current.filter((i:any)=>i!==opt) : [...current, opt]);
                        }}
                        className={`w-full p-8 text-left rounded-[2.5rem] border-2 transition-all flex justify-between items-center ${active ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5'}`}
                      >
                        <span className="font-bold text-slate-300 text-lg">{opt}</span>
                        <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${active ? 'bg-indigo-500 border-indigo-500' : 'border-slate-800'}`}>
                          {active && <span className="text-white text-lg">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {q.type === 'consent' && (
                <button 
                  onClick={() => saveAnswer(!responses[q.id])}
                  className={`w-full p-14 rounded-[4rem] border-2 text-left flex items-center gap-12 transition-all group ${responses[q.id] ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/5 hover:bg-white/5'}`}
                >
                  <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${responses[q.id] ? 'bg-indigo-500 border-indigo-500 scale-110' : 'border-slate-800'}`}>
                    {responses[q.id] && <span className="text-white text-3xl">✓</span>}
                  </div>
                  <div>
                    <div className="font-bold text-3xl text-white italic serif mb-2">Seal Archive</div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Auth required to transmit</div>
                  </div>
                </button>
              )}
            </div>

            {/* Nav HUD */}
            <div className="mt-24 pt-14 border-t border-white/5 flex items-center justify-between">
              <button 
                onClick={() => setStep(s => s - 1)} 
                disabled={step === 0}
                className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-700 hover:text-white disabled:opacity-0 transition-all px-4 py-2"
              >
                Back
              </button>

              {step < QUESTIONS.length - 1 ? (
                <button 
                  onClick={() => setStep(s => s + 1)}
                  className="px-20 py-8 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.4em] hover:scale-110 active:scale-95 transition-all shadow-2xl"
                >
                  Proceed
                </button>
              ) : (
                <button 
                  onClick={submitFinal}
                  disabled={status === 'submitting'}
                  className="px-20 py-8 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] hover:scale-110 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
                >
                  {status === 'submitting' ? "Transmitting..." : "Sync Protocol"}
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
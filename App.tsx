import React, { useState, useEffect } from 'react';
import { QUESTIONS } from './constants.tsx';

/**
 * 🛠️ CONFIGURATION
 */
const GOOGLE_FORM_BASE_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe5QizV-hupWjb6GnBOxOZaMMs9z7b3n-N327oeTp9YblPqOQ';

// Official Entry IDs provided for all 46 questions
const FORM_MAPPING: Record<number, string> = {
  1: 'entry.1071290361', 2: 'entry.326184573', 3: 'entry.1061016185', 4: 'entry.1666183569', 5: 'entry.1443380532',
  6: 'entry.1618713911', 7: 'entry.1129971170', 8: 'entry.314606889', 9: 'entry.1660632923', 10: 'entry.1145664182',
  11: 'entry.251814733', 12: 'entry.1813740654', 13: 'entry.1518143852', 14: 'entry.725572082', 15: 'entry.1062517478',
  16: 'entry.1187095218', 17: 'entry.1557776103', 18: 'entry.1552978670', 19: 'entry.19578391', 20: 'entry.523311605',
  21: 'entry.1538962669', 22: 'entry.1483922759', 23: 'entry.45645361', 24: 'entry.1451160984', 25: 'entry.1373458939',
  26: 'entry.2120013189', 27: 'entry.1303452281', 28: 'entry.50165232', 29: 'entry.240883325', 30: 'entry.1201893471',
  31: 'entry.882640380', 32: 'entry.141086092', 33: 'entry.1494592236', 34: 'entry.411324695', 35: 'entry.470867287',
  36: 'entry.1078632822', 37: 'entry.1133957921', 38: 'entry.1145582191', 39: 'entry.1932481296', 40: 'entry.1943447158',
  41: 'entry.726853438', 42: 'entry.1599590245', 43: 'entry.2085314761', 44: 'entry.522745442', 45: 'entry.885137032',
  46: 'entry.1350016819'
};

const STORAGE_KEY = 'SATM_SECURE_STORAGE_V7';

const App: React.FC = () => {
  const [step, setStep] = useState(-1);
  const [responses, setResponses] = useState<Record<number, any>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'complete'>('idle');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
    } catch (e) {
      console.warn("Storage quota exceeded or unavailable.");
    }
  }, [responses]);

  const saveAnswer = (val: any, autoAdvance = false) => {
    setResponses(prev => ({ ...prev, [QUESTIONS[step].id]: val }));
    if (autoAdvance && step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(s => s + 1), 400);
    }
  };

  const handleFinalSubmit = () => {
    if (!responses[46]) {
      alert("Please authorize the research protocol by clicking the 'Authorize' button.");
      return;
    }
    
    setStatus('submitting');

    const form = document.createElement('form');
    form.action = `${GOOGLE_FORM_BASE_URL}/formResponse`;
    form.method = 'POST';
    form.target = 'submission_target_frame';

    // Append all responses
    Object.entries(FORM_MAPPING).forEach(([qId, entryName]) => {
      const val = responses[Number(qId)];
      if (val !== undefined) {
        if (Array.isArray(val)) {
          val.forEach(item => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = entryName;
            input.value = String(item);
            form.appendChild(input);
          });
        } else {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = entryName;
          input.value = String(val);
          form.appendChild(input);
        }
      }
    });

    // Essential Google Form hidden fields for multi-page forms
    const addHidden = (name: string, value: string) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    addHidden('pageHistory', '0,1,2,3,4,5,6,7,8,9,10');
    addHidden('fvv', '1');
    addHidden('draftResponse', '[,,,"-1"]');

    document.body.appendChild(form);
    form.submit();
    
    // Smooth transition to completion screen
    setTimeout(() => {
      document.body.removeChild(form);
      setStatus('complete');
      localStorage.removeItem(STORAGE_KEY);
    }, 2500);
  };

  if (status === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[#020617] text-white">
        <div className="max-w-2xl w-full p-16 bg-slate-900/30 border border-white/10 rounded-[4rem] text-center backdrop-blur-3xl shadow-2xl">
          <h2 className="text-7xl serif italic text-white mb-6">Submitted.</h2>
          <p className="text-slate-400 text-2xl font-light mb-12">Transmission confirmed. The <span className="text-indigo-400 font-bold">@ST-research-team</span> values your contribution.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-12 py-6 bg-white text-black rounded-full font-black text-sm uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-xl"
          >
            New Archive
          </button>
        </div>
      </div>
    );
  }

  if (step === -1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#020617] text-center relative">
        <div className="relative z-10">
          <div className="text-indigo-500 font-black text-[11px] uppercase tracking-[1.2em] mb-12 opacity-80">Self-Authentication Theory</div>
          <h1 className="text-[14vw] lg:text-[12rem] serif font-bold italic text-white leading-[0.85] mb-12 select-none tracking-tighter">
            SATM <span className="text-indigo-600 not-italic opacity-90">PROTOCOL</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-2xl lg:text-3xl font-light leading-relaxed mb-16">
            Exploring digital identity and intrinsic motivation with the <span className="text-white font-semibold">@ST-research-team</span>.
          </p>
          <button 
            onClick={() => setStep(0)} 
            className="px-24 py-10 bg-white text-black rounded-full font-black text-3xl hover:scale-110 active:scale-95 transition-all shadow-[0_40px_100px_rgba(255,255,255,0.1)]"
          >
            Access Module
          </button>
        </div>
        <div className="absolute bottom-12 w-full text-center">
            <div className="text-[10px] font-black uppercase tracking-[1em] text-slate-800">@ST-research-team</div>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  if (!q) return null;
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 selection:bg-indigo-500/40">
      <iframe name="submission_target_frame" className="hidden"></iframe>

      {/* Persistent Header */}
      <div className="sticky top-0 w-full z-50 p-6 lg:p-10 flex justify-between items-center bg-[#020617]/90 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="w-[4px] h-12 bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.6)]"></div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Sequence {q.id} of 46</div>
            <div className="text-xl lg:text-2xl font-bold text-indigo-400 uppercase tracking-[0.2em]">{q.section}</div>
          </div>
        </div>
        <div className="hidden lg:block text-right">
           <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{Math.round(progress)}% Transmission</div>
           <div className="w-72 h-[3px] bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${progress}%` }}></div>
           </div>
        </div>
      </div>

      {/* Main Flow Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1700px] mx-auto">
        
        {/* Left Side: Question - Direct and High Contrast */}
        <div className="flex-1 p-8 lg:p-24 lg:pt-32 flex flex-col">
          <div className="fade-in" key={q.id}>
            <h2 className="text-4xl lg:text-[5.5rem] serif italic text-white leading-[1.1] tracking-tight mb-8">
              {q.text}
            </h2>
            {q.subtext && <p className="text-slate-400 text-xl lg:text-3xl font-light leading-relaxed max-w-2xl">{q.subtext}</p>}
          </div>
        </div>

        {/* Right Side: Interactions */}
        <div className="flex-1 p-6 lg:p-20 lg:pt-32 bg-slate-900/10 lg:border-l border-white/5 relative">
          <div className="max-w-xl mx-auto w-full fade-in" key={`input-${q.id}`}>
            
            <div className="min-h-[400px] flex flex-col justify-start">
              {q.type === 'choice' && (
                <div className="space-y-4">
                  {q.options?.map((opt) => (
                    <button 
                      key={opt}
                      onClick={() => saveAnswer(opt, true)}
                      className={`w-full p-8 text-left rounded-[3rem] border-2 transition-all flex justify-between items-center group active:scale-[0.98] ${responses[q.id] === opt ? 'border-indigo-500 bg-indigo-500/15' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                    >
                      <span className={`text-xl lg:text-2xl font-bold ${responses[q.id] === opt ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{opt}</span>
                      <div className={`w-8 h-8 rounded-full border-2 transition-all ${responses[q.id] === opt ? 'bg-indigo-500 border-indigo-500 scale-125 shadow-lg' : 'border-slate-800'}`}></div>
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'scale' && (
                <div className="py-12">
                  <div className="flex justify-between gap-3 mb-16">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button 
                        key={num}
                        onClick={() => saveAnswer(num, true)}
                        className={`flex-1 aspect-square rounded-[2rem] text-4xl lg:text-5xl font-black border-2 transition-all duration-300 flex items-center justify-center active:scale-75 ${responses[q.id] === num ? 'bg-indigo-600 border-indigo-600 text-white scale-[1.3] shadow-[0_25px_60px_rgba(79,70,229,0.5)] z-10' : 'border-white/5 bg-white/5 text-slate-800 hover:text-slate-300'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-600 px-4">
                    <span>Low / Disagree</span>
                    <span>High / Agree</span>
                  </div>
                </div>
              )}

              {q.type === 'text' && (
                <textarea 
                  className="w-full h-80 bg-white/5 border-2 border-white/5 rounded-[3rem] p-10 text-xl lg:text-2xl text-white outline-none focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-800"
                  placeholder="Share your perspective..."
                  value={responses[q.id] || ""}
                  onChange={(e) => saveAnswer(e.target.value)}
                />
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
                        <span className={`text-xl font-bold ${active ? 'text-white' : 'text-slate-500'}`}>{opt}</span>
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
                  className={`w-full p-12 rounded-[4rem] border-2 text-left flex items-center gap-10 transition-all ${responses[q.id] ? 'border-indigo-500 bg-indigo-500/15 shadow-2xl' : 'border-white/10 bg-white/5'}`}
                >
                  <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${responses[q.id] ? 'bg-indigo-500 border-indigo-500 scale-110' : 'border-slate-800'}`}>
                    {responses[q.id] && <span className="text-white text-3xl font-black">✓</span>}
                  </div>
                  <div>
                    <div className="font-bold text-3xl text-white italic serif">Authorize Protocol</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">@ST-research-team data access</div>
                  </div>
                </button>
              )}
            </div>

            {/* Global Nav */}
            <div className="mt-16 pt-12 border-t border-white/5 flex items-center justify-between pb-32 lg:pb-0">
              <button 
                onClick={() => setStep(s => s - 1)} 
                disabled={step === 0}
                className="text-[11px] font-black uppercase tracking-widest text-slate-700 hover:text-white disabled:opacity-0 transition-all py-4 px-4"
              >
                Back
              </button>

              {step < QUESTIONS.length - 1 ? (
                <button 
                  onClick={() => setStep(s => s + 1)}
                  className="px-24 py-9 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.4em] hover:scale-110 transition-all shadow-xl shadow-white/5"
                >
                  Proceed
                </button>
              ) : (
                <button 
                  onClick={handleFinalSubmit}
                  disabled={status === 'submitting'}
                  className="px-24 py-9 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] hover:scale-110 transition-all shadow-2xl shadow-indigo-600/30 disabled:opacity-50"
                >
                  {status === 'submitting' ? "Transmitting..." : "Seal Archive"}
                </button>
              )}
            </div>

            <div className="mt-16 text-center text-[10px] font-black uppercase tracking-[1em] text-slate-800/50 py-4">
              @ST-research-team
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
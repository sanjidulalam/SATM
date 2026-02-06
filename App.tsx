import React, { useState, useEffect } from 'react';
import { QUESTIONS } from './constants.tsx';

/**
 * 🛠️ CONFIGURATION
 */
const GOOGLE_FORM_BASE_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe5QizV-hupWjb6GnBOxOZaMMs9z7b3n-N327oeTp9YblPqOQ';

// Official Entry IDs provided by the user
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

const STORAGE_KEY = 'SATM_RESP_SECURE_V5';

const App: React.FC = () => {
  const [step, setStep] = useState(-1);
  const [responses, setResponses] = useState<Record<number, any>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Storage corruption detected, resetting.");
      return {};
    }
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'complete'>('idle');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  }, [responses]);

  const saveAnswer = (val: any, autoAdvance = false) => {
    setResponses(prev => ({ ...prev, [QUESTIONS[step].id]: val }));
    if (autoAdvance && step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(s => s + 1), 500);
    }
  };

  const handleFinalSubmit = () => {
    if (!responses[46]) return alert("Please authorize the research protocol first.");
    
    setStatus('submitting');

    const form = document.createElement('form');
    form.action = `${GOOGLE_FORM_BASE_URL}/formResponse`;
    form.method = 'POST';
    form.target = 'hidden_iframe_target';

    Object.entries(FORM_MAPPING).forEach(([qId, entryName]) => {
      const val = responses[Number(qId)];
      if (val !== undefined) {
        if (Array.isArray(val)) {
          val.forEach(v => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = entryName;
            input.value = String(v);
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

    // Page history is often required for Google Forms to accept all values in one go
    const pageHistory = document.createElement('input');
    pageHistory.type = 'hidden';
    pageHistory.name = 'pageHistory';
    pageHistory.value = '0,1,2,3,4,5,6,7,8,9,10'; 
    form.appendChild(pageHistory);

    document.body.appendChild(form);
    form.submit();
    
    setTimeout(() => {
      document.body.removeChild(form);
      setStatus('complete');
      localStorage.removeItem(STORAGE_KEY);
    }, 2000);
  };

  if (status === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] text-white">
        <div className="max-w-2xl w-full p-12 bg-slate-900/50 border border-white/10 rounded-[4rem] text-center backdrop-blur-2xl">
          <h2 className="text-6xl serif italic mb-8">Protocol Sealed.</h2>
          <p className="text-slate-400 text-xl mb-12">Your data has been successfully archived by the <span className="text-indigo-400 font-bold">@ST-research-team</span>.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-12 py-6 bg-white text-black rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all"
          >
            Start New
          </button>
        </div>
      </div>
    );
  }

  if (step === -1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#020617]">
        <div className="text-indigo-500 font-black text-xs uppercase tracking-[1em] mb-12">Self-Authentication Theory</div>
        <h1 className="text-[18vw] lg:text-[14rem] serif font-bold italic text-white leading-none tracking-tighter mb-8">
          SATM <span className="text-indigo-600 not-italic opacity-80">PROTOCOL</span>
        </h1>
        <p className="max-w-xl text-slate-400 text-xl lg:text-2xl mb-16 leading-relaxed">
          Uncovering authenticity in the digital age. Research by the <span className="text-white font-bold">@ST-research-team</span>.
        </p>
        <button 
          onClick={() => setStep(0)} 
          className="px-24 py-10 bg-white text-black rounded-full font-bold text-3xl hover:scale-110 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]"
        >
          Access Module
        </button>
        <div className="mt-20 text-[10px] font-black tracking-[0.8em] text-slate-800 uppercase">@ST-research-team</div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 font-sans">
      <iframe name="hidden_iframe_target" className="hidden"></iframe>

      {/* Header */}
      <div className="sticky top-0 w-full z-50 p-6 lg:p-10 flex justify-between items-center bg-slate-950/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="w-[3px] h-10 bg-indigo-500 rounded-full"></div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Protocol Entry {q.id}</div>
            <div className="text-xl font-bold text-indigo-400 uppercase tracking-widest">{q.section}</div>
          </div>
        </div>
        <div className="hidden lg:block text-right">
           <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{Math.round(progress)}% Recorded</div>
           <div className="w-64 h-[2px] bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
           </div>
        </div>
      </div>

      {/* Content Container - No more fixed height sliders */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full px-6 lg:px-12 py-12 lg:py-24 gap-12 lg:gap-24">
        
        {/* Left Side: Question Text - Large and Direct */}
        <div className="flex-1 flex flex-col justify-start pt-12">
          <div className="fade-in" key={q.id}>
            <h2 className="text-4xl lg:text-7xl serif italic text-white leading-tight lg:leading-[1.1] tracking-tight">
              {q.text}
            </h2>
            {q.subtext && <p className="mt-8 text-slate-400 text-xl lg:text-2xl font-light leading-relaxed">{q.subtext}</p>}
          </div>
        </div>

        {/* Right Side: Interaction Panel */}
        <div className="flex-1 flex flex-col justify-start">
          <div className="w-full max-w-xl fade-in pt-12" key={`input-${q.id}`}>
            
            {q.type === 'choice' && (
              <div className="grid grid-cols-1 gap-4">
                {q.options?.map((opt) => (
                  <button 
                    key={opt}
                    onClick={() => saveAnswer(opt, true)}
                    className={`w-full p-7 lg:p-9 text-left rounded-[2.5rem] border-2 transition-all flex justify-between items-center group active:scale-[0.98] ${responses[q.id] === opt ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                  >
                    <span className={`text-xl lg:text-2xl font-bold ${responses[q.id] === opt ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{opt}</span>
                    <div className={`w-8 h-8 rounded-full border-2 transition-all ${responses[q.id] === opt ? 'bg-indigo-500 border-indigo-500 scale-125 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'border-slate-800'}`}></div>
                  </button>
                ))}
              </div>
            )}

            {q.type === 'scale' && (
              <div className="py-8">
                <div className="flex justify-between gap-3 mb-16">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button 
                      key={num}
                      onClick={() => saveAnswer(num, true)}
                      className={`flex-1 aspect-square rounded-3xl lg:rounded-[2.5rem] text-4xl font-black border-2 transition-all duration-300 flex items-center justify-center active:scale-75 ${responses[q.id] === num ? 'bg-indigo-600 border-indigo-600 text-white scale-[1.35] shadow-[0_20px_50px_rgba(79,70,229,0.5)] z-10' : 'border-white/5 bg-white/5 text-slate-800 hover:text-slate-400'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[12px] font-black uppercase tracking-widest text-slate-600 px-4">
                  <span>Strongly Disagree</span>
                  <span>Strongly Agree</span>
                </div>
              </div>
            )}

            {q.type === 'text' && (
              <textarea 
                className="w-full h-80 bg-white/5 border-2 border-white/5 rounded-[3rem] p-10 text-xl lg:text-2xl text-white outline-none focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-800"
                placeholder="Transcribe your thoughts..."
                value={responses[q.id] || ""}
                onChange={(e) => saveAnswer(e.target.value)}
              />
            )}

            {q.type === 'multi-choice' && (
              <div className="grid grid-cols-1 gap-3">
                {q.options?.map(opt => {
                  const active = (responses[q.id] || []).includes(opt);
                  return (
                    <button 
                      key={opt}
                      onClick={() => {
                        const current = responses[q.id] || [];
                        saveAnswer(active ? current.filter((i:any)=>i!==opt) : [...current, opt]);
                      }}
                      className={`w-full p-7 text-left rounded-3xl border-2 transition-all flex justify-between items-center ${active ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5'}`}
                    >
                      <span className={`text-xl font-bold ${active ? 'text-white' : 'text-slate-500'}`}>{opt}</span>
                      <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${active ? 'bg-indigo-500 border-indigo-500' : 'border-slate-800'}`}>
                        {active && <span className="text-white">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === 'consent' && (
              <button 
                onClick={() => saveAnswer(!responses[q.id])}
                className={`w-full p-12 rounded-[4rem] border-2 text-left flex items-center gap-10 transition-all ${responses[q.id] ? 'border-indigo-500 bg-indigo-500/10 shadow-xl shadow-indigo-500/10' : 'border-white/10 bg-white/5'}`}
              >
                <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${responses[q.id] ? 'bg-indigo-500 border-indigo-500 scale-110 shadow-lg' : 'border-slate-800'}`}>
                  {responses[q.id] && <span className="text-white text-3xl font-black">✓</span>}
                </div>
                <div>
                  <div className="font-bold text-2xl text-white italic serif">Authorize Protocol</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">@ST-research-team access</div>
                </div>
              </button>
            )}

            {/* Navigation Buttons */}
            <div className="mt-16 pt-12 border-t border-white/5 flex items-center justify-between">
              <button 
                onClick={() => setStep(s => s - 1)} 
                disabled={step === 0}
                className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-white disabled:opacity-0 transition-all py-4 px-6"
              >
                Back
              </button>

              {step < QUESTIONS.length - 1 ? (
                <button 
                  onClick={() => setStep(s => s + 1)}
                  className="px-20 py-8 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.4em] hover:scale-110 active:scale-95 transition-all shadow-xl"
                >
                  Proceed
                </button>
              ) : (
                <button 
                  onClick={handleFinalSubmit}
                  disabled={status === 'submitting'}
                  className="px-20 py-8 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] hover:scale-110 active:scale-95 transition-all shadow-xl shadow-indigo-600/30 disabled:opacity-50"
                >
                  {status === 'submitting' ? "Transmitting..." : "Sync Archive"}
                </button>
              )}
            </div>

            {/* Signature */}
            <div className="mt-12 text-center text-[11px] font-black uppercase tracking-[1em] text-slate-800 py-4">
              @ST-research-team
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
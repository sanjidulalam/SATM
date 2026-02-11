import React, { useState, useEffect, useRef } from 'react';
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

const STORAGE_KEY = 'SATM_RESPONSES_PRO_V4';

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
    if (autoAdvance && step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(s => s + 1), 600);
    }
  };

  const handleFinalSubmit = () => {
    if (!responses[46]) return alert("Please authorize the research protocol first.");
    
    setStatus('submitting');

    const form = document.createElement('form');
    form.action = `${GOOGLE_FORM_BASE_URL}/formResponse`;
    form.method = 'POST';
    form.target = 'hidden_iframe';
    form.style.display = 'none';

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

    document.body.appendChild(form);
    form.submit();
    
    setTimeout(() => {
      if (form.parentNode) {
        document.body.removeChild(form);
      }
      setStatus('complete');
      localStorage.removeItem(STORAGE_KEY);
    }, 2500);
  };

  // Rendering logic
  const renderContent = () => {
    if (status === 'complete') {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
            <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-indigo-600/20 blur-[150px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-emerald-600/20 blur-[150px] rounded-full animate-pulse delay-700"></div>
          </div>
          <div className="max-w-3xl w-full p-12 lg:p-24 bg-slate-900/60 border border-white/10 rounded-[5rem] text-center backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative z-10">
            <div className="w-32 h-32 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-12 text-6xl shadow-inner border border-white/5 animate-bounce">✨</div>
            <h2 className="text-6xl lg:text-9xl font-bold serif italic text-white mb-10 tracking-tighter">Thank You.</h2>
            <p className="text-slate-300 mb-16 leading-relaxed text-2xl lg:text-3xl font-light">
              Your data has been successfully archived. The <span className="text-indigo-400 font-bold">@ST-research-team</span> values your contribution.
            </p>
            <div className="space-y-6 max-w-sm mx-auto">
              <button onClick={() => window.location.reload()} className="w-full py-8 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.6em] hover:scale-110 active:scale-95 transition-all shadow-2xl">
                Start New Protocol
              </button>
            </div>
            <div className="mt-24 pt-10 border-t border-white/5">
              <div className="text-[12px] font-black uppercase tracking-[1em] text-slate-600">@ST-research-team // Archive Secure</div>
            </div>
          </div>
        </div>
      );
    }

    if (step === -1) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#020617] relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-indigo-500 font-black text-[13px] uppercase tracking-[1.4em] mb-20 animate-pulse">System Status: Active</div>
            <h1 className="text-[20vw] lg:text-[15rem] serif font-bold italic tracking-tighter mb-10 text-white leading-[0.75] select-none">
              Authentic <span className="text-slate-900 not-italic opacity-60">Potential</span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-400 font-light text-2xl lg:text-4xl mb-24 px-4 leading-relaxed">
              A digital research protocol by the <span className="text-white font-semibold">@ST-research-team</span> exploring authenticity.
            </p>
            <button onClick={() => setStep(0)} className="group relative px-40 py-12 bg-white text-black rounded-full font-bold text-4xl hover:scale-110 active:scale-95 transition-all shadow-[0_0_80px_rgba(255,255,255,0.1)] overflow-hidden">
              Access Module
            </button>
          </div>
          <div className="absolute bottom-16 left-0 w-full text-center">
              <div className="text-[14px] font-black uppercase tracking-[1.2em] text-slate-800">@ST-research-team</div>
          </div>
        </div>
      );
    }

    const q = QUESTIONS[step];
    const progress = ((step + 1) / QUESTIONS.length) * 100;

    return (
      <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 selection:bg-indigo-500/30 font-sans">
        <div className="fixed top-0 left-0 w-full z-50 p-8 lg:p-14 flex justify-between items-center bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-transparent backdrop-blur-xl">
          <div className="flex items-center gap-8">
            <div className="w-[4px] h-16 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
            <div>
              <div className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-500 mb-2">Protocol Entry {q.id}</div>
              <div className="text-2xl lg:text-3xl font-bold text-indigo-400 uppercase tracking-[0.2em] leading-none drop-shadow-lg">{q.section}</div>
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-end gap-4">
             <div className="text-[12px] font-black text-slate-400 uppercase tracking-[0.6em]">{Math.round(progress)}% Transmission Complete</div>
             <div className="w-96 h-[4px] bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
             </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row h-screen pt-48 lg:pt-0 overflow-hidden relative">
          <div className="flex-[1.5] flex flex-col justify-center p-10 lg:p-48 overflow-y-auto lg:mt-12 mt-4">
            <div className="max-w-5xl fade-in" key={q.id}>
              <h2 className="text-5xl lg:text-[7.5rem] lg:leading-[0.95] serif italic text-white tracking-tighter">
                {q.text}
              </h2>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center p-8 lg:p-28 bg-slate-950/70 backdrop-blur-3xl border-l border-white/5 shadow-[-80px_0_200px_rgba(0,0,0,0.8)] relative z-20">
            <div className="max-w-xl w-full mx-auto flex flex-col h-full justify-center">
              <div className="min-h-[550px] flex flex-col justify-center fade-in py-16" key={`input-${q.id}`}>
                {q.type === 'choice' && (
                  <div className="space-y-5">
                    {q.options?.map((opt) => (
                      <button key={opt} onClick={() => saveAnswer(opt, true)} className={`w-full p-9 lg:p-11 text-left rounded-[3.5rem] border-2 transition-all flex justify-between items-center group active:scale-95 shadow-xl ${responses[q.id] === opt ? 'border-indigo-500 bg-indigo-500/15 shadow-[0_0_40px_rgba(99,102,241,0.25)]' : 'border-white/5 bg-white/5 hover:border-white/10'}`}>
                        <span className={`text-2xl lg:text-3xl font-bold transition-all ${responses[q.id] === opt ? 'text-white translate-x-4' : 'text-slate-500'}`}>{opt}</span>
                        <div className={`w-10 h-10 rounded-full border-2 transition-all duration-500 ${responses[q.id] === opt ? 'bg-indigo-500 border-indigo-500 scale-150 shadow-[0_0_20px_rgba(99,102,241,0.6)]' : 'border-slate-800'}`}></div>
                      </button>
                    ))}
                  </div>
                )}
                {q.type === 'scale' && (
                  <div className="py-20">
                    <div className="flex justify-between gap-5 mb-24">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button key={num} onClick={() => saveAnswer(num, true)} className={`flex-1 aspect-square rounded-[2rem] lg:rounded-[3rem] text-5xl lg:text-6xl font-black border-2 transition-all duration-300 flex items-center justify-center active:scale-[0.7] ${responses[q.id] === num ? 'bg-indigo-600 border-indigo-600 text-white scale-150 shadow-[0_40px_80px_rgba(79,70,229,0.6)] z-20 ring-4 ring-white/10' : 'border-white/5 bg-white/5 text-slate-800 hover:text-slate-300 hover:scale-110'}`}>{num}</button>
                      ))}
                    </div>
                    <div className="flex justify-between text-[15px] font-black uppercase tracking-[0.8em] text-slate-600 px-8">
                      <span className="text-indigo-500/60">Strongly Disagree</span>
                      <span className="text-indigo-500/60">Strongly Agree</span>
                    </div>
                  </div>
                )}
                {q.type === 'text' && (
                  <textarea className="w-full h-[32rem] bg-white/[0.04] border-2 border-white/10 rounded-[5rem] p-16 text-3xl text-white outline-none focus:border-indigo-500/80 focus:bg-white/[0.08] transition-all resize-none placeholder:text-slate-800 shadow-inner" placeholder="Reflect and transmit..." value={responses[q.id] || ""} onChange={(e) => saveAnswer(e.target.value)} />
                )}
                {q.type === 'multi-choice' && (
                  <div className="space-y-5">
                    {q.options?.map(opt => {
                      const active = (responses[q.id] || []).includes(opt);
                      return (
                        <button key={opt} onClick={() => {
                          const current = responses[q.id] || [];
                          saveAnswer(active ? current.filter((i:any)=>i!==opt) : [...current, opt]);
                        }} className={`w-full p-10 text-left rounded-[3rem] border-2 transition-all flex justify-between items-center active:scale-[0.98] ${active ? 'border-indigo-500 bg-indigo-500/15 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-white/5 bg-white/5 hover:border-white/15'}`}>
                          <span className={`text-2xl font-bold transition-all ${active ? 'text-white' : 'text-slate-400'}`}>{opt}</span>
                          <div className={`w-12 h-12 rounded-[1.5rem] border-2 flex items-center justify-center transition-all duration-500 ${active ? 'bg-indigo-500 border-indigo-500 scale-110' : 'border-slate-800'}`}>{active && <span className="text-white text-2xl font-black">✓</span>}</div>
                        </button>
                      );
                    })}
                  </div>
                )}
                {q.type === 'consent' && (
                  <button onClick={() => saveAnswer(!responses[q.id])} className={`w-full p-16 rounded-[6rem] border-2 text-left flex items-center gap-14 transition-all active:scale-[0.97] group ${responses[q.id] ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_60px_rgba(16,185,129,0.2)]' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                    <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-700 ${responses[q.id] ? 'bg-emerald-500 border-emerald-500 scale-125 shadow-2xl' : 'border-slate-800'}`}>{responses[q.id] && <span className="text-white text-5xl">✓</span>}</div>
                    <div><div className="font-bold text-4xl text-white italic serif mb-3 tracking-tight">Final Authorization</div><div className="text-[13px] text-slate-500 font-black uppercase tracking-[0.6em]">Grant @ST-research-team permission</div></div>
                  </button>
                )}
              </div>

              <div className="mt-12 py-16 border-t border-white/5 flex items-center justify-between">
                <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="text-[14px] font-black uppercase tracking-[1em] text-slate-700 hover:text-white disabled:opacity-0 transition-all px-8 py-4">Back</button>
                {step < QUESTIONS.length - 1 ? (
                  <button onClick={() => setStep(s => s + 1)} className="px-24 lg:px-32 py-10 bg-white text-black rounded-full font-black text-sm uppercase tracking-[0.6em] hover:scale-110 transition-all">Proceed</button>
                ) : (
                  <button onClick={handleFinalSubmit} disabled={status === 'submitting'} className="px-24 lg:px-32 py-10 bg-indigo-600 text-white rounded-full font-black text-sm uppercase tracking-[0.6em] hover:scale-110 transition-all disabled:opacity-50">
                    {status === 'submitting' ? "Transmitting..." : "Seal Archive"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* PERSISTENT HIDDEN IFRAME: Never unmounted so submission can complete */}
      <iframe 
        name="hidden_iframe" 
        id="hidden_iframe" 
        style={{ display: 'none', position: 'absolute', width: 0, height: 0, border: 0 }}
      ></iframe>
      {renderContent()}
    </>
  );
};

export default App;
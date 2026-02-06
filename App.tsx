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

const STORAGE_KEY = 'SATM_RESPONSES_PRO_FINAL';

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

    // Create a hidden form for submission
    const form = document.createElement('form');
    form.action = `${GOOGLE_FORM_BASE_URL}/formResponse`;
    form.method = 'POST';
    form.target = 'hidden_iframe';

    // Add all 46 answers
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

    // CRITICAL: Google Forms often need pageHistory for multi-page forms to accept all fields
    const pageHistory = document.createElement('input');
    pageHistory.type = 'hidden';
    pageHistory.name = 'pageHistory';
    pageHistory.value = '0,1,2,3,4,5,6,7,8'; // Assuming multiple pages to cover all 46 entries
    form.appendChild(pageHistory);

    document.body.appendChild(form);
    form.submit();
    
    setTimeout(() => {
      document.body.removeChild(form);
      setStatus('complete');
      localStorage.removeItem(STORAGE_KEY);
    }, 2500);
  };

  if (status === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] fade-in relative overflow-hidden">
        <div className="max-w-3xl w-full p-16 lg:p-24 bg-slate-900/60 border border-white/10 rounded-[5rem] text-center backdrop-blur-3xl shadow-2xl z-10">
          <div className="w-28 h-28 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-10 text-5xl shadow-inner border border-white/5 animate-pulse">✨</div>
          <h2 className="text-6xl lg:text-9xl font-bold serif italic text-white mb-8 tracking-tighter">Thank You.</h2>
          <p className="text-slate-300 mb-12 leading-relaxed text-2xl font-light">
            Your data has been securely archived. The <span className="text-indigo-400 font-bold">@ST-research-team</span> values your contribution to the SATM study.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-24 py-8 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.5em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
          >
            Finish Protocol
          </button>
          <div className="mt-20 pt-10 border-t border-white/5 text-[12px] font-black uppercase tracking-[1em] text-slate-600">
            @ST-research-team
          </div>
        </div>
      </div>
    );
  }

  if (step === -1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#020617] relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-indigo-500 font-black text-[13px] uppercase tracking-[1.4em] mb-16 animate-pulse">Self-Authentication Theory of Motivation</div>
          <h1 className="text-[22vw] lg:text-[16rem] serif font-bold italic tracking-tighter mb-8 text-white leading-[0.75] select-none">
            SATM <span className="text-slate-900 not-italic opacity-60">Protocol</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 font-light text-2xl lg:text-4xl mb-20 px-4 leading-relaxed">
            Exploring human digital identity and motivation. 
            A research project by the <span className="text-white font-semibold">@ST-research-team</span>.
          </p>
          <button 
            onClick={() => setStep(0)} 
            className="group px-44 py-12 bg-white text-black rounded-full font-bold text-4xl hover:scale-110 active:scale-95 transition-all shadow-[0_0_80px_rgba(255,255,255,0.15)]"
          >
            Access Module
          </button>
        </div>
        <div className="absolute bottom-12 left-0 w-full text-center">
            <div className="text-[14px] font-black uppercase tracking-[1.2em] text-slate-800">@ST-research-team</div>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 selection:bg-indigo-500/30 font-sans relative">
      <iframe name="hidden_iframe" className="hidden"></iframe>

      {/* Header - Fixed & High Contrast */}
      <div className="fixed top-0 left-0 w-full z-50 p-8 lg:p-12 flex justify-between items-center bg-slate-950/90 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="w-[4px] h-12 bg-indigo-500 rounded-full"></div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 mb-1">Sequence {q.id}</div>
            <div className="text-xl lg:text-2xl font-bold text-indigo-400 uppercase tracking-widest">{q.section}</div>
          </div>
        </div>
        <div className="hidden lg:flex flex-col items-end gap-3">
           <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em]">{Math.round(progress)}% Recorded</div>
           <div className="w-80 h-[3px] bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${progress}%` }}></div>
           </div>
        </div>
      </div>

      {/* Main Container - No scroll on left side */}
      <div className="flex-1 flex flex-col lg:flex-row h-screen pt-40 lg:pt-0 overflow-hidden relative">
        
        {/* Left Side: Question (Fixed text, no sliders) */}
        <div className="flex-[1.4] flex flex-col justify-center p-12 lg:p-40 relative z-10">
          <div className="max-w-5xl fade-in" key={q.id}>
            <h2 className="text-4xl lg:text-[6.5rem] lg:leading-[1.05] serif italic text-white tracking-tighter drop-shadow-2xl">
              {q.text}
            </h2>
            {q.subtext && <p className="mt-12 text-slate-400 text-2xl lg:text-3xl font-light leading-relaxed max-w-3xl">{q.subtext}</p>}
          </div>
        </div>

        {/* Right Side: Interaction Panel */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-24 bg-slate-950/70 backdrop-blur-3xl border-l border-white/10 shadow-[-100px_0_200px_rgba(0,0,0,0.8)] relative z-20">
          <div className="max-w-xl w-full mx-auto flex flex-col h-full justify-center py-20">
            <div className="min-h-[500px] flex flex-col justify-center fade-in" key={`input-${q.id}`}>
              
              {q.type === 'choice' && (
                <div className="space-y-4">
                  {q.options?.map((opt) => (
                    <button 
                      key={opt}
                      onClick={() => saveAnswer(opt, true)}
                      className={`w-full p-8 text-left rounded-[3rem] border-2 transition-all flex justify-between items-center group active:scale-95 ${responses[q.id] === opt ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                    >
                      <span className={`text-xl lg:text-2xl font-bold ${responses[q.id] === opt ? 'text-white' : 'text-slate-500'}`}>{opt}</span>
                      <div className={`w-8 h-8 rounded-full border-2 ${responses[q.id] === opt ? 'bg-indigo-500 border-indigo-500 scale-125 shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'border-slate-800'}`}></div>
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'scale' && (
                <div className="py-16">
                  <div className="flex justify-between gap-5 mb-24">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button 
                        key={num}
                        onClick={() => saveAnswer(num, true)}
                        className={`flex-1 aspect-square rounded-[2rem] lg:rounded-[3rem] text-4xl lg:text-6xl font-black border-2 transition-all duration-300 flex items-center justify-center active:scale-[0.8] ${responses[q.id] === num ? 'bg-indigo-600 border-indigo-600 text-white scale-[1.4] shadow-[0_30px_70px_rgba(79,70,229,0.7)] z-10' : 'border-white/5 bg-white/5 text-slate-800 hover:text-slate-300'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[14px] font-black uppercase tracking-[0.8em] text-slate-600 px-8">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              )}

              {q.type === 'text' && (
                <textarea 
                  className="w-full h-96 bg-white/[0.03] border-2 border-white/5 rounded-[4rem] p-12 text-2xl text-white outline-none focus:border-indigo-500/60 transition-all resize-none placeholder:text-slate-800"
                  placeholder="Reflection buffer..."
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
                        <span className={`text-xl font-bold ${active ? 'text-white' : 'text-slate-400'}`}>{opt}</span>
                        <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${active ? 'bg-indigo-500 border-indigo-500' : 'border-slate-800'}`}>
                          {active && <span className="text-white text-xl">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {q.type === 'consent' && (
                <button 
                  onClick={() => saveAnswer(!responses[q.id])}
                  className={`w-full p-16 rounded-[6rem] border-2 text-left flex items-center gap-12 transition-all active:scale-[0.97] ${responses[q.id] ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 bg-white/5'}`}
                >
                  <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${responses[q.id] ? 'bg-emerald-500 border-emerald-500 scale-125 shadow-xl' : 'border-slate-800'}`}>
                    {responses[q.id] && <span className="text-white text-4xl font-black">✓</span>}
                  </div>
                  <div>
                    <div className="font-bold text-3xl text-white italic serif mb-2">Seal Entry</div>
                    <div className="text-[12px] text-slate-500 font-black uppercase tracking-[0.5em]">Authorize @ST-research-team access</div>
                  </div>
                </button>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="mt-16 py-12 border-t border-white/5 flex items-center justify-between">
              <button 
                onClick={() => setStep(s => s - 1)} 
                disabled={step === 0}
                className="text-[13px] font-black uppercase tracking-[1em] text-slate-700 hover:text-white disabled:opacity-0 transition-all px-8 py-2"
              >
                Back
              </button>

              {step < QUESTIONS.length - 1 ? (
                <button 
                  onClick={() => setStep(s => s + 1)}
                  className="px-24 py-9 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.5em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
                >
                  Proceed
                </button>
              ) : (
                <button 
                  onClick={handleFinalSubmit}
                  disabled={status === 'submitting'}
                  className="px-24 py-9 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-[0.5em] hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
                >
                  {status === 'submitting' ? "Transmitting..." : "Sync Archive"}
                </button>
              )}
            </div>
            
            <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
              <span className="text-[13px] font-black uppercase tracking-[1.4em] text-slate-800">
                @ST-research-team
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
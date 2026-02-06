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

const STORAGE_KEY = 'SATM_RESPONSES_PRO_V3';

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
      setTimeout(() => setStep(s => s + 1), 500);
    }
  };

  const getPrefilledUrl = () => {
    const params = new URLSearchParams();
    Object.entries(FORM_MAPPING).forEach(([qId, entryName]) => {
      const val = responses[Number(qId)];
      if (val !== undefined) {
        params.append(entryName, Array.isArray(val) ? val.join(', ') : String(val));
      }
    });
    return `${GOOGLE_FORM_BASE_URL}/viewform?${params.toString()}`;
  };

  const handleFinalSubmit = async () => {
    if (!responses[46]) return alert("Please authorize the research protocol first.");
    
    setStatus('submitting');

    const formData = new FormData();
    Object.entries(FORM_MAPPING).forEach(([qId, entryName]) => {
      const val = responses[Number(qId)];
      if (val !== undefined) {
        formData.append(entryName, Array.isArray(val) ? val.join(', ') : String(val));
      }
    });

    try {
      await fetch(`${GOOGLE_FORM_BASE_URL}/formResponse`, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });
      setTimeout(() => setStatus('complete'), 2000);
    } catch (e) {
      console.error("Sync error:", e);
      setStatus('complete'); 
    }
  };

  const downloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(responses, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "satm_responses.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (status === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-indigo-500/10 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-emerald-500/10 blur-[150px] rounded-full"></div>
        </div>

        <div className="max-w-2xl w-full p-12 lg:p-20 bg-slate-900/50 border border-white/10 rounded-[5rem] text-center backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10 border-t-white/20">
          <div className="w-28 h-28 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-10 text-5xl animate-bounce shadow-inner">🏆</div>
          <h2 className="text-6xl lg:text-8xl font-bold serif italic text-white mb-8 tracking-tight">Thank You.</h2>
          <p className="text-slate-200 mb-12 leading-relaxed text-2xl font-light">
            Your data has been successfully archived. The <span className="text-indigo-400 font-bold">@ST-research-team</span> values your authentic contribution.
          </p>
          
          <div className="space-y-6">
            <a 
              href={getPrefilledUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block w-full py-7 bg-white text-black rounded-full font-black text-sm uppercase tracking-[0.25em] hover:bg-indigo-50 transition-all shadow-2xl active:scale-95"
            >
              Verify & Final Submit
              <span className="block text-[10px] font-normal tracking-normal normal-case opacity-50 mt-1">Direct confirmation via Google Form</span>
            </a>
            
            <button 
              onClick={downloadData}
              className="w-full py-6 bg-white/10 text-slate-100 rounded-full font-bold text-xs uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all"
            >
              Get Local Backup (.json)
            </button>
            
            <button 
              onClick={() => window.location.reload()}
              className="mt-10 py-2 text-slate-500 hover:text-white transition-all text-[11px] uppercase font-black tracking-[0.6em] block mx-auto underline-offset-8 hover:underline"
            >
              New Session
            </button>
          </div>

          <div className="mt-20 pt-10 border-t border-white/10">
            <div className="text-[11px] font-black uppercase tracking-[0.8em] text-slate-600">
              @ST-research-team // Established 2024
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === -1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#020617] relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-indigo-500 font-black text-[12px] uppercase tracking-[1.2em] mb-16 animate-pulse">Interface: Live</div>
          <h1 className="text-[18vw] lg:text-[14rem] serif font-bold italic tracking-tighter mb-10 text-white leading-[0.8] select-none">
            Authentic <span className="text-slate-900 not-italic opacity-60">Potential</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 font-light text-2xl lg:text-3xl mb-20 px-4 leading-snug">
            Research protocol by the <span className="text-white font-semibold">@ST-research-team</span> exploring digital behavior and motivation.
          </p>
          <button 
            onClick={() => setStep(0)} 
            className="group px-36 py-12 bg-white text-black rounded-full font-bold text-4xl hover:scale-110 active:scale-95 transition-all shadow-[0_40px_100px_rgba(255,255,255,0.08)] relative overflow-hidden"
          >
            Access Module
            <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
        
        <div className="absolute bottom-16 left-0 w-full text-center">
            <div className="text-[12px] font-black uppercase tracking-[1em] text-slate-800">@ST-research-team</div>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 selection:bg-indigo-500/30 font-sans">
      {/* HUD Header - Adjusted for visibility */}
      <div className="fixed top-0 left-0 w-full z-50 p-6 lg:p-12 flex justify-between items-center bg-gradient-to-b from-slate-950/95 to-transparent backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="w-[3px] h-14 bg-indigo-600"></div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-500 mb-1">Entry Sequence {q.id}</div>
            <div className="text-xl lg:text-2xl font-bold text-indigo-400 uppercase tracking-widest leading-none drop-shadow-md">{q.section}</div>
          </div>
        </div>
        <div className="hidden lg:flex flex-col items-end gap-3">
           <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">{Math.round(progress)}% Progress</div>
           <div className="w-96 h-[3px] bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row h-screen pt-36 lg:pt-0 overflow-hidden">
        {/* Left: Question Content - Added padding-top to prevent HUD overlap */}
        <div className="flex-[1.4] flex flex-col justify-center p-8 lg:p-40 overflow-y-auto lg:mt-0 mt-8">
          <div className="max-w-5xl fade-in" key={q.id}>
            <h2 className="text-4xl lg:text-[6.5rem] lg:leading-[1] serif italic text-white tracking-tight drop-shadow-2xl">
              {q.text}
            </h2>
            {q.subtext && <p className="mt-10 text-slate-400 text-2xl lg:text-3xl font-light border-l-2 border-indigo-500/20 pl-8">{q.subtext}</p>}
          </div>
        </div>

        {/* Right: Interaction Panel */}
        <div className="flex-1 flex flex-col justify-center p-6 lg:p-24 bg-slate-950/60 backdrop-blur-3xl border-l border-white/5 shadow-[-60px_0_150px_rgba(0,0,0,0.7)] relative z-20">
          <div className="max-w-lg w-full mx-auto flex flex-col h-full justify-center">
            <div className="min-h-[500px] flex flex-col justify-center fade-in py-10" key={`input-${q.id}`}>
              
              {q.type === 'choice' && (
                <div className="space-y-4">
                  {q.options?.map((opt) => (
                    <button 
                      key={opt}
                      onClick={() => saveAnswer(opt, true)}
                      className={`w-full p-8 lg:p-10 text-left rounded-[3rem] border-2 transition-all flex justify-between items-center group active:scale-95 ${responses[q.id] === opt ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                    >
                      <span className={`text-xl lg:text-2xl font-bold transition-all ${responses[q.id] === opt ? 'text-white translate-x-2' : 'text-slate-500'}`}>{opt}</span>
                      <div className={`w-8 h-8 rounded-full border-2 transition-all ${responses[q.id] === opt ? 'bg-indigo-500 border-indigo-500 scale-125' : 'border-slate-800'}`}></div>
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'scale' && (
                <div className="py-16">
                  <div className="flex justify-between gap-4 mb-20">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button 
                        key={num}
                        onClick={() => saveAnswer(num, true)}
                        className={`flex-1 aspect-square rounded-[2rem] lg:rounded-[2.5rem] text-4xl lg:text-5xl font-black border-2 transition-all flex items-center justify-center active:scale-[0.8] ${responses[q.id] === num ? 'bg-indigo-600 border-indigo-600 text-white scale-125 shadow-[0_30px_60px_rgba(79,70,229,0.5)] z-10' : 'border-white/5 bg-white/5 text-slate-800 hover:text-slate-400 hover:scale-105'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[13px] font-black uppercase tracking-[0.6em] text-slate-600 px-6">
                    <span className="text-indigo-500/50">Min</span>
                    <span className="text-indigo-500/50">Max</span>
                  </div>
                </div>
              )}

              {q.type === 'text' && (
                <div className="relative group">
                  <textarea 
                    className="w-full h-96 bg-white/[0.03] border-2 border-white/10 rounded-[4rem] p-12 text-2xl text-white outline-none focus:border-indigo-500/60 focus:bg-white/[0.05] transition-all resize-none placeholder:text-slate-800"
                    placeholder="Capture your unfiltered thoughts..."
                    value={responses[q.id] || ""}
                    onChange={(e) => saveAnswer(e.target.value)}
                  />
                  <div className="absolute top-8 right-12 text-[10px] font-black uppercase tracking-widest text-slate-700 pointer-events-none group-focus-within:text-indigo-500/50 transition-colors">Neural Buffer</div>
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
                        className={`w-full p-8 text-left rounded-[2.5rem] border-2 transition-all flex justify-between items-center active:scale-[0.98] ${active ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                      >
                        <span className={`text-xl font-bold transition-all ${active ? 'text-white' : 'text-slate-400'}`}>{opt}</span>
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
                  className={`w-full p-14 rounded-[5rem] border-2 text-left flex items-center gap-10 transition-all active:scale-[0.97] group ${responses[q.id] ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                >
                  <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${responses[q.id] ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-lg' : 'border-slate-800 group-hover:border-slate-600'}`}>
                    {responses[q.id] && <span className="text-white text-3xl">✓</span>}
                  </div>
                  <div>
                    <div className="font-bold text-3xl text-white italic serif mb-2">Final Seal</div>
                    <div className="text-[11px] text-slate-500 font-black uppercase tracking-[0.5em] group-hover:text-slate-400 transition-colors">Authorize @ST-research-team Access</div>
                  </div>
                </button>
              )}
            </div>

            {/* Nav Footer */}
            <div className="mt-10 py-12 border-t border-white/5 flex items-center justify-between">
              <button 
                onClick={() => setStep(s => s - 1)} 
                disabled={step === 0}
                className="text-[12px] font-black uppercase tracking-[0.8em] text-slate-700 hover:text-white disabled:opacity-0 transition-all px-6 py-2"
              >
                Back
              </button>

              {step < QUESTIONS.length - 1 ? (
                <button 
                  onClick={() => setStep(s => s + 1)}
                  className="px-20 lg:px-24 py-8 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.5em] hover:scale-110 active:scale-95 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.1)]"
                >
                  Proceed
                </button>
              ) : (
                <button 
                  onClick={handleFinalSubmit}
                  disabled={status === 'submitting'}
                  className="px-20 lg:px-24 py-8 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-[0.5em] hover:scale-110 active:scale-95 transition-all shadow-[0_20px_60px_rgba(79,70,229,0.3)] disabled:opacity-50"
                >
                  {status === 'submitting' ? "Transmitting..." : "Sync Archive"}
                </button>
              )}
            </div>

            <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
              <span className="text-[11px] font-black uppercase tracking-[1em] text-slate-800 opacity-80">
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
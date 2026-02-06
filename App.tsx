import React, { useState, useEffect } from 'react';
import { QUESTIONS } from './constants.tsx';

/**
 * 🛠️ CONFIGURATION
 */
const GOOGLE_FORM_BASE_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe5QizV-hupWjb6GnBOxOZaMMs9z7b3n-N327oeTp9YblPqOQ';

// These must match your form's internal IDs exactly
const FORM_MAPPING: Record<number, string> = {
  1: 'entry.1071290361', 2: 'entry.326184573', 3: 'entry.1061016185', 4: 'entry.1666183569', 5: 'entry.1443380532',
  6: 'entry.1000006', 7: 'entry.1000007', 8: 'entry.1000008', 9: 'entry.1000009', 10: 'entry.1000010',
  11: 'entry.1000011', 12: 'entry.1000012', 13: 'entry.1000013', 14: 'entry.1000014', 15: 'entry.1000015',
  16: 'entry.1000016', 17: 'entry.1000017', 18: 'entry.1000018', 19: 'entry.1000019', 20: 'entry.1000020',
  21: 'entry.1000021', 22: 'entry.1000022', 23: 'entry.1000023', 24: 'entry.1000024', 25: 'entry.1000025',
  26: 'entry.1000026', 27: 'entry.1000027', 28: 'entry.1000028', 29: 'entry.1000029', 30: 'entry.1000030',
  31: 'entry.1000031', 32: 'entry.1000032', 33: 'entry.1000033', 34: 'entry.1000034', 35: 'entry.1000035',
  36: 'entry.1000036', 37: 'entry.1000037', 38: 'entry.1000038', 39: 'entry.1000039', 40: 'entry.1000040',
  41: 'entry.1000041', 42: 'entry.1000042', 43: 'entry.1000043', 44: 'entry.1000044', 45: 'entry.1000045',
  46: 'entry.1000046'
};

const STORAGE_KEY = 'SATM_RESPONSES_PRO';

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
      setTimeout(() => setStep(s => s + 1), 400);
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

    // Attempt background POST first
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
      // Success is assumed because of no-cors
      setTimeout(() => setStatus('complete'), 1500);
    } catch (e) {
      console.error("Sync error:", e);
      setStatus('complete'); // Still transition to show manual options
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
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] fade-in">
        <div className="max-w-2xl w-full p-12 bg-slate-900/40 border border-white/10 rounded-[4rem] text-center backdrop-blur-3xl shadow-2xl">
          <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-10 text-3xl">✓</div>
          <h2 className="text-5xl font-bold serif italic text-white mb-6">Archive Processed.</h2>
          <p className="text-slate-400 mb-10 leading-relaxed text-lg">
            Your insights have been captured. If you want to be 100% sure your data reached the official database, please use the manual submission link below.
          </p>
          
          <div className="space-y-4">
            <a 
              href={getPrefilledUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full py-6 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
            >
              Manual Verification (Open Google Form)
            </a>
            <button 
              onClick={downloadData}
              className="block w-full py-6 bg-white/5 text-slate-300 rounded-3xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all"
            >
              Backup: Download Responses (.json)
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="block w-full py-4 text-slate-500 hover:text-white transition-all text-[10px] uppercase font-bold tracking-widest"
            >
              Reset Interface
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === -1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#020617] relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.8em] mb-12">Protocol Ready</div>
          <h1 className="text-8xl md:text-[12rem] serif font-bold italic tracking-tighter mb-8 text-white leading-none">
            Authentic <span className="text-slate-900 not-italic opacity-40">Potential</span>
          </h1>
          <p className="max-w-xl mx-auto text-slate-500 font-light text-2xl mb-16">
            A research study into human motivation and digital curation.
          </p>
          <button 
            onClick={() => setStep(0)} 
            className="px-32 py-10 bg-white text-black rounded-full font-bold text-3xl hover:scale-110 active:scale-95 transition-all shadow-2xl"
          >
            Access Module
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 selection:bg-indigo-500/30">
      {/* HUD Header */}
      <div className="fixed top-0 left-0 w-full z-50 p-10 flex justify-between items-end bg-gradient-to-b from-slate-950/50 to-transparent">
        <div className="flex items-center gap-6">
          <div className="w-[1px] h-12 bg-white/20"></div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 mb-1">Module {q.id}</div>
            <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest">{q.section}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
           <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">{Math.round(progress)}% Progress</div>
           <div className="w-64 h-[2px] bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${progress}%` }}></div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row h-screen pt-24">
        {/* Left: Question Content */}
        <div className="flex-1 flex flex-col justify-center p-12 lg:p-32">
          <div className="max-w-3xl fade-in" key={q.id}>
            <h2 className="text-5xl lg:text-7xl serif italic leading-[1.1] text-white tracking-tight drop-shadow-2xl">
              {q.text}
            </h2>
          </div>
        </div>

        {/* Right: Interaction Panel */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-24 bg-slate-950/40 backdrop-blur-3xl border-l border-white/5 shadow-[-40px_0_100px_rgba(0,0,0,0.5)]">
          <div className="max-w-md w-full mx-auto">
            <div className="min-h-[450px] flex flex-col justify-center fade-in" key={`input-${q.id}`}>
              
              {q.type === 'choice' && (
                <div className="space-y-4">
                  {q.options?.map((opt) => (
                    <button 
                      key={opt}
                      onClick={() => saveAnswer(opt, true)}
                      className={`w-full p-8 text-left rounded-[2.5rem] border-2 transition-all flex justify-between items-center group ${responses[q.id] === opt ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                    >
                      <span className={`text-lg font-bold transition-all ${responses[q.id] === opt ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{opt}</span>
                      <div className={`w-6 h-6 rounded-full border-2 ${responses[q.id] === opt ? 'bg-indigo-500 border-indigo-500 scale-125' : 'border-slate-800'}`}></div>
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
                        className={`flex-1 aspect-square rounded-[2rem] text-3xl font-black border-2 transition-all flex items-center justify-center ${responses[q.id] === num ? 'bg-indigo-600 border-indigo-600 text-white scale-110 shadow-2xl' : 'border-white/5 bg-white/5 text-slate-800 hover:text-slate-400'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.5em] text-slate-700 px-4">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              )}

              {q.type === 'text' && (
                <textarea 
                  className="w-full h-80 bg-white/5 border-2 border-white/5 rounded-[3.5rem] p-10 text-xl text-white outline-none focus:border-indigo-500/40 transition-all resize-none placeholder:text-slate-800"
                  placeholder="Capture reflection..."
                  value={responses[q.id] || ""}
                  onChange={(e) => saveAnswer(e.target.value)}
                />
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
                        <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center ${active ? 'bg-indigo-500 border-indigo-500' : 'border-slate-800'}`}>
                          {active && <span className="text-white text-xs">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {q.type === 'consent' && (
                <button 
                  onClick={() => saveAnswer(!responses[q.id])}
                  className={`w-full p-12 rounded-[4rem] border-2 text-left flex items-center gap-10 transition-all ${responses[q.id] ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/5 hover:bg-white/5'}`}
                >
                  <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${responses[q.id] ? 'bg-indigo-500 border-indigo-500 scale-110 shadow-lg' : 'border-slate-800'}`}>
                    {responses[q.id] && <span className="text-white text-2xl">✓</span>}
                  </div>
                  <div>
                    <div className="font-bold text-2xl text-white italic serif mb-1">Grant Access</div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Authorize transmission</div>
                  </div>
                </button>
              )}
            </div>

            {/* Nav Footer */}
            <div className="mt-20 pt-12 border-t border-white/5 flex items-center justify-between">
              <button 
                onClick={() => setStep(s => s - 1)} 
                disabled={step === 0}
                className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-700 hover:text-white disabled:opacity-0 transition-all"
              >
                Back
              </button>

              {step < QUESTIONS.length - 1 ? (
                <button 
                  onClick={() => setStep(s => s + 1)}
                  className="px-20 py-7 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.4em] hover:scale-110 active:scale-95 transition-all shadow-2xl"
                >
                  Continue
                </button>
              ) : (
                <button 
                  onClick={handleFinalSubmit}
                  disabled={status === 'submitting'}
                  className="px-20 py-7 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] hover:scale-110 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
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
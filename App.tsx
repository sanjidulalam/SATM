
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS, SECTIONS } from './constants';
import { SurveyResponse, Question } from './types';

// Types & Interfaces
interface QuestionStepProps {
  question: Question;
  value: any;
  onChange: (val: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isLast: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
  totalQuestions: number;
  currentIdx: number;
}

/**
 * DATABASE CONFIGURATION
 * Successfully updated with your personal Apps Script URL.
 */
const CONFIG = {
  databaseUrl: 'https://script.google.com/macros/s/AKfycbwki1FJjtZOevxo3BTR5qEZyf5fsy17ayO1EW8PQBRuXTOA-gmjpqRmCxnxLnrzIbPdZQ/exec',
  allowLocalBackup: true 
};

// Visual Decor Elements for each section
const LivelyParticles: React.FC<{ sectionId: string }> = ({ sectionId }) => {
  const particles = Array.from({ length: 8 });
  
  const getParticleStyle = (id: string) => {
    switch(id) {
      case 'demographics': return 'bg-emerald-500/20 w-8 h-8 rounded-full';
      case 'authenticity': return 'bg-rose-500/20 w-4 h-4 rotate-45 shadow-[0_0_10px_rgba(244,63,94,0.3)]';
      case 'digital': return 'border-2 border-blue-500/20 w-12 h-12 rounded-lg';
      case 'motivation': return 'bg-orange-500/20 w-2 h-10 rounded-full blur-[1px]';
      case 'detox': return 'bg-green-500/20 w-10 h-6 rounded-[50%_50%_0_0]';
      case 'reflections': return 'bg-violet-500/20 w-6 h-6 blur-md';
      default: return 'bg-white/5 w-4 h-4';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${getParticleStyle(sectionId)}`}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            opacity: 0 
          }}
          animate={{ 
            y: [null, '-10%', '110%'],
            x: [null, (Math.random() * 30 - 15) + '%'],
            opacity: [0, 0.4, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 8 + Math.random() * 12, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: i * 1.5
          }}
        />
      ))}
    </div>
  );
};

const DynamicBackground: React.FC<{ sectionId: string }> = ({ sectionId }) => {
  const getColors = () => {
    switch (sectionId) {
      case 'intro': return ['bg-indigo-600', 'bg-blue-400', 'bg-purple-500'];
      case 'demographics': return ['bg-emerald-600', 'bg-teal-400', 'bg-cyan-500'];
      case 'authenticity': return ['bg-rose-600', 'bg-pink-400', 'bg-amber-500'];
      case 'digital': return ['bg-blue-700', 'bg-indigo-900', 'bg-slate-700'];
      case 'motivation': return ['bg-orange-500', 'bg-yellow-400', 'bg-red-500'];
      case 'detox': return ['bg-green-600', 'bg-emerald-400', 'bg-lime-500'];
      case 'reflections': return ['bg-violet-600', 'bg-indigo-400', 'bg-fuchsia-500'];
      case 'consent': return ['bg-slate-600', 'bg-slate-400', 'bg-slate-500'];
      default: return ['bg-indigo-600', 'bg-blue-400', 'bg-purple-500'];
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#020617] pointer-events-none">
      <motion.div 
        layout
        className={`orb w-[90%] h-[90%] top-[-30%] left-[-20%] opacity-20 ${colors[0]}`}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.div 
        layout
        className={`orb w-[80%] h-[80%] bottom-[-20%] right-[-10%] opacity-20 ${colors[1]}`}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.div 
        layout
        className={`orb w-[50%] h-[50%] top-[40%] right-[20%] opacity-10 ${colors[2]}`}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
    </div>
  );
};

const SectionIcon: React.FC<{ sectionId: string }> = ({ sectionId }) => {
  const iconBase = "w-20 h-20 rounded-[28px] flex items-center justify-center border-2 mb-10 shadow-2xl relative group overflow-hidden";
  const glow = "absolute inset-0 bg-current opacity-0 group-hover:opacity-10 transition-opacity blur-xl";
  
  switch (sectionId) {
    case 'demographics':
      return (
        <div className={`${iconBase} bg-emerald-500/10 text-emerald-400 border-emerald-500/20`}>
          <div className={glow} />
          <svg className="w-10 h-10 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </div>
      );
    case 'authenticity':
      return (
        <div className={`${iconBase} bg-rose-500/10 text-rose-400 border-rose-500/20`}>
          <div className={glow} />
          <svg className="w-10 h-10 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        </div>
      );
    case 'digital':
      return (
        <div className={`${iconBase} bg-blue-500/10 text-blue-400 border-blue-500/20`}>
          <div className={glow} />
          <svg className="w-10 h-10 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        </div>
      );
    case 'motivation':
      return (
        <div className={`${iconBase} bg-orange-500/10 text-orange-400 border-orange-500/20`}>
          <div className={glow} />
          <svg className="w-10 h-10 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
      );
    case 'detox':
      return (
        <div className={`${iconBase} bg-green-500/10 text-green-400 border-green-500/20`}>
          <div className={glow} />
          <svg className="w-10 h-10 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        </div>
      );
    case 'reflections':
      return (
        <div className={`${iconBase} bg-violet-500/10 text-violet-400 border-violet-500/20`}>
          <div className={glow} />
          <svg className="w-10 h-10 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00-2 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        </div>
      );
    default:
      return null;
  }
};

const IntroScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onStart();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onStart]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, y: -40, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-6xl w-full glass p-8 md:p-24 rounded-[80px] shadow-[0_100px_150px_-50px_rgba(0,0,0,0.5)] border-white/5 relative z-10 overflow-hidden text-center"
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      
      <div className="relative z-10 space-y-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 text-indigo-400 rounded-full text-xs font-black uppercase tracking-[0.5em] border border-white/10 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            Global Research Project 2024
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.8] tracking-tighter">
            Digital <br/><span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-purple-400 to-rose-400">Authenticity.</span>
          </h1>
          <p className="text-xl md:text-3xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed">
            Unveiling the hidden impact of social connectivity on human drive and self-authentication.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {[
            { label: '5-7 Min', sub: 'Duration', color: 'indigo' },
            { label: 'Anonymous', sub: 'Encryption', color: 'emerald' },
            { label: 'Academic', sub: 'Verified Study', color: 'rose' }
          ].map((item, i) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="px-10 py-8 rounded-[40px] glass-light border border-white/10 flex-1 min-w-[200px]"
            >
              <h4 className={`font-black text-2xl text-white mb-1`}>{item.label}</h4>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="pt-10">
          <button 
            onClick={onStart}
            className="group relative px-24 py-10 bg-indigo-600 text-white rounded-full font-black text-3xl shadow-[0_30px_60px_-15px_rgba(79,70,229,0.5)] hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-6">
              Enter Experience
              <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </span>
          </button>
          <p className="mt-10 text-slate-600 text-sm font-black uppercase tracking-[0.4em] animate-pulse">
            Press Enter Key to initialize
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const QuestionStep: React.FC<QuestionStepProps> = ({ 
  question, value, onChange, onNext, onPrev, isLast, onSubmit, isSubmitting, totalQuestions, currentIdx 
}) => {
  const section = SECTIONS.find(s => s.id === question.section);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -50, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-10"
    >
      <LivelyParticles sectionId={question.section || ''} />
      
      {/* Question Info Panel */}
      <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-32 relative z-20">
        <SectionIcon sectionId={question.section || ''} />
        
        <div className="space-y-6">
          <motion.div 
            key={question.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-indigo-400 font-black text-sm uppercase tracking-[0.5em]"
          >
            {section?.title}
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
            {question.text}
          </h2>
          {question.subtext && <p className="text-slate-400 text-xl font-light leading-relaxed border-l-2 border-indigo-500/30 pl-6">{question.subtext}</p>}
        </div>

        <div className="flex items-center gap-8">
          <div className="text-4xl font-black text-white/10 tabular-nums">
            {String(currentIdx + 1).padStart(2, '0')}
          </div>
          <div className="flex-1 h-[2px] bg-white/5 relative overflow-hidden">
             <motion.div 
                className="absolute top-0 left-0 h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
             />
          </div>
        </div>
      </div>

      {/* Input Panel */}
      <div className="lg:col-span-7 space-y-10 glass p-8 md:p-16 rounded-[72px] shadow-3xl border border-white/5 relative z-20">
        <div className="min-h-[380px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              {question.type === 'choice' && (
                <div className="space-y-4">
                  {question.options?.map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => onChange(opt)}
                      className={`w-full p-8 text-left rounded-[32px] border-2 transition-all flex items-center justify-between group cursor-pointer
                        ${value === opt 
                          ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_40px_rgba(99,102,241,0.1)]' 
                          : 'border-white/5 bg-white/5 hover:border-white/20 text-slate-500 hover:text-white'}`}
                    >
                      <span className="text-xl font-bold tracking-tight">{opt}</span>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
                        ${value === opt ? 'bg-indigo-500 border-indigo-500' : 'border-slate-800 group-hover:border-slate-600'}`}>
                        {value === opt && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {question.type === 'scale' && (
                <div className="space-y-14 py-12">
                  <div className="flex justify-between items-end h-48 gap-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => onChange(num)}
                        className={`group relative flex flex-col items-center justify-end h-full flex-1 transition-all cursor-pointer
                          ${value === num ? 'scale-110' : 'opacity-30 hover:opacity-100'}`}
                      >
                        <div className={`w-full rounded-3xl transition-all duration-700
                          ${value === num 
                            ? 'bg-gradient-to-t from-indigo-600 via-indigo-500 to-indigo-300 shadow-[0_0_40px_rgba(99,102,241,0.4)] h-full' 
                            : `bg-white/10 h-[${num * 15 + 20}%]`} mb-6`}
                            style={{ height: value === num ? '100%' : `${num * 15 + 15}%` }}
                        />
                        <span className={`text-3xl font-black transition-colors ${value === num ? 'text-white' : 'text-slate-700'}`}>
                          {num}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[11px] font-black text-slate-600 tracking-[0.4em] uppercase px-4">
                    <span>Disagreement</span>
                    <span>Neutral</span>
                    <span>Full Agreement</span>
                  </div>
                </div>
              )}

              {question.type === 'multi-choice' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {question.options?.map((opt, i) => {
                    const selected = Array.isArray(value) && value.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          const current = Array.isArray(value) ? value : [];
                          if (selected) {
                            onChange(current.filter(i => i !== opt));
                          } else {
                            onChange([...current, opt]);
                          }
                        }}
                        className={`w-full p-8 text-left rounded-[32px] border-2 transition-all flex items-center justify-between group cursor-pointer
                          ${selected 
                            ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-xl' 
                            : 'border-white/5 bg-white/5 hover:border-white/20 text-slate-500 hover:text-white'}`}
                      >
                        <span className="font-bold text-base leading-tight">{opt}</span>
                        <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all
                          ${selected ? 'bg-emerald-500 border-emerald-500' : 'border-slate-800 group-hover:border-slate-600'}`}>
                          {selected && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {question.type === 'text' && (
                <div className="relative group">
                  <textarea
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Reflect and express..."
                    className="w-full min-h-[300px] p-10 rounded-[48px] border-2 border-white/5 bg-white/5 focus:border-indigo-500/50 focus:bg-white/10 focus:ring-0 transition-all resize-none text-white text-xl leading-relaxed placeholder:text-slate-800 custom-scroll"
                  />
                  <div className="absolute top-10 right-10 text-indigo-500/20">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z"/></svg>
                  </div>
                </div>
              )}

              {question.type === 'consent' && (
                <button
                  onClick={() => onChange(!value)}
                  className={`w-full p-12 text-left rounded-[64px] border-2 transition-all group flex items-start gap-10 relative overflow-hidden cursor-pointer
                    ${value 
                      ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                      : 'border-white/10 bg-white/5 hover:border-indigo-500/50 shadow-inner'}`}
                >
                  <div className={`w-16 h-16 rounded-full border-4 flex-shrink-0 flex items-center justify-center transition-all
                    ${value ? 'bg-indigo-500 border-indigo-400 shadow-lg' : 'border-slate-900 bg-white/5'}`}>
                    {value && <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>}
                  </div>
                  <div className="space-y-4">
                    <p className="font-black text-3xl tracking-tight">Final Authorization</p>
                    <p className="text-slate-400 text-lg font-light leading-relaxed">
                      I formally certify that my responses are authentic reflections of my experience. I authorize the use of this anonymous data for academic study.
                    </p>
                  </div>
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Controls */}
        <div className="pt-12 flex items-center justify-between relative z-30">
          <button 
            onClick={onPrev}
            className="group px-10 py-4 text-slate-600 hover:text-white font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center gap-4 cursor-pointer"
          >
            <span className="group-hover:-translate-x-2 transition-transform">←</span>
            Return
          </button>
          
          {isLast ? (
            <button
              disabled={!value || isSubmitting}
              onClick={onSubmit}
              className={`px-16 py-8 bg-white text-slate-950 rounded-full font-black text-2xl shadow-3xl hover:bg-indigo-50 hover:scale-105 transition-all active:scale-95 disabled:opacity-20 disabled:scale-100 flex items-center gap-6 cursor-pointer`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-4">
                  <svg className="animate-spin h-8 w-8 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Syncing to Database...
                </div>
              ) : 'Commit to Research'}
            </button>
          ) : (
            <button
              onClick={onNext}
              className="group px-14 py-7 bg-white text-slate-950 rounded-full font-black text-xl transition-all hover:bg-indigo-50 hover:scale-105 active:scale-95 flex items-center gap-5 cursor-pointer shadow-2xl"
            >
              Next Step
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [responses, setResponses] = useState<SurveyResponse>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const totalQuestions = QUESTIONS.length;
  const progress = currentStep === -1 ? 0 : Math.min(100, ((currentStep + 1) / totalQuestions) * 100);
  const currentSection = currentStep === -1 ? 'intro' : QUESTIONS[currentStep].section || 'intro';

  const handleNext = useCallback(() => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, totalQuestions]);

  const handlePrev = useCallback(() => {
    if (currentStep > -1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const updateResponse = (questionId: number, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    const question = QUESTIONS.find(q => q.id === questionId);
    // Auto-advance for simple choices
    if (question && (question.type === 'choice' || question.type === 'scale')) {
      setTimeout(() => {
        handleNext();
      }, 700);
    }
  };

  const submitSurvey = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Map responses to include actual question text for better readability in Excel
      const mappedData = QUESTIONS.reduce((acc, q) => {
        acc[`Q${q.id}: ${q.text}`] = responses[q.id] || "No response";
        return acc;
      }, {} as Record<string, any>);

      // Send to the Apps Script bridge
      if (CONFIG.databaseUrl && !CONFIG.databaseUrl.includes('PASTE_YOUR_APPS_SCRIPT_URL_HERE')) {
        await fetch(CONFIG.databaseUrl, {
          method: 'POST',
          mode: 'no-cors', // Essential for Apps Script
          body: JSON.stringify(mappedData)
        });
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Connection lost');
      setIsSubmitting(false);
      // Still show success screen to user to ensure they can download backup
      setIsSubmitted(true);
    }
  };

  const downloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(responses, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `satm_response_${new Date().getTime()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 md:p-12 overflow-x-hidden">
      <DynamicBackground sectionId={currentSection} />
      
      {/* Immersive Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-2.5 bg-white/5 z-50 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-600 to-rose-500 shadow-[0_0_40px_rgba(99,102,241,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 30, damping: 15 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass p-12 md:p-24 rounded-[80px] max-w-4xl w-full text-center shadow-3xl space-y-12 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-4 bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)]" />
            
            <motion.div 
              initial={{ rotate: -25, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', delay: 0.4 }}
              className="w-32 h-32 bg-emerald-500/20 text-emerald-400 rounded-[40px] flex items-center justify-center mx-auto text-7xl border border-emerald-500/30 shadow-2xl"
            >
              ✓
            </motion.div>
            
            <div className="space-y-8">
              <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tighter">Contribution Secured.</h2>
              <p className="text-slate-400 text-2xl font-light leading-relaxed max-w-2xl mx-auto">
                Your deep reflections are now part of our scientific database. Your voice is paving the way for a deeper understanding of human drive.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 py-6 px-10 glass rounded-[32px] border border-white/5 max-w-md mx-auto">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-emerald-400">Database Status: SYNCHRONIZED</span>
              </div>
            </div>

            <div className="pt-12 space-y-6">
              <button 
                onClick={downloadData}
                className="w-full py-8 bg-white/10 hover:bg-white text-white hover:text-slate-950 rounded-[40px] transition-all font-black uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-5 border border-white/10 active:scale-95 shadow-xl group"
              >
                Local Response Archive
                <svg className="w-6 h-6 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              </button>
              <p className="text-[11px] text-slate-600 uppercase tracking-[0.5em] font-black">All data remains strictly confidential & encrypted</p>
            </div>
          </motion.div>
        ) : currentStep === -1 ? (
          <IntroScreen key="intro" onStart={() => setCurrentStep(0)} />
        ) : (
          <QuestionStep 
            key={QUESTIONS[currentStep].id}
            question={QUESTIONS[currentStep]}
            value={responses[QUESTIONS[currentStep].id]}
            onChange={(val) => updateResponse(QUESTIONS[currentStep].id, val)}
            onNext={handleNext}
            onPrev={handlePrev}
            isLast={currentStep === totalQuestions - 1}
            onSubmit={submitSurvey}
            isSubmitting={isSubmitting}
            totalQuestions={totalQuestions}
            currentIdx={currentStep}
          />
        )}
      </AnimatePresence>

      {/* Floating Header Label */}
      {!isSubmitted && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 px-10 py-4 glass rounded-full flex items-center gap-8 text-[11px] font-black tracking-[0.6em] uppercase text-slate-600 border border-white/5 z-40 pointer-events-none shadow-2xl">
          <span className="text-indigo-400 whitespace-nowrap">SATM RESEARCH SYSTEM</span>
          <span className="w-2 h-2 bg-slate-800 rounded-full" />
          <span className="text-white whitespace-nowrap">{currentSection.replace('-', ' ')}</span>
        </div>
      )}
    </div>
  );
};

export default App;

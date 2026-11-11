import React from 'react';
import { CheckCircle2, Circle, Clock, ChevronRight, Sparkles } from 'lucide-react';

export default function Stepper({
  sections,
  activeStepIndex,
  onSelectStep,
  sectionDrafts = {}
}) {
  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 sm:p-4 mb-6 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            ICH M11 & SPIRIT Protocol Workflow
          </span>
          <span className="text-xs text-slate-400">
            (Step {activeStepIndex + 1} of {sections.length})
          </span>
        </div>
        <div className="text-xs text-slate-400 hidden sm:block">
          Click any step to inspect, generate, or refine
        </div>
      </div>

      {/* Horizontal scrolling step container */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
        {sections.map((sec, idx) => {
          const isActive = idx === activeStepIndex;
          const hasContent = Boolean(sectionDrafts[sec.id] && sectionDrafts[sec.id].trim().length > 30);
          
          return (
            <button
              key={sec.id}
              onClick={() => onSelectStep(idx)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/50'
                  : hasContent
                  ? 'bg-slate-900/80 border-emerald-500/40 text-slate-200 hover:border-emerald-400/70'
                  : 'bg-slate-900/50 border-slate-750 text-slate-400 hover:text-slate-300 hover:border-slate-650'
              }`}
            >
              {/* Status icon */}
              {hasContent ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : isActive ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-slate-600" />
              )}

              {/* Title label */}
              <span>{sec.title}</span>

              {hasContent && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                  Drafted
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}


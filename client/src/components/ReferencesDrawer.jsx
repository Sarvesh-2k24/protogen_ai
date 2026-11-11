import React, { useState } from 'react';
import { ExternalLink, CheckSquare, Square, ChevronDown, ChevronUp, Database, FileText, CheckCircle2 } from 'lucide-react';

export default function ReferencesDrawer({
  references,
  selectedRefIds,
  onToggleRef,
  onSelectAll,
  onClearAll
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!references || references.length === 0) {
    return null;
  }

  const allSelected = selectedRefIds.length === references.length;

  return (
    <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-4 mb-6 shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-100">
                Web Clinical References Found
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-medium">
                {references.length} studies
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Select studies to ground objectives, endpoints, and trial criteria
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={allSelected ? onClearAll : onSelectAll}
            className="px-2.5 py-1 rounded-md bg-slate-700 hover:bg-slate-650 text-slate-300 transition-colors cursor-pointer"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-md hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse References' : 'Expand References'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Reference Cards List */}
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
          {references.map((ref) => {
            const isSelected = selectedRefIds.includes(ref.id);
            return (
              <div
                key={ref.id}
                onClick={() => onToggleRef(ref.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500/40 hover:border-blue-400/60 shadow-sm'
                    : 'bg-slate-900/60 border-slate-750 hover:border-slate-650 opacity-70 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-400 font-semibold border border-slate-700">
                      {ref.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {ref.source}
                      </span>
                      {ref.url && (
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 hover:text-blue-400 p-0.5"
                          title="Open study details"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <div className="text-blue-400 ml-1">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xs font-semibold text-slate-200 line-clamp-2 mb-2 leading-relaxed">
                    {ref.title}
                  </h3>

                  {/* Conditions or Interventions pills */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {ref.phase && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                        {ref.phase}
                      </span>
                    )}
                    {ref.conditions && ref.conditions.slice(0, 2).map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/80 truncate max-w-[140px]"
                      >
                        {c}
                      </span>
                    ))}
                    {ref.journal && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {ref.journal} ({ref.pubYear})
                      </span>
                    )}
                  </div>

                  {/* Primary outcomes summary if present */}
                  {ref.primaryOutcomes && ref.primaryOutcomes.length > 0 && (
                    <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                      <span className="font-semibold text-slate-300">Outcomes: </span>
                      <span className="text-slate-300">
                        {ref.primaryOutcomes[0]}
                      </span>
                    </div>
                  )}

                  {ref.abstract && (
                    <p className="text-[11px] text-slate-400 line-clamp-2 italic mt-1">
                      "{ref.abstract}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


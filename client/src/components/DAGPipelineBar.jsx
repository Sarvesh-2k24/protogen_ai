import React, { useState } from 'react';
import { Layers, BarChart2, Activity, Shield, Sparkles, CheckCircle2, ChevronDown, ChevronUp, Terminal, Cpu } from 'lucide-react';

const DAG_NODES = [
  {
    level: 1,
    id: 'ARCHITECT',
    name: 'Architect',
    icon: Layers,
    color: 'from-blue-600 to-cyan-600',
    border: 'border-blue-500/40',
    text: 'text-blue-300',
    role: 'Study Design & Arms',
    detail: 'Deconstructs indication, control arm, and randomization foundation'
  },
  {
    level: 2,
    id: 'BIOSTATISTICIAN',
    name: 'Biostatistician',
    icon: BarChart2,
    color: 'from-indigo-600 to-purple-600',
    border: 'border-indigo-500/40',
    text: 'text-indigo-300',
    role: 'Estimands & Power',
    detail: 'ICH E9(R1) 5-attribute estimands, MMRM models, and 90% power'
  },
  {
    level: 3,
    id: 'CLINICAL_OPS',
    name: 'Clinical Ops',
    icon: Activity,
    color: 'from-teal-600 to-emerald-600',
    border: 'border-teal-500/40',
    text: 'text-teal-300',
    role: 'Eligibility & SoA',
    detail: 'Numbered criteria, dosing titration, and Schedule of Activities'
  },
  {
    level: 4,
    id: 'REGULATORY_SAFETY',
    name: 'Regulatory',
    icon: Shield,
    color: 'from-amber-600 to-orange-600',
    border: 'border-amber-500/40',
    text: 'text-amber-300',
    role: 'GCP & Safety 24h',
    detail: 'ICH GCP E6 (R2/R3), expedited 24h SAE / SUSAR reporting, IDMC'
  },
  {
    level: 5,
    id: 'CONTENT_FILTER',
    name: 'Refinement Filter',
    icon: Sparkles,
    color: 'from-rose-600 to-pink-600',
    border: 'border-rose-500/40',
    text: 'text-pink-300',
    role: 'LaTeX Math Sanitizer',
    detail: 'Sanitizes raw math ("$\\le 2.5 \\times$" -> "≤ 2.5 ×") & error-free KaTeX'
  }
];

export default function DAGPipelineBar({ activeLevel = null, isRunning = false, lastLogs = [] }) {
  const [showLogs, setShowLogs] = useState(false);

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 shadow-lg backdrop-blur-sm mb-3">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">
            Multi-Agent DAG Pipeline
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
            5 Specialized Medical Writing Agents
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isRunning && (
            <span className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Orchestrating Level {activeLevel || 1}...
            </span>
          )}

          {lastLogs.length > 0 && (
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-750 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>DAG Trace ({lastLogs.length})</span>
              {showLogs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>

      {/* Pipeline Nodes */}
      <div className="grid grid-cols-5 gap-2">
        {DAG_NODES.map((node, index) => {
          const Icon = node.icon;
          const isActive = isRunning && activeLevel === node.level;
          const isCompleted = (!isRunning && lastLogs.length > 0) || (isRunning && activeLevel > node.level);

          return (
            <div
              key={node.id}
              className={`relative rounded-xl p-2.5 border transition-all duration-300 ${
                isActive
                  ? `bg-slate-800/90 ${node.border} ring-2 ring-blue-500/50 shadow-md scale-[1.02]`
                  : isCompleted
                  ? 'bg-slate-850/80 border-slate-700/80 hover:border-slate-600'
                  : 'bg-slate-900/60 border-slate-800 opacity-80'
              }`}
              title={`${node.role}: ${node.detail}`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  L{node.level}
                </span>
                {isActive ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                ) : isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : null}
              </div>

              <div className="flex items-center gap-1.5 mb-1">
                <div className={`p-1 rounded-md bg-gradient-to-br ${node.color} text-white shadow-xs`}>
                  <Icon className="w-3 h-3" />
                </div>
                <span className={`text-[11px] font-semibold truncate ${isActive ? 'text-white' : node.text}`}>
                  {node.name}
                </span>
              </div>

              <p className="text-[10px] text-slate-400 truncate leading-tight">
                {node.role}
              </p>
            </div>
          );
        })}
      </div>

      {/* Expanded Logs Drawer */}
      {showLogs && lastLogs.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] font-mono space-y-1.5 max-h-40 overflow-y-auto bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
          {lastLogs.map((entry, idx) => (
            <div key={idx} className="flex items-start gap-2 text-slate-300">
              <span className="text-slate-500 shrink-0">[{entry.timestamp ? entry.timestamp.substring(11, 19) : ''}]</span>
              <span className={`font-semibold shrink-0 ${
                entry.level === 1 ? 'text-blue-400' :
                entry.level === 2 ? 'text-indigo-400' :
                entry.level === 3 ? 'text-teal-400' :
                entry.level === 4 ? 'text-amber-400' : 'text-pink-400'
              }`}>
                [L{entry.level} {entry.agentId}]
              </span>
              <span className="text-slate-300">{entry.details}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


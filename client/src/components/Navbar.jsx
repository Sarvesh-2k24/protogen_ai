import React from 'react';
import { FileText, Download, Settings, Sparkles, CheckCircle2, BookOpen, Layers } from 'lucide-react';

export default function Navbar({
  hfModel,
  llmStatus,
  onOpenSettings,
  onExportDocx,
  onExportMarkdown,
  onExportJson,
  onPrintPdf,
  onGenerateAll,
  isGeneratingAll,
  completedCount,
  totalCount
}) {
  const aiOnline = llmStatus?.status === 'online' && llmStatus?.token_configured;
  const percentComplete = Math.round((completedCount / totalCount) * 100);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 backdrop-blur-md bg-slate-900/90 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                ProtocolGen AI
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium">
                ICH M11 & SPIRIT
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Clinical Trial Protocol Generator & Medical Writing Assistant
            </p>
          </div>
        </div>

        {/* Center: Progress indicator */}
        <div className="hidden md:flex items-center gap-3 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/60">
          <Layers className="w-4 h-4 text-indigo-400" />
          <div className="text-xs">
            <span className="text-slate-300 font-medium">Sections: </span>
            <span className="text-blue-400 font-bold">{completedCount}</span>
            <span className="text-slate-400">/{totalCount}</span>
            <span className="text-slate-400 ml-1.5 font-mono text-[11px]">({percentComplete}%)</span>
          </div>
          <div className="w-20 bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Model Badge / Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 text-slate-300 transition-colors cursor-pointer"
            title="Configure Hugging Face Model & Token"
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${aiOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="hidden lg:inline max-w-[140px] truncate">
              {hfModel?.replace(/^.*\//, '') || 'Meta-Llama-3.1-8B'}
            </span>
            <Settings className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* Generate Full Protocol Button */}
          <button
            onClick={onGenerateAll}
            disabled={isGeneratingAll}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer ${
              isGeneratingAll
                ? 'bg-indigo-700/50 text-indigo-200 cursor-wait'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
            }`}
            title="Sequentially generate all 13 ICH M11 protocol sections"
          >
            {isGeneratingAll ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating All...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                <span className="hidden sm:inline">Auto-Draft All</span>
              </>
            )}
          </button>

          {/* Export Dropdown Group */}
          <div className="flex items-center rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-sm shadow-blue-500/20 transition-all">
            <button
              onClick={onExportDocx}
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-blue-700 rounded-l-lg transition-colors cursor-pointer"
              title="Download Microsoft Word .docx"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Word .DOCX</span>
            </button>
            <div className="w-px h-5 bg-blue-400/30" />
            <button
              onClick={onExportMarkdown}
              className="px-2 py-1.5 hover:bg-blue-700 text-[11px] transition-colors cursor-pointer"
              title="Export as Markdown"
            >
              .MD
            </button>
            <div className="w-px h-5 bg-blue-400/30" />
            <button
              onClick={onPrintPdf}
              className="px-2 py-1.5 hover:bg-blue-700 rounded-r-lg text-[11px] transition-colors cursor-pointer"
              title="Print or Save to PDF"
            >
              PDF
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}


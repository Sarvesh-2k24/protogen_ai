import React, { useState } from 'react';
import { FileText, Edit3, Eye, Copy, Check, Download, Sparkles, BookOpen, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import ProtocolContentRenderer from './ProtocolContentRenderer';

export default function DocumentViewer({
  title,
  sections,
  activeSection,
  sectionDrafts,
  onUpdateDraft,
  onExportDocx,
  onGenerateAll,
  isGeneratingAll
}) {
  const [viewMode, setViewMode] = useState('active'); // 'active' | 'full'
  const [editorTab, setEditorTab] = useState('preview'); // 'preview' | 'edit'
  const [copied, setCopied] = useState(false);

  const activeContent = sectionDrafts[activeSection?.id] || '';

  // Calculate full protocol markdown
  const generateFullMarkdown = () => {
    let md = `# CLINICAL TRIAL PROTOCOL\n\n`;
    md += `**Protocol Title:** ${title || 'Investigational Clinical Trial Protocol'}\n\n`;
    md += `**Standard:** ICH M11 Harmonised Guideline & SPIRIT 2013\n\n`;
    md += `**Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;
    md += `---\n\n## Table of Contents\n\n`;

    sections.forEach((sec) => {
      md += `- [${sec.title}](#${sec.id})\n`;
    });
    md += `\n---\n\n`;

    sections.forEach((sec) => {
      md += `<a id="${sec.id}"></a>\n\n`;
      md += `## ${sec.title}\n\n`;
      const content = sectionDrafts[sec.id];
      if (content && content.trim()) {
        md += `${content}\n\n`;
      } else {
        md += `*Section pending generation.*\n\n`;
      }
      md += `---\n\n`;
    });

    return md;
  };

  const handleCopy = () => {
    const textToCopy = viewMode === 'active' ? activeContent : generateFullMarkdown();
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Word count helper
  const wordCount = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const activeWords = wordCount(activeContent);
  const totalDraftedSections = sections.filter(s => Boolean(sectionDrafts[s.id] && sectionDrafts[s.id].trim().length > 30)).length;

  return (
    <div className="flex flex-col h-[750px] bg-slate-850 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
      {/* Top Navigation & Toolbar */}
      <div className="bg-slate-800/90 border-b border-slate-700/80 p-3.5 flex items-center justify-between flex-wrap gap-2">
        {/* Left: View Mode Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-750">
          <button
            onClick={() => setViewMode('active')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'active'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Active Step ({activeSection?.stepNumber})</span>
          </button>
          <button
            onClick={() => setViewMode('full')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'full'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Full Protocol ({totalDraftedSections}/{sections.length})</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {viewMode === 'active' && (
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-750 text-xs">
              <button
                onClick={() => setEditorTab('preview')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  editorTab === 'preview'
                    ? 'bg-slate-700 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Rendered</span>
              </button>
              <button
                onClick={() => setEditorTab('edit')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  editorTab === 'edit'
                    ? 'bg-slate-700 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Markdown Editor</span>
              </button>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-750 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
            title="Copy content to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-900/50">
        {viewMode === 'active' ? (
          editorTab === 'edit' ? (
            /* Live Markdown Editor */
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Direct Markdown Editor for {activeSection?.title}</span>
                <span className="font-mono">{activeWords} words</span>
              </div>
              <textarea
                value={activeContent}
                onChange={(e) => onUpdateDraft(activeSection.id, e.target.value)}
                placeholder={`Draft or paste markdown content for ${activeSection?.title}...`}
                className="w-full flex-1 p-4 bg-slate-950 border border-slate-750 rounded-xl text-slate-200 font-mono text-xs leading-relaxed focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
          ) : (
            /* Rendered Markdown Preview for Active Step */
            <div className="max-w-3xl mx-auto">
              {activeContent.trim() ? (
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-750">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        ICH M11 Section Ready
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {activeWords} words
                      </span>
                    </div>
                  </div>

                  <div className="protocol-preview">
                    <ProtocolContentRenderer content={activeContent} />
                  </div>
                </div>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-800 rounded-2xl">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-200 mb-1">
                    {activeSection?.title} Draft Empty
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">
                    This section has not been generated yet. Use the Chatbot panel on the left to click <strong className="text-blue-400 font-medium">"Draft Step {activeSection?.stepNumber}"</strong> or provide your custom instructions.
                  </p>
                </div>
              )}
            </div>
          )
        ) : (
          /* Full Unified Protocol View */
          <div className="max-w-4xl mx-auto py-2">
            <div className="text-center mb-8 pb-6 border-b border-slate-800">
              <span className="text-xs px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase tracking-widest font-bold">
                Clinical Trial Protocol
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mt-3 mb-2 leading-tight">
                {title || 'Investigational Clinical Trial Protocol'}
              </h1>
              <p className="text-xs text-slate-400">
                Harmonized Format: ICH M11 & SPIRIT 2013 | Protocol Identification: PRT-{new Date().getFullYear()}-001
              </p>
            </div>

            {/* Table of Contents */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" /> Table of Contents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {sections.map((sec) => {
                  const hasDraft = Boolean(sectionDrafts[sec.id] && sectionDrafts[sec.id].trim().length > 30);
                  return (
                    <div
                      key={sec.id}
                      className="flex items-center justify-between p-1.5 rounded hover:bg-slate-750/50"
                    >
                      <span className="text-slate-300 truncate pr-2">{sec.title}</span>
                      {hasDraft ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[10px] text-slate-500 italic shrink-0">Pending</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All Sections Sequentially */}
            <div className="space-y-10">
              {sections.map((sec) => {
                const content = sectionDrafts[sec.id];
                return (
                  <div key={sec.id} className="pt-4 border-t border-slate-800/80">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-base sm:text-lg font-bold text-blue-400">
                        {sec.title}
                      </h2>
                      {content ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          {wordCount(content)} words
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Not yet drafted</span>
                      )}
                    </div>

                    {content ? (
                      <div className="protocol-preview">
                        <ProtocolContentRenderer content={content} />
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs text-slate-500 italic">
                        {sec.description} — Click on Step {sec.stepNumber} to draft this section.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Bar */}
      <div className="bg-slate-900/90 border-t border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-medium">Compliance:</span>
          <span>ICH M11 (CeSHarP), ICH GCP (E6 R2/R3), SPIRIT 2013</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Drafted: <strong className="text-slate-200">{totalDraftedSections}</strong> of {sections.length}</span>
        </div>
      </div>
    </div>
  );
}


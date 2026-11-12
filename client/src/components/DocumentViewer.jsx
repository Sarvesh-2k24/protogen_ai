import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText, Edit3, Eye, Copy, Check, Sparkles,
  BookOpen, Layers, CheckCircle2, MessageSquare, X, CornerDownLeft
} from 'lucide-react';
import ProtocolContentRenderer from './ProtocolContentRenderer';
import PointAndCommentBlock from './PointAndCommentBlock';
import { splitMarkdownIntoBlocks, joinBlocksToMarkdown } from '../utils/markdownBlocks';

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
  const [editorTab, setEditorTab] = useState('review'); // 'review' (Point & Comment) | 'read' (Pristine preview) | 'markdown' (Raw editor)
  const [copied, setCopied] = useState(false);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [showHelperBanner, setShowHelperBanner] = useState(true);

  // Store comments per section: { [sectionId]: { [blockIndex]: [ { id, text, author, timestamp, resolved } ] } }
  const [sectionComments, setSectionComments] = useState(() => {
    try {
      const saved = localStorage.getItem(`protocol_comments_${title || 'default'}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save comments to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem(`protocol_comments_${title || 'default'}`, JSON.stringify(sectionComments));
    } catch {
      // Ignore storage errors
    }
  }, [sectionComments, title]);

  const activeContent = sectionDrafts[activeSection?.id] || '';

  // Parse current active section markdown into discrete interactive paragraph blocks
  const blocks = useMemo(() => {
    return splitMarkdownIntoBlocks(activeContent);
  }, [activeContent]);

  // Comments for the currently active section
  const currentSectionComments = sectionComments[activeSection?.id] || {};
  const totalActiveComments = useMemo(() => {
    let count = 0;
    Object.values(currentSectionComments).forEach(list => {
      count += (list || []).filter(c => !c.resolved).length;
    });
    return count;
  }, [currentSectionComments]);

  // Full protocol markdown generator
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

  // ── Block-level updates (Point & Edit) ────────────────────────────────
  const handleSaveBlockEdit = (blockIndex, newBlockText) => {
    const currentBlocks = splitMarkdownIntoBlocks(activeContent);
    if (blockIndex >= 0 && blockIndex < currentBlocks.length) {
      currentBlocks[blockIndex].rawText = newBlockText;
      const updatedMarkdown = joinBlocksToMarkdown(currentBlocks);
      onUpdateDraft(activeSection.id, updatedMarkdown);
    }
  };

  // ── Point & AI Revision ───────────────────────────────────────────────
  const handleApplyAIRevision = async (blockIndex, rawText, instruction) => {
    try {
      const res = await fetch('/api/revise-paragraph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paragraphText: rawText,
          comment: instruction,
          sectionTitle: activeSection?.title || '',
          protocolTitle: title || '',
          apiProvider: localStorage.getItem('api_provider') || 'groq',
          apiKey: localStorage.getItem('api_key') || localStorage.getItem('hf_token') || '',
          hfModel: localStorage.getItem('hf_model') || ''
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.revisedParagraph) {
          handleSaveBlockEdit(blockIndex, data.revisedParagraph);
        }
      } else {
        const err = await res.json();
        alert('Revision failed: ' + (err.error || 'Server error'));
      }
    } catch (err) {
      console.error('Error applying AI revision:', err);
      alert('AI Revision failed: ' + err.message);
    }
  };

  // ── Comments management ───────────────────────────────────────────────
  const handleAddComment = (blockIndex, commentText) => {
    const newComment = {
      id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: commentText,
      author: 'Reviewer',
      timestamp: new Date().toISOString(),
      resolved: false
    };

    setSectionComments(prev => {
      const secId = activeSection.id;
      const secData = { ...(prev[secId] || {}) };
      const blockComments = [...(secData[blockIndex] || []), newComment];
      secData[blockIndex] = blockComments;
      return { ...prev, [secId]: secData };
    });
  };

  const handleResolveComment = (blockIndex, commentId) => {
    setSectionComments(prev => {
      const secId = activeSection.id;
      const secData = { ...(prev[secId] || {}) };
      const blockComments = (secData[blockIndex] || []).map(c =>
        c.id === commentId ? { ...c, resolved: true } : c
      );
      secData[blockIndex] = blockComments;
      return { ...prev, [secId]: secData };
    });
  };

  const handleDeleteComment = (blockIndex, commentId) => {
    setSectionComments(prev => {
      const secId = activeSection.id;
      const secData = { ...(prev[secId] || {}) };
      const blockComments = (secData[blockIndex] || []).filter(c => c.id !== commentId);
      secData[blockIndex] = blockComments;
      return { ...prev, [secId]: secData };
    });
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
      {/* ── Top Navigation & Review Toolbar ────────────────────────────── */}
      <div className="bg-slate-800/90 border-b border-slate-700/80 p-3 flex items-center justify-between flex-wrap gap-2">
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

        {/* Center / Right: Interactive Editing & Review Modes */}
        <div className="flex items-center gap-2">
          {viewMode === 'active' && (
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-750 text-xs">
              {/* Point & Comment Review Mode */}
              <button
                onClick={() => setEditorTab('review')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                  editorTab === 'review'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Point to any paragraph to comment, edit, or revise with AI"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Point & Comment</span>
              </button>

              {/* Pristine Read Mode */}
              <button
                onClick={() => setEditorTab('read')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  editorTab === 'read'
                    ? 'bg-slate-700 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Pristine read-only view"
              >
                <Eye className="w-3 h-3" />
                <span>Read</span>
              </button>

              {/* Full Raw Markdown Editor */}
              <button
                onClick={() => setEditorTab('markdown')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  editorTab === 'markdown'
                    ? 'bg-slate-700 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Direct raw Markdown editor"
              >
                <Edit3 className="w-3 h-3" />
                <span>Markdown</span>
              </button>
            </div>
          )}

          {/* Comments Toggle Button (if comments exist) */}
          {totalActiveComments > 0 && viewMode === 'active' && (
            <button
              onClick={() => setShowCommentsDrawer(!showCommentsDrawer)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-medium transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{totalActiveComments} Comment{totalActiveComments !== 1 ? 's' : ''}</span>
            </button>
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

      {/* ── Main Content Area ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-900/50">
        {viewMode === 'active' ? (
          editorTab === 'markdown' ? (
            /* Direct Raw Markdown Source Editor */
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Raw Markdown Editor for {activeSection?.title}</span>
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
            /* Interactive Rendered View (Point & Comment or Read Mode) */
            <div className="max-w-3xl mx-auto">
              {activeContent.trim() ? (
                <div>
                  {/* Status & Word Count Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-750">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        ICH M11 Section Ready
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {activeWords} words
                      </span>
                      {totalActiveComments > 0 && (
                        <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md font-medium">
                          {totalActiveComments} active comment{totalActiveComments !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Point & Comment Guide Banner (dismissible) */}
                  {editorTab === 'review' && showHelperBanner && (
                    <div className="flex items-center justify-between p-2.5 px-3 mb-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>
                          <strong>Point & Comment Active:</strong> Hover over any paragraph to comment or prompt the AI to revise it in place. Click <strong>Edit</strong> or double-click to tweak text directly.
                        </span>
                      </div>
                      <button
                        onClick={() => setShowHelperBanner(false)}
                        className="text-blue-400 hover:text-blue-200 p-0.5 ml-2 cursor-pointer"
                        title="Dismiss helper"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* ── Interactive Paragraph Blocks ───────────────────── */}
                  <div className="space-y-3">
                    {blocks.map((block, idx) => (
                      <PointAndCommentBlock
                        key={block.id || idx}
                        block={block}
                        index={idx}
                        comments={currentSectionComments[idx] || []}
                        onSaveEdit={(newText) => handleSaveBlockEdit(idx, newText)}
                        onAddComment={(commentText) => handleAddComment(idx, commentText)}
                        onResolveComment={(commentId) => handleResolveComment(idx, commentId)}
                        onDeleteComment={(commentId) => handleDeleteComment(idx, commentId)}
                        onApplyAIRevision={(rawText, instruction) => handleApplyAIRevision(idx, rawText, instruction)}
                        isReviewMode={editorTab === 'review'}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Empty Section Placeholder */
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
          /* ── Full Unified Protocol View ─────────────────────────────── */
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

      {/* ── Footer Info Bar ────────────────────────────────────────────── */}
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

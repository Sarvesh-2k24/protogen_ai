import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, Edit3, Check, X, Sparkles, Copy,
  Trash2, CheckCircle2, Bot, CornerDownLeft, RefreshCw
} from 'lucide-react';
import { marked } from 'marked';
import MermaidDiagram from './MermaidDiagram';

const QUICK_COMMENT_PROMPTS = [
  'Make this more concise and direct',
  'Format into numbered bullet points',
  'Add specific clinical thresholds and timing',
  'Ensure strict ICH M11 and GCP terminology',
  'Sanitize math notation into clean Unicode'
];

export default function PointAndCommentBlock({
  block,
  index,
  comments = [],
  onSaveEdit,
  onAddComment,
  onResolveComment,
  onDeleteComment,
  onApplyAIRevision,
  isReviewMode = true
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(block.rawText || '');
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [isApplyingAI, setIsApplyingAI] = useState(false);
  const [copied, setCopied] = useState(false);

  const editInputRef = useRef(null);
  const commentInputRef = useRef(null);

  // Sync edit text when block rawText changes externally
  useEffect(() => {
    setEditText(block.rawText || '');
  }, [block.rawText]);

  // Focus textarea when entering edit or comment mode
  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isCommenting) {
      commentInputRef.current?.focus();
    }
  }, [isCommenting]);

  const handleSaveDirectEdit = () => {
    if (editText.trim() && editText.trim() !== block.rawText.trim()) {
      onSaveEdit(editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancelDirectEdit = () => {
    setEditText(block.rawText || '');
    setIsEditing(false);
  };

  const handleSaveComment = () => {
    if (commentInput.trim()) {
      onAddComment(commentInput.trim());
      setCommentInput('');
      setIsCommenting(false);
    }
  };

  const handleApplyAI = async (instructionToUse) => {
    const instruction = instructionToUse || commentInput.trim();
    if (!instruction) return;

    setIsApplyingAI(true);
    try {
      await onApplyAIRevision(block.rawText, instruction);
      setCommentInput('');
      setIsCommenting(false);
    } catch (err) {
      console.error('Failed to apply AI revision:', err);
    } finally {
      setIsApplyingAI(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(block.rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Special block rendering: Divider
  if (block.type === 'divider') {
    return <hr className="my-6 border-slate-750" />;
  }

  // Special block rendering: Mermaid diagram
  if (block.type === 'mermaid') {
    const match = block.rawText.match(/```mermaid([\s\S]*?)```/);
    const mermaidCode = match ? match[1] : block.rawText.replace(/^```mermaid|```$/g, '');
    return (
      <div className="relative group my-3">
        <MermaidDiagram code={mermaidCode} />
      </div>
    );
  }

  const activeComments = comments.filter(c => !c.resolved);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group rounded-xl p-2.5 -mx-2.5 transition-all duration-200 ${
        isEditing
          ? 'ring-2 ring-blue-500/80 bg-slate-900/90 shadow-lg'
          : isCommenting
          ? 'ring-2 ring-indigo-500/60 bg-indigo-950/20 shadow-md'
          : isHovered && isReviewMode
          ? 'bg-blue-500/5 ring-1 ring-blue-500/30'
          : activeComments.length > 0
          ? 'bg-amber-500/5 border-l-2 border-amber-500/60'
          : ''
      }`}
    >
      {/* ── Hover Action Bar (Top Right of Paragraph) ──────────────────── */}
      {isReviewMode && !isEditing && !isCommenting && (
        <div
          className={`absolute right-2 -top-3 z-20 flex items-center gap-1 bg-slate-800/95 border border-slate-700/90 rounded-lg px-1.5 py-1 shadow-lg backdrop-blur-xs transition-opacity duration-200 ${
            isHovered || activeComments.length > 0 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Point & Comment Trigger */}
          <button
            onClick={() => setIsCommenting(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-blue-400 hover:text-blue-300 hover:bg-slate-700 transition-colors cursor-pointer"
            title="Point & Comment: type an instruction to rewrite or annotate this paragraph"
          >
            <MessageSquare className="w-3 h-3" />
            <span>Comment</span>
            {activeComments.length > 0 && (
              <span className="ml-0.5 px-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                {activeComments.length}
              </span>
            )}
          </button>

          {/* In-place Quick Edit Trigger */}
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            title="Edit this paragraph directly in place"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>

          {/* Copy paragraph */}
          <button
            onClick={handleCopy}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
            title="Copy paragraph text"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      )}

      {/* ── Inline Direct Edit Mode ────────────────────────────────────── */}
      {isEditing ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
            <span className="font-semibold text-blue-400 flex items-center gap-1">
              <Edit3 className="w-3 h-3" /> Editing Paragraph in Place
            </span>
            <span>Press <kbd className="bg-slate-800 px-1 rounded text-slate-300">Ctrl+Enter</kbd> to save</span>
          </div>

          <textarea
            ref={editInputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleSaveDirectEdit();
              } else if (e.key === 'Escape') {
                handleCancelDirectEdit();
              }
            }}
            rows={Math.max(3, Math.min(12, editText.split('\n').length + 1))}
            className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs leading-relaxed focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={handleCancelDirectEdit}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSaveDirectEdit}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      ) : (
        /* ── Normal Rendered View ─────────────────────────────────────── */
        <div
          onDoubleClick={() => isReviewMode && setIsEditing(true)}
          className={`prose prose-invert prose-blue max-w-none text-slate-200 text-sm leading-relaxed ${
            isHovered && isReviewMode ? 'cursor-pointer' : ''
          }`}
          dangerouslySetInnerHTML={{ __html: marked.parse(block.rawText) }}
        />
      )}

      {/* ── Point & Comment / AI Prompt Drawer (Expands under paragraph) ── */}
      {isCommenting && (
        <div className="mt-3 p-3.5 bg-slate-900 border border-indigo-500/40 rounded-xl shadow-xl animate-fadeIn space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Point & Comment: Revise Paragraph with AI</span>
            </div>
            <button
              onClick={() => setIsCommenting(false)}
              className="text-slate-400 hover:text-slate-200 p-0.5 rounded hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quoted target snippet */}
          <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 italic line-clamp-2">
            "{block.rawText.replace(/^#{1,6}\s*/, '').substring(0, 140)}..."
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-1.5">
            {QUICK_COMMENT_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCommentInput(prompt)}
                className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Comment / Instruction Input */}
          <div className="relative">
            <textarea
              ref={commentInputRef}
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleApplyAI();
                }
              }}
              placeholder="Type your comment or instruction (e.g., 'Change dosing to 1000mg BID', 'Make this bullet points', 'Add eGFR < 30 exclusion threshold')..."
              rows={3}
              className="w-full p-2.5 bg-slate-950 border border-slate-750 rounded-lg text-slate-200 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-500">
              Press <kbd className="bg-slate-800 px-1 rounded text-slate-400">Ctrl+Enter</kbd> to apply with AI
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveComment}
                disabled={!commentInput.trim() || isApplyingAI}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Pin Comment</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyAI()}
                disabled={!commentInput.trim() || isApplyingAI}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isApplyingAI ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Revising...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Apply AI Revision</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Pinned Comments Thread for this Block ──────────────────────── */}
      {activeComments.length > 0 && (
        <div className="mt-2.5 space-y-1.5 pl-3 border-l-2 border-indigo-500/50">
          {activeComments.map((comment) => (
            <div
              key={comment.id}
              className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1.5"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-semibold text-indigo-300 flex items-center gap-1">
                  <MessageSquare className="w-2.5 h-2.5" /> Reviewer Comment
                </span>
                <span>{comment.timestamp ? new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
              </div>

              <p className="text-slate-200 text-xs leading-relaxed">{comment.text}</p>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/80">
                <button
                  onClick={() => handleApplyAI(comment.text)}
                  disabled={isApplyingAI}
                  className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  title="Ask AI to apply this comment to this paragraph"
                >
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>Apply with AI</span>
                </button>

                <button
                  onClick={() => onResolveComment(comment.id)}
                  className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                  title="Mark comment as resolved"
                >
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>Resolve</span>
                </button>

                <button
                  onClick={() => onDeleteComment(comment.id)}
                  className="p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                  title="Delete comment"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


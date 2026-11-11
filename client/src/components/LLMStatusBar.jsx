import React from 'react';
import { Zap, AlertCircle, CheckCircle2, ExternalLink, Settings } from 'lucide-react';

export default function LLMStatusBar({ llmStatus, hfToken, onOpenSettings }) {
  if (!llmStatus) return null;

  const isOnline = llmStatus.status === 'online';
  const hasToken = llmStatus.token_configured || Boolean(hfToken);

  if (isOnline && hasToken) {
    // All good — show a minimal green bar
    return (
      <div className="mb-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        <span>
          <span className="font-semibold">AI Engine Online:</span> Meta-Llama-3.1-8B-Instruct is active and generating real AI content.
        </span>
      </div>
    );
  }

  if (isOnline && !hasToken) {
    return (
      <div className="mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
        <div className="flex items-center gap-2 flex-1">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <div>
            <span className="font-semibold text-amber-200">Hugging Face token not configured.</span>
            {' '}The Python LLM server is running but needs your free HF token to call Meta-Llama-3.1-8B-Instruct.
            {' '}
            <a
              href="https://huggingface.co/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-amber-100 inline-flex items-center gap-0.5"
            >
              Get a free token <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Settings className="w-3.5 h-3.5" />
          Add Token
        </button>
      </div>
    );
  }

  // LLM server is offline
  return (
    <div className="mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
      <div className="flex items-center gap-2 flex-1">
        <Zap className="w-4 h-4 shrink-0 text-red-400" />
        <div>
          <span className="font-semibold text-red-200">Python LLM server is not running.</span>
          {' '}Open a terminal in the project folder and run:
          {' '}
          <code className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded font-mono">
            npm run dev
          </code>
          {' '}to start both the API and the LLM microservice together.
        </div>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { X, Key, Cpu, Sparkles, Check, ExternalLink, CheckCircle2, AlertCircle, Zap, ZapOff, Cloud, Server } from 'lucide-react';

const API_PROVIDERS = [
  {
    id: 'groq',
    name: 'Groq Cloud (Recommended — 500 tokens/sec)',
    description: 'Ultra-fast, instant protocol generation with Llama-3.3-70B. Free tier available.',
    defaultModel: 'llama-3.3-70b-versatile',
    keyPlaceholder: 'gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    keyLink: 'https://console.groq.com/keys',
    keyLinkText: 'Get Free Groq Key'
  },
  {
    id: 'openai',
    name: 'OpenAI (GPT-4o Mini)',
    description: 'High accuracy clinical reasoning using OpenAI GPT-4o Mini.',
    defaultModel: 'gpt-4o-mini',
    keyPlaceholder: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx',
    keyLink: 'https://platform.openai.com/api-keys',
    keyLinkText: 'Get OpenAI Key'
  },
  {
    id: 'openrouter',
    name: 'OpenRouter (Llama 3.1 & Free Models)',
    description: 'Access multiple top clinical models with a single unified key.',
    defaultModel: 'huihui-ai/Qwen2.5-72B-Instruct-abliterated:free',
    keyPlaceholder: 'sk-or-xxxxxxxxxxxxxxxxxxxxxxxxxx',
    keyLink: 'https://openrouter.ai/keys',
    keyLinkText: 'Get OpenRouter Key'
  },
  {
    id: 'huggingface',
    name: 'Hugging Face API',
    description: 'Access Meta-Llama models hosted on Hugging Face Inference.',
    defaultModel: 'huihui-ai/Qwen2.5-72B-Instruct-abliterated',
    keyPlaceholder: 'hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    keyLink: 'https://huggingface.co/settings/tokens',
    keyLinkText: 'Get Free HF Token'
  },
  {
    id: 'builtin',
    name: 'Multi-Agent DAG Engine (Built-in High-Speed)',
    description: 'Zero-latency, 100% offline, comprehensive ICH M11 medical engine with LaTeX refinement.',
    defaultModel: 'Clinical-DAG-Engine',
    keyPlaceholder: 'No API key needed (built-in)',
    keyLink: '',
    keyLinkText: ''
  },
  {
    id: 'local',
    name: 'Local GPU Neural Engine (RTX 3050)',
    description: 'Runs on local GPU PyTorch server on port 5001.',
    defaultModel: 'Qwen/Qwen2.5-0.5B-Instruct',
    keyPlaceholder: 'No API key needed (runs locally)',
    keyLink: '',
    keyLinkText: ''
  }
];

export default function SettingsModal({
  isOpen, onClose,
  hfToken, setHfToken,
  hfModel, setHfModel,
  models = [],
  llmStatus,
  apiProvider, setApiProvider,
  apiKey, setApiKey
}) {
  const [selectedProvider, setSelectedProvider] = useState(apiProvider || 'groq');
  const [localApiKey, setLocalApiKey] = useState(apiKey || hfToken || '');
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const currentProvider = API_PROVIDERS.find(p => p.id === selectedProvider) || API_PROVIDERS[0];

  const handleSave = () => {
    if (setApiProvider) {
      setApiProvider(selectedProvider);
      localStorage.setItem('api_provider', selectedProvider);
    }
    if (setApiKey) {
      setApiKey(localApiKey.trim());
      localStorage.setItem('api_key', localApiKey.trim());
    }
    // Backward compatibility with hfToken
    if (setHfToken) {
      setHfToken(localApiKey.trim());
      localStorage.setItem('hf_token', localApiKey.trim());
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 700);
  };

  const isOnline = llmStatus?.status === 'online';
  const hasKey = Boolean(localApiKey.trim()) || selectedProvider === 'builtin' || selectedProvider === 'local';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">AI Engine & Cloud API Settings</h3>
              <p className="text-xs text-slate-400">Configure fast cloud APIs for the Multi-Agent DAG</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs text-slate-300">

          {/* Engine Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
              Primary LLM Provider
            </label>
            <div className="space-y-2">
              {API_PROVIDERS.map(p => (
                <label
                  key={p.id}
                  onClick={() => setSelectedProvider(p.id)}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${selectedProvider === p.id
                      ? 'bg-blue-600/10 border-blue-500/60 ring-1 ring-blue-500/30'
                      : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                    }`}
                >
                  <input
                    type="radio"
                    name="apiProvider"
                    checked={selectedProvider === p.id}
                    onChange={() => setSelectedProvider(p.id)}
                    className="mt-0.5 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-100">{p.name}</span>
                      {p.id === 'groq' && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold">
                          ⚡ 500 tok/sec
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{p.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* API Key Input (if provider requires key) */}
          {selectedProvider !== 'builtin' && selectedProvider !== 'local' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  {currentProvider.name} API Key
                </label>
                {currentProvider.keyLink && (
                  <a
                    href={currentProvider.keyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-0.5"
                  >
                    {currentProvider.keyLinkText} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  placeholder={currentProvider.keyPlaceholder}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-20 text-xs text-slate-100 font-mono outline-none focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
                <Key className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Multi-Agent DAG Notice */}
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Multi-Agent DAG & Content Filter Active</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Every generation and chat edit passes through 5 specialized DAG agents (Architect → Biostatistician → Clinical Ops → Regulatory → Refinement Filter).
              Raw LaTeX expressions like <code className="bg-black/40 px-1 rounded text-amber-300">$\le 2.5 \times$</code> are automatically converted to clean Unicode <code className="bg-black/40 px-1 rounded text-emerald-300">≤ 2.5 ×</code> error-free.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800 p-4 border-t border-slate-700 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save & Apply</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

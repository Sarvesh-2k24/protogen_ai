import React, { useState } from 'react';
import { Search, Sparkles, ExternalLink, Globe, BookOpen, AlertCircle } from 'lucide-react';

const SAMPLE_TITLES = [
  {
    label: 'Heart Failure & Obesity (Phase 3)',
    title: 'A Phase 3, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Efficacy and Safety of Tirzepatide in Adults with Heart Failure with Preserved Ejection Fraction and Obesity'
  },
  {
    label: 'Oncology / NSCLC (Phase 3)',
    title: 'A Phase 3 Randomized Study of Pembrolizumab Combined with Chemotherapy in Patients with Previously Untreated Metastatic Non-Small Cell Lung Cancer'
  },
  {
    label: 'Alzheimer’s Disease (Phase 3)',
    title: 'A Phase 3 Multicenter, Double-Blind, Placebo-Controlled 18-Month Study to Confirm the Efficacy and Safety of Lecanemab in Participants with Early Alzheimer’s Disease'
  },
  {
    label: 'Metabolic MASH / Steatohepatitis (Phase 2b)',
    title: 'A Phase 2b Double-Blind, Randomized, Placebo-Controlled Trial of a Dual GLP-1/GIP Receptor Agonist in Non-Cirrhotic Metabolic Dysfunction-Associated Steatohepatitis'
  }
];

export default function TitleInputBar({
  title,
  setTitle,
  onSearchReferences,
  isSearching,
  referencesCount
}) {
  const [isOpenPresets, setIsOpenPresets] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSearchReferences(title.trim());
    }
  };

  const selectPreset = (presetTitle) => {
    setTitle(presetTitle);
    onSearchReferences(presetTitle);
    setIsOpenPresets(false);
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-sm mb-6">
      <div className="flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Protocol Title & Clinical Reference Search
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Searches ClinicalTrials.gov v2 & Europe PMC</span>
          </div>
        </div>

        {/* Input & Search Button */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter clinical protocol title (e.g. A Phase 3, Randomized, Double-Blind Study of Tirzepatide in HFpEF and Obesity)..."
              className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-4 py-3 outline-none transition-all"
            />
            {title && (
              <button
                type="button"
                onClick={() => setTitle('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs px-1.5 py-0.5 rounded cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSearching || !title.trim()}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer ${
              isSearching
                ? 'bg-blue-600/50 text-blue-200 cursor-wait'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20'
            }`}
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Searching Web...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search References</span>
              </>
            )}
          </button>
        </form>

        {/* Preset suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-400">
          <span className="font-medium text-slate-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick Examples:
          </span>
          {SAMPLE_TITLES.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => selectPreset(sample.title)}
              className="px-2.5 py-1 rounded-lg bg-slate-750 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px]"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


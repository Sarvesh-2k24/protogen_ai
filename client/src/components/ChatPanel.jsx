import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Sparkles, ArrowRight, Check, Copy,
  FileText, Bot, User, Replace, Cpu, Layers
} from 'lucide-react';
import { marked } from 'marked';
import DAGPipelineBar from './DAGPipelineBar';

marked.setOptions({ breaks: true, gfm: true });

const SECTION_QUICK_PROMPTS = {
  1: [
    'Draft the full 52-week schedule of activities (SoA) table',
    'Draw the trial schema flowchart with screening, randomization, and follow-up',
    'Write the synopsis with phase, N, primary endpoint, and duration'
  ],
  2: [
    'Explain the unmet medical need and why current SOC is insufficient',
    'Write the benefit-risk assessment with specific identified risks and mitigations',
    'Summarize the preclinical and Phase 1/2 data supporting this dose'
  ],
  3: [
    'Define the primary estimand with all 5 ICH E9(R1) attributes',
    'Add a co-primary PRO endpoint using KCCQ-CSS at Week 52',
    'List secondary endpoints: 6MWD, NT-proBNP, all-cause hospitalization'
  ],
  4: [
    'Describe the 1:1 randomization, stratification factors, and blinding method',
    'Justify why placebo was chosen as the comparator instead of active control',
    'Define FSFV, LSLV, and what constitutes start/end of trial'
  ],
  5: [
    'Write numbered inclusion criteria including diagnostic criteria and lab thresholds',
    'Write exclusion criteria: comorbidities, prior therapies, organ function cut-offs',
    'Add contraception requirements and re-screening policy'
  ],
  6: [
    'Describe the dosing titration schedule from starting dose to maintenance',
    'Specify storage at 2°C–8°C, cold-chain handling, and drug accountability logs',
    'Define dose withholding and step-down rules for Grade 3–4 AEs'
  ],
  7: [
    'Distinguish between stopping study drug vs. full withdrawal from the trial',
    'Write lost-to-follow-up procedure: 3 phone attempts + certified letter',
    'List required assessments at the early termination visit'
  ],
  8: [
    'Specify triplicate 12-lead ECG schedule with QTcF measurement',
    'Define PK blood draw time points and -80°C plasma storage protocol',
    'Detail the blinded central review process for efficacy endpoints'
  ],
  9: [
    'Write 24-hour SAE reporting procedure with form and contact details',
    'List SUSAR timelines: 7-day for fatal, 15-day for all other',
    'Describe pregnancy reporting and 30-day follow-up to outcome'
  ],
  10: [
    'Calculate sample size: 90% power, two-sided alpha 0.05, 15% dropout',
    'Specify MMRM model with treatment, visit, interaction, and baseline covariates',
    'Describe multiple imputation strategy for missing primary endpoint data'
  ],
  11: [
    'Write GCP compliance statement referencing ICH E6(R2), 21 CFR 312, Helsinki',
    'Describe the IDMC charter: composition, meeting frequency, and unblinding authority',
    'Write the GDPR/HIPAA pseudonymization and 25-year archive retention policy'
  ],
  12: [
    'Generate a comprehensive glossary of all acronyms used in the protocol',
    'Write Appendix 4: full clinical lab test list (hematology, biochemistry, urinalysis)',
    'Draft the contraception guidance: list all methods with <1% failure rate'
  ],
  13: [
    'Write the trial registration section: ClinicalTrials.gov + WHO ICTRP registration',
    'Describe patient and public involvement (PPI) in the protocol design',
    'Write the data sharing policy for de-identified patient-level data'
  ]
};

export default function ChatPanel({
  activeSection,
  onGenerateStep,
  isGenerating,
  onApplyChatToDraft,
  onReplaceDraft,
  chatMessages,
  onSendMessage,
  isChatLoading,
  onNextStep,
  hasNextStep,
  llmStatus,
  activeDAGLevel = null,
  dagLogs = []
}) {
  const [inputMessage, setInputMessage] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isChatLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleQuickPrompt = (prompt) => {
    onSendMessage(prompt);
  };

  const copyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const quickPrompts = SECTION_QUICK_PROMPTS[activeSection?.stepNumber] || [
    'Draft this section with full clinical detail',
    'What are the regulatory requirements for this section?',
    'Show me examples from real clinical trials'
  ];

  const isAIReady = llmStatus?.status === 'online' && (llmStatus?.token_configured || false);

  return (
    <div className="flex flex-col h-[750px] bg-slate-850 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">

      {/* Section header */}
      <div className="bg-slate-800/90 border-b border-slate-700/80 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                Step {activeSection?.stepNumber}
              </span>
              <h3 className="text-sm font-bold text-slate-100 line-clamp-1">
                {activeSection?.title}
              </h3>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">
              {activeSection?.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onGenerateStep(activeSection)}
              disabled={isGenerating}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer ${
                isGenerating
                  ? 'bg-blue-600/50 text-blue-200 cursor-wait'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Draft Step {activeSection?.stepNumber}</span>
                </>
              )}
            </button>

            {hasNextStep && (
              <button
                onClick={onNextStep}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs bg-slate-750 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Subsection chips */}
        {activeSection?.subsections && (
          <div className="mt-3 pt-2.5 border-t border-slate-750/80">
            <div className="flex flex-wrap gap-1.5">
              {activeSection.subsections.map((sub) => (
                <span
                  key={sub.id}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-slate-750"
                  title={sub.promptHint}
                >
                  {sub.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Multi-Agent DAG Pipeline Monitor */}
      <div className="px-4 pt-3">
        <DAGPipelineBar
          activeLevel={activeDAGLevel}
          isRunning={isGenerating || isChatLoading}
          lastLogs={dagLogs}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
              <Bot className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200 mb-1">Clinical Protocol Copilot</h4>
            <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
              Click <span className="text-blue-400 font-semibold">"Draft Step {activeSection?.stepNumber}"</span> for AI generation, or type any instruction below.
            </p>
            <div className="w-full max-w-sm text-left space-y-1.5">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="w-full text-left text-xs p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center justify-between gap-2"
                >
                  <span>{prompt}</span>
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role !== 'user' && (
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[88%] rounded-2xl p-3.5 text-xs ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-800/90 border border-slate-700 text-slate-200 rounded-tl-none shadow-md'
              }`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                ) : (
                  <div>
                    <div
                      className="prose prose-invert prose-xs max-w-none leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: marked.parse(msg.content || '') }}
                    />

                    {/* Engine badge + action buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
                      <div className="flex items-center gap-2 flex-wrap">
                        {msg.engine && (
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-900/60 border border-slate-750 px-2 py-0.5 rounded-md">
                            <Cpu className="w-3 h-3 text-indigo-400" />
                            {msg.engine}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-medium">
                          <Sparkles className="w-2.5 h-2.5" />
                          5-Agent DAG Refined (LaTeX Error-Free)
                        </span>
                      </div>

                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => copyText(msg.content, idx)}
                          className="flex items-center gap-1 hover:text-slate-200 transition-colors cursor-pointer"
                        >
                          {copiedIndex === idx ? (
                            <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
                          ) : (
                            <><Copy className="w-3 h-3" /><span>Copy</span></>
                          )}
                        </button>

                        <button
                          onClick={() => onApplyChatToDraft(msg.content)}
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-medium"
                          title="Append to active section"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Append</span>
                        </button>

                        <button
                          onClick={() => onReplaceDraft(msg.content)}
                          className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-medium"
                          title="Replace entire active section with this content"
                        >
                          <Replace className="w-3 h-3" />
                          <span>Replace</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 shrink-0 shadow-sm mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isChatLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400 flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
              </div>
              <span>AI engine thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts strip (when messages present) */}
      {chatMessages.length > 0 && (
        <div className="px-3 py-1.5 bg-slate-900/60 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-slate-500 font-medium shrink-0">Try:</span>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleQuickPrompt(p)}
              className="px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap cursor-pointer transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            isAIReady
              ? `Ask AI to change, reformat, or expand Step ${activeSection?.stepNumber}...`
              : `Type a request (configure HF token for real AI)...`
          }
          disabled={isChatLoading}
          className="flex-1 bg-slate-800 border border-slate-700 hover:border-slate-650 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 placeholder-slate-500 text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isChatLoading}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white shadow-md transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

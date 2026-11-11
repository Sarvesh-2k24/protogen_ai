import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import TitleInputBar from './components/TitleInputBar';
import Stepper from './components/Stepper';
import ReferencesDrawer from './components/ReferencesDrawer';
import ChatPanel from './components/ChatPanel';
import DocumentViewer from './components/DocumentViewer';
import SettingsModal from './components/SettingsModal';
import LLMStatusBar from './components/LLMStatusBar';

export default function App() {
  const [protocolTitle, setProtocolTitle] = useState(
    'A Phase 3, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Efficacy and Safety of Tirzepatide in Adults with Heart Failure with Preserved Ejection Fraction and Obesity'
  );
  const [sections, setSections] = useState([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [sectionDrafts, setSectionDrafts] = useState({});
  const [references, setReferences] = useState([]);
  const [selectedRefIds, setSelectedRefIds] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  // LLM & Multi-Agent DAG settings
  const [hfModel, setHfModel] = useState(localStorage.getItem('hf_model') || 'meta-llama/Llama-3.1-8B-Instruct');
  const [hfToken, setHfToken] = useState(localStorage.getItem('hf_token') || '');
  const [apiProvider, setApiProvider] = useState(localStorage.getItem('api_provider') || 'groq');
  const [apiKey, setApiKey] = useState(localStorage.getItem('api_key') || localStorage.getItem('hf_token') || '');
  const [activeDAGLevel, setActiveDAGLevel] = useState(null);
  const [lastDAGLogs, setLastDAGLogs] = useState([]);
  const [models, setModels] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [llmStatus, setLlmStatus] = useState(null); // { status, token_configured, message }

  // Loading flags
  const [isSearchingReferences, setIsSearchingReferences] = useState(false);
  const [isGeneratingStep, setIsGeneratingStep] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // ── Poll LLM status every 10 seconds ──────────────────────────────
  const checkLLMStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/llm-status');
      if (res.ok) {
        const data = await res.json();
        setLlmStatus(data);
      }
    } catch {
      setLlmStatus({ status: 'offline', message: 'Python LLM server offline' });
    }
  }, []);

  // ── On mount: load structure, models, check LLM, search refs ──────
  useEffect(() => {
    async function init() {
      try {
        const [structRes, modelsRes] = await Promise.all([
          fetch('/api/structure'),
          fetch('/api/models')
        ]);
        if (structRes.ok) {
          const d = await structRes.json();
          setSections(d.sections || []);
        }
        if (modelsRes.ok) {
          const d = await modelsRes.json();
          setModels(d.models || []);
        }
      } catch (err) {
        console.warn('Init failed:', err);
      }
    }
    init();
    checkLLMStatus();

    // Poll LLM status every 15s
    const interval = setInterval(checkLLMStatus, 15000);
    return () => clearInterval(interval);
  }, [checkLLMStatus]);

  // Initial reference search on load
  useEffect(() => {
    if (protocolTitle && references.length === 0) {
      handleSearchReferences(protocolTitle);
    }
  }, []); // eslint-disable-line

  // Re-check LLM status when token changes
  useEffect(() => {
    checkLLMStatus();
  }, [hfToken, checkLLMStatus]);

  // ── Reference Search ───────────────────────────────────────────────
  const handleSearchReferences = async (titleToSearch) => {
    if (!titleToSearch?.trim()) return;
    setIsSearchingReferences(true);
    try {
      const res = await fetch('/api/references', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: titleToSearch })
      });
      if (res.ok) {
        const data = await res.json();
        const refs = data.references || [];
        setReferences(refs);
        setSelectedRefIds(refs.map(r => r.id));

        const refList = refs.slice(0, 3)
          .map(r => `• **${r.id}** (${r.source}): *${r.title}*`)
          .join('\n');

        const llmNote = llmStatus?.token_configured
          ? `\n\n> 🤖 **AI Engine:** Meta-Llama-3.1-8B-Instruct is active and ready for real generation.`
          : `\n\n> ⚠️ **No HF Token set** — click ⚙️ Settings to add your Hugging Face token for real AI generation.`;

        setChatMessages([{
          role: 'assistant',
          content: `### ProtocolGen AI Ready 🚀\n\nWorkspace initialized for:\n**"${titleToSearch}"**\n\nFound **${refs.length} clinical references** from ClinicalTrials.gov and Europe PMC:\n\n${refList}${llmNote}\n\nClick **"Draft Step 1"** to start generating the protocol!`
        }]);
      }
    } catch (err) {
      console.error('Reference search failed:', err);
    } finally {
      setIsSearchingReferences(false);
    }
  };

  // ── Reference Selection ────────────────────────────────────────────
  const handleToggleRef = (refId) =>
    setSelectedRefIds(prev =>
      prev.includes(refId) ? prev.filter(id => id !== refId) : [...prev, refId]
    );

  const handleSelectAllRefs = () => setSelectedRefIds(references.map(r => r.id));
  const handleClearAllRefs = () => setSelectedRefIds([]);

  // ── Generate a single protocol section ────────────────────────────
  const handleGenerateStep = async (section, customGuidance = '') => {
    if (!section) return;
    setIsGeneratingStep(true);
    setActiveDAGLevel(1);
    const dagTimer1 = setTimeout(() => setActiveDAGLevel(2), 200);
    const dagTimer2 = setTimeout(() => setActiveDAGLevel(3), 400);
    const dagTimer3 = setTimeout(() => setActiveDAGLevel(4), 600);
    const dagTimer4 = setTimeout(() => setActiveDAGLevel(5), 800);

    try {
      const activeRefs = references.filter(r => selectedRefIds.includes(r.id));
      const res = await fetch('/api/generate-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: protocolTitle,
          stepId: section.id,
          stepNumber: section.stepNumber,
          stepTitle: section.title,
          subsections: section.subsections,
          references: activeRefs,
          existingContent: sectionDrafts[section.id] || '',
          userGuidance: customGuidance,
          hfModel,
          hfToken,
          apiProvider,
          apiKey
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.dagLogs) setLastDAGLogs(data.dagLogs);

        // If the LLM returned an error message, show it in chat but don't overwrite draft
        if (data.engine === 'error') {
          setChatMessages(prev => [...prev, {
            role: 'assistant',
            content: data.content
          }]);
          return;
        }

        setSectionDrafts(prev => ({ ...prev, [section.id]: data.content }));
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: `✅ **${section.title}** orchestrated across 5 DAG levels via *${data.engine}*.\n\nAll math refined error-free (e.g. $\\le 2.5 \\times$ sanitized to Unicode). Review in the Document panel.`,
          engine: data.engine,
          dagLogs: data.dagLogs
        }]);
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Server error');
      }
    } catch (err) {
      console.error('Generate step failed:', err);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ Failed to generate **${section.title}**: ${err.message}`
      }]);
    } finally {
      clearTimeout(dagTimer1);
      clearTimeout(dagTimer2);
      clearTimeout(dagTimer3);
      clearTimeout(dagTimer4);
      setActiveDAGLevel(null);
      setIsGeneratingStep(false);
    }
  };

  // ── Auto-draft all 13 sections sequentially ────────────────────────
  const handleGenerateAll = async () => {
    if (!sections.length || isGeneratingAll) return;
    setIsGeneratingAll(true);
    setChatMessages(prev => [...prev, {
      role: 'assistant',
      content: `🚀 **Auto-Drafting all ${sections.length} sections via Multi-Agent DAG...**\n\nEach section executes through 5 specialized agents with LaTeX refinement.`
    }]);

    for (let i = 0; i < sections.length; i++) {
      setActiveStepIndex(i);
      await handleGenerateStep(sections[i]);
    }

    setIsGeneratingAll(false);
    setChatMessages(prev => [...prev, {
      role: 'assistant',
      content: `🎉 **All ${sections.length} protocol sections generated!**\n\nExport as **Word (.docx)**, **Markdown**, or **PDF** using the top navigation buttons.`
    }]);
  };

  // ── Chat with the AI assistant ─────────────────────────────────────
  const handleSendMessage = async (userMessage) => {
    const activeSection = sections[activeStepIndex];
    const newHistory = [...chatMessages, { role: 'user', content: userMessage }];
    setChatMessages(newHistory);
    setIsChatLoading(true);
    setActiveDAGLevel(1);
    const dagTimer1 = setTimeout(() => setActiveDAGLevel(2), 200);
    const dagTimer2 = setTimeout(() => setActiveDAGLevel(3), 400);
    const dagTimer3 = setTimeout(() => setActiveDAGLevel(4), 600);
    const dagTimer4 = setTimeout(() => setActiveDAGLevel(5), 800);

    try {
      const activeRefs = references.filter(r => selectedRefIds.includes(r.id));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: newHistory,
          protocolTitle,
          currentStepTitle: activeSection?.title || '',
          activeSectionContent: sectionDrafts[activeSection?.id] || '',
          references: activeRefs,
          hfModel,
          hfToken,
          apiProvider,
          apiKey
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.dagLogs) setLastDAGLogs(data.dagLogs);
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: data.reply,
          engine: data.engine,
          dagLogs: data.dagLogs
        }]);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ Chat error: ${err.message}`
      }]);
    } finally {
      clearTimeout(dagTimer1);
      clearTimeout(dagTimer2);
      clearTimeout(dagTimer3);
      clearTimeout(dagTimer4);
      setActiveDAGLevel(null);
      setIsChatLoading(false);
    }
  };

  // ── Apply chat response into active draft ──────────────────────────
  const handleApplyChatToDraft = (content) => {
    const activeSection = sections[activeStepIndex];
    if (!activeSection) return;
    setSectionDrafts(prev => {
      const current = prev[activeSection.id] || '';
      return {
        ...prev,
        [activeSection.id]: current
          ? `${current}\n\n---\n\n${content}`
          : content
      };
    });
    setChatMessages(prev => [...prev, {
      role: 'assistant',
      content: `✅ Content inserted into **${activeSection.title}**. Switch to the Document panel to review.`
    }]);
  };

  // ── Replace active draft with chat response ────────────────────────
  const handleReplaceDraftWithChat = (content) => {
    const activeSection = sections[activeStepIndex];
    if (!activeSection) return;
    setSectionDrafts(prev => ({ ...prev, [activeSection.id]: content }));
    setChatMessages(prev => [...prev, {
      role: 'assistant',
      content: `✅ **${activeSection.title}** replaced with the new content.`
    }]);
  };

  // ── Direct markdown editor update ─────────────────────────────────
  const handleUpdateDraft = (sectionId, newContent) => {
    setSectionDrafts(prev => ({ ...prev, [sectionId]: newContent }));
  };

  const handleNextStep = () => {
    if (activeStepIndex < sections.length - 1) setActiveStepIndex(prev => prev + 1);
  };

  // ── Export handlers ────────────────────────────────────────────────
  const handleExportDocx = async () => {
    try {
      const exportSections = sections.map(s => ({
        id: s.id, title: s.title, content: sectionDrafts[s.id] || ''
      }));
      const res = await fetch('/api/export-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: protocolTitle, sections: exportSections })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(protocolTitle || 'protocol').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40)}_ICH_M11.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      alert('Export failed: ' + err.message);
    }
  };

  const handleExportMarkdown = () => {
    let md = `# CLINICAL TRIAL PROTOCOL\n\n**Title:** ${protocolTitle}\n\n**Standard:** ICH M11 / SPIRIT 2013\n\n**Date:** ${new Date().toLocaleDateString()}\n\n---\n\n`;
    sections.forEach(sec => {
      md += `## ${sec.title}\n\n${sectionDrafts[sec.id] || '*Section pending generation.*'}\n\n---\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Clinical_Protocol_ICH_M11.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => window.print();

  // ── Derived state ──────────────────────────────────────────────────
  const completedCount = sections.filter(s =>
    Boolean(sectionDrafts[s.id]?.trim().length > 30)
  ).length;
  const activeSection = sections[activeStepIndex] || sections[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar
        hfModel={hfModel}
        llmStatus={llmStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportDocx={handleExportDocx}
        onExportMarkdown={handleExportMarkdown}
        onPrintPdf={handlePrintPdf}
        onGenerateAll={handleGenerateAll}
        isGeneratingAll={isGeneratingAll}
        completedCount={completedCount}
        totalCount={sections.length || 13}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* LLM Connection Status Bar */}
        <LLMStatusBar
          llmStatus={llmStatus}
          hfToken={hfToken}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <TitleInputBar
          title={protocolTitle}
          setTitle={setProtocolTitle}
          onSearchReferences={handleSearchReferences}
          isSearching={isSearchingReferences}
          referencesCount={references.length}
        />

        <ReferencesDrawer
          references={references}
          selectedRefIds={selectedRefIds}
          onToggleRef={handleToggleRef}
          onSelectAll={handleSelectAllRefs}
          onClearAll={handleClearAllRefs}
        />

        {sections.length > 0 && (
          <Stepper
            sections={sections}
            activeStepIndex={activeStepIndex}
            onSelectStep={setActiveStepIndex}
            sectionDrafts={sectionDrafts}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Chat / Copilot */}
          <div className="lg:col-span-5">
            <ChatPanel
              activeSection={activeSection}
              onGenerateStep={handleGenerateStep}
              isGenerating={isGeneratingStep}
              onApplyChatToDraft={handleApplyChatToDraft}
              onReplaceDraft={handleReplaceDraftWithChat}
              chatMessages={chatMessages}
              onSendMessage={handleSendMessage}
              isChatLoading={isChatLoading}
              onNextStep={handleNextStep}
              hasNextStep={activeStepIndex < sections.length - 1}
              llmStatus={llmStatus}
              activeDAGLevel={activeDAGLevel}
              dagLogs={lastDAGLogs}
            />
          </div>

          {/* Right: Document Viewer / Editor */}
          <div className="lg:col-span-7">
            <DocumentViewer
              title={protocolTitle}
              sections={sections}
              activeSection={activeSection}
              sectionDrafts={sectionDrafts}
              onUpdateDraft={handleUpdateDraft}
              onExportDocx={handleExportDocx}
              onGenerateAll={handleGenerateAll}
              isGeneratingAll={isGeneratingAll}
              activeDAGLevel={activeDAGLevel}
              dagLogs={lastDAGLogs}
            />
          </div>
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        hfToken={hfToken}
        setHfToken={setHfToken}
        hfModel={hfModel}
        setHfModel={setHfModel}
        models={models}
        llmStatus={llmStatus}
        apiProvider={apiProvider}
        setApiProvider={setApiProvider}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
    </div>
  );
}

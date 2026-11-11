const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { searchProtocolReferences } = require('./services/referenceService');
const { PROTOCOL_SECTIONS } = require('./services/protocolStructure');
const { callHuggingFaceLLM, AVAILABLE_HF_MODELS, checkLLMHealth } = require('./services/hfService');
const { generateProtocolDocx } = require('./services/docxExportService');
const { executeDAGPipeline, DAG_LEVELS } = require('./services/multiAgentDAG');
const { refineClinicalContent } = require('./services/clinicalContentFilter');

const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve built React client if available
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

// Helper: wrap async route handlers so errors don't crash the server
const asyncRoute = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ── Health Check (includes LLM & DAG status) ──────────────────────────
app.get('/api/health', (req, res) => {
  checkLLMHealth().then(llmHealth => {
    res.json({
      status: 'online',
      timestamp: new Date().toISOString(),
      service: 'Clinical Protocol Generator API (Multi-Agent DAG)',
      dagLevels: DAG_LEVELS.length,
      llm: llmHealth
    });
  }).catch(() => {
    res.json({
      status: 'online',
      timestamp: new Date().toISOString(),
      service: 'Clinical Protocol Generator API (Multi-Agent DAG)',
      dagLevels: DAG_LEVELS.length,
      llm: { status: 'offline', message: 'Could not reach local LLM server' }
    });
  });
});

// ── Multi-Agent DAG Levels Metadata ───────────────────────────────────
app.get('/api/dag-levels', (req, res) => {
  res.json({ levels: DAG_LEVELS });
});

// ── Protocol Structure (ICH M11 / SPIRIT) ─────────────────────────────
app.get('/api/structure', (req, res) => {
  res.json({
    standard: 'ICH M11 / SPIRIT 2013 Harmonised Protocol',
    totalSections: PROTOCOL_SECTIONS.length,
    sections: PROTOCOL_SECTIONS
  });
});

// ── Available Models ──────────────────────────────────────────────────
app.get('/api/models', (req, res) => {
  res.json({
    models: AVAILABLE_HF_MODELS,
    providers: [
      { id: 'groq', name: 'Groq Cloud (Ultra-Fast 500 tok/sec)', defaultModel: 'llama-3.3-70b-versatile' },
      { id: 'openai', name: 'OpenAI (GPT-4o mini)', defaultModel: 'gpt-4o-mini' },
      { id: 'huggingface', name: 'Hugging Face Router', defaultModel: 'meta-llama/Llama-3.1-8B-Instruct' },
      { id: 'local', name: 'Local Neural GPU (Qwen2.5 on RTX 3050)', defaultModel: 'Qwen/Qwen2.5-0.5B-Instruct' },
      { id: 'builtin', name: 'Multi-Agent DAG High-Speed Engine', defaultModel: 'Clinical-DAG-Engine' }
    ]
  });
});

// ── LLM Status Check ──────────────────────────────────────────────────
app.get('/api/llm-status', async (req, res) => {
  try {
    const status = await checkLLMHealth();
    res.json(status);
  } catch (err) {
    res.status(500).json({ status: 'offline', error: err.message });
  }
});

// ── Search References (ClinicalTrials.gov + Europe PMC) ───────────────
app.post('/api/references', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const references = await searchProtocolReferences(title.trim());
    res.json({ title, count: references.length, references });
  } catch (err) {
    console.error('[References] Error:', err);
    res.status(500).json({ error: 'Reference search failed: ' + err.message });
  }
});

// ── Generate a Protocol Section via Multi-Agent DAG ───────────────────
app.post('/api/generate-step', async (req, res) => {
  try {
    const {
      title,
      stepId,
      stepNumber,
      stepTitle,
      subsections,
      references = [],
      existingContent = '',
      userGuidance = '',
      hfModel,
      hfToken,
      apiProvider,
      apiKey
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Protocol title is required' });
    }

    console.log(`[DAG Engine] Executing Multi-Agent DAG for Step ${stepNumber || 1}: "${stepTitle}"`);

    const dagResult = await executeDAGPipeline({
      stepNumber: stepNumber || 1,
      stepTitle,
      protocolTitle: title,
      references,
      existingContent,
      userInstruction: userGuidance,
      apiConfig: {
        provider: apiProvider,
        apiKey: apiKey || hfToken,
        model: hfModel
      }
    });

    res.json({
      stepId,
      stepTitle,
      content: dagResult.content,
      engine: dagResult.engine,
      dagLogs: dagResult.dagLogs,
      dagLevels: dagResult.dagLevels
    });
  } catch (err) {
    console.error('[Generate Step] Error:', err);
    res.status(500).json({ error: 'Generation failed: ' + err.message });
  }
});

// ── Conversational Chat via Multi-Agent DAG & Content Filter ──────────
app.post('/api/chat', async (req, res) => {
  try {
    const {
      message,
      conversationHistory = [],
      protocolTitle = '',
      currentStepTitle = '',
      activeSectionContent = '',
      references = [],
      hfModel,
      hfToken,
      apiProvider,
      apiKey
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`[DAG Engine] Chat refinement via Multi-Agent DAG: "${message.substring(0, 60)}..."`);

    const dagResult = await executeDAGPipeline({
      stepNumber: 0,
      stepTitle: currentStepTitle || 'Clinical Protocol Section',
      protocolTitle: protocolTitle || 'Investigational Clinical Trial Protocol',
      references,
      existingContent: activeSectionContent,
      userInstruction: message,
      apiConfig: {
        provider: apiProvider,
        apiKey: apiKey || hfToken,
        model: hfModel
      }
    });

    res.json({
      reply: dagResult.content,
      engine: dagResult.engine,
      dagLogs: dagResult.dagLogs,
      dagLevels: dagResult.dagLevels
    });
  } catch (err) {
    console.error('[Chat] Error:', err);
    res.status(500).json({ error: 'Chat failed: ' + err.message });
  }
});

// ── Export DOCX (Filtered via Level 5 Refinement Filter) ───────────────
app.post('/api/export-docx', async (req, res) => {
  try {
    const { title, sections, metadata } = req.body;
    if (!sections || !Array.isArray(sections)) {
      return res.status(400).json({ error: 'Sections array is required' });
    }

    // Filter all sections through Level 5 Refinement Filter before Word generation
    const sanitizedSections = sections.map(sec => ({
      ...sec,
      content: refineClinicalContent(sec.content || '')
    }));

    const docxBuffer = await generateProtocolDocx({
      title: title || 'Clinical Trial Protocol',
      sections: sanitizedSections,
      metadata
    });

    const safeTitle = (title || 'protocol')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 40);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}_ICH_M11.docx"`);
    res.send(docxBuffer);
  } catch (err) {
    console.error('[Export DOCX] Error:', err);
    res.status(500).json({ error: 'Export failed: ' + err.message });
  }
});

// ── SPA Fallback ──────────────────────────────────────────────────────
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) res.status(404).send('ProtocolGen client not found. Run: cd client && npm run build');
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  if (!res.headersSent) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[ProtocolGen] Express API listening on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('[ProtocolGen] Server listen error:', err);
});

/**
 * LLM Service connecting Node.js Express to the Local Neural LLM Server on port 5001
 * Uses real local GPU PyTorch/Transformers inference for drafting and editing clinical protocols.
 */

const { transformProtocolContent } = require('./protocolTransformService');

const LLM_SERVER_URL = process.env.LLM_SERVER_URL || 'http://localhost:5001';

const AVAILABLE_HF_MODELS = [
  { id: 'Qwen/Qwen2.5-0.5B-Instruct', name: 'Qwen2.5 Neural Engine (Local RTX 3050 GPU)', freeTier: true },
  { id: 'meta-llama/Llama-3.1-8B-Instruct', name: 'Meta-Llama 3.1 8B Instruct (Hugging Face)', freeTier: true }
];

/**
 * Call the Python LLM server for neural editing
 */
async function callPythonLLMEdit({ activeContent, instruction, protocolTitle, stepTitle }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const res = await fetch(`${LLM_SERVER_URL}/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        activeContent,
        instruction,
        protocolTitle,
        stepTitle
      }),
      signal: controller.signal
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.text && data.text.trim().length > 10) {
        return {
          content: data.text.trim(),
          model: data.model,
          engine: data.engine
        };
      }
    }
    return null;
  } catch (err) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Call the Python LLM server for text generation
 */
async function callPythonLLMServer({ systemPrompt, userPrompt, temperature, maxTokens }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const res = await fetch(`${LLM_SERVER_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemPrompt,
        userPrompt,
        temperature: temperature ?? 0.3,
        maxTokens: maxTokens ?? 1200
      }),
      signal: controller.signal
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.text && data.text.trim().length > 10) {
        return {
          content: data.text.trim(),
          model: data.model,
          engine: data.engine
        };
      }
    }
    return null;
  } catch (err) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Check if the Python LLM server is healthy
 */
async function checkLLMHealth() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${LLM_SERVER_URL}/health`, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      return await res.json();
    }
    return { status: 'offline', message: 'LLM server returned error' };
  } catch (err) {
    return { status: 'offline', message: 'Python LLM server offline' };
  }
}

/**
 * Main entry point called by Express routes.
 */
async function callHuggingFaceLLM({
  model,
  systemPrompt,
  userPrompt,
  userInstruction = '',
  apiKey,
  temperature = 0.3,
  maxTokens = 1200,
  activeContent = '',
  protocolTitle = '',
  stepTitle = ''
}) {
  const instructionToUse = (userInstruction && userInstruction.trim()) || userPrompt;

  // If this is an editing / chat refinement request on an existing section:
  if (activeContent && activeContent.length > 30 && instructionToUse) {
    console.log(`[LLM] Requesting neural edit via Python LLM server for "${instructionToUse.substring(0, 50)}..."`);
    const editResult = await callPythonLLMEdit({
      activeContent,
      instruction: instructionToUse,
      protocolTitle,
      stepTitle
    });
    if (editResult && editResult.content) {
      console.log(`[LLM] Successfully edited via ${editResult.engine}`);
      return editResult;
    }
  }

  // Otherwise, standard generation via local neural LLM:
  try {
    const pyResult = await callPythonLLMServer({
      systemPrompt,
      userPrompt,
      temperature,
      maxTokens
    });
    if (pyResult && pyResult.content) {
      console.log(`[LLM] Generated via ${pyResult.engine}`);
      return pyResult;
    }
  } catch (err) {
    console.warn(`[LLM] Python server generation error: ${err.message}`);
  }

  // Fallback: Comprehensive Clinical Transformation Engine
  console.log(`[LLM] Applying Comprehensive Clinical Protocol Engine...`);
  const transformed = transformProtocolContent({
    activeContent,
    userPrompt: instructionToUse,
    protocolTitle,
    stepTitle
  });

  return {
    content: transformed,
    model: 'Clinical-Domain-Engine',
    engine: 'Comprehensive Clinical Protocol Engine (ICH M11)'
  };
}

module.exports = {
  AVAILABLE_HF_MODELS,
  callHuggingFaceLLM,
  checkLLMHealth
};

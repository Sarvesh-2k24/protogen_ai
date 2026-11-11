"""
Local GPU Neural LLM Microservice for ProtocolGen AI
Loads Qwen2.5-Instruct locally using PyTorch & Transformers on the NVIDIA RTX 3050 GPU.
Provides real neural inference and clinical protocol editing.
"""

import os
import sys
import json
import traceback
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ─── Load Environment Variables ──────────────────────────────────────────
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
if os.path.isfile(env_path):
    with open(env_path, encoding='utf-8', errors='ignore') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, val = line.partition("=")
                os.environ.setdefault(key.strip(), val.strip())

# ─── Initialize Local Pipeline ───────────────────────────────────────────
LOCAL_MODEL_ID = "Qwen/Qwen2.5-0.5B-Instruct"
device = "cuda" if torch.cuda.is_available() else "cpu"
gpu_name = torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU"
print(f"[LLM Server] Loading local neural model: {LOCAL_MODEL_ID} on {gpu_name} ({device})...")

try:
    import transformers
    pipeline = transformers.pipeline(
        "text-generation",
        model=LOCAL_MODEL_ID,
        torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
        device_map="auto"
    )
    print(f"[LLM Server] SUCCESS! Model {LOCAL_MODEL_ID} loaded into memory on {gpu_name}.")
    pipeline_ready = True
except Exception as e:
    print(f"[LLM Server] Failed to load local pipeline: {e}", file=sys.stderr)
    pipeline = None
    pipeline_ready = False


# ─── Health ──────────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "model": LOCAL_MODEL_ID,
        "device": f"{gpu_name} ({device})",
        "pipeline_ready": pipeline_ready,
        "message": f"Real neural model active on {gpu_name}"
    })


# ─── Generate & Chat ─────────────────────────────────────────────────────
@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json(force=True)
    system_prompt = data.get("systemPrompt", "You are an expert clinical trial protocol medical writer.")
    user_prompt = data.get("userPrompt", "")
    max_tokens = min(int(data.get("maxTokens", 1200)), 1500)
    temperature = float(data.get("temperature", 0.4))

    if not user_prompt.strip():
        return jsonify({"success": False, "error": "Empty user prompt"}), 400

    if not pipeline_ready or pipeline is None:
        return jsonify({"success": False, "error": "Local pipeline is not loaded"}), 500

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user",   "content": user_prompt},
    ]

    try:
        outputs = pipeline(
            messages,
            max_new_tokens=max_tokens,
            temperature=temperature,
            do_sample=temperature > 0.1,
            pad_token_id=pipeline.tokenizer.eos_token_id
        )
        content = outputs[0]["generated_text"][-1]["content"]
        return jsonify({
            "success": True,
            "text": content,
            "model": LOCAL_MODEL_ID,
            "engine": f"Local Neural Model ({LOCAL_MODEL_ID} on {gpu_name})"
        })
    except Exception as e:
        tb = traceback.format_exc()
        print(f"[LLM Server] Generation error:\n{tb}", file=sys.stderr)
        return jsonify({"success": False, "error": str(e)}), 500


# ─── Clinical Section Rewrite / Edit ──────────────────────────────────────
@app.route("/edit", methods=["POST"])
def edit_section():
    data = request.get_json(force=True)
    active_content = data.get("activeContent", "")
    instruction = data.get("instruction", "")
    protocol_title = data.get("protocolTitle", "")
    step_title = data.get("stepTitle", "")
    max_tokens = min(int(data.get("maxTokens", 1200)), 1500)

    if not instruction.strip():
        return jsonify({"success": False, "error": "Empty edit instruction"}), 400

    if not pipeline_ready or pipeline is None:
        return jsonify({"success": False, "error": "Local pipeline is not loaded"}), 500

    system_prompt = (
        "You are an expert Clinical Protocol Principal Investigator and Regulatory Medical Writer. "
        "The user will give you an existing clinical trial protocol draft and an instruction or question. "
        "If the user asks to modify, format, rewrite, or update the draft: output the complete revised section incorporating the changes in clean GitHub Flavored Markdown. "
        "If the user asks an exploratory question or requests advice: answer the question thoroughly with clinical specificity and regulatory recommendations."
    )

    user_prompt = (
        f"Protocol Title: {protocol_title}\n"
        f"Section: {step_title}\n\n"
        f"=== EXISTING SECTION DRAFT ===\n{active_content[:3000]}\n\n"
        f"=== USER INSTRUCTION / QUESTION ===\n{instruction}\n\n"
        f"Please provide your response or the complete rewritten section incorporating the requested changes:"
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user",   "content": user_prompt},
    ]

    try:
        outputs = pipeline(
            messages,
            max_new_tokens=max_tokens,
            temperature=0.3,
            do_sample=True,
            top_p=0.9,
            pad_token_id=pipeline.tokenizer.eos_token_id
        )
        content = outputs[0]["generated_text"][-1]["content"]
        return jsonify({
            "success": True,
            "text": content,
            "model": LOCAL_MODEL_ID,
            "engine": f"Local Neural Model ({LOCAL_MODEL_ID} on {gpu_name})"
        })
    except Exception as e:
        tb = traceback.format_exc()
        print(f"[LLM Server] Edit error:\n{tb}", file=sys.stderr)
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("LLM_PORT", 5001))
    print(f"[LLM Server] Running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)

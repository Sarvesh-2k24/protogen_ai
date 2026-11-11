"""
Python LLM Service using Transformers / Hugging Face for Meta-Llama-3.1-8B-Instruct
Implements the exact transformers text-generation pipeline requested by the user.
"""

import sys
import json
import os

def generate_with_transformers(system_prompt, user_prompt, max_tokens=1024, hf_token=None):
    """
    Generate text using meta-llama/Llama-3.1-8B-Instruct via transformers or huggingface_hub
    """
    model_id = "meta-llama/Llama-3.1-8B-Instruct"
    token = hf_token or os.environ.get("HF_TOKEN") or os.environ.get("HF_API_KEY")

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    # Mode 1: Cloud Serverless Inference via huggingface_hub InferenceClient
    # This runs the actual Meta-Llama-3.1-8B-Instruct model without downloading 16GB locally
    try:
        from huggingface_hub import InferenceClient
        client = InferenceClient(model=model_id, token=token)
        response = client.chat_completion(
            messages=messages,
            max_tokens=max_tokens,
            temperature=0.3
        )
        content = response.choices[0].message.content
        return {
            "success": True,
            "engine": "Meta-Llama-3.1-8B-Instruct (Hugging Face Inference)",
            "model": model_id,
            "text": content
        }
    except Exception as e_cloud:
        # Mode 2: Local transformers pipeline
        try:
            import torch
            import transformers

            pipeline = transformers.pipeline(
                "text-generation",
                model=model_id,
                model_kwargs={"torch_dtype": torch.bfloat16},
                device_map="auto",
                token=token
            )

            outputs = pipeline(
                messages,
                max_new_tokens=max_tokens,
                temperature=0.3
            )

            generated = outputs[0]["generated_text"][-1]["content"]
            return {
                "success": True,
                "engine": "Meta-Llama-3.1-8B-Instruct (Local Transformers Pipeline)",
                "model": model_id,
                "text": generated
            }
        except Exception as e_local:
            return {
                "success": False,
                "error": f"Cloud inference: {str(e_cloud)} | Local pipeline: {str(e_local)}"
            }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Read request from stdin or arg file
        try:
            raw_input = sys.stdin.read()
            if raw_input:
                data = json.loads(raw_input)
                system_prompt = data.get("systemPrompt", "You are an expert Clinical Protocol Principal Investigator.")
                user_prompt = data.get("userPrompt", "")
                hf_token = data.get("hfToken", "")
                max_tokens = data.get("maxTokens", 1200)

                res = generate_with_transformers(system_prompt, user_prompt, max_tokens, hf_token)
                print(json.dumps(res))
            else:
                print(json.dumps({"success": False, "error": "No input provided"}))
        except Exception as err:
            print(json.dumps({"success": False, "error": str(err)}))


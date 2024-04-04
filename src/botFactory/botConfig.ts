export const botConfig = {
  zephyr: {
    languageModel: "HuggingFaceH4/zephyr-7b-beta",
    temperature: 0.6,
    tags: {
      system: "<|system|>\n",
      user: "<|user|>\n",
      bot: "<|assistant|>\n",
      closing: "</s>\n",
    }
  },
  hermes: {
    languageModel: "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
    temperature: 0.9,
    tags: {
      system: "<|im_start|>system\n",
      user: "<|im_start|>user\n",
      bot: "<|im_start|>assistant\n",
      closing: "<|im_end|>\n",
    }
  },
  tinyLlama: {
    languageModel: "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
    temperature: 0.5,
    maxNewTokens: 200,
    doSample: false,
    contextWindow: 2000,
    systemPrompt: "",
    tags: {
      system: "<|system|>\n",
      user: "<|user|>\n",
      bot: "<|assistant|>\n",
      closing: "</s>\n",
    }
  },
  starCoder: {
    languageModel: "HuggingFaceH4/starchat-beta",
    topK: 50,
    topP: 0.95,
    temperature: 0.2,
    repetitionPenalty: 1.2,
    contextWindow: 8192,
    systemPrompt: "You are a coder assistant.",
    tags: {
      system: "<|system|>\n",
      user: "<|user|>\n",
      bot: "<|assistant|>\n",
      closing: "<|end|>\n",
    }
  }
}

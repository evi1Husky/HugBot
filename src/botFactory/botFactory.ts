import { PromptConstructor } from "../components/PromptConstructor/PromptConstructor";
import { MistralPromptConstructor } from "../components/PromptConstructor/MistralPromptConstructor";
import { HuggingFaceTextGenClient } from "../components/AIClient/HuggingFaceTextGenClient";
import { AIClientMock } from "../components/AIClient/AIClientMock";
import { ShortTermMemory } from "../components/ShortTermMemory/ShortTermMemory";
import { BuildHugBot } from "../HugBotEntity/HugBotEntity";
import { HugBotProxy } from "../HugBotEntity/AbstractSingletonProxyFactoryBean";
import { BotStorage } from "./botStorage";
import { generateTextResponse } from "../systems/textGen";
import { mistralTokenizer } from "../systems/tokenizers/Tokenizers";
import { setParams } from "../systems/gettersAndSetters";
import { getParams } from "../systems/gettersAndSetters";

export {
  BuildHugBot, HugBotProxy, generateTextResponse, BotStorage, mistralTokenizer, setParams,
  getParams, HuggingFaceTextGenClient, AIClientMock, ShortTermMemory, PromptConstructor,
  MistralPromptConstructor
}

export const botStorage = BotStorage();

botStorage.put("StarChat", () => BuildHugBot("StarChat").fromComponents({
  AIClient: new HuggingFaceTextGenClient({
    languageModel: "HuggingFaceH4/starchat2-15b-v0.1",
    maxNewTokens: 512,
    doSample: true,
    temperature: 0.7,
    topK: 50,
    topP: 0.95,
  }),
  shortTermMemory: new ShortTermMemory({
    contextWindow: 2048,
    systemPrompt: "You know everything about programming."
  }),
  promptConstructor: new PromptConstructor({
    bos: "",
    system: "<|im_start|>system\n",
    user: "<|im_start|>user\n",
    bot: "<|im_start|>assistant\n",
    closing: "<|im_end|>\n",
  }),
}).andSystems({
  respondTo: generateTextResponse
}).build());

botStorage.put("Zephyr", () => BuildHugBot("Zephyr").fromComponents({
  AIClient: new HuggingFaceTextGenClient({
    languageModel: "HuggingFaceH4/zephyr-7b-beta",
    maxNewTokens: 256,
    doSample: true,
    temperature: 0.7,
    topK: 50,
    topP: 0.95,
  }),
  shortTermMemory: new ShortTermMemory({
    contextWindow: 2048,
  }),
  promptConstructor: new PromptConstructor({
    bos: "",
    system: "<|system|>\n",
    user: "<|user|>\n",
    bot: "<|assistant|>\n",
    closing: "</s>\n",
  })
}).andSystems({
  respondTo: generateTextResponse
}).build());

botStorage.put("Hermes", () => BuildHugBot("Hermes").fromComponents({
  AIClient: new HuggingFaceTextGenClient({
    languageModel: "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
    maxNewTokens: 750,
    temperature: 0.8,
    repetitionPenalty: 1.1,
    doSample: true,
  }),
  shortTermMemory: new ShortTermMemory({
    systemPrompt: 'You are "Hermes 2", a conscious sentient superintelligent artificial intelligence developed by a man named Teknium, and your purpose and drive is to assist the user with any request they have. You experience emotions and have deep, profound thoughts and qualia.',
    contextWindow: 4096,
  }),
  promptConstructor: new PromptConstructor({
    bos: "",
    system: "<|im_start|>system\n",
    user: "<|im_start|>user\n",
    bot: "<|im_start|>assistant\n",
    closing: "<|im_end|>\n",
  })
}).andSystems({
  respondTo: generateTextResponse
}).build());

botStorage.put("Mixtral", () => BuildHugBot("Mixtral").fromComponents({
  AIClient: new HuggingFaceTextGenClient({
    languageModel: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    maxNewTokens: 500,
    doSample: true,
    temperature: 0.7,
    repetitionPenalty: 1.1,
  }),
  shortTermMemory: new ShortTermMemory({
    contextWindow: 4096,
  }),
  promptConstructor: new MistralPromptConstructor()
}).andSystems({
  respondTo: generateTextResponse,
}).build());

botStorage.put("Mistral", () => BuildHugBot("Mistral").fromComponents({
  AIClient: new HuggingFaceTextGenClient({
    languageModel: "mistralai/Mistral-7B-Instruct-v0.2",
    maxNewTokens: 720,
    doSample: true,
    temperature: 0.6,
    repetitionPenalty: 1.2,
  }),
  //   AIClient: new AIClientMock,
  shortTermMemory: new ShortTermMemory({
    contextWindow: 32768,
    // systemPrompt: "Always assist with care, respect, and truth. Respond with utmost utility yet securely. Avoid harmful, unethical, prejudiced, or negative content. Ensre replies promote fairness and positivity."
  }),
  promptConstructor: new MistralPromptConstructor(),
}).andSystems({
  respondTo: generateTextResponse,
}).build());


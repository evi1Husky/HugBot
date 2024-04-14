import { PromptConstructor } from "../components/PromptConstructor/PromptConstructor";
import { MistralPromptConstructor } from "../components/PromptConstructor/MistralPromptConstructor";
import { HuggingFaceTextGenClient } from "../components/AIClient/HuggingFaceTextGenClient";
import { AIClientMock } from "../components/AIClient/AIClientMock";
import { ShortTermMemory } from "../components/ShortTermMemory/ShortTermMemory";
import { IObuffer } from "../components/IObuffer/IObuffer";
import { BuildHugBot } from "../HugBotEntity/HugBotEntity";
import { HugBotProxy } from "../HugBotEntity/AbstractSingletonProxyFactoryBean";
import { BotStorage } from "./botStorage";
import { generateTextResponse } from "../components/RespondTo/TextGen";
import { mistralTokenizer } from "../components/Tokenizers/MistralTokenizer";
import { SecretsHider } from "../components/SecretsHider/SecretsHider";
import { RateLimiter } from "../HugBotEntity/RateLimiter";
import { FCFSqueue } from "../components/IObuffer/FCFS_queue";

export {
  BuildHugBot, HugBotProxy, generateTextResponse, BotStorage, mistralTokenizer,
  HuggingFaceTextGenClient, AIClientMock, ShortTermMemory, PromptConstructor,
  MistralPromptConstructor, IObuffer, FCFSqueue, SecretsHider, RateLimiter
}

/**
 * Bot storage container. Maps bot id's to their builder functions.
 * The bot is instantiated during retieval with get() method.
 * Bots in storage: "StarChat", "Zephyr", "Hermes", "Mixtral", "Mistral"
 */
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
  respondTo: generateTextResponse,
  IObuffer: new IObuffer(),
  secretsHider: SecretsHider(),
}).build());

botStorage.put("Zephyr", () => BuildHugBot("Zephyr").fromComponents({
  AIClient: new HuggingFaceTextGenClient({
    languageModel: "HuggingFaceH4/zephyr-7b-beta",
    maxNewTokens: 500,
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
  }),
  respondTo: generateTextResponse,
  IObuffer: new IObuffer(),
  secretsHider: SecretsHider(),
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
  }),
  respondTo: generateTextResponse,
  IObuffer: new IObuffer(),
  secretsHider: SecretsHider(),
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
  promptConstructor: new MistralPromptConstructor(),
  respondTo: generateTextResponse,
  IObuffer: new IObuffer(),
  secretsHider: SecretsHider(),
}).build());

botStorage.put("Mistral", () => BuildHugBot("Mistral").fromComponents({
  AIClient: new HuggingFaceTextGenClient({
    languageModel: "mistralai/Mistral-7B-Instruct-v0.2",
    maxNewTokens: 720,
    doSample: true,
    temperature: 0.6,
    repetitionPenalty: 1.2,
  }),
  shortTermMemory: new ShortTermMemory({
    contextWindow: 32768,
  }),
  promptConstructor: new MistralPromptConstructor(),
  respondTo: generateTextResponse,
  IObuffer: new IObuffer(),
  secretsHider: SecretsHider(),
}).build());


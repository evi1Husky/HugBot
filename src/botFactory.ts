import { HugBot } from "./HugBot/HugBot"
import { PromptConstructor } from "./components/PromptConstructor/PromptConstructor"
import { HuggingFaceTextGenClient } from "./components/AIClient/HuggingFaceTextGenClient"
import { AIClientMock } from "./components/AIClient/AIClientMock"
import { ShortTermMemory } from "./components/ShortTermMemory/ShortTermMemory"
import { BotStorage } from "./utility/botStorage"
import { hugBot } from "./utility/botBuilder"

export { hugBot, BotStorage, HugBot, PromptConstructor, HuggingFaceTextGenClient, 
AIClientMock, ShortTermMemory }

export const botStorage = BotStorage()
  .set("Zephyr", hugBot("Zephyr")
  .withAiClient(new HuggingFaceTextGenClient)
  .withParams({
    languageModel: "HuggingFaceH4/zephyr-7b-beta",
    temperature: 0.6,
    tags: {
      system: "<|system|>\n",
      user: "<|user|>\n",
      bot: "<|assistant|>\n",
      closing: "</s>\n",
    }}).build)
  .set("Hermes", hugBot("Hermes")
  .withAiClient(new HuggingFaceTextGenClient)
  .withParams({
    languageModel: "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
    temperature: 0.9,
    tags: {
      system: "<|im_start|>system\n",
      user: "<|im_start|>user\n",
      bot: "<|im_start|>assistant\n",
      closing: "<|im_end|>\n",
    }}).build)
  .set("TinyLlama", hugBot("TinyLlama")
  .withAiClient(new HuggingFaceTextGenClient)
  .withParams({
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
    }}).build)
  .set("StarCoder", hugBot("StarCoder")
  .withAiClient(new HuggingFaceTextGenClient)
  .withParams({
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
    }}).build)
  .set("TestBot", 
  hugBot("TestBot").withAiClient(new AIClientMock).build)

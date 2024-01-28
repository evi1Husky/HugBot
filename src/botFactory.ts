import { HugBot } from "./HugBot"
import { PromptConstructor } from "./PromptConstructor"
import { HuggingFaceTextGenClient } from "./HuggingFaceTextGenClient"
import { IHugBot } from "./typings"
export { HugBot, PromptConstructor, HuggingFaceTextGenClient }

/**
 * Chat bot using HuggingFace Inference API Nous-Hermes-2-Mixtral-8x7B-DPO model.
 */
export const Hermes = (apiToken?: string): IHugBot => {
  const promptConstructor = new PromptConstructor()
  const client = new HuggingFaceTextGenClient({
     languageModel: "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
     apiToken: apiToken, 
     temperature: 0.9 
  })
  promptConstructor.tags = {
    system: "<|im_start|>system\n",
    user: "<|im_start|>user\n",
    bot: "<|im_start|>assistant\n",
    closing: "<|im_end|>\n",
  };
  return new HugBot(client, promptConstructor)
}

/**
 * Chat bot using HuggingFace Inference API Zephyr-7b-beta model.
 */
export const Zephyr = (apiToken?: string): IHugBot => {
  const promptConstructor = new PromptConstructor()
  const client = new HuggingFaceTextGenClient({
    languageModel: "HuggingFaceH4/zephyr-7b-beta",
    apiToken: apiToken,
    temperature: 0.6,
  })
  return new HugBot(client, promptConstructor)
}

/**
 * Chat bot using HuggingFace Inference API TinyLlama-1.1B-Chat-v1.0 model.
 */
export const TinyLlama = (apiToken?: string): IHugBot => {
  const promptConstructor = new PromptConstructor()
  const client = new HuggingFaceTextGenClient({
    languageModel: "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
    apiToken: apiToken,
    temperature: 0.5,
    maxNewTokens: 200,
    doSample: false,
  })
  promptConstructor.contextWindow = 1800
  promptConstructor.systemPrompt = ""
  return new HugBot(client, promptConstructor)
}

import { HugBot } from "./HugBot"
import { PromptConstructor } from "./PromptConstructor"
import { HuggingFaceTextGenClient } from "./HuggingFaceTextGenClient"
import { IHugBot } from "./typings"
export { HugBot, PromptConstructor, HuggingFaceTextGenClient }

/**
 * Chat bot using HuggingFace Inference API Nous-Hermes-2-Mixtral-8x7B-DPO model.
 */
export const Hermes = (apiToken?: string): IHugBot => {
  return new HugBot(new HuggingFaceTextGenClient({
      languageModel: "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
      apiToken: apiToken, 
      temperature: 0.9,
    }), new PromptConstructor({
      tags: {
        system: "<|im_start|>system\n",
        user: "<|im_start|>user\n",
        bot: "<|im_start|>assistant\n",
        closing: "<|im_end|>\n",
    }}))
}

/**
 * Chat bot using HuggingFace Inference API Zephyr-7b-beta model.
 */
export const Zephyr = (apiToken?: string): IHugBot => {
  return new HugBot(new HuggingFaceTextGenClient({
    languageModel: "HuggingFaceH4/zephyr-7b-beta",
    apiToken: apiToken,
    temperature: 0.6,
  }), new PromptConstructor())
}

/**
 * Chat bot using HuggingFace Inference API TinyLlama-1.1B-Chat-v1.0 model.
 */
export const TinyLlama = (apiToken?: string): IHugBot => {
  return new HugBot(new HuggingFaceTextGenClient({
    languageModel: "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
    apiToken: apiToken,
    temperature: 0.5,
    maxNewTokens: 200,
    doSample: false,
  }), new PromptConstructor({
    contextWindow: 1800,
    systemPrompt: "",
  }))
}

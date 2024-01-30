import { HugBot } from "./HugBot"
import { PromptConstructor } from "./PromptConstructor"
import { HuggingFaceTextGenClient } from "./HuggingFaceTextGenClient"
import { AIClientMock } from "./AIClientMock"
import { IHugBot } from "./typings"
export { HugBot, PromptConstructor, HuggingFaceTextGenClient, AIClientMock }

/**
 * Chat bot using HuggingFace Inference API Nous-Hermes-2-Mixtral-8x7B-DPO model.
 */
export const Hermes = (): IHugBot => {
  return new HugBot({
    AIClient: new HuggingFaceTextGenClient({
      languageModel: "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
      temperature: 0.9,
    }),
    promptConstructor: new PromptConstructor({
      tags: {
        system: "<|im_start|>system\n",
        user: "<|im_start|>user\n",
        bot: "<|im_start|>assistant\n",
        closing: "<|im_end|>\n",
      }
    })
  })
}

/**
 * Chat bot using HuggingFace Inference API Zephyr-7b-beta model.
 */
export const Zephyr = (): IHugBot => {
  return new HugBot({
    AIClient: new HuggingFaceTextGenClient({
      languageModel: "HuggingFaceH4/zephyr-7b-beta",
      temperature: 0.6,
    }),
    promptConstructor: new PromptConstructor()
  })
}

/**
 * Chat bot using HuggingFace Inference API TinyLlama-1.1B-Chat-v1.0 model.
 */
export const TinyLlama = (): IHugBot => {
  return new HugBot({
    AIClient: new HuggingFaceTextGenClient({
      languageModel: "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
      temperature: 0.5,
      maxNewTokens: 200,
      doSample: false,
    }),
    promptConstructor: new PromptConstructor({
      contextWindow: 2000,
      systemPrompt: "",
    })
  })
}

/**
 * Programming helper bot using HuggingFace Inference API HuggingFaceH4/starchat-beta.
 */
export const StarCoder = (): IHugBot => {
  return new HugBot({
    AIClient: new HuggingFaceTextGenClient({
      languageModel: "HuggingFaceH4/starchat-beta",
      topK: 50,
      topP: 0.95,
      temperature: 0.2,
      repetitionPenalty: 1.2,
    }),
    promptConstructor: new PromptConstructor({
      contextWindow: 8192,
      systemPrompt: "You are a coder assistant.",
      tags: {
        system: "<|system|>\n",
        user: "<|user|>\n",
        bot: "<|assistant|>\n",
        closing: "<|end|>\n",
      }
    })
  })
}

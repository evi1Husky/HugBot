import { HugBot } from "./HugBot/HugBot"
import { PromptConstructor } from "./components/PromptConstructor/PromptConstructor"
import { HuggingFaceTextGenClient } from "./components/AIClient/HuggingFaceTextGenClient"
import { AIClientMock } from "./components/AIClient/AIClientMock"
import { ShortTermMemory } from "./components/ShortTermMemory/ShortTermMemory"
import { setParams } from "./utility/inputValidation"
import { IAIClient, IShortTermMemory, IPromptConstructor ,
HugBotParams } from "./HugBot/typings"

export { HugBot, PromptConstructor, HuggingFaceTextGenClient, 
AIClientMock, ShortTermMemory }

/**
 * Chat bot using HuggingFace Inference API Nous-Hermes-2-Mixtral-8x7B-DPO model.
 */
export const Hermes = () => {
  return new HugBot({
    AIClient: new HuggingFaceTextGenClient({
      languageModel: "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
      temperature: 0.9,
    }),
    shortTermMemory: new ShortTermMemory(),
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
export const Zephyr = () => {
  return new HugBot({
    AIClient: new HuggingFaceTextGenClient({
      languageModel: "HuggingFaceH4/zephyr-7b-beta",
      temperature: 0.6,
    }),
    shortTermMemory: new ShortTermMemory(),
    promptConstructor: new PromptConstructor()
  })
}

/**
 * Chat bot using HuggingFace Inference API TinyLlama-1.1B-Chat-v1.0 model.
 */
export const TinyLlama = () => {
  return new HugBot({
    AIClient: new HuggingFaceTextGenClient({
      languageModel: "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
      temperature: 0.5,
      maxNewTokens: 200,
      doSample: false,
    }),
    shortTermMemory: new ShortTermMemory({
      contextWindow: 2000,
      systemPrompt: "",
    }),
    promptConstructor: new PromptConstructor()
  })
}

/**
 * Programming helper bot using HuggingFace Inference API HuggingFaceH4/starchat-beta.
 */
export const StarCoder = () => {
  return new HugBot({
    AIClient: new HuggingFaceTextGenClient({
      languageModel: "HuggingFaceH4/starchat-beta",
      topK: 50,
      topP: 0.95,
      temperature: 0.2,
      repetitionPenalty: 1.2,
    }),
    shortTermMemory: new ShortTermMemory({
      contextWindow: 8192,
      systemPrompt: "You are a coder assistant.",
    }),
    promptConstructor: new PromptConstructor({
      tags: {
        system: "<|system|>\n",
        user: "<|user|>\n",
        bot: "<|assistant|>\n",
        closing: "<|end|>\n",
      }
    })
  })
}

export const hugBot = (name?: string) => {
  const hugBot = new HugBot()

  const withAiClient = (client: IAIClient) => {
    hugBot.setParams({AIClient: client})
    return options
  }

  const withShortTermMemory = (shortTermMemory: IShortTermMemory) => {
    hugBot.setParams({shortTermMemory: shortTermMemory})
    return options
  }

  const withPromptConstructor = (promptConstructor: IPromptConstructor) => {
    hugBot.setParams({promptConstructor: promptConstructor})
    return options
  }

  const withParams = (params: Partial<HugBotParams>) => {
    setParams(params, hugBot)
    return { build }
  }

  const build = () => hugBot

  const options = {
    withAiClient,
    withShortTermMemory,
    withPromptConstructor,
    withParams,
    build,
  }

  return options
}



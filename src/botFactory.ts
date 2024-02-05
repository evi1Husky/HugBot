import { HugBot } from "./HugBot"
import { PromptConstructor } from "./PromptConstructor"
import { HuggingFaceTextGenClient } from "./HuggingFaceTextGenClient"
import { AIClientMock } from "./AIClientMock"
import { ShortTermMemory } from "./ShortTermMemory"
import { IHugBot, IAIClient, IShortTermMemory, IPromptConstructor ,
HugBotParams } from "./typings"

export { HugBot, PromptConstructor, HuggingFaceTextGenClient, 
AIClientMock, ShortTermMemory }

/**
 * Chat bot using HuggingFace Inference API Nous-Hermes-2-Mixtral-8x7B-DPO model.
 */
export const Hermes = (): IHugBot => {
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
export const Zephyr = (): IHugBot => {
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
export const TinyLlama = (): IHugBot => {
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
export const StarCoder = (): IHugBot => {
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

const hugBot = (name: string) => {
  const hugBot = new HugBot()

  const aiClient = (client: IAIClient) => {
    hugBot.setParams({AIClient: client})
    return options
  }

  const shortTermMemory = (shortTermMemory: IShortTermMemory) => {
    hugBot.setParams({shortTermMemory: shortTermMemory})
    return options
  }

  const promptConstructor = (promptConstructor: IPromptConstructor) => {
    hugBot.setParams({promptConstructor: promptConstructor})
    return options
  }

  const withParams = (params: Partial<HugBotParams>) => {
    console.log(params)
    return options
  }

  const uses = () => components
  
  const build = () => hugBot

  const components = {
    aiClient,
    shortTermMemory,
    promptConstructor
  }

  const options = {
    build,
    withParams,
    uses
  }

  return options
}

const bot = hugBot("Zephyr").uses().aiClient(new AIClientMock)
  .withParams({ contextWindow: 300, topP: 50 }).build()

bot.respondTo("hi").then((r) => console.log(r))


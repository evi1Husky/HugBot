import { HugBot } from "../HugBot/HugBot"
import { setParams } from "../utility/inputValidation"
import { IAIClient, IShortTermMemory, IPromptConstructor ,
HugBotParams } from "../HugBot/typings"

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

  const build = (): HugBot => hugBot

  const options = {
    withAiClient,
    withShortTermMemory,
    withPromptConstructor,
    withParams,
    build,
  }

  return options
}
import { HugBot } from "../HugBot/HugBot"
import { setParams } from "../AbstractHugBotProxyBean/inputValidation"
import { IAIClient, IShortTermMemory, IPromptConstructor ,
HugBotParams, HugBotDependencies } from "../HugBot/typings"

export const buildHugBot = (name?: string) => {
  const hugBot = new HugBot() 

  const withAiClient = (client: new () => IAIClient) => {
    hugBot.setParams({AIClient: new client})
    return options
  }

  const withShortTermMemory = (shortTermMemory: new () => IShortTermMemory) => {
    hugBot.setParams({shortTermMemory: new shortTermMemory})
    return options
  }

  const withPromptConstructor = (promptConstructor: new () => IPromptConstructor) => {
    hugBot.setParams({promptConstructor: new promptConstructor})
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
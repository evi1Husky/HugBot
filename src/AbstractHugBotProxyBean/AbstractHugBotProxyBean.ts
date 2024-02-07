import { AIClientMock, HugBot, PromptConstructor, ShortTermMemory 
} from "../botFactory/botFactory"
import { filterDisallowedParams, getObjectProps } from "./gettersAndSetters"
import { Params } from "./typings"

const disallowedParams = new Set([
  "AIClient", "shortTermMemory", "promptConstructor",
  "languageModel", "endPoint", "tokenizer", "tags",
  "returnFullText", "truncate", "useCache",])

export const hugBot = (bot: HugBot) => {
  const HugBot = bot

  const respondTo = async (userInput: string, apiToken?: string): Promise<string> => {
    return HugBot.respondTo(userInput, apiToken)
  }

  const setParams = (params: Partial<Params>) => {
    HugBot.setParams(filterDisallowedParams(params, disallowedParams))
    return { respondTo, setParams, getParams }
  }

  const getParams = (params: string[]) => getObjectProps(params, HugBot)

  return { respondTo, setParams, getParams }
}

(async () => {
  const bot = hugBot(new HugBot({AIClient: new AIClientMock}))
  bot.setParams({contextWindow: 90000})
  await bot.respondTo("hi").then(x => console.log(x))
  const params = bot.getParams(["memory"])
  console.log(params)
})();





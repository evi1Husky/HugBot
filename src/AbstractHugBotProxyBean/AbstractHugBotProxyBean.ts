import { filterDisallowedParams, getObjectProps } from "../systems/gettersAndSetters"
import { Params, HugBot } from "./typings"

const disallowedParams = new Set([
  "AIClient", "shortTermMemory", "promptConstructor",
  "languageModel", "endPoint", "tokenizer", "tags",
  "returnFullText", "truncate", "useCache",])

export const hugBot = (bot: any) => {
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


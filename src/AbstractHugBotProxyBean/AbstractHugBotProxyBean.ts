import { AIClientMock, HugBot, PromptConstructor, ShortTermMemory } from "../botFactory/botFactory"
import { HugBotParams } from "../HugBot/typings"
import { filterValidParams } from "./inputValidation"

export const hugBot = (bot: HugBot) => {
  const HugBot = bot

  const respondTo = async (userInput: string, apiToken?: string): Promise<string> => {
    return HugBot.respondTo(userInput, apiToken)
  }

  const setParams = (params: Partial<HugBotParams>) => {
    const validParams = filterValidParams(params)
    console.log(validParams)
    HugBot.setParams(params)
  }

  return { respondTo, setParams }
}

const bot = hugBot(new HugBot({AIClient: new AIClientMock}))
bot.setParams({
  AIClient: new AIClientMock,
  shortTermMemory: new ShortTermMemory,
  promptConstructor: new PromptConstructor,
  languageModel: "sadasd",
  systemPrompt: "asdasdas",
  responseAffirmation: "1321",
  userInstruction: "31212",
  endPoint: "213111",
  contextWindow: 700,
  tokenizer: (text: string) => 1,
  tags: {
    user: "aa",
    system: "aaa",
    bot: "aa",
    closing: "ss"
  },
  topK: 3,
  topP: 2,
  temperature: 0.2,
  repetitionPenalty: 1,
  maxNewTokens: 200,
  maxTime: 20,
  returnFullText: false,
  numReturnSequences: 1,
  doSample: true,
  truncate: undefined,
  waitForModel: false,
  useCache: false})
// bot.respondTo("hi").then(x => console.log(x))

import { HugBotEntity, MemoryEntry, MemoryDump } from "../HugBotEntity/HugBotEntity"

const pushToShortTermMemory = (HugBot: HugBotEntity, entry: MemoryEntry) => {
  if (!HugBot.shortTermMemory) return
  HugBot.shortTermMemory.push(entry)
}

const memoryDump = (HugBot: HugBotEntity) => {
  if (!HugBot.shortTermMemory) return
  return HugBot.shortTermMemory.dump
}

const fallBackPromptTemplate = (entries: MemoryEntry[]) => 
  entries.reduce((acc, x) => acc + `<${x.role}>\n${x.input}\n`, "") + "<ai>\n"

const buildPromptTemplate = 
  (HugBot: HugBotEntity, userInput: string, memoryEntries?: MemoryDump) => {
  if (memoryEntries && HugBot.promptConstructor)
    return HugBot.promptConstructor.getPromptTemplate(memoryEntries)
  if (!memoryEntries && !HugBot.promptConstructor) 
    return `<user>\nuserInput\n<ai>\n`
  if (!memoryEntries && HugBot.promptConstructor)
  return HugBot.promptConstructor.getPromptTemplate({ 
    conversation: [{ role: "user", input: userInput }],
    systemPrompt: "", responseAffirmation: "", userInstruction: "" })
  return fallBackPromptTemplate(memoryEntries!.conversation)
}

const sendRequest = (HugBot: HugBotEntity, promptTemplate: string, apiToken?: string) => {
  if (!HugBot.AIClient) return "No response..."
  return HugBot.AIClient.sendRequest(promptTemplate, apiToken)
}

export const generateTextResponse = 
  async (HugBot: HugBotEntity, userInput: string, apiToken?: string): Promise<string> => {
  pushToShortTermMemory(HugBot, {role: "user", input: userInput})
  const promptTemplate = buildPromptTemplate(HugBot, userInput, memoryDump(HugBot))
  const response = await sendRequest(HugBot, promptTemplate, apiToken)
  pushToShortTermMemory(HugBot, {role: "ai", input: response})
  return response
}

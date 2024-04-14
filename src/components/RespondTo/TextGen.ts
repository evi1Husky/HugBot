import { HugBotEntity } from "../../HugBotEntity/HugBotEntity";

type MemoryEntry = {
  role: "user" | "ai";
  input: string;
}

type MemoryDump = {
  conversation: MemoryEntry[];
  systemPrompt: string;
  responseAffirmation: string;
  userInstruction: string;
}

function pushToShortTermMemory(HugBot: HugBotEntity, entry: MemoryEntry) {
  if (!HugBot.shortTermMemory)
    return;
  HugBot.shortTermMemory.push(entry);
}

function memoryDump(HugBot: HugBotEntity) {
  if (!HugBot.shortTermMemory)
    return;
  return HugBot.shortTermMemory.dump;
}

function fallBackPromptTemplate(entries: MemoryEntry[]) {
  return entries.reduce((acc, x) => acc + `<${x.role}>\n${x.input}\n`, "") + "<ai>\n";
}

function buildPromptTemplate(HugBot: HugBotEntity, userInput: string, memoryEntries?: MemoryDump) {
  if (memoryEntries && HugBot.promptConstructor)
    return HugBot.promptConstructor.getPromptTemplate(memoryEntries);
  if (!memoryEntries && !HugBot.promptConstructor)
    return `<user>\n${userInput}\n<ai>\n`;
  if (!memoryEntries && HugBot.promptConstructor)
    return HugBot.promptConstructor.getPromptTemplate({
      conversation: [{ role: "user", input: userInput }],
      systemPrompt: "", responseAffirmation: "", userInstruction: ""
    });
  return fallBackPromptTemplate(memoryEntries!.conversation);
}

function sendRequest(HugBot: HugBotEntity, promptTemplate: string, apiToken?: string) {
  if (!HugBot.AIClient)
    return "No response...";
  return HugBot.AIClient.sendRequest(promptTemplate, apiToken);
}

async function maybeRetrieveApiToken(HugBot: HugBotEntity, apiToken?: string) {
  if (apiToken) {
    return apiToken;
  } else if (HugBot.secretsHider) {
    try {
      const token = await HugBot.secretsHider.get();
      if (token) {
        return token;
      }
    } catch (what) {
      console.error(what);
      return undefined;
    }
  }
  return undefined;
}

/**
 * Main HugBot interaction method. Uses components present on the bot instance 
 * to produce text response.
 */
export async function generateTextResponse
  (this: HugBotEntity, userInput: string, apiToken?: string) {
  pushToShortTermMemory(this, { role: "user", input: userInput });
  const memoryState = memoryDump(this);
  const promptTemplate = buildPromptTemplate(this, userInput, memoryState);
  const token = await maybeRetrieveApiToken(this, apiToken);
  const response = await sendRequest(this, promptTemplate, token);
  pushToShortTermMemory(this, { role: "ai", input: response });
  return response;
}


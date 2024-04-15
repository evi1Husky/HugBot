import { HugBotEntity } from "../../HugBotEntity/HugBotEntity";
import { MemoryEntry, MemoryDump } from "../../HugBotEntity/HugBotEntity";

const maybePushToShortTermMemory = (HugBot: HugBotEntity, entry: MemoryEntry): void => {
  if (HugBot.shortTermMemory) {
    HugBot.shortTermMemory.push(entry);
  }
}

const maybeUseMemoryDump = (HugBot: HugBotEntity): MemoryDump | undefined => {
  if (!HugBot.shortTermMemory) {
    return;
  } else {
    return HugBot.shortTermMemory.dump;
  }
}

const fallBackPromptTemplate = (entries: MemoryEntry[]): string =>
  entries.reduce((acc, x) => acc + `<${x.role}>\n${x.input}\n`, "") + "<ai>\n";

const buildPromptTemplate = (HugBot: HugBotEntity, userInput: string, memoryEntries?: MemoryDump) => {
  if (memoryEntries && HugBot.promptConstructor) {
    return HugBot.promptConstructor.getPromptTemplate(memoryEntries);
  } else if (!memoryEntries && !HugBot.promptConstructor) {
    return `<user>\n${userInput}\n<ai>\n`;
  } else if (!memoryEntries && HugBot.promptConstructor) {
    return HugBot.promptConstructor.getPromptTemplate({
      conversation: [{ role: "user", input: userInput }],
      systemPrompt: "", responseAffirmation: "", userInstruction: ""
    });
  } else {
    return fallBackPromptTemplate(memoryEntries!.conversation);
  }
}

const sendRequest = (HugBot: HugBotEntity, promptTemplate: string, apiToken?: string) => {
  if (!HugBot.AIClient) {
    return "No response...";
  } else {
    return HugBot.AIClient.sendRequest(promptTemplate, apiToken);
  }
}

const maybeRetrieveApiToken = async (HugBot: HugBotEntity, apiToken?: string) => {
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

const maybeUseRateLimiter = (HugBot: HugBotEntity): void | never => {
  if (HugBot.rateLimiter) {
    HugBot.rateLimiter.check();
  }
}

/**
 * Main HugBot interaction method. Uses components present on the bot instance 
 * to produce text response.
 */
const generateTextResponse = async (HugBot: HugBotEntity, userInput: string, apiToken?: string) => {
  maybeUseRateLimiter(HugBot);
  maybePushToShortTermMemory(HugBot, { role: "user", input: userInput });
  const memoryState = maybeUseMemoryDump(HugBot);
  const promptTemplate = buildPromptTemplate(HugBot, userInput, memoryState);
  const token = await maybeRetrieveApiToken(HugBot, apiToken);
  const response = await sendRequest(HugBot, promptTemplate, token);
  maybePushToShortTermMemory(HugBot, { role: "ai", input: response });
  return response;
}

export { generateTextResponse }


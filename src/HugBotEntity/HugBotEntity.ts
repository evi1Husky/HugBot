import { HugBotProxy } from "./AbstractSingletonProxyFactoryBean";

export const BuildHugBot = (id: string) => {
  const bot: HugBot = Object.create(null);
  Object.defineProperty(bot, "id",
    { value: id, enumerable: true, writable: true, configurable: true });

  const fromComponents = (components: Partial<HugBotComponents>) => {
    Object.entries(components).forEach(([name, component]) =>
      Object.defineProperty(bot, name,
        { value: component, enumerable: true, writable: true, configurable: true }));
    return { build }
  }

  const build = (): HugBot => HugBotProxy(bot);

  return { fromComponents }
}

export interface HugBot {
  id: string;
  respondTo: (userInput: string, apiToken?: string) => Promise<string>;
  setParams: (params: Partial<HugBotParams>) => void;
}

export type HugBotEntity = {
  id: string;
  AIClient?: AIClient;
  shortTermMemory?: ShortTermMemory;
  promptConstructor?: PromptConstructor;
  respondTo?: GenerateResponse;
}

type HugBotComponents = {
  AIClient: AIClient;
  shortTermMemory: ShortTermMemory;
  promptConstructor: PromptConstructor;
  respondTo: GenerateResponse;
}

export type HugBotParams = {
  systemPrompt: string;
  responseAffirmation: string;
  userInstruction: string;
  contextWindow: number;
  topK: number | undefined;
  topP: number | undefined;
  temperature: number;
  repetitionPenalty: number | undefined;
  maxNewTokens: number | undefined;
  maxTime: number | undefined;
  returnFullText: boolean;
  numReturnSequences: number;
  doSample: boolean;
  truncate: number | undefined;
  waitForModel: boolean;
  useCache: boolean;
}

type GenerateResponse = (userInput: string, apiToken?: string) => Promise<string>;

interface AIClient {
  sendRequest: (prompt: string, apiToken?: string) => Promise<string>;
}

interface PromptConstructor {
  getPromptTemplate: (memoryDump: MemoryDump) => string;
}

interface ShortTermMemory {
  push: (entry: MemoryEntry) => void;
  get dump(): MemoryDump;
}

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


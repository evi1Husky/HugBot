import { HugBotProxy } from "./AbstractSingletonProxyFactoryBean";

export const BuildHugBot = (id: string) => {
  const bot: HugBotEntity = Object.create(null);

  Object.defineProperty(bot, "id",
    { value: id, enumerable: true, writable: true, configurable: true });

  const fromComponents = (components: Partial<HugBotComponents>) => {
    Object.entries(components).forEach(([name, component]) =>
      Object.defineProperty(bot, name,
        { value: component, enumerable: true, writable: true, configurable: true }));
    return { build }
  }

  const build = (): HugBot => {
    if (bot.IObuffer)
      bot.IObuffer.setBot = bot;
    return HugBotProxy(bot);
  }

  return { fromComponents }
}

export interface HugBot {
  id: string;
  apiToken: (key: string | null) => Promise<Res>;
  respondTo: (userInput: string, apiToken?: string) => Promise<string>;
  onResponse: (...cb: Array<(res: string) => void>) => void;
  pushMessage: (msg: string) => void;
  setParams: (params: Partial<HugBotParams>) => void;
}

export type HugBotEntity = {
  id: string;
  AIClient?: AIClient;
  shortTermMemory?: ShortTermMemory;
  promptConstructor?: PromptConstructor;
  respondTo?: GenerateResponse;
  IObuffer?: IObuffer;
  secretsHider?: SecretsHider;
}

type HugBotComponents = {
  AIClient: AIClient;
  shortTermMemory: ShortTermMemory;
  promptConstructor: PromptConstructor;
  respondTo: GenerateResponse;
  IObuffer: IObuffer;
  secretsHider: SecretsHider;
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

interface IObuffer {
  pushMessage: (msg: string) => void;
  onResponse: (...cb: Array<(res: string) => void>) => void;
  removeEventListener: (name: string | "all") => void;
  set setBot(bot: HugBotEntity);
}

interface SecretsHider {
  set: (secret: string) => Promise<Res>;
  get: () => Promise<string | null | Res>;
  destroy: () => void;
}

enum Res {
  Success = "Success",
  Failure = "Failure",
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


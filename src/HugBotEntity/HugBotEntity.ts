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
  /**
   * Encrypts and stores api token in memory for the session duration.
   * @param key - api token string
   * @returns Promise<Res> - "Success" | "Failure"
   * */
  apiToken: (key: string | null) => Promise<Res>;
  /** 
   * Takes user prompt and optional api token and generates AI response.
   * @param userInput - string - user prompt striing.
   * @param apiToken - string - optional api token to be sent to ai provider along with the prompt.
   * @returns Promise<string>
   * */
  respondTo: (userInput: string, apiToken?: string) => Promise<string>;
  /**
   * Takes even listener callbacks to be called when bot processes messages in the queue.
   * @param (res: string) => void
   */
  onResponse: (...cb: Array<(res: string) => void>) => void;
  /**
   * Pushes messages to the queue to be processed one by one by the bot.
   * @param msg - user message string.
   * */
  pushMessage: (msg: string) => void;
  /**
   * Set available HugBot params.
   * @Object {params} - Bot configuration object.
   * @property {string} systemPrompt - System prompt used in the chatbot.
   * @property {string} responseAffirmation - Affirmation prepended to bot responses.
   * @property {string} userInstruction - Instruction added after user queries.
   * @property {number} contextWindow - Conversation memory buffer size.
   * @property {number} topK - Top-K sampling parameter for LLMs.
   * @property {number} topP - Top-P sampling parameter for LLMs.
   * @property {number} temperature - Temperature parameter for LLMs.
   * @property {number} repetitionPenalty - Repetition penalty for LLMs.
   * @property {number} maxNewTokens - Maximum number of new tokens generated.
   * @property {number} maxTime - Maximum time allowed for generation.
   * @property {boolean} returnFullText - Flag to return full text responses.
   * @property {number} numReturnSequences - Number of return sequences.
   * @property {boolean} doSample - Flag to enable sampling.
   * @property {number} truncate - Truncate parameter for responses.
   * @property {boolean} waitForModel - Flag to wait for model availability.
   * @property {boolean} useCache - Flag to enable caching.
   * */
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


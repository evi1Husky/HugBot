import { HugBotProxy } from "./AbstractSingletonProxyFactoryBean";

/**
 * Bot builder function. Takes component instances and returns proxied HugBot entity.
 */
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
    if (bot.IObuffer) {
      bot.IObuffer.setBot = bot;
    }
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
   * @param userInput - string - user prompt string.
   * @param apiToken - string - optional api token to be sent to ai provider along with the prompt.
   * @returns Promise<string>
   * */
  respondTo: (userInput: string, apiToken?: string) => Promise<string>;
  /**
   * Takes event listener callbacks to be called when bot processes messages in the queue.
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
   * @property {string} systemPrompt - "You are a helpful AI assistant.".
   * @property {string} responseAffirmation - Prepended to bot replies, can be used to coerce the bot into following any instructions, exapmple: "Sure!", "Here you go:"
   * @property {string} userInstruction - Added after user query, can be used for RAG and additional instructions.
   * @property {number} contextWindow - Conversation memory buffer size in tokens.
   * @property {number} topK - Top-K sampling parameter.
   * @property {number} topP - Top-P sampling parameter.
   * @property {number} temperature - Temperature parameter.
   * @property {number} repetitionPenalty - Repetition penalty.
   * @property {number} maxNewTokens - Maximum number of new tokens generated.
   * @property {number} maxTime - Maximum time allowed for generation.
   * @property {boolean} doSample - Flag to enable sampling.
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
  doSample: boolean;
}

export type GenerateResponse = (userInput: string, apiToken?: string) => Promise<string>;

export interface AIClient {
  sendRequest: (prompt: string, apiToken?: string) => Promise<string>;
}

export interface PromptConstructor {
  getPromptTemplate: (memoryDump: MemoryDump) => string;
}

export interface ShortTermMemory {
  push: (entry: MemoryEntry) => void;
  get dump(): MemoryDump;
}

export interface IObuffer {
  pushMessage: (msg: string) => void;
  onResponse: (...cb: Array<(res: string) => void>) => void;
  removeEventListener: (name: string | "all") => void;
  set setBot(bot: HugBotEntity);
}

export interface SecretsHider {
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


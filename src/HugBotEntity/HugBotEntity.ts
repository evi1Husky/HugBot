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
   * Set HugBot params.
   * @Object params - Bot configuration object.
   * @param systemPrompt - An instruction to AI added to the beginnig of the prompt string example: "You are a helpful AI assistant.".
   * @param responseAffirmation - Prepended to bot replies, can be used to coerce the bot into following any instructions, exapmple: "Sure!", "Here you go:"
   * @param userInstruction - Added after user query, can be used for RAG and additional instructions.
   * @param contextWindow - Chatbot conversation memory size in tokens (around 1.5 tokens per word). Used to manage limitet LLM context window. When memory buffer overflows it's truncated 
   * @param topK - Top-K sampling. The range of candidate tokens to select from for the next prediction.
   * @param topP - Sampling based on probability threshold
   * @param temperature - Parameter impacting the randomness of predictions by scaling the probabilities of alternatives.
   * @param repetitionPenalty - Penalizing repeated phrases or sentences by lowering their likelihood.
   * @param maxNewTokens - limits the amount of newly generated text per response.
   * @param maxTime - Maximum time allowed for generation.
   * @param doSample - Choosing between deterministic greedy decoding (false) and stochastic sampling (true). 
   * @example
   * ```typescript
   *  bot.setParams({
   *    systemPrompt: "You are a helpful AI assistant.",
   *    contextWindow: 2048,
   *    maxNewTokens: 500,
   *    repetitionPenalty: 1.1,
   *    doSample: true,
   *    temperature: 0.7,
   *    topK: 50,
   *    topP: 0.95,
   *    maxTime: 30
   *  });
   * ```
   */
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


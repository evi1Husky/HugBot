import { HugBotProxy } from "./AbstractSingletonProxyFactoryBean";

export const BuildHugBot = (id: string) => {
  const bot: HugBot = Object.create(null);
  Object.defineProperty(bot, "id",
    { value: id, enumerable: true, writable: true, configurable: true });

  const fromComponents = (components: Partial<HugBotComponents>) => {
    Object.entries(components).forEach(([name, component]) =>
      Object.defineProperty(bot, name,
        { value: component, enumerable: true, writable: true, configurable: true }));
    return { andSystems, build }
  }

  const andSystems = (systems: Partial<HugBotSystems>) => {
    Object.entries(systems).forEach(([name, system]) =>
      Object.defineProperty(bot, name,
        { value: system, enumerable: true, writable: true, configurable: true }));
    return { build }
  }

  const build = (): HugBot => HugBotProxy(bot);

  return { fromComponents }
}

export type HugBot = {
  id: string;
  respondTo: (userInput: string, apiToken?: string) => Promise<string>;
  setParams: (params: Partial<HugBotParams>) => void;
}

export type HugBotEntity = {
  id: string;
  AIClient?: AIClient;
  shortTermMemory?: ShortTermMemory;
  promptConstructor?: PromptConstructor;
  respondTo?: (userInput: string, apiToken?: string) => Promise<string>;
}

type HugBotComponents = {
  AIClient: AIClient;
  shortTermMemory: ShortTermMemory;
  promptConstructor: PromptConstructor;
}

type HugBotSystems = {
  respondTo: (userInput: string, apiToken?: string) => Promise<string>;
}

export type HugBotParams = {
  language_model: string;
  systemPrompt: string;
  responseAffirmation: string;
  userInstruction: string;
  contextWindow: number;
  tokenizer: (text: string) => number;
  tags: PromptTags;
  top_k: number | undefined;
  top_p: number | undefined;
  temperature: number;
  repetition_penalty: number | undefined;
  max_new_tokens: number | undefined;
  max_time: number | undefined;
  return_full_text: boolean;
  num_return_sequences: number;
  do_sample: boolean;
  truncate: number | undefined;
  wait_for_model: boolean;
  use_cache: boolean;
}

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

type PromptTags = {
  system: string;
  user: string;
  bot: string;
  closing: string;
}


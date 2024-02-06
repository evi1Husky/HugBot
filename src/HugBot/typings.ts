export interface IAIClient {
  sendRequest: (consversation: string, apiToken?: string) => Promise<string>
}

export interface IPromptConstructor {
  getPromptTemplate: (memoryDump: MemoryDump) => string
}

export interface IShortTermMemory {
  push: (entry: MemoryEntry) => void
  get dump(): MemoryDump
}

export type MemoryEntry = {
  role: "user" | "ai"
  input: string
}

export type MemoryDump = {
  conversation: MemoryEntry[]
  systemPrompt: string
  responseAffirmation: string
  userInstruction: string
}

export type HugBotDependencies = {
  AIClient: IAIClient
  shortTermMemory: IShortTermMemory
  promptConstructor: IPromptConstructor
}

export type PromptTags = {
  system: string
  user: string
  bot: string
  closing: string
}

export type HugBotParams = {
  AIClient: IAIClient
  shortTermMemory: IShortTermMemory
  promptConstructor: IPromptConstructor
  languageModel: string
  systemPrompt: string
  responseAffirmation: string
  userInstruction: string
  endPoint: string
  contextWindow: number
  tokenizer: (text: string) => number
  tags: PromptTags
  topK: number | undefined
  topP: number | undefined
  temperature: number
  repetitionPenalty: number | undefined
  maxNewTokens: number | undefined
  maxTime: number | undefined
  returnFullText: boolean
  numReturnSequences: number
  doSample: boolean
  truncate: number | undefined
  waitForModel: boolean
  useCache: boolean
}

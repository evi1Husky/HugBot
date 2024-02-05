export interface IHugBot {
  AIClient: IAIClient
  shortTermMemory: IShortTermMemory
  promptConstructor: IPromptConstructor
  /**
  * @method respondTo Takes user input text and generates AI response to it.
  * @param string - User input string.
  * @param string - Optional api token for AI client.
  * @returns String Promise with AI response.
  */
  respondTo: (userInput: string, apiToken?: string) => Promise<string>
}

export interface IHugBotDependencies {
  AIClient: IAIClient
  shortTermMemory: IShortTermMemory
  promptConstructor: IPromptConstructor
}


/************************************************************************/


export interface IAIClient {
  sendRequest: (consversation: string, apiToken?: string) => Promise<string>
}

export interface IHuggingFaceTextGenParams {
  languageModel: string
  endPoint: string
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

export type InferenceAPIErrorResponse = {
  error: string
  error_type: string
}

export type InferenceAPITextGenResponse = [{ generated_text: string }]


/************************************************************************/


export interface PromptTags {
  system: string
  user: string
  bot: string
  closing: string
}

export interface IPromptConstructor {
  getPromptTemplate: (memoryDump: MemoryDump) => string
}

export interface IPromptConstructorParams {
  tags: PromptTags
}


/************************************************************************/

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

export type ShortTermMemoryParams = {
  tokenizer: (text: string) => number
  contextWindow: number
  systemPrompt: string
  responseAffirmation: string
  userInstruction: string
}

export interface IShortTermMemory {
  push: (entry: MemoryEntry) => void
  get dump(): MemoryDump
}

/************************************************************************/

export type HugBotParams = {
  languageModel: string
  systemPrompt: string
  responseAffirmation: string
  userInstruction: string
  endPoint: string
  contextWindow: number
  tokenizer: (text: string) => number
  promptTags: PromptTags
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
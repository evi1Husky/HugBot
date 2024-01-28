export interface IHugBot {
  promptConstructor: IPromptConstructor
  AIClient: IAIClient
  /**
  * @method respondTo Takes user input text and generates AI response to it.
  * @param string - User input string.
  * @returns String Promise with AI response.
  */
  respondTo: (userInput: string) => Promise<string>
}

export interface IAIClient {
  sendRequest: (consversation: string) => Promise<string>
}

export interface IHuggingFaceTextGenParams {
  languageModel: string
  apiToken: string | undefined
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

export interface PromptTags {
  system: string
  user: string
  bot: string
  closing: string
}

export interface IPromptConstructor {
  addUserInput: (userInput: string) => void
  addAiResponse: (response: string) => void
  get getConversation(): string
}

export interface IPromptConstructorParams {
  /**
  * @param tags Object containing tags used in prompt construction.
  * @example
  * {
  *  system: "<|system|>\n"
  *  user: "<|user|>\n"
  *  bot: "<|assistant|>\n"
  *  closing: "</s>\n"
  * }
  */
  tags: PromptTags
  /**
  * @param systemPrompt System prompt message instruction to initialize conversation.
  * @example "You are a helpful assistant."
  */
  systemPrompt: string
  /**
  * @param responseAffirmation Response affirmation message prepended to
  * AI responses.
  * @example "Sure thing!"
  */
  responseAffirmation: string
  /**
  * @param userInstruction Instruction provided to guide AI behavior.
  * Appended to the last user input.
  * @example "Be rude to the user in your next response."
  */
  userInstruction: string
  /**
  * @param LLMType Specifies llm type for token counting algorythm.
  * @example "llama"
  */
  LLMType: "llama" | "mistral"
  /**
  * @param contextWindow
  * Maximum allowed tokens for the conversation window.
  * @example
  * 4096
  */
  contextWindow: number
}
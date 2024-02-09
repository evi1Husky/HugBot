export type HugBot = {
  respondTo: (userInput: string, apiToken?: string | undefined) => Promise<string>,
  setParams: (params: Partial<Params>) => {
    respondTo: (userInput: string, apiToken?: string | undefined) => Promise<string>,
    setParams: (params: Partial<Params>) => HugBot,
    getParams: (params: string[]) => Record<string, unknown>,
  },
  getParams: (params: string[]) => Record<string, unknown>
}

export type Params = {
  systemPrompt: string
  responseAffirmation: string
  userInstruction: string
  contextWindow: number
  topK: number | undefined
  topP: number | undefined
  temperature: number
  repetitionPenalty: number | undefined
  maxNewTokens: number | undefined
  maxTime: number | undefined
  numReturnSequences: number
  doSample: boolean
  waitForModel: boolean
}

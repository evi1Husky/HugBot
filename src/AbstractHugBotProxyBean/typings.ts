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
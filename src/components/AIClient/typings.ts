export type HuggingFaceTextGenParams = {
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
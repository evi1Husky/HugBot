import { IAIClient, IHuggingFaceTextGenParams, InferenceAPITextGenResponse } 
from "./typings"

export class HuggingFaceTextGenClient implements IAIClient, IHuggingFaceTextGenParams {
  public languageModel = "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO"
  public endPoint = "https://api-inference.huggingface.co/models/"

  public topK = undefined
  public topP = undefined
  public temperature = 0.7
  public repetitionPenalty = 1.1
  public maxNewTokens = 512
  public maxTime = 30
  public returnFullText = false
  public numReturnSequences = 1
  public doSample = true
  public truncate = undefined

  public waitForModel = true
  public useCache = true

  constructor(params?: Partial<IHuggingFaceTextGenParams>) {
    Object.assign(this, params)
  }

  private makePayload(conversation: string, apiToken?: string) {
    const payload = {
      headers: {
        "Content-Type": "application/json",
        "x-compute-type": "cpu+optimized",
      } as Record<string, string>,
      method: "POST",
      body: JSON.stringify({
        inputs: conversation,
        options: {
          wait_for_model: this.waitForModel,
          use_cache: this.useCache,
        },
        parameters: {
          top_k: this.topK,
          top_p: this.topP,
          temperature: this.temperature,
          repetition_penalty: this.repetitionPenalty,
          max_new_tokens: this.maxNewTokens,
          max_time: this.maxTime,
          return_full_text: this.returnFullText,
          num_return_sequences: this.numReturnSequences,
          do_sample: this.doSample,
          truncate: this.truncate,
        },
      }),
    }
    if (apiToken) payload.headers.Authorization = `Bearer ${apiToken}`
    return payload
  }

  public async sendRequest(conversation: string, apiToken?: string): Promise<string> {
    const payload = this.makePayload(conversation, apiToken)
    try {
      const response = await fetch(this.endPoint + this.languageModel, payload)
      const generatedText: InferenceAPITextGenResponse = await response.json()
      if ("error" in generatedText) console.error(generatedText.error)
      return generatedText[0].generated_text
    } catch (error) {
      return "No response..."
    }
  }
}

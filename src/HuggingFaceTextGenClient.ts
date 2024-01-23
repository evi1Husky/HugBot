import {
  IHuggingFaceTextGenClient,
  IHuggingFaceTextGenParams,
  InferenceAPITextGenResponse,
} from "./typings";

export class HuggingFaceTextGenClient implements IHuggingFaceTextGenClient {
  public languageModel: string;
  public endPoint = "https://api-inference.huggingface.co/models/";
  private apiToken: string | undefined;

  public params: IHuggingFaceTextGenParams = {
    top_k: undefined,
    top_p: undefined,
    temperature: 0.7,
    repetition_penalty: 1.1,
    max_new_tokens: 500,
    max_time: 30,
    return_full_text: false,
    num_return_sequences: 1,
    do_sample: true,
    truncate: undefined,
  };

  public set setParams(params: Partial<IHuggingFaceTextGenParams>) {
    this.params = {
      ...this.params,
      ...params,
    };
  }

  public options = {
    wait_for_model: true,
    use_cache: true,
  };

  constructor(languageModel: string, apiToken?: string) {
    this.languageModel = languageModel;
    this.apiToken = apiToken;
  }

  private makePayload(conversation: string) {
    const payload = {
      headers: {
        "Content-Type": "application/json",
        "x-compute-type": "cpu+optimized",
      } as Record<string, string>,
      method: "POST",
      body: JSON.stringify({
        inputs: conversation,
        options: this.options,
        parameters: this.params,
      }),
    };
    if (this.apiToken) {
      payload.headers.Authorization = `Bearer ${this.apiToken}`;
    }
    return payload;
  }

  public async sendRequest(conversation: string): Promise<string> {
    const payload = this.makePayload(conversation);
    try {
      const response = await fetch(this.endPoint + this.languageModel, payload);
      const generatedText: InferenceAPITextGenResponse = await response.json();
      if ("error" in generatedText) console.error(generatedText.error);
      return generatedText[0].generated_text;
    } catch (error) {
      return "No response...";
    }
  }
}

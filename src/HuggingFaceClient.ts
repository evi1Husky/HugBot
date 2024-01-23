import { IHuggingFaceClient, IParams, Response } from "./typings";

export class HuggingFaceClient implements IHuggingFaceClient {
  readonly languageModel: string;
  private endPoint = "https://api-inference.huggingface.co/models/";
  private apiToken: string | undefined;

  public options = {
    wait_for_model: true,
    use_cache: true,
  };

  constructor(languageModel: string, apiToken?: string) {
    this.languageModel = languageModel;
    this.apiToken = apiToken;
  }

  public async sendRequest(consversation: string, params: IParams): Promise<Response> {
    const request = {
      headers: {
        "Content-Type": "application/json",
        // "x-compute-type": "cpu+optimized",
      } as Record<string, string>,
      method: "POST",
      body: JSON.stringify({
        inputs: consversation,
        options: this.options,
        parameters: params,
      }),
    };
    if (this.apiToken) {
      request.headers.Authorization = `Bearer ${this.apiToken}`;
    }
    const response = await fetch(this.endPoint + this.languageModel, request);
    return await response.json();
  }
}

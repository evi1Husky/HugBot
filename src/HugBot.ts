import {
  IHugBot,
  Response,
  ITokenCounter,
  IPromptConstructor,
} from "./typings";

/**
 * Chat bot agent for HuggingFace Inference API text generation task models.
 */
export abstract class HugBot implements IHugBot {
  /**
   * @param string Language model identifier for HuggingFace inference API.
   * @example "HuggingFaceH4/zephyr-7b-beta"
   */
  abstract readonly languageModel: string;
  public abstract name: string;
  private endPoint = "https://api-inference.huggingface.co/models/";
  private apiToken: string | undefined;
  abstract readonly promptConstructor: IPromptConstructor;
  abstract readonly tokenCounter: ITokenCounter;
  /**
   * @param object Configuration object with language model parameters.
   */
  public abstract params: {
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
  };
  /**
   * @param object Configuration object with server options.
   */
  public options = {
    wait_for_model: true,
    use_cache: true,
  };

  /**
   * @constructor
   * @param string apiToken - API token for authentication with
   * HuggingFace Inference API. Optional.
   * @example
   * // Create a new chat bot instance and generate a response
   * const bot = new Zephyr();
   * const response = await bot.respondTo('Hi!');
   */
  constructor(apiToken?: string) {
    this.apiToken = apiToken;
  }

  private async sendRequest(): Promise<Response> {
    const request = {
      headers: {
        "Content-Type": "application/json",
        // "x-compute-type": "cpu+optimized",
      } as Record<string, string>,
      method: "POST",
      body: JSON.stringify({
        inputs: this.promptConstructor.getConversation.join(""),
        options: this.options,
        parameters: this.params,
      }),
    };
    if (this.apiToken) {
      request.headers.Authorization = `Bearer ${this.apiToken}`;
    }
    const response = await fetch(this.endPoint + this.languageModel, request);
    return await response.json();
  }

  private popLeftIfContextOverflow(): void {
    if (!this.tokenCounter.contextOverflow) return;
    this.tokenCounter.popLeft();
    this.promptConstructor.popLeft();
    this.popLeftIfContextOverflow();
  }

  /**
   * @method respondTo Takes user input text and generates AI response to it.
   * @param string - User input string.
   * @returns String Promise with AI response.
   */
  public async respondTo(userInput: string): Promise<string> {
    this.tokenCounter.countAdditionalTokens(this.promptConstructor.systemPrompt);
    this.promptConstructor.addUserInput(userInput);
    this.tokenCounter.addTokens(userInput);
    this.popLeftIfContextOverflow();
    try {
      const response = await this.sendRequest();
      // const response = [{ generated_text: "bot response" }];
      this.tokenCounter.addTokens(response[0].generated_text, "bot");
      this.promptConstructor.addAiResponse(response[0].generated_text);
      return response[0].generated_text;
    } catch (error) {
      this.promptConstructor.addAiResponse("No response...");
      this.tokenCounter.addTokens("No response...");
      return "No response...";
    }
  }
}

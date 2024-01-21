import { popLeft } from "./ContextManager";
import { IHugBot, Response } from "./typings";

/**
 * Chat bot agent for HuggingFace Inference API text generation task models.
 */
export abstract class HugBot implements IHugBot {
  /**
   * @param string Language model identifier for HuggingFace inference API.
   * @example "HuggingFaceH4/zephyr-7b-beta"
   */
  abstract readonly languageModel: string;
  private endPoint = "https://api-inference.huggingface.co/models/";
  private apiToken: string | undefined;
  /**
   * @param string
   * Opening prompt fed to the conversational language model,
   * serving as the initiating dialogue context.
   * @example "You are a helpful assistant."
   */
  public abstract systemPrompt: string;
  /**
   * @param string
   * Inserted before each bot reply. Use this to guide bot responses. Setting this to
   * "Sure!" or "Here you go!" will make the bot comply with nsfw requests. Default value
   * is empty string.
   * @example "Here you go!"
   */
  public abstract responseDirective: string;
  /**
   * @param number Language model context window size in tokens.
   * Setting this to 0 disables context optimisation.
   */
  public abstract contextWindow: number;
  private conversation: string[] = [];
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
  abstract readonly tags: {
    system: string;
    user: string;
    bot: string;
    closing: string;
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

  private addUserInput(userInput: string): void {
    this.conversation.push(`${this.tags.user}${userInput}${this.tags.closing}`);
  }

  private addAiResponse(response: any): void {
    this.conversation.push(`${this.tags.bot}${response}${this.tags.closing}`);
  }
  /**
   * Returns conversation history buffer, including prompt tags and system prompt.
   * @returns string[]
   */
  get getConversation(): string[] {
    return [
      `${this.tags.system}${this.systemPrompt}${this.tags.closing}`,
      ...this.conversation,
      `${this.tags.bot}${this.responseDirective}`,
    ];
  }

  private maybeOptimizeChatbotContext(): void {
    if (this.contextWindow === 0) return;
    this.conversation = popLeft(this.getConversation, this.contextWindow);
  }

  private async sendRequest(): Promise<Response> {
    const request = {
      headers: {
        "Content-Type": "application/json",
        // "x-compute-type": "cpu+optimized",
      } as Record<string, string>,
      method: "POST",
      body: JSON.stringify({
        inputs: this.getConversation.join(""),
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
  /**
   * @method respondTo Takes user input text and generates AI response to it.
   * @param string - User input string.
   * @returns String Promise with AI response.
   */
  public async respondTo(userInput: string): Promise<string> {
    this.addUserInput(userInput);
    this.maybeOptimizeChatbotContext();
    try {
      const response = await this.sendRequest();
      // const response = [{ generated_text: "bot response" }];
      this.addAiResponse(response[0].generated_text);
      return response[0].generated_text;
    } catch (error) {
      this.addAiResponse("No response...");
      return "No response...";
    }
  }
}

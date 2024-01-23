import {
  IHugBot,
  ITokenCounter,
  IPromptConstructor,
  IHuggingFaceTextGenClient,
} from "./typings";

/**
 * Chat bot agent for HuggingFace Inference API text generation task models.
 */
export abstract class HugBot implements IHugBot {
  public abstract name: string;
  /**
   * Maneges chatbot prompt templating and conversation memory.
   */
  abstract readonly promptConstructor: IPromptConstructor;
  /**
   * Token counter class that keeps track of the token count in prompt template
   * and detects context window overflow.
   */
  abstract readonly tokenCounter: ITokenCounter;
  /**
   * A client for AI providers.
   */
  abstract readonly AIClient: IHuggingFaceTextGenClient;

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
    this.tokenCounter.countAdditionalTokens(
      this.promptConstructor.systemPrompt
    );
    this.promptConstructor.addUserInput(userInput);
    this.tokenCounter.addTokens(userInput);
    this.popLeftIfContextOverflow();
    // const response = "bot response";
    const conv = this.promptConstructor.getConversation;
    const response = await this.AIClient.sendRequest(conv);
    this.tokenCounter.addTokens(response, "bot");
    this.promptConstructor.addAiResponse(response);
    return response;
  }
}

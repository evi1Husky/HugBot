import {
  IHugBot,
  ITokenCounter,
  IPromptConstructor,
  IHuggingFaceClient,
  IParams,
} from "./typings";

/**
 * Chat bot agent for HuggingFace Inference API text generation task models.
 */
export abstract class HugBot implements IHugBot {
  public abstract name: string;
  abstract readonly promptConstructor: IPromptConstructor;
  abstract readonly tokenCounter: ITokenCounter;
  abstract readonly AIClient: IHuggingFaceClient;
  /**
   * @param object Configuration object with language model parameters.
   */
  public abstract params: IParams;

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
    try {
      // const response = [{ generated_text: "bot response" }];
      const conv = this.promptConstructor.getConversation.join("");
      const response = await this.AIClient.sendRequest(conv, this.params);
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

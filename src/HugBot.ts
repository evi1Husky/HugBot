import { IHugBot, IPromptConstructor, IHuggingFaceTextGenClient } from "./typings";

/**
 * Chat bot agent for HuggingFace Inference API text generation task models.
 */
export abstract class HugBot implements IHugBot {
  public abstract name: string;
  /**
   * LLM Prompt templating engine. Maneges chatbot prompt and conversation memory.
   */
  abstract readonly promptConstructor: IPromptConstructor;

  /**
   * A client for AI providers. Holds LLM settings.
   */
  abstract readonly AIClient: IHuggingFaceTextGenClient;

  /**
   * @method respondTo Takes user input text and generates AI response to it.
   * @param string - User input string.
   * @returns String Promise with AI response.
   */
  public async respondTo(userInput: string): Promise<string> {
    this.promptConstructor.addUserInput(userInput);
    const conv = this.promptConstructor.getConversation;
    const response = await this.AIClient.sendRequest(conv);
    this.promptConstructor.addAiResponse(response);
    return response;
  }
}

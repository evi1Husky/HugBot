import {
  IHugBot,
  IPromptConstructor,
  IHuggingFaceTextGenClient,
} from "./typings";

/**
 * Chat bot agent for HuggingFace Inference API text generation task models.
 */
export abstract class HugBot implements IHugBot {
  public abstract name: string;
  /**
   * LLM Prompt templating engine. Maneges chatbot prompt and conversation memory.
   * @param systemPrompt System prompt message instruction to initialize conversation.
   * @example "You are a helpful assistant."
   * @param responseAffirmation Response affirmation message prepended to
   * AI responses.
   * @example "Sure thing!"
   * @param userInstruction Instruction provided to guide AI behavior.
   * Appended to the last user input.
   * @example "Be rude to the user in your next response."
   * @param LLMType Specifies llm type for token counting algorythm.
   * @example "llama"
   * @param tags Object containing tags used in prompt construction.
   * @example
   * {
   *  system: "<|system|>\n";
   *  user: "<|user|>\n";
   *  bot: "<|assistant|>\n";
   *  closing: "</s>\n";
   * }
   * @param contextWindow
   * Maximum allowed tokens for the conversation window.
   * @example
   * 4096
   */
  abstract readonly promptConstructor: IPromptConstructor;
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

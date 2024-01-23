import { MistralTokenizer } from "mistral-tokenizer-ts";
import { ITokenCounter } from "./typings";

/**
 * Token counter class that keeps track of the token count in prompt template,
 * and detects context window overflow.
 */
export class TokenCounter implements ITokenCounter {
  readonly LLMType: "llama" | "mistral";
  private conversationTokenCount = 0;
  private botReplyNum = 0;
  private botReplyTokens = 0;
  private averageBotReplyTokens = 0;
  public contextWindow: number;
  private additionalTokens = 0;
  public contextOverflow = false;
  private tokenHistory: number[] = [];
  private readonly mistralTokenizer = new MistralTokenizer();

  /**
   * @constructor
   * @param string LLMType - selects tokenization algorythm according to
   * language model type.
   * @example
   * "llama" | "mistral"
   * @param number contextWindow - conversation buffer size in tokens.
   * @example
   * 4096
   */
  constructor(LLMType: "llama" | "mistral", contextWindow: number) {
    this.LLMType = LLMType;
    this.contextWindow = contextWindow;
  }

  /**
   * Resets token counter state.
   */
  public resetTokenCounter() {
    this.conversationTokenCount = 0;
    this.averageBotReplyTokens = 0;
    this.botReplyTokens = 0;
    this.botReplyNum = 0;
    this.tokenHistory = [];
    this.contextOverflow = false;
  }

  private mistralCountTokens(text: string): number {
    return this.mistralTokenizer.encode(text, true, false).length;
  }

  private countTokens(text: string): number {
    switch (this.LLMType) {
      case "mistral":
        return this.mistralCountTokens(text);
      case "llama":
        return this.mistralCountTokens(text);
    }
  }

  /**
   * Counts additional tokens in system prompt and other added prompt elements.
   * @param Array strings - accepts arbitrary amount of string arguments.
   */
  public countAdditionalTokens(...strings: string[]): void {
    this.additionalTokens = 0;
    strings.forEach((string) => {
      this.additionalTokens += this.countTokens(string);
    });
    this.checkIfContextOverflow();
  }

  private checkIfContextOverflow(): void {
    const tokens =
      this.conversationTokenCount +
      this.additionalTokens +
      this.averageBotReplyTokens;
    this.contextOverflow = tokens > this.contextWindow;
  }

  /**
   * Removes oldest conversation entry if context overflow, recalculates token count.
   */
  public popLeft(): void {
    const firstTokens = this.tokenHistory.shift();
    this.conversationTokenCount -= firstTokens!;
    this.checkIfContextOverflow();
  }

  /**
   * Adds tokens to the token history and updates the conversation token count.
   * @param string text - Text to extract the token count from.
   * @param "bot" | "user" [role=""] - Role specifier for distinguishing between bot and user utterances.
   */
  public addTokens(text: string, role?: "bot" | "user"): void {
    const tokens = this.countTokens(text);
    this.tokenHistory.push(tokens);
    this.conversationTokenCount += tokens;
    if (role === "bot") {
      this.botReplyNum++;
      this.botReplyTokens += tokens;
      this.averageBotReplyTokens = this.botReplyTokens / this.botReplyNum;
    }
    this.checkIfContextOverflow();
  }
}

import { MistralTokenizer } from "mistral-tokenizer-ts";
import { ITokenCounter } from "./typings";

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

  constructor(LLMType: "llama" | "mistral", contextWindow: number) {
    this.LLMType = LLMType;
    this.contextWindow = contextWindow;
  }

  public resetTokenCount() {
    this.conversationTokenCount = 0;
  }

  private mistralCountTokens(text: string): number {
    return this.mistralTokenizer.encode(text, true, false).length;
  }

  public countTokens(text: string): number {
    switch (this.LLMType) {
      case "mistral":
        return this.mistralCountTokens(text);
      case "llama":
        return this.mistralCountTokens(text);
    }
  }

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

  public popLeft(): void {
    const firstTokens = this.tokenHistory.shift();
    this.conversationTokenCount -= firstTokens!;
    this.checkIfContextOverflow();
  }

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

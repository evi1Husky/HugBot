import { PromptTags, IPromptConstructor } from "./typings";
import { countTokens } from "./Tokenizer";

interface entry {
  role: string;
  input: string;
}

/**
 * LLM Prompt templating engine. Maneges chatbot prompt and conversation memory.
 */
export class PromptConstructor implements IPromptConstructor {
  private conversation: entry[] = [];
  public systemPrompt =
    "Respond casually. Use emojis. Express strong opinions.";
  public responseDirective = "";
  public LLMType: "llama" | "mistral" = "mistral";
  public contextWindow: number = 4096;
  public tags: PromptTags = {
    system: "<|system|>\n",
    user: "<|user|>\n",
    bot: "<|assistant|>\n",
    closing: "</s>\n",
  };

  public addUserInput(userInput: string): void {
    this.conversation.push({ role: "user", input: userInput });
    this.popLeftIfContextOverflow();
  }

  public addAiResponse(response: any): void {
    this.conversation.push({ role: "ai", input: response });
  }

  private popLeftIfContextOverflow(): void {
    if (!this.isContextOverflow()) return;
    this.conversation.shift();
    this.popLeftIfContextOverflow();
  }

  private isContextOverflow(): boolean {
    const convContent = this.getRawConversationContent;
    const ctx = this.contextWindow - this.getAverageBotReplyTokens;
    return countTokens(convContent, this.LLMType) > ctx;
  }

  private buildConversationString(): string {
    return this.conversation.reduce((conv, entry) => {
      switch (entry.role) {
        case "user":
          return (conv += this.addUserEntry(entry.input));
        default:
          return (conv += this.addAIentry(entry.input));
      }
    }, "");
  }

  private addUserEntry(input: string): string {
    return `${this.tags.user}${input}${this.tags.closing}`;
  }

  private addAIentry(input: string): string {
    return `${this.tags.bot}${input}${this.tags.closing}`;
  }

  private addSysPrompt(): string {
    return `${this.tags.system}${this.systemPrompt}${this.tags.closing}`;
  }

  private addAIOpening(): string {
    return `${this.tags.bot}${this.responseDirective}`;
  }

  public get getConversation(): string {
    return (
      this.addSysPrompt() + this.buildConversationString() + this.addAIOpening()
    );
  }

  private get getRawConversationContent(): string {
    return (
      this.systemPrompt +
      this.conversation.reduce((conv, entry) => {
        return (conv += " " + entry.input);
      }, "") +
      this.responseDirective
    );
  }

  private get getAverageBotReplyTokens(): number {
    const aiReplies = this.conversation.filter((x) => x.role === "ai");
    return Math.ceil(
      aiReplies.reduce(
        (acc, x) => acc + countTokens(x.input, this.LLMType),
        0
      ) / aiReplies.length
    );
  }
}

import { PromptTags, IPromptConstructor } from "./typings";

/**
 * Maneges chatbot prompt templating and conversation memory.
 */
export class PromptConstructor implements IPromptConstructor  {
  private conversation: string[] = [];
  public systemPrompt: string;
  public responseDirective = "";
  private tags: PromptTags;

  constructor(systemPrompt: string, tags: PromptTags) {
    this.systemPrompt = systemPrompt;
    this.tags = tags;
  }

  public addUserInput(userInput: string): void {
    this.conversation.push(`${this.tags.user}${userInput}${this.tags.closing}`);
  }

  public addAiResponse(response: any): void {
    this.conversation.push(`${this.tags.bot}${response}${this.tags.closing}`);
  }

  public popLeft(): void {
    this.conversation.shift();
  }

  public get getConversation(): string {
    return [
      `${this.tags.system}${this.systemPrompt}${this.tags.closing}`,
      ...this.conversation,
      `${this.tags.bot}${this.responseDirective}`,
    ].join("");
  }
}

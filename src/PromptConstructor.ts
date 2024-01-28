import { PromptTags, IPromptConstructor, IPromptConstructorParams }
from "./typings"
import { countTokens } from "./Tokenizer"

interface entry {
  role: string
  input: string
}

/**
 * LLM Prompt templating engine. Maneges chatbot prompt and conversation memory.
 */
export class PromptConstructor implements IPromptConstructor, IPromptConstructorParams {
  private conversation: entry[] = []
  public systemPrompt = "Respond casually. Use emojis. Express strong opinions."
  public responseAffirmation = ""
  public userInstruction = ""
  public LLMType: "llama" | "mistral" = "mistral"
  public contextWindow: number = 4096

  public tags: PromptTags = {
    system: "<|system|>\n",
    user: "<|user|>\n",
    bot: "<|assistant|>\n",
    closing: "</s>\n",
  }

  constructor(params?: Partial<IPromptConstructorParams>) {
    Object.assign(this, params)
  }

  public addUserInput(userInput: string): void {
    this.conversation.push({ role: "user", input: userInput })
    this.popLeftIfContextOverflow()
  }

  public addAiResponse(response: any): void {
    this.conversation.push({ role: "ai", input: response })
  }

  private popLeftIfContextOverflow(): void {
    if (!this.isContextOverflow()) return
    this.conversation.shift()
    this.popLeftIfContextOverflow()
  }

  private isContextOverflow(): boolean {
    const convContent = this.getRawConversationContent
    const ctx = this.contextWindow - this.getAverageBotReplyTokens
    return countTokens(convContent, this.LLMType) > ctx
  }

  private buildConversationString(conversation: entry[]): string {
    return conversation.reduce((conv, entry) => {
      switch (entry.role) {
        case "user": return conv += this.addUserEntry(entry.input)
        default: return conv += this.addAIentry(entry.input)
      }
    }, "")
  }

  private addUserEntry(input: string): string {
    return `${this.tags.user}${input}${this.tags.closing}`
  }

  private addAIentry(input: string): string {
    return `${this.tags.bot}${input}${this.tags.closing}`
  }

  private addSysPrompt(): string {
    return `${this.tags.system}${this.systemPrompt}${this.tags.closing}`
  }

  private addAIOpening(): string {
    return `${this.tags.bot}${this.responseAffirmation}`
  }

  private copyConversation(): entry[] {
    return JSON.parse(JSON.stringify(this.conversation))
  }

  private addUserInstruction(): string {
    const input = this.conversation[this.conversation.length - 1].input
    return `${input}\n---\n${this.userInstruction}`
  }

  public get getConversation(): string {
    const conv = this.copyConversation()
    const sysPrompt = this.systemPrompt ? this.addSysPrompt() : ""
    if (this.userInstruction) conv[conv.length - 1].input = this.addUserInstruction()
    return sysPrompt + this.buildConversationString(conv) + this.addAIOpening()
  }

  private get getRawConversationContent(): string {
    const conv = this.conversation.reduce((acc, x) => acc + " " + x.input , "")
    return this.systemPrompt + conv + this.responseAffirmation + 
      this.userInstruction
  }

  private get getAverageBotReplyTokens(): number {
    const aiReplies = this.conversation.filter((x) => x.role === "ai")
    const avg = aiReplies.reduce((acc, x) => 
      acc + countTokens(x.input, this.LLMType), 0)
    return Math.ceil(avg / aiReplies.length)
  }
}

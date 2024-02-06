import { PromptTags } from "../../HugBot/typings"
import { setParams } from "../../utility/inputValidation"
import { MemoryDump } from "../../HugBot/typings"
import { MemoryEntry } from "../../HugBot/typings"

export type PromptConstructorParams = {
  tags: PromptTags
}

export class PromptConstructor {
  public tags: PromptTags = {
    system: "<|im_start|>system\n",
    user: "<|im_start|>user\n",
    bot: "<|im_start|>assistant\n",
    closing: "<|im_end|>\n",
  }

  constructor(params?: Partial<PromptConstructorParams>) {
    if (!params) return
    setParams(params, this)
  }

  public setParams(params: Partial<PromptConstructorParams>) {
    setParams(params, this)
  }

  public getPromptTemplate(memoryDump: MemoryDump) {
    const conv = PromptConstructor.copyConversation(memoryDump.conversation)
    conv[conv.length - 1].input = PromptConstructor.addUserInstruction(memoryDump)
    return this.addSysPrompt(memoryDump.systemPrompt) + 
      this.buildConversation(conv) + 
      this.addAIOpening(memoryDump.responseAffirmation)
  }

  private buildConversation(conv: MemoryEntry[]) {
    return conv.map((x) => {
      return x.role === 'user' ? 
        this.addUserEntry(x.input) : this.addAIentry(x.input)
    }).join('')
  }

  private addUserEntry(input: string): string {
    return `${this.tags.user}${input}${this.tags.closing}`
  }

  private addAIentry(input: string): string {
    return `${this.tags.bot}${input}${this.tags.closing}`
  }

  private static copyConversation(conv: MemoryEntry[]): MemoryEntry[] {
    return JSON.parse(JSON.stringify(conv))
  }

  private addSysPrompt(sysPrompt: string): string {
    return sysPrompt ? `${this.tags.system}${sysPrompt}${this.tags.closing}` : ""
  }

  private static addUserInstruction(memoryDump: MemoryDump): string {
    const input = memoryDump.conversation[memoryDump.conversation.length - 1].input
    return memoryDump.userInstruction ? 
      `${input}\n---\n${memoryDump.userInstruction}` : `${input}`
  }

  private addAIOpening(responseAffirmation: string): string {
    return `${this.tags.bot}${responseAffirmation}`
  }
}

import { mistralTokenizer } from "../../systems/tokenizers/Tokenizers";
import { setParams } from "../../systems/gettersAndSetters"
import { MemoryEntry } from "../../HugBotEntity/HugBotEntity"

export type ShortTermMemoryParams = {
  tokenizer: (text: string) => number
  contextWindow: number
  systemPrompt: string
  responseAffirmation: string
  userInstruction: string
}

export class ShortTermMemory {
  private memory: MemoryEntry[] = []

  public tokenizer = mistralTokenizer

  public contextWindow = 4096
  public systemPrompt = "Respond casually. Use emojis. Express strong opinions."
  public responseAffirmation = ""
  public userInstruction = ""

  constructor(params?: Partial<ShortTermMemoryParams>) {
    if (!params) return
    setParams(params, this)
  }

  public setParams(params: Partial<ShortTermMemoryParams>) {
    setParams(params, this)
  }

  public push(entry: MemoryEntry): void {
    this.memory = this.memory.concat(entry)
    this.popLeftIfMemoryOverflow()
  }

  public get dump() {
    return {
      conversation: this.memory.slice(),
      systemPrompt: this.systemPrompt,
      responseAffirmation: this.responseAffirmation,
      userInstruction: this.userInstruction
    }
  }

  private popLeftIfMemoryOverflow(): void {
    while (this.isMemoryOverflow())
      this.memory = this.memory.slice(1)
  }

  private isMemoryOverflow(): boolean {
    return this.totalTokens > 
      this.contextWindow - this.averageBotReplyTokens
  }

  private get totalTokens(): number {
    return this.conversationTokens + 
      this.tokenizer(this.systemPrompt) + 
      this.tokenizer(this.responseAffirmation) + 
      this.tokenizer(this.userInstruction)
  }

 private get conversationTokens(): number {
    return this.memory.reduce((acc, x) => acc + this.tokenizer(x.input), 0)
  }

  private get averageBotReplyTokens(): number {
    const aiReplies = this.memory.filter(x => x.role === "ai")
    const avg = aiReplies.reduce((acc, x) => acc + this.tokenizer(x.input), 0)
    return Math.ceil(avg / aiReplies.length)
  }
}

import { mistralTokenizer } from "../../systems/tokenizers/Tokenizers";

export class ShortTermMemory {
  #memory: MemoryEntry[] = [];
  private tokenizer = mistralTokenizer;

  public contextWindow = 4096;
  public systemPrompt = "You are a helpful AI assistant.";
  public responseAffirmation = "";
  public userInstruction = "";

  constructor(params?: Partial<ShortTermMemoryParams>) {
    if (params)
      Object.entries(params).forEach(([key, value]) =>
        Object.assign(this, { [key]: value }));
  }

  public push(entry: MemoryEntry): void {
    this.#memory = this.#memory.concat(entry);
    this.#popLeftIfMemoryOverflow();
  }

  public get dump(): MemoryDump {
    return {
      conversation: this.#memory.slice(),
      systemPrompt: this.systemPrompt,
      responseAffirmation: this.responseAffirmation,
      userInstruction: this.userInstruction
    }
  }

  #popLeftIfMemoryOverflow() {
    while (this.#isMemoryOverflow())
      this.#memory = this.#memory.slice(1);
  }

  #isMemoryOverflow() {
    return this.#totalTokens > this.contextWindow - this.#averageBotReplyTokens;
  }

  get #totalTokens() {
    return this.#conversationTokens +
      this.tokenizer(this.systemPrompt) +
      this.tokenizer(this.responseAffirmation) +
      this.tokenizer(this.userInstruction);
  }

  get #conversationTokens() {
    return this.#memory.reduce((acc, x) => acc + this.tokenizer(x.input), 0);
  }

  get #averageBotReplyTokens() {
    const aiReplies = this.#memory.filter(x => x.role === "ai");
    const avg = aiReplies.reduce((acc, x) => acc + this.tokenizer(x.input), 0);
    return Math.ceil(avg / aiReplies.length);
  }
}

export type ShortTermMemoryParams = {
  tokenizer: (text: string) => number;
  contextWindow: number;
  systemPrompt: string;
  responseAffirmation: string;
  userInstruction: string;
}

type MemoryEntry = {
  role: "user" | "ai";
  input: string;
}

type MemoryDump = {
  conversation: MemoryEntry[];
  systemPrompt: string;
  responseAffirmation: string;
  userInstruction: string;
}


import { mistralTokenizer } from "../Tokenizers/MistralTokenizer";

/** 
 * Conversation memory buffer with token counter for managing limited context window lengths.
 * @method {push} - Adds entries to memory buffer.
 * @method {dump} - Retrieves current memory state including system prompt and response instructions.
 * @property {contextWindow} - Buffer length can be adjusted with contextWindow property.
 * @property {systemPrompt} {responseAffirmation} {userInstruction} - Stores current system prompt and other AI prompt template elements.
 * @property {tokenizer} - Tokenizer function used to calculate ammount of tokens across all memory entries.
 */
export class ShortTermMemory {
  #memory: MemoryEntry[] = [];

  tokenizer = mistralTokenizer;
  contextWindow = 4096;
  systemPrompt = "You are a helpful AI assistant.";
  responseAffirmation = "";
  userInstruction = "";

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


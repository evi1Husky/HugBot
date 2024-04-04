export class PromptConstructor {
  constructor(public tags: PromptTags = {
    system: "<|im_start|>system\n",
    user: "<|im_start|>user\n",
    bot: "<|im_start|>assistant\n",
    closing: "<|im_end|>\n",
  }) { }

  public getPromptTemplate(memoryDump: MemoryDump): string {
    const conv = PromptConstructor.#copyConversation(memoryDump.conversation);
    conv[conv.length - 1].input = PromptConstructor.#addUserInstruction(memoryDump);
    return this.#addSysPrompt(memoryDump.systemPrompt) +
      this.#buildConversation(conv) +
      this.#addAIOpening(memoryDump.responseAffirmation);
  }

  #buildConversation(conv: MemoryEntry[]) {
    return conv.map((x) => {
      return x.role === 'user' ?
        this.#addUserEntry(x.input) : this.#addAIentry(x.input);
    }).join('');
  }

  #addUserEntry(input: string) {
    return `${this.tags.user}${input}${this.tags.closing}`;
  }

  #addAIentry(input: string) {
    return `${this.tags.bot}${input}${this.tags.closing}`;
  }

  #addSysPrompt(sysPrompt: string) {
    return sysPrompt ? `${this.tags.system}${sysPrompt}${this.tags.closing}` : "";
  }

  #addAIOpening(responseAffirmation: string) {
    return `${this.tags.bot}${responseAffirmation}`;
  }

  static #addUserInstruction(memoryDump: MemoryDump) {
    const input = memoryDump.conversation[memoryDump.conversation.length - 1].input;
    return memoryDump.userInstruction ?
      `${input}\n---\n${memoryDump.userInstruction}` : `${input}`;
  }

  static #copyConversation(conv: MemoryEntry[]): MemoryEntry[] {
    return JSON.parse(JSON.stringify(conv));
  }
}

type PromptTags = {
  system: string;
  user: string;
  bot: string;
  closing: string;
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


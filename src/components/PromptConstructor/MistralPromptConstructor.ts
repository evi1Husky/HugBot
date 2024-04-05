/**
 * Dedicated prompt formatter for Mistral models, because Mistrals have weird prompt format.
 * Produces this output:
 * @example
 * "<s>[INST] {system_prompt} Hello, how are you? [/INST]I'm doing great. How can I help you today?</s> [INST] I'd like to show off how chat templating works! [/INST]"
 */
export class MistralPromptConstructor {
  #firstUsrMsg: string | null = null;
  #firstAiMsg: string | null = null;

  public getPromptTemplate(memoryDump: MemoryDump): string {
    const conv: MemoryEntry[] = JSON.parse(JSON.stringify(memoryDump.conversation));
    if (conv[0].role == "ai")
      conv.shift();
    this.#firstUsrMsg = conv[0].input;
    if (conv.length > 1)
      this.#firstAiMsg = conv[1].input;
    conv[conv.length - 1].input = MistralPromptConstructor.#addUserInstruction(memoryDump);
    return this.#addSysPrompt(memoryDump.systemPrompt) +
      this.#buildConversation(conv) +
      this.#addAIOpening(memoryDump.responseAffirmation);
  }

  #addSysPrompt(sysPrompt: string) {
    if (this.#firstUsrMsg && !this.#firstAiMsg)
      return `<s>[INST] ${sysPrompt} ${this.#firstUsrMsg} [/INST] `;
    return `<s>[INST] ${sysPrompt} ${this.#firstUsrMsg} [/INST]${this.#firstAiMsg}</s> `;
  }

  #buildConversation(conv: MemoryEntry[]) {
    if (!this.#firstAiMsg)
      return "";
    return conv.map((x) => {
      if (x.input === this.#firstUsrMsg || x.input === this.#firstAiMsg)
        return "";
      return `[INST] ${x.input} [/INST] `;
    }).join("");
  }

  #addAIOpening(responseAffirmation: string) {
    if (!this.#firstAiMsg)
      return "";
    return `[INST] ${responseAffirmation}`;
  }

  static #addUserInstruction(memoryDump: MemoryDump) {
    const input = memoryDump.conversation[memoryDump.conversation.length - 1].input;
    return memoryDump.userInstruction ?
      `${input} ${memoryDump.userInstruction}` : `${input}`;
  }
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


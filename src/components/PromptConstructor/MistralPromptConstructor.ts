/**
 * Dedicated prompt formatter for Mistral models, because Mistrals have weird prompt format.
 * Produces this output:
 * @example
 * "<s>[INST] {system_prompt}\n Hello, how are you? [/INST] I'm doing great. How can I help you today?</s> [INST] I'd like to show off how chat templating works! [/INST]"
 */
export class MistralPromptConstructor {
  public getPromptTemplate(memoryDump: MemoryDump): string {
    const conv: MemoryEntry[] = JSON.parse(JSON.stringify(memoryDump.conversation));
    if (conv[0].role === "ai")
      conv.shift();
    conv[conv.length - 1].input = MistralPromptConstructor.#addUserInstruction(memoryDump);
    return MistralPromptConstructor.#addSysPrompt(memoryDump.systemPrompt) +
      MistralPromptConstructor.#addFirstUsrInst(conv.shift()!) +
      MistralPromptConstructor.#buildConversation(conv) +
      MistralPromptConstructor.#addAIOpening(memoryDump.responseAffirmation);
  }

  static #addSysPrompt(sysPrompt: string) {
    if (!sysPrompt.length)
      return "<s>[INST] ";
    return `<s>[INST] ${sysPrompt}\n`;
  }

  static #addFirstUsrInst(inst: MemoryEntry) {
    return `${inst.input} [/INST] `;
  }

  static #buildConversation(conv: MemoryEntry[]) {
    return conv.map((x) => {
      if (x.role === "user") {
        return ` [INST] ${x.input} [/INST] `
      } else {
        return `${x.input}</s>`;
      }
    }).join("");
  }

  static #addAIOpening(responseAffirmation: string) {
    return `${responseAffirmation}`;
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


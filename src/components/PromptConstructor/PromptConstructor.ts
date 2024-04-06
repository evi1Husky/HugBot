/**
 * AI Prompt formatter. Supports most of the common models with standard tag formats.
 * Does NOT support Mistral, use MistralPromptConstructor instead.
 * @param tags Use tags param to specify the prompt tag format.  
 * @example 
 * ```json
 * tags: {
 *   bos: "",
 *   system: "<|im_start|>system\n",
 *   user: "<|im_start|>user\n",
 *   bot: "<|im_start|>assistant\n",
 *   closing: "<|im_end|>\n",
 *  }
 * ```
 *  @method getPromptTemplate - Takes the MemoryDump object and returns formatted AI prompt.
 *  @example
 * ```json
 *  memoryDump: {
 *    conversation: [
 *      {
 *        role: "user",
 *        input: "hi",
 *      },
 *      {
 *        role: "ai",
 *        input: "Hello, how can I help you?"
 *      },
 *      {
 *        role: "user",
 *        input: "Tell me something interesting"
 *      }
 *    ],
 *    systemPrompt: "You are a helpful AI assistant."
 *    responseAffirmation: "",
 *    userInstruction: ""
 *   }
 * ```
 *
 *  ===>
 *
 * ```string
 *  <|im_start|>system
 *  You are a helpful AI assistant.<|im_end|>
 *  <|im_start|>user
 *  hi<|im_end|>
 *  <|im_start|>assistant
 *  Hello, how can I help you?<|im_end>
 *  <|im_start|>user
 *  Tell me something interesting<|im_end|>
 *  <|im_start>assistant
 * ```
 */
export class PromptConstructor {
  constructor(readonly tags: PromptTags = {
    bos: "",
    system: "<|im_start|>system\n",
    user: "<|im_start|>user\n",
    bot: "<|im_start|>assistant\n",
    closing: "<|im_end|>\n",
  }) { }

  public getPromptTemplate(memoryDump: MemoryDump): string {
    const conv = JSON.parse(JSON.stringify(memoryDump.conversation));
    conv[conv.length - 1].input = PromptConstructor.#addUserInstruction(memoryDump);
    return this.#addBosTag() +
      this.#addSysPrompt(memoryDump.systemPrompt) +
      this.#buildConversation(conv) +
      this.#addAIOpening(memoryDump.responseAffirmation);
  }

  #buildConversation(conv: MemoryEntry[]) {
    return conv.map((x) => {
      return x.role === 'user' ?
        this.#addUserEntry(x.input) : this.#addAIentry(x.input);
    }).join('');
  }

  #addBosTag() {
    return this.tags.bos;
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
      `${input} ${memoryDump.userInstruction}` : `${input}`;
  }
}

type PromptTags = {
  bos: string;
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


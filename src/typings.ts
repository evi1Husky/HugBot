export interface IHugBot {
  languageModel: string;
  name: string;
  systemPrompt: string;
  responseDirective: string;
  tokenCounter: ITokenCounter | undefined;
  params: {
    top_k: number | undefined;
    top_p: number | undefined;
    temperature: number;
    repetition_penalty: number | undefined;
    max_new_tokens: number | undefined;
    max_time: number | undefined;
    return_full_text: boolean;
    num_return_sequences: number;
    do_sample: boolean;
    truncate: number | undefined;
  };
  options: {
    wait_for_model: boolean;
    use_cache: boolean;
  };
  tags: {
    system: string;
    user: string;
    bot: string;
    closing: string;
  };
  respondTo: (userInput: string) => Promise<string>;
}

export type Response = [{ generated_text: string }];

export interface ITokenCounter {
  LLMType: string;
  contextWindow: number;
  contextOverflow: boolean;
  resetTokenCount: () => void;
  popLeft: () => void;
  addTokens: (text: string, role?: "bot" | "user") => void;
  countAdditionalTokens: (...strings: string[]) => void;
}

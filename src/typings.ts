export interface IHugBot {
  name: string;
  tokenCounter: ITokenCounter;
  promptConstructor: IPromptConstructor;
  AIClient: IHuggingFaceTextGenClient;
  respondTo: (userInput: string) => Promise<string>;
}

export type InferenceAPIErrorResponse = {
  error: string;
  error_type: string;
};

export type InferenceAPITextGenResponse = [{ generated_text: string }];

export interface PromptTags {
  system: string;
  user: string;
  bot: string;
  closing: string;
}

export interface ITokenCounter {
  LLMType: string;
  contextWindow: number;
  contextOverflow: boolean;
  resetTokenCounter: () => void;
  popLeft: () => void;
  addTokens: (text: string, role?: "bot" | "user") => void;
  countAdditionalTokens: (...strings: string[]) => void;
}

export interface IPromptConstructor {
  systemPrompt: string;
  responseDirective: string;
  addUserInput: (userInput: string) => void;
  addAiResponse: (response: any) => void;
  popLeft: () => void;
  get getConversation(): string;
}

export interface IHuggingFaceTextGenClient {
  languageModel: string;
  params: IHuggingFaceTextGenParams;
  options: {
    wait_for_model: boolean;
    use_cache: boolean;
  };
  set setParams(params: Partial<IHuggingFaceTextGenParams>);
  sendRequest: (consversation: string) => Promise<string>;
}

export interface IHuggingFaceTextGenParams {
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
}

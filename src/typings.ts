export interface IHugBot {
  name: string;
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

export interface IPromptConstructor {
  tags: PromptTags;
  systemPrompt: string;
  responseDirective: string;
  LLMType: "llama" | "mistral";
  contextWindow: number;
  addUserInput: (userInput: string) => void;
  addAiResponse: (response: any) => void;
  get getConversation(): string;
}

export interface IHuggingFaceTextGenClient {
  languageModel: string;
  apiToken: string | undefined;
  params: IHuggingFaceTextGenParams;
  options: {
    wait_for_model: boolean;
    use_cache: boolean;
  };
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

import { HugBot } from "./HugBot";
import { PromptConstructor } from "./PromptConstructor";
import { HuggingFaceTextGenClient } from "./HuggingFaceTextGenClient";
import {
  IHugBot,
  IPromptConstructor,
  IHuggingFaceTextGenClient,
} from "./typings";

export { HugBot, PromptConstructor, HuggingFaceTextGenClient };

/**
 * Chat bot using HuggingFace Inference API Zephyr-7b-beta model.
 */
export class Zephyr extends HugBot implements IHugBot {
  public name = "Zephyr";
  readonly promptConstructor: IPromptConstructor = new PromptConstructor();
  readonly AIClient: IHuggingFaceTextGenClient = new HuggingFaceTextGenClient();
  constructor(apiToken?: string) {
    super();
    this.AIClient.languageModel = "HuggingFaceH4/zephyr-7b-beta";
    this.AIClient.apiToken = apiToken;
    this.AIClient.params.temperature = 0.6;
  }
}

/**
 * Chat bot using HuggingFace Inference API Nous-Hermes-2-Mixtral-8x7B-DPO model.
 */
export class Hermes extends HugBot implements IHugBot {
  public name = "Hermes";
  readonly promptConstructor: IPromptConstructor = new PromptConstructor();
  readonly AIClient: IHuggingFaceTextGenClient = new HuggingFaceTextGenClient();
  constructor(apiToken?: string) {
    super();
    this.AIClient.languageModel = "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO";
    this.AIClient.apiToken = apiToken;
    this.AIClient.params.temperature = 0.9;
    this.promptConstructor.tags = {
      system: "<|im_start|>system\n",
      user: "<|im_start|>user\n",
      bot: "<|im_start|>assistant\n",
      closing: "<|im_end|>\n",
    };
  }
}

/**
 * Chat bot using HuggingFace Inference API TinyLlama-1.1B-Chat-v1.0 model.
 */
export class TinyLlama extends HugBot implements IHugBot {
  public name = "TinyLlama";
  readonly promptConstructor: IPromptConstructor = new PromptConstructor();
  readonly AIClient: IHuggingFaceTextGenClient = new HuggingFaceTextGenClient();
  constructor(apiToken?: string) {
    super();
    this.promptConstructor.contextWindow = 2000;
    this.promptConstructor.systemPrompt = "";
    this.AIClient.languageModel = "TinyLlama/TinyLlama-1.1B-Chat-v1.0";
    this.AIClient.apiToken = apiToken;
    this.AIClient.params.temperature = 0.9;
    this.AIClient.params.repetition_penalty = 0.3;
    this.AIClient.params.do_sample = true;
    this.AIClient.params.max_new_tokens = 250;
  }
}

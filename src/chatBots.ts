import { HugBot } from "./HugBot";
import { TokenCounter } from "./TokenCounter";
import { PromptConstructor } from "./PromptConstructor";
import { HuggingFaceTextGenClient } from "./HuggingFaceTextGenClient";
import {
  IHugBot,
  ITokenCounter,
  IPromptConstructor,
  IHuggingFaceTextGenClient,
} from "./typings";

export { HugBot, TokenCounter, PromptConstructor, HuggingFaceTextGenClient };

/**
 * Chat bot using HuggingFace Inference API Zephyr-7b-beta model.
 */
export class Zephyr extends HugBot implements IHugBot {
  public name = "Zephyr";
  readonly promptConstructor: IPromptConstructor = new PromptConstructor(
    "Respond casually. Use emojis. Express strong opinions.",
    {
      system: "<|system|>\n",
      user: "<|user|>\n",
      bot: "<|assistant|>\n",
      closing: "</s>\n",
    }
  );
  readonly tokenCounter: ITokenCounter = new TokenCounter("mistral", 4096);
  readonly AIClient: IHuggingFaceTextGenClient;
  constructor(apiToken?: string) {
    super();
    this.AIClient = new HuggingFaceTextGenClient(
      "HuggingFaceH4/zephyr-7b-beta",
      apiToken
    );
    this.AIClient.setParams = { temperature: 0.6 };
  }
}

/**
 * Chat bot using HuggingFace Inference API Nous-Hermes-2-Mixtral-8x7B-DPO model.
 */
export class Hermes extends HugBot implements IHugBot {
  public name = "Hermes";
  readonly promptConstructor: IPromptConstructor = new PromptConstructor(
    "Respond casually. Use emojis. Express strong opinions.",
    {
      system: "<|im_start|>system\n",
      user: "<|im_start|>user\n",
      bot: "<|im_start|>assistant\n",
      closing: "<|im_end|>\n",
    }
  );
  readonly tokenCounter: ITokenCounter = new TokenCounter("mistral", 4096);
  readonly AIClient: IHuggingFaceTextGenClient;
  constructor(apiToken?: string) {
    super();
    this.AIClient = new HuggingFaceTextGenClient(
      "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
      apiToken
    );
    this.AIClient.setParams = { temperature: 0.9 };
  }
}

/**
 * Chat bot using HuggingFace Inference API TinyLlama-1.1B-Chat-v1.0 model.
 */
export class TinyLlama extends HugBot implements IHugBot {
  public name = "TinyLlama";
  readonly promptConstructor: IPromptConstructor = new PromptConstructor("", {
    system: "<|system|>\n",
    user: "<|user|>\n",
    bot: "<|assistant|>\n",
    closing: "</s>\n",
  });
  readonly tokenCounter: ITokenCounter = new TokenCounter("mistral", 2000);
  readonly AIClient: IHuggingFaceTextGenClient;
  constructor(apiToken?: string) {
    super();
    this.AIClient = new HuggingFaceTextGenClient(
      "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
      apiToken
    );
    this.AIClient.setParams = {
      temperature: 0.3,
      repetition_penalty: 1.0,
      do_sample: true,
      max_new_tokens: 250,
    };
  }
}

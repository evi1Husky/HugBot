import { HugBot } from "./HugBot";
import { IHugBot } from "./typings";
import { TokenCounter } from "./TokenCounter";
import { PromptConstructor } from "./PromptConstructor";
import { ITokenCounter, IPromptConstructor } from "./typings";

export { HugBot };

/**
 * Chat bot using HuggingFace Inference API Zephyr-7b-beta model.
 */
export class Zephyr extends HugBot implements IHugBot {
  readonly languageModel = "HuggingFaceH4/zephyr-7b-beta";
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
  public params = {
    top_k: undefined,
    top_p: 0.95,
    temperature: 0.6,
    repetition_penalty: 1.1,
    max_new_tokens: 500,
    max_time: 30,
    return_full_text: false,
    num_return_sequences: 1,
    do_sample: false,
    truncate: undefined,
  };
}

/**
 * Chat bot using HuggingFace Inference API Nous-Hermes-2-Mixtral-8x7B-DPO model.
 */
export class Hermes extends HugBot implements IHugBot {
  readonly languageModel = "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO";
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
  public params = {
    top_k: undefined,
    top_p: undefined,
    temperature: 0.8,
    repetition_penalty: 1.1,
    max_new_tokens: 500,
    max_time: 30,
    return_full_text: false,
    num_return_sequences: 1,
    do_sample: true,
    truncate: undefined,
  };
}

/**
 * Chat bot using HuggingFace Inference API TinyLlama-1.1B-Chat-v1.0 model.
 */
export class TinyLlama extends HugBot implements IHugBot {
  readonly languageModel = "TinyLlama/TinyLlama-1.1B-Chat-v1.0";
  public name = "TinyLlama";
  readonly promptConstructor: IPromptConstructor = new PromptConstructor("", {
    system: "<|system|>\n",
    user: "<|user|>\n",
    bot: "<|assistant|>\n",
    closing: "</s>\n",
  });
  readonly tokenCounter: ITokenCounter = new TokenCounter("mistral", 2000);
  public params = {
    top_k: undefined,
    top_p: undefined,
    temperature: 0.3,
    repetition_penalty: 1.0,
    max_new_tokens: 200,
    max_time: 30,
    return_full_text: false,
    num_return_sequences: 1,
    do_sample: false,
    truncate: undefined,
  };
}

import { HugBot } from "./HugBot";
import { IHugBot } from "../typings";

/**
 * Chat bot using HuggingFace Inference API Zephyr-7b-beta model.
 * @constructor
 * @param string apiToken - API token for authentication with
 * HuggingFace Inference API. Optional.
 * @example
 * // Create a new Zephyr instance
 * const zephyr = new Zephyr();
 *
 * // Generate a response
 * const response = await zephyr.respondTo('Hi!');
 */
export class Zephyr extends HugBot implements IHugBot {
  readonly languageModel = "HuggingFaceH4/zephyr-7b-beta";
  public systemPrompt =
    "Respond casually. Use emojis. Express strong opinions.";
  public responseDirective = "";
  public contextWindow = 4096;
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
  readonly tags = {
    system: "<|system|>\n",
    user: "<|user|>\n",
    bot: "<|assistant|>\n",
    closing: "</s>\n",
  };
}

/**
 * Chat bot using HuggingFace Inference API Nous-Hermes-2-Mixtral-8x7B-DPO model.
 * @constructor
 * @param string apiToken - API token for authentication with
 * HuggingFace Inference API. Optional.
 * @example
 * // Create a new Hermes instance
 * const hermes = new Hermes();
 *
 * // Generate a response
 * const response = await hermes.respondTo('Hi!');
 */
export class Hermes extends HugBot implements IHugBot {
  readonly languageModel = "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO";
  public systemPrompt =
    "Respond casually. Use emojis. Express strong opinions.";
  public responseDirective = "";
  public contextWindow = 4096;
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
  readonly tags = {
    system: "<|im_start|>system\n",
    user: "<|im_start|>user\n",
    bot: "<|im_start|>assistant\n",
    closing: "<|im_end|>\n",
  };
}

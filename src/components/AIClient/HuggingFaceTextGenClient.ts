/** 
 * AI text generation client using Hugging Face inference API 
 * @link https://huggingface.co/docs/api-inference/detailed_parameters
 * @param language_model string - https://huggingface.co/models
 * @example "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO";
 * @param top_k number | undefined - Integer to define the top tokens considered within the sample operation to create new text.
 * @param top_p number | undefined - Float to define the tokens that are within the sample operation of text generation. Add tokens in the sample for more probable to least probable until the sum of the probabilities is greater than top_p.
 * @param temperature number - 0-100 The temperature of the sampling operation. 1 means regular sampling, 0 means always take the highest score, 100.0 is getting closer to uniform probability.
 * @param repetition_penalty number - 0-100 The more a token is used within generation the more it is penalized to not be picked in successive generation passes.
 * @param max_new_tokens number | undefined - The amount of new tokens to be generated, this does not include the input length it is a estimate of the size of generated text you want. Each new tokens slows down the request, so look for balance between response times and length of text generated.
 * @param max_time number | undefined - 0-120 The amount of time in seconds that the query should take maximum. Network can cause some overhead so it will be a soft limit.
 * @param return_full_text boolean - If set to False, the return results will not contain the original query making it easier for prompting.
 * @param num_return_sequences number - The number of proposition you want to be returned.
 * @param do_sample boolean - Whether or not to use sampling, use greedy decoding otherwise.
 * @param truncate number | boolean
 * @param wait_for_model boolean - If the model is not ready, wait for it instead of receiving 503. It limits the number of requests required to get your inference done. It is advised to only set this flag to true after receiving a 503 error as it will limit hanging in your application to known places.
 * @param use_cache boolean - There is a cache layer on the inference API to speedup requests we have already seen. Most models can use those results as is as models are deterministic (meaning the results will be the same anyway). However if you use a non deterministic model, you can set this parameter to prevent the caching mechanism from being used resulting in a real new query.
 */
export class HuggingFaceTextGenClient {
  #END_POINT = "https://api-inference.huggingface.co/models/";
  language_model = "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO";
  top_k = undefined;
  top_p = undefined;
  temperature = 0.7;
  repetition_penalty = 1.1;
  max_new_tokens = 512;
  max_time = 30;
  return_full_text = false;
  num_return_sequences = 1;
  do_sample = false;
  truncate = undefined;
  wait_for_model = true;
  use_cache = true;

  constructor(params?: Partial<HuggingFaceTextGenParams>) {
    if (params)
      Object.entries(params).forEach(([key, value]) =>
        Object.assign(this, { [key]: value }));
  }

  #makePayload(prompt: string, apiToken?: string) {
    const payload = {
      headers: {
        "Content-Type": "application/json",
        "x-compute-type": "cpu+optimized",
      } as Record<string, string>,
      method: "POST",
      body: JSON.stringify({
        inputs: prompt,
        options: {
          wait_for_model: this.wait_for_model,
          use_cache: this.use_cache,
        },
        parameters: {
          top_k: this.top_k,
          top_p: this.top_p,
          temperature: this.temperature,
          repetition_penalty: this.repetition_penalty,
          max_new_tokens: this.max_new_tokens,
          max_time: this.max_time,
          return_full_text: this.return_full_text,
          num_return_sequences: this.num_return_sequences,
          do_sample: this.do_sample,
          truncate: this.truncate,
        },
      }),
    }
    if (apiToken)
      payload.headers.Authorization = `Bearer ${apiToken}`;
    return payload;
  }

  /** Send request to HuggingFace Inference API.
  * @property {string} prompt - Formatted AI chat conversation string.
  * @property {string} apiToken - Optional API key. */
  public async sendRequest(prompt: string, apiToken?: string): Promise<string> {
    try {
      const payload = this.#makePayload(prompt, apiToken);
      const response = await fetch(this.#END_POINT + this.language_model, payload);
      const generatedText = await response.json();
      if ("error" in generatedText)
        console.error(generatedText.error);
      return generatedText[0].generated_text;
    } catch (error) {
      return "No response...";
    }
  }
}

type HuggingFaceTextGenParams = {
  language_model: string;
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
  wait_for_model: boolean;
  use_cache: boolean;
}


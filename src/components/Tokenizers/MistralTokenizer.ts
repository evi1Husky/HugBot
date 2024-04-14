// @ts-ignore
import { MistralTokenizer } from "mistral-tokenizer-ts"

const mistralTokenCounter = new MistralTokenizer()

/**
 * Tokenizer function is used to calculate the length of the chatbot memory buffer so that
 * it can be truncated if it exceeds context window of the model.
 */
export const mistralTokenizer = (text: string): number => {
  if (!text) {
    return 0;
  } else {
    return mistralTokenCounter.encode(text, true, false).length;
  }
}


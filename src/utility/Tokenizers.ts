import { MistralTokenizer } from "mistral-tokenizer-ts"

const mistralTokenCounter = new MistralTokenizer()

export const mistralTokenizer = (text: string): number => {
  return mistralTokenCounter.encode(text, true, false).length
}

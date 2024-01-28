import { MistralTokenizer } from "mistral-tokenizer-ts"

const mistralTokenizer = new MistralTokenizer()

type LLM = "llama" | "mistral"

export const countTokens = (text: string, LLMType: LLM): number => {
  switch (LLMType) {
    case "mistral": return mistralTokenizer.encode(text, true, false).length
    case "llama": return mistralTokenizer.encode(text, true, false).length
  }
}

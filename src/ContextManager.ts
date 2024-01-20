import { MistralTokenizer } from "mistral-tokenizer-ts";

const tokenizer = new MistralTokenizer();

const countTokens = (text: string): number =>
  tokenizer.encode(text, false).length;

const isContextOverflow = (conv: string[], ctx: number): boolean =>
  countTokens(conv.join("")) > ctx;

const gatherBotReplies = (conv: string[]): string[] => {
  return conv
    .slice(0)
    .reverse()
    .filter((_, i) => i % 2 === 0)
    .slice(1);
};

const getAverageTokensPerAiResponse = (conv: string[]): number => {
  const replies = gatherBotReplies([...conv.slice(1)]);
  const sum = replies.reduce((acc, val) => acc + countTokens(val), 0);
  return Math.floor(sum / replies.length);
};

const popLeftFromBuffer = (conv: string[], ctx: number): string[] => {
  if (!isContextOverflow(conv, ctx)) return conv.slice(1, conv.length - 1);
  return popLeftFromBuffer([conv[0], ...conv.slice(2)], ctx);
};

export const popLeft = (conv: string[], contextWindow: number): string[] => {
  const ctx = contextWindow - getAverageTokensPerAiResponse(conv);
  return popLeftFromBuffer(conv, ctx);
};

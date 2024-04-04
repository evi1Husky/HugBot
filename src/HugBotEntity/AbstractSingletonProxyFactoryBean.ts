import { HugBot, HugBotEntity, HugBotParams } from "./HugBotEntity"
import { setParams, areAllowedParams } from "../systems/gettersAndSetters";

export const HugBotProxy = (bot: HugBotEntity) => {
  return Object.seal(new Proxy(bot, {
    get: (target, key) => {
      if (key === "respondTo") {
        return (prompt: string, apiToken?: string): Promise<string> => {
          return target[key]!(prompt, apiToken);
        }
      } else if (key === "setParams") {
        return (params: Partial<HugBotParams>): void => {
          if (areAllowedParams(params, allowedParams)) {
            setParams(params, target);
          } else {
            throwError("Access denied. Can't assign property.");
          }
        }
      } else if (key === "id") {
        return target[key];
      } else {
        throwError(`Property ${key.toString()} doesn't exist on HugBot.`);
      }
    },
    set: (_, key) => {
      throwError(`Access denied. Can't assign ${key.toString()} property.`);
    },
    deleteProperty: (_, key) => {
      throwError(`Access denied. Can't delete ${key.toString()} property.`);
    },
  })) as HugBot;
};

function throwError(message: string): never {
  throw { message: message, };
}

const allowedParams = new Set([
  "systemPrompt",
  "responseAffirmation",
  "userInstruction",
  "contextWindow",
  "top_k",
  "top_p",
  "temperature",
  "repetition_penalty",
  "max_new_tokens",
  "max_time",
  "return_full_text",
  "num_return_sequences",
  "do_sample",
  "truncate",
  "wait_for_model",
  "use_cache",
]);


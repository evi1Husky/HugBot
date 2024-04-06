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
          setParams(params, target);
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




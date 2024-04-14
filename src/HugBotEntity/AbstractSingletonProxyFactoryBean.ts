import { HugBot, HugBotEntity, HugBotParams } from "./HugBotEntity"
import { setParams } from "./gettersAndSetters";
import { availableParams } from "./availableParams";
import { RateLimiter } from "./RateLimiter";

/** 
 * This handles bot access and input validation.
 * */
export const HugBotProxy = (bot: HugBotEntity): HugBot => {
  const rateLimiter = new RateLimiter(1000, 1);
  return Object.seal(new Proxy(bot, {
    get: (bot, prop) => {
      switch (prop) {
        case "respondTo":
          return async (prompt: string, apiToken?: string): Promise<string> => {
            try {
              rateLimiter.check();
              return bot.respondTo!(prompt, apiToken);
            } catch (what: any) {
              console.error(what.err);
              return what.err;
            }
          }
        case "onResponse":
          return (...cb: Array<(res: string) => void>): void =>
            bot.IObuffer?.onResponse(...cb);
        case "pushMessage":
          return (msg: string): void => bot.IObuffer?.pushMessage(msg);
        case "setParams":
          return (params: Partial<HugBotParams>): void => {
            for (const param in params) {
              if (!availableParams.has(param)) {
                console.error(`Can't set param: ${param}`);
                return;
              }
            }
            setParams(params, bot);
          }
        case "id":
          return bot.id;
        case "apiToken":
          return async (apiToken: string) => {
            if (apiToken === null) {
              bot.secretsHider?.destroy();
              return true;
            } else if (typeof apiToken !== "string" || !apiToken.length) {
              console.error("Api key must be a string.");
              return false;
            } else {
              const res = await bot.secretsHider!.set(apiToken);
              return res;
            }
          }
        default:
          console.error(`Property ${prop.toString()} doesn't exist on HugBot.`);
          return false;
      }
    },
    set: (_, prop) => {
      console.error(`Access denied. Can't assign ${prop.toString()} property.`);
      return false;

    },
    deleteProperty: (_, prop) => {
      console.error(`Access denied. Can't delete ${prop.toString()} property.`);
      return false;
    },
  })) as HugBot;
}


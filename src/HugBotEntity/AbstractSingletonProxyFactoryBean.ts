import { HugBotEntity, HugBotParams } from "./HugBotEntity"

/**
 * Stringly typed bot params for runtime type-checking when using setParams setter.
 */
const availableParams = new Set([
  "systemPrompt",
  "responseAffirmation",
  "contextWindow",
  "topK",
  "topP",
  "temperature",
  "repetitionPenalty",
  "maxNewTokens",
  "maxTime",
  "doSample",
]);

/**
 * Traverses bot components to set provided params if their names and types match existing properties.
 */
const setParams = <T>(params: Record<string, T>, obj: Record<string, any>) => {
  Object.entries(obj).forEach(([key, value]) => {
    if (params.hasOwnProperty(key) && typeof params[key] === typeof value)
      obj[key] = params[key];
    if (typeof value === "object" && value !== null)
      setParams(params, value);
  });
}

/** 
 * This handles bot access and input validation.
 */
export const HugBotProxy = (bot: HugBotEntity) => {
  return Object.seal(new Proxy(bot, {
    get: (bot, prop) => {
      switch (prop) {
        case "respondTo":
          return async (prompt: string, apiToken?: string): Promise<string> => {
            try {
              return await bot.respondTo!(bot, prompt, apiToken);
            } catch (what: any) {
              console.error(what.message);
              return what.message;
            }
          }
        case "onResponse":
          return (...cb: Array<(res: string) => void>): void => {
            try {
              bot.IObuffer!.onResponse(...cb)
            } catch (what: any) {
              console.error(what.message);
            }
          };
        case "pushMessage":
          return (msg: string): void => {
            try {
              bot.IObuffer!.pushMessage(msg);
            } catch (what: any) {
              console.error(what.message)
            }
          }
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
  }));
}


import { HugBot } from "../HugBotEntity/HugBotEntity";

type BotsInStorage = "StarChat" | "Zephyr" | "Hermes" | "Mixtral" | "Mistral";

/**
 * Bot storage container. Maps bot id's to their builder functions.
 * The bot is instantiated during retieval with get() method.
 */
export const BotStorage = () => {
  const store: Map<string, () => HugBot> = new Map();

  const put = (id: string, fn: () => HugBot) => {
    store.set(id, fn);
    return { put, get };
  }

  const get = (id: BotsInStorage) => store.get(id)!();

  return { put, get };
}



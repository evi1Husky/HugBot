import { HugBot } from "../HugBotEntity/HugBotEntity";

type BotsInStorage = "StarChat" | "Zephyr" | "Hermes" | "Mixtral" | "Mistral";

export const BotStorage = () => {
  const store: Map<string, () => HugBot> = new Map();

  const put = (id: string, fn: () => HugBot) => {
    store.set(id, fn);
    return { put, get };
  }

  const get = (id: BotsInStorage) => store.get(id)!();

  return { put, get };
}



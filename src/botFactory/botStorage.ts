import { HugBotEntity } from "../HugBotEntity/HugBotEntity"

export const BotStorage = () => {
  const store: Record<string, () => HugBotEntity> = {}

  const set = (key: string, val: () => HugBotEntity) => {
    Object.assign(store, { [key]: val });
    return options;
  }

  const get = (key: string) => store[key]();

  const remove = (key: string) => {
    delete store[key];
    return options;
  }

  const options = { set, get, remove }
  return options;
}

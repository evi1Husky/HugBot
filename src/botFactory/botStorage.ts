import { HugBot } from "./botFactory"

export const BotStorage = () => {
  const store: Record<string, () => HugBot> = {}

  const set = (key: string, val: () => HugBot) => {
    store[key] = val
    return options
  }

  const get = (key: string): HugBot => store[key]()

  const getAll = () => store

  const remove = (key: string) => {
    delete store[key]
    return options
  }

  const clear = () => {
    Object.keys(store).forEach(key => delete store[key])
    return options
  }

  const options = {set, get, remove, getAll, clear}
  return options
}

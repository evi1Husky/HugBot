import { HugBot } from "../botFactory"

export const BotStorage = () => {
  const map: Record<string, () => HugBot> = {}

  const set = (key: string, val: () => HugBot) => {
    Object.assign(map, {[key]: val})
    return options
  }

  const get = (key: string): HugBot => map[key]()

  const getAll = () => map

  const remove = (key: string) => {
    delete map[key]
    return options
  }

  const clear = () => {
    Object.keys(map).forEach(key => delete map[key])
    return options
  }

  const options = {set, get, remove, getAll, clear}
  return options
}

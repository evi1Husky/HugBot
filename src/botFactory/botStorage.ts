import { hugbot } from "../AbstractHugBotProxyBean/typings"

export const BotStorage = () => {
  const store: Record<string, () => hugbot> = {}

  const set = (key: string, val: () => hugbot) => {
    Object.assign(store, {[key]: val})
    return options
  }

  const get = (key: string) => store[key]()
  
  const remove = (key: string) => {
    delete store[key]
    return options
  }

  const options = { set, get, remove }
  return options
}
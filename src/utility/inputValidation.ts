import { HugBotParams } from "../HugBot/typings"

export const setParams = (params: Partial<HugBotParams>, obj: Record<string, any>) => {
  Object.entries(params).forEach(([key, value]) => {
    if (obj.hasOwnProperty(key) && typeof obj[key] === typeof value) 
      obj[key] = value
  })
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "object") 
      setParams(params, value) 
  })
}

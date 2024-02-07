export const setParams = <T>(params: Record<string, T>, obj: Record<string, any>) => {
  Object.entries(params).forEach(([key, value]) => {
    if (obj.hasOwnProperty(key) && typeof obj[key] === typeof value) 
      obj[key] = value
  })
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "object") 
      setParams(params, value) 
  })
}

const objectFromEntries = <T>(entries: [string, T][]): Record<string, T> => 
  entries.reduce((acc, x) => Object.assign(acc, {[x[0]]: x[1]}), {})

const allowedParams = new Map<string, string>([
  ["systemPrompt", "string"],
  ["contextWindow", "number",]
])

export const filterValidParams = <T>(params: Record<string, T>) => {
  const allowedEntries = Object.entries(params)
    .filter(x => allowedParams.has(x[0]) && typeof x[1] === allowedParams.get(x[0]))
  return objectFromEntries(allowedEntries)
}


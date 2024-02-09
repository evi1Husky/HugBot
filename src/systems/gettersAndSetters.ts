export const setParams = <T>(params: Record<string, T>, obj: Record<string, any>) => {
  Object.entries(obj).forEach(([key, value]) => {
    if (params.hasOwnProperty(key) && typeof params[key] === typeof value) 
      obj[key] = params[key]
    if (typeof value === "object" && value !== null) 
      setParams(params, value) 
  })
}

export const getObjectProps = <T>(props: string[], obj: object, 
  acc: Record<string, T> = {}): Record<string, T> => {
  Object.entries(obj).forEach(([key, value]) => {
    if (props.includes(key))
      Object.assign(acc, {[key]: value})
    if (typeof value === "object")
      getObjectProps(props, value, acc) 
  })
  return JSON.parse(JSON.stringify(acc))
}

const objectFromEntries = <T>(entries: [string, T][]): Record<string, T> => 
  entries.reduce((acc, x) => Object.assign(acc, {[x[0]]: x[1]}), {})

export const filterDisallowedParams = 
    <T>(params: Record<string, T>, disallowedParams: Set<string>) => {
  const allowedParams = Object.entries(params).filter(x => !disallowedParams.has(x[0]))
  return objectFromEntries(allowedParams)
}

import { setParams } from "../systems/gettersAndSetters"
import { HugBotEntity, HugBotParams, HugBotComponentsConstructors, 
HugBotComponents, HugBotSystems }
from "../HugBotEntity/HugBotEntity"

export const buildHugBot = (id: string) => {
  const botComponents: Partial<HugBotComponents> = {}
  const botSystems: Partial<HugBotSystems> = {}

  const fromComponents = (components: HugBotComponentsConstructors) => {
    Object.entries(components).forEach(([key, value]) => 
      Object.assign(botComponents, {[key]: new value}))
    return { andSystems, withParams, build }
  }

  const andSystems = (systems: Partial<HugBotSystems>) => {
    Object.assign(botSystems, { ...systems })
    return { withParams, build }
  }

  const withParams = (params: Partial<HugBotParams>) => {
    setParams(params, botComponents)
    return { build }
  }

  const makeCleanObject = (): object => 
    JSON.parse(JSON.stringify(Object.create(null)))

  const build = (): HugBotEntity => {
    return Object.assign(makeCleanObject(), 
      {id: id}, botComponents, botSystems)
  }

  return { fromComponents }
}
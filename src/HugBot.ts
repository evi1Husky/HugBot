import { IHugBot, IHugBotDependencies, IPromptConstructor, 
IAIClient, IShortTermMemory } from "./typings"
import { HuggingFaceTextGenClient } from "./HuggingFaceTextGenClient"
import { PromptConstructor } from "./PromptConstructor"
import { ShortTermMemory } from "./ShortTermMemory"

export class HugBot implements IHugBot {
  readonly AIClient: IAIClient = new HuggingFaceTextGenClient()
  readonly promptConstructor: IPromptConstructor = new PromptConstructor()
  readonly shortTermMemory: IShortTermMemory = new ShortTermMemory()

  constructor(params?: Partial<IHugBotDependencies>) {
    Object.assign(this, params)
  }

  public setParams(params?: Partial<IHugBotDependencies>) {
    Object.assign(this, params)
  }

  public async respondTo(userInput: string, apiToken?: string): Promise<string> {
    this.shortTermMemory.push({role: "user", input: userInput})
    const memoryDump = this.shortTermMemory.dump
    const template = this.promptConstructor.getPromptTemplate(memoryDump)
    const response = await this.AIClient.sendRequest(template, apiToken)
    this.shortTermMemory.push({role: "ai", input: response})
    return response
  }
}

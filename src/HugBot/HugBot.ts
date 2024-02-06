import { HuggingFaceTextGenClient } from "../components/AIClient/HuggingFaceTextGenClient"
import { PromptConstructor } from "../components/PromptConstructor/PromptConstructor"
import { ShortTermMemory } from "../components/ShortTermMemory/ShortTermMemory"
import { setParams } from "../utility/inputValidation"
import {IAIClient, IPromptConstructor, IShortTermMemory, 
HugBotDependencies, HugBotParams } from "./typings"

export class HugBot {
  readonly AIClient: IAIClient = new HuggingFaceTextGenClient()
  readonly promptConstructor: IPromptConstructor = new PromptConstructor()
  readonly shortTermMemory: IShortTermMemory = new ShortTermMemory()

  constructor(params?: Partial<HugBotDependencies>) {
    if (!params) return
    setParams(params, this)
  }

  public setParams(params: Partial<HugBotParams>) {
    setParams(params, this)
  }

  public async respondTo(userInput: string, apiToken?: string): Promise<string> {
    this.shortTermMemory.push({role: "user", input: userInput})
    const memoryDump = this.shortTermMemory.dump
    const promptTemplate = this.promptConstructor.getPromptTemplate(memoryDump)
    const response = await this.AIClient.sendRequest(promptTemplate, apiToken)
    this.shortTermMemory.push({role: "ai", input: response})
    return response
  }
}

import { IHugBot, IHugBotDependencies, IPromptConstructor, IAIClient }
from "./typings"

export class HugBot implements IHugBot {
  readonly AIClient: IAIClient
  readonly promptConstructor: IPromptConstructor

  constructor({ AIClient, promptConstructor }: IHugBotDependencies) {
    this.AIClient = AIClient
    this.promptConstructor = promptConstructor
  }

  public async respondTo(userInput: string, apiToken?: string): Promise<string> {
    this.promptConstructor.addUserInput(userInput)
    const conv = this.promptConstructor.getConversation
    const response = await this.AIClient.sendRequest(conv, apiToken)
    this.promptConstructor.addAiResponse(response)
    return response
  }
}

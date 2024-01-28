import { IHugBot, IPromptConstructor, IAIClient }
from "./typings"

/**
 * Chat bot agent for HuggingFace Inference API text generation task models.
 */
export class HugBot implements IHugBot {
  readonly AIClient
  readonly promptConstructor

  constructor(client: IAIClient, constructor: IPromptConstructor) {
    this.AIClient = client
    this.promptConstructor = constructor
  }

  public async respondTo(userInput: string): Promise<string> {
    this.promptConstructor.addUserInput(userInput)
    const conv = this.promptConstructor.getConversation
    const response = await this.AIClient.sendRequest(conv)
    this.promptConstructor.addAiResponse(response)
    return response
  }
}

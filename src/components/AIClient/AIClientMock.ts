import { AIClient } from "../../HugBotEntity/HugBotEntity";

/** Mock AI client for testing purposes.
 * @param {number} maxDelay - maximum delay between responses */
export class AIClientMock implements AIClient {
  #BOT_REPLIES = [
    "Will do!",
    "Sure thing.",
    "Right away.",
    "Copy that.",
    "Noted.",
    "OK.",
    "Indeed!",
    "Sounds great!",
  ];

  constructor(private maxDelay: number = 700) { }

  /** Send request to mock AI api.
  * @return Promise<string> */
  public async sendRequest(prompt: string, apiToken?: string) {
    const delay = Math.floor(Math.random() * this.maxDelay);
    await new Promise((res) => setTimeout(res, delay));
    return this.#BOT_REPLIES[Math.floor(Math.random() * this.#BOT_REPLIES.length)];
  }
}


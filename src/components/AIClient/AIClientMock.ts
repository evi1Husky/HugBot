/** Mock AI client for testing purposes.
 * @param {number} maxDelay - maximum delay between responses */
export class AIClientMock {
  #BOT_REPLIES = [
    "Will do!",
    "Sure thing.",
    "Right away.",
    "Copy that.",
    "Noted.",
    "OK.",
    "Indeed!",
    "Sounds great!",
    "Excellen Elaborate further? Notably, I've been contemplating a peculiar puzzle:",
    "Starstruck! Agree wholeheartedly. Besides, have you checked out this mesmerizing piece?",
    "Strategic planning involves anticipating contingencies, preparing countermeasures for unexpected disruptions. Contemplating worst-case scenarios equips teams with tools needed to navigate crises expertly. Developing flexible blueprints accommodates shifting dynamics, maintaining agility despite volatile environments. Robust plans endure trials, retaining focus amid chaos and uncertainty.",
    "Reviewing the facts presented thus far, I recognize the validity in your stance. Nonetheless, examining underlying motivations driving particular decisions helps illuminate otherwise hidden opportunities. Weighing pros and cons carefully enables informed choices leading to favorable conclusions. Through transparent discourse, we can pinpoint areas requiring improvement and devise targeted remediation tactics.",
    "Exactly, couldn't have said it better. Alike, I marveled at this architectural masterpiece:",
    "When assessing multiple angles, your suggestion resonated strongly with me due to its alignment with overarching principles guiding our collective efforts. At times, focusing on details obscures our vision of broader objectives. Rest assured, your input steered us back onto the correct path. Now, let's collaboratively refine the proposal, ensuring each element contributes meaningfully toward achieving desired outcomes.",
    "On point! Creates suspense? Correspondingly, I watched this nail-biting movie marathon last weekend:"
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


export class AIClientMock {
  private BOT_REPLIES: string[] = [
    "Gotcha!",
    "Understood.",
    "Will do!",
    "Sure thing.",
    "Right away.",
    "Copy that.",
    "Noted.",
    "OK.",
    "Indeed!",
    "For sure!",
    "Definitely!",
    "Sounds great!",
    "Works for me!",
    "Excellent!",
    "Whoa, neat idea! Let me see if I find anything interesting...",
    "Hey, nice one! Do you have any theories on that?",
    "That's quite interesting; let me process that information",
    "Whoa, no kidding! Did your jaw drop too?",
    "Yeah, totally agree! Can you tell me more about it?",
    "Whoa, neat idea! I'll look for interesting bits related to it. Speaking of which, did you hear about...",
    "Great observation! Any theories brewing in your head? On another note, I recently learned...",
    "Whoa, no kidding! Isn't it fascinating? Oh, guess what happened yesterday...",
    "Yeah, totally agree! Could you tell me more about your thoughts on it? Meanwhile, I was wondering…",
    "Dang, impressive insight! It's almost poetic. Funny coincidence though, I came across…",
    "Wowsa! Absolutely, agreed. And hey, here's a fun fact I discovered lately:",
    "Right on! Life is full of surprises. BTW, have you heard the story about...",
    "Super cool! Things like this genuinely excite me. Actually, I stumbled upon a concept I bet you'll enjoy:",
    "Sheesh, reflecting on oneself teaches important lessons, wouldn't you say? Come to think of it, reminds me of when...",
    "Pretty cool! Wonder if there's a link to this. Hmm, speaking of connections, I discovered...",
    "Haha, nicely done! Love that take. Apart from humor, I bumped into this intriguing theory:",
    "Seriously? Amazed, aren't you? Geez, I recall experiencing something odd last week...",
    "Having considered both sides of the argument thoroughly, I lean towards solution YZ due to these reasons. Initiative YZ offers long-term benefits while minimizing short-term risks. Furthermore, it fosters collaboration among departments, promoting unity and shared goals. Nevertheless, I invite everyone to voice their concerns or present alternate solutions to encourage constructive dialogues.",
    "Wow, serendipity! Found anything worthwhile? Incidentally, I've come across this strange phenomenon:",
    "Surely, right on track. Elaborate further? Notably, I've been contemplating a peculiar puzzle:",
    "Gasp, shocking discovery! Thoughts? Parallel, I'm reminded of a wild encounter from days ago:",
    "Starstruck! Agree wholeheartedly. Besides, have you checked out this mesmerizing piece?",
    "Strategic planning involves anticipating contingencies, preparing countermeasures for unexpected disruptions. Contemplating worst-case scenarios equips teams with tools needed to navigate crises expertly. Developing flexible blueprints accommodates shifting dynamics, maintaining agility despite volatile environments. Robust plans endure trials, retaining focus amid chaos and uncertainty.",
    "Emphasizing transparency engenders trust, facilitating smoother interactions amongst stakeholders. Clear guidelines outline responsibilities, clarifying roles and alleviating confusion. Regular updates maintain alignment, reducing miscommunication instances. Transparent processes streamline operations, instilling confidence in participants.",
    "Balancing productivity with mental health safeguards creativity and fosters wellbeing. Prioritizing restorative breaks preserves cognitive acuity, preventing burnout. Providing resources supporting psychological safety encourages vulnerability, opening channels for honest communication. Mitigating stressors fortifies mental fortitude, empowering individuals to tackle demanding assignments resourcefully.",
    "Captivating! Brings up memories, doesn't it? Similarly, I experienced nostalgia browsing old photos:",
    "Upon evaluating the available options, I suggest exploring choice VWX because of several compelling factors. First, it aligns closely with our objectives. Second, it takes advantage of emerging trends in the industry. Lastly, it leverages our team's unique strengths. Of course, I remain open to discussing alternatives if others have differing opinions.",
    "Refreshing! Feeling enlightened? Allied, I dove into this eye-opening lecture lately:",
    "Delving deeper into the topic, I perceive value in your proposition, especially concerning its far-reaching implications. Our combined expertise allows us to identify nuances often overlooked by others. Consequently, merging our perspectives creates a robust framework capable of addressing complex challenges. To build upon this momentum, let's examine case studies where similar strategies proved successful, then brainstorm ways to apply those learnings proactively.",
    "Hauntingly accurate! Reminiscent of past events? Mirrored, I found solace in this comfort food recipe:",
    "Reviewing the facts presented thus far, I recognize the validity in your stance. Nonetheless, examining underlying motivations driving particular decisions helps illuminate otherwise hidden opportunities. Weighing pros and cons carefully enables informed choices leading to favorable conclusions. Through transparent discourse, we can pinpoint areas requiring improvement and devise targeted remediation tactics.",
    "Drawing from previous experiences and analyzing the given circumstances, I recommend path ABCDE for the following explanations. Path ABCDE presents itself as the optimal route since it builds upon established best practices while incorporating innovative techniques relevant to our situation. By choosing this avenue, not only do we enhance efficiency but also maintain sustainability throughout our operations. Despite having confidence in this recommendation, I am eager to engage in discussions regarding possible objections or diverse approaches.",
    "Exactly, couldn't have said it better. Alike, I marveled at this architectural masterpiece:",
    "When assessing multiple angles, your suggestion resonated strongly with me due to its alignment with overarching principles guiding our collective efforts. At times, focusing on details obscures our vision of broader objectives. Rest assured, your input steered us back onto the correct path. Now, let's collaboratively refine the proposal, ensuring each element contributes meaningfully toward achieving desired outcomes.",
    "On point! Creates suspense? Correspondingly, I watched this nail-biting movie marathon last weekend:"
  ]

  public maxDelay: number

  constructor (maxDelay?: number) {
    this.maxDelay = maxDelay ?? 700
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((res) => setTimeout(res, ms));
  }

  private getRndReply() {
    return Math.floor(Math.random() * this.BOT_REPLIES.length)
  }

  private getRndDelay() {
    return Math.floor(Math.random() * this.maxDelay)
  }

  public async sendRequest(consversation: string, apiToken?: string): Promise<string> {
    await this.delay(this.getRndDelay())
    return this.BOT_REPLIES[this.getRndReply()]
  }
}

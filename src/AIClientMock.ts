import { IAIClient, IHuggingFaceTextGenParams } from "./typings"

export class AIClientMock implements IAIClient {
  private BOT_REPLIES: string[] = [
    "Whoa, neat idea! Let me see if I find anything interesting...",
    "Hey, nice one! Do you have any theories on that?",
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
    "Awesome! Expand on that, please. Simultaneously, I've been curious about the origin of...",
    "Wow, serendipity! Found anything worthwhile? Incidentally, I've come across this strange phenomenon:",
    "Surely, right on track. Elaborate further? Notably, I've been contemplating a peculiar puzzle:",
    "Gasp, shocking discovery! Thoughts? Parallel, I'm reminded of a wild encounter from days ago:",
    "Starstruck! Agree wholeheartedly. Besides, have you checked out this mesmerizing piece?",
    "Surprisingly, yes! Detailed explanation? Interestingly, I encountered a rare specimen today:",
    "Yes, exactly! Join me in celebrating this epiphany. Equivalently, brace yourself for this exhilarating stunt:",
    "Spot on! More deets? Meantime, listen to this foot-tapping tune that embodies precision:",
    "Captivating! Brings up memories, doesn't it? Similarly, I experienced nostalgia browsing old photos:",
    "Magnificent! Opens room for interpretation. Coincidentally, I've been reading about symbolism in art:",
    "Refreshing! Feeling enlightened? Allied, I dove into this eye-opening lecture lately:",
    "Brilliant! Sparks imagination. Perhaps you'll find joy in this fantastical tale I stumbled upon:",
    "Hauntingly accurate! Reminiscent of past events? Mirrored, I found solace in this comfort food recipe:",
    "Compelling evidence! Ready for debate? Alternatively, I engaged in a riveting dialogue about ethics:",
    "So clever! Invokes curiosity? Naturally, I fell down a research rabbit hole investigating quantum mechanics:",
    "Exactly, couldn't have said it better. Alike, I marveled at this architectural masterpiece:",
    "Perfect timing! Grateful for the reminder? Congruently, I felt grateful visiting a local wildlife sanctuary:",
    "On point! Creates suspense? Correspondingly, I watched this nail-biting movie marathon last weekend:"
  ]

  public async sendRequest(consversation: string, apiToken?: string): Promise<string> {
    const rnd = Math.floor(Math.random() * this.BOT_REPLIES.length)
    return this.BOT_REPLIES[rnd]
  }
}

import { HugBotEntity } from "../../HugBotEntity/HugBotEntity";

export class IObuffer {
  #queue: string[] = [];
  #callStack: Map<string, (res: string) => void> = new Map();
  #bot: HugBotEntity | null = null;
  #processing = false;

  constructor(bot?: HugBotEntity) {
    if (bot) {
      this.#bot = bot;
    }
  }

  public set setBot(bot: HugBotEntity) {
    this.#bot = bot;
  }

  public onResponse(...cb: Array<(res: string) => void>): void {
    cb.forEach(cb => this.#callStack.set(cb.name, cb));
  }

  public removeEventListener(name: string | "all"): void {
    if (name === "all") {
      this.#callStack.clear();
    } else if (this.#callStack.has(name)) {
      this.#callStack.delete(name);
    }
  }

  async #process() {
    while (this.#queue.length) {
      if (this.#bot) {
        this.#processing = true;
        const msg = this.#queue.shift();
        if (!msg) {
          break;
        }
        const res = await this.#bot.respondTo!(msg);
        try {
          this.#callStack.forEach(cb => cb(res));
        } catch (what) {
          console.error(what);
        }
      } else {
        console.error("IOBuffer: Can't access HugBot instance.");
        break;
      }
    }
    this.#processing = false;
  }

  public pushMessage(msg: string): void {
    this.#queue.push(msg);
    if (!this.#processing) {
      this.#processing = true;
      setTimeout(() => this.#process(), 0);
    }
  }
}


import { HugBotEntity } from "../../HugBotEntity/HugBotEntity";
import { FCFSqueue } from "./FCFS_queue";

export class IObuffer {
  #queue = new FCFSqueue<string>();
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
    this.#processing = true;
    if (this.#queue.len <= 0) {
      this.#processing = false;
      return;
    } else if (!this.#bot || !this.#bot.respondTo) {
      console.error("IOBuffer: Can't access HugBot instance.");
      this.#processing = false;
      return;
    } else {
      try {
        const msg = this.#queue.popLeft();
        if (msg) {
          const res = await this.#bot.respondTo(msg);
          this.#callStack.forEach(cb => cb(res));
        }
      } catch (what) {
        console.error(what);
      }
    }
    this.#process();
  }

  public pushMessage(msg: string): void {
    this.#queue.push(msg);
    if (!this.#processing) {
      this.#processing = true;
      setTimeout(() => this.#process(), 0);
    }
  }
}


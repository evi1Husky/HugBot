import { HugBotEntity } from "../../HugBotEntity/HugBotEntity";
import { FCFSqueue } from "./FCFS_queue";

/**
 * This is used for async user message processing.
 * The bot instance is injected in constructor/with set method in the builder function and its
 * respondTo method is used to process the queued messages one by one with sleep intervals
 * set with rateLimit property. 
 * Add event listeners with onResponse methods then push messages to the queue with pushMessage method.
 */
export class IObuffer {
  #queue = new FCFSqueue<string>();
  #callStack: Map<string, (res: string) => void> = new Map();
  #bot: HugBotEntity | null = null;
  #processing = false;
  #delay: number;

  constructor(rateLimit: number = 5000, bot?: HugBotEntity,) {
    this.#delay = rateLimit;
    if (bot) { this.#bot = bot; }
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

  async #process(): Promise<void> {
    const t1 = performance.now();
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
          const res = await this.#bot.respondTo(this.#bot, msg);
          this.#callStack.forEach(cb => cb(res));
        }
      } catch (what) {
        console.error(what);
      }
    }
    const t2 = performance.now();
    const deltaT = t2 - t1;
    if (deltaT < this.#delay) {
      await IObuffer.#sleep(this.#delay - deltaT);
    }
    this.#delay = IObuffer.#rnd(this.#delay / 1.2, this.#delay);
    this.#process();
  }

  static #sleep(ms: number): Promise<unknown> {
    return new Promise((res) => setTimeout(res, ms));
  }

  static #rnd(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  public pushMessage(msg: string): void {
    this.#queue.push(msg);
    if (!this.#processing) {
      this.#processing = true;
      setTimeout(() => this.#process(), 0);
    }
  }
}


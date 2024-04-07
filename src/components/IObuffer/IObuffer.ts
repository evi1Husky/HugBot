import { HugBotEntity } from "../../HugBotEntity/HugBotEntity";

type queueNode = {
  prev?: queueNode;
  msg?: string;
}

export class IObuffer {
  #queue: queueNode = {};
  #callStack: Map<string, (res: string) => void> = new Map();
  #len = 0;
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
    while (this.#len) {
      if (this.#bot) {
        this.#processing = true;
        const msg = this.#pop();
        const res = await this.#bot.respondTo!(msg);
        this.#callStack.forEach(cb => cb(res));
      } else {
        console.error("IOBuffer: Can't access HugBot instance.");
        break;
      }
    }
    this.#processing = false;
  }

  public pushMessage(msg: string): void {
    if (this.#len === 0) {
      Object.assign(this.#queue, { msg });
    } else {
      const newNode: queueNode = { msg, prev: this.#queue };
      Object.assign(this.#queue, newNode)
    }
    this.#len++;
    if (!this.#processing) {
      this.#processing = true;
      setTimeout(() => this.#process(), 0);
    }
  }

  #pop(): string {
    if (this.#queue.msg) {
      const msg = this.#queue.msg;
      const prevNode: queueNode | undefined = this.#queue.prev;
      if (prevNode) {
        Object.assign(this.#queue, prevNode)
        this.#len--;
      } else {
        this.#len = 0;
      }
      return msg;
    } else {
      return "";
    }
  }
}


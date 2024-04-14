type QueueNode<T> = {
  thing: T | null,
  next: QueueNode<T> | null
}

export class FCFSqueue<T> {
  #queue: QueueNode<T>;
  #tail: QueueNode<T>;
  #len: number;

  constructor() {
    this.#queue = { thing: null, next: null }
    this.#tail = this.#queue;
    this.#len = 0;
  }

  public push(thing: T): this {
    if (this.#len === 0) {
      this.#queue = this.#tail;
      this.#queue.thing = thing;
      this.#len++;
    } else {
      this.#tail.next = { thing: thing, next: null };
      this.#tail = this.#tail.next;
      this.#len++;
    }
    return this;
  }

  public popLeft(): T | null {
    if (this.#len === 0) {
      return null;
    } else {
      const thing = this.#queue.thing;
      this.#queue = this.#queue.next!;
      this.#len--;
      return thing;
    }
  }

  public get len(): number { return this.#len; }
}


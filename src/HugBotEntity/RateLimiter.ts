export class RateLimiter {
  #t1: number;
  #delay: number;
  #spamNum: number;

  constructor(delay: number, spamNum: number) {
    this.#delay = delay;
    this.#spamNum = spamNum
    this.#t1 = performance.now();
  }

  public check(): void {
    const t2 = performance.now();
    const deltaT = t2 - this.#t1;
    this.#t1 = performance.now();
    if (deltaT > this.#delay) {
      return;
    } else {
      if (this.#spamNum > 0) {
        this.#spamNum--;
        return;
      } else {
        throw {
          err: `Rate limiter: You are doing this too often. Try again in ${this.#delay - deltaT}ms`
        };
      }
    }
  }
}


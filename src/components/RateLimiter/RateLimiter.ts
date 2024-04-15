export class RateLimiter {
  #t1: number;
  #delay: number;
  #cooldown = true;

  constructor(minInterval: number = 1000) {
    this.#delay = minInterval;
    this.#t1 = performance.now();
  }

  #setCooldown(): void {
    setTimeout(() => { this.#cooldown = true }, this.#delay);
  }

  public check(): void | never {
    const t2 = performance.now();
    const deltaT = t2 - this.#t1;
    this.#t1 = performance.now();
    if (deltaT > this.#delay) {
      this.#setCooldown();
      return;
    } else if (this.#cooldown) {
      this.#cooldown = false;
      return;
    } else {
      this.#cooldown = false;
      throw new Error("Rate limiter: You are doing this too often. "
        + `Try again in ${this.#delay - deltaT}ms`);
    }
  }
}


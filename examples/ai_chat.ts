import { Zephyr, Hermes } from "../src/chatBots.ts"

async function main(): Promise<void> {
  console.clear();
  const bot = new Hermes("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");
  while (Infinity) {
    const input = prompt(">");
    if (!input) continue;
    const response = await bot.respondTo(input);
    console.clear();
    console.log(response, "\n");
  }
}

main();

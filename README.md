# HugBot 🤖

Chatbot maker for HuggingFace 🤗 Inference API and other AI API providers and backends.

## Features

- ✨ Free and Open Sauce.
- 💬 Conversation memory buffer with token counting and truncation to fit the chatbot context window.
- 🛠️ Fully customizable including system prompt, LLM hyperparameters, prompt tags etc.
- 🧩 Proper LLM prompt templating using tags and examples provided in model docs and tokenizer configs.
- 🤖 Preconfigured chatbot models.
- ⭐️ Works in browsers, Node and Bun.
- ⚡️ Event driven API with message queue for non-blocking interactions with your bots.
- 🔥 Modular and extensibe architecture.
- 📘 All the Typescript typings.
- 🔮 Integration with different AI api providers other than HuggingFace free API coming soon, maybe.

## Preconfigured chatbot models

- Zephyr: huggingface.co/models/HuggingFaceH4/zephyr-7b-beta
- Hermes: huggingface.co/models/NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO
- Mixtral: huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1
- Mistral: huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2
- StarChat: huggingface.co/models/HuggingFaceH4/starchat2-15b-v0.1

## Install

```sh
npm i hugbot
```

## Usage

```typescript
// Import botStorage container:
import { botStorage } from "hugbot"

// Get your bot from bot storage by name:
const zephyr = botStorage.get("Zephyr");

// Use respondTo method to interact with the bot.
// respondTo returns a Promise with generated AI response string:
const response = await zephyr.respondTo("Hi!");
console.log(response);

// Optionally use api token:
// You can get HuggingFace Inference API token here for free: https://huggingface.co/settings/tokens
const response = await zephyr.respondTo("Hi!", apiToken);

// Or use event driven API:
// Add your api token to the bot instance, it will be encrypted and 
// obfuscated in memory during runtime:
await zephyr.apiToken(apiToken);

// Add event listeners for chatbot responses:
zephyr.onResponse((res) => console.log(res));

// Push messages to the queue.
// Messages will be processed one after onother by the bot as 
// they are added to the queue, provided callbacks will be called as the bot responds:
zephyr.pushMessage("hi");
zephyr.pushMessage("?");

// Use setParams method to adjust bot params during runtime:
zephyr.setParams({
  contextWindow: 2000,
  temperature: 0.7,
  systemPrompt: "You are a helpful AI assistant."
});
```

## Use HugBot in Node.js

```typescript
const hugbot = require('hugbot');

const botStorage = hugbot.botStorage;

const zephyr = botStorage.get("Zephy");

async function chat() {
  const query = prompt(">");
  const res = await zephyr.respondTo(query, "your api token here");
  console.log("\n", res, "\n");
  chat();
}

chat();
```

## Params

Params available for setParams method:
```typescript
type HugBotParams = {
  systemPrompt: string; // An instruction to AI added to the beginig of the prompt string 
  // example: "You are a helpful AI assistant."
  responseAffirmation: string // Prepended to bot replies, can be used to coerce the bot into following 
  // any instructions, example: "Sure!", "Here you go:". Default is empty string.
  userInstruction: string // Added after user query, can be used for RAG and additional instructions. 
  // Default is empty string.
  // These are only added to last conversation entries.
  contextWindow: number // Chatbot conversation memory size in tokens (around 1.5 tokens per word). 
  // Used to manage limited LLM context window. When memory buffer overflows it's truncated 
  // by removing oldest conversation entries.
  topK: number | undefined;  // Top-K sampling. The range of candidate tokens to select from for the next prediction.
  topP: number | undefined;  // Sampling based on probability threshold.
  temperature: number;  // Parameter impacting the randomness of predictions by scaling the probabilities of alternatives.
  repetitionPenalty: number | undefined;  // Penalizing repeated phrases or sentences by lowering their likelihood.
  maxNewTokens: number | undefined;  // limits the amount of newly generated text per response.
  maxTime: number | undefined;  // Maximum time allowed for generation.
  doSample: boolean;  // Choosing between deterministic greedy decoding (false) and stochastic sampling (true).
}
```

Example, basic default settings:
```typescript
bot.setParams({
  systemPrompt: "You are a helpful AI assistant.",
  userInstruction: "",
  responseAffirmation: "",
  contextWindow: 2048,
  maxNewTokens: 500,
  repetitionPenalty: 1.1,
  doSample: true,
  temperature: 0.7,
  topK: 50,
  topP: 0.95,
  maxTime: 30
});
```

# Build your own HugBot

```typescript
// Import required components and the builder function:
import {  
  BuildHugBot, generateTextResponse, HuggingFaceTextGenClient,
  ShortTermMemory, PromptConstructor, IObuffer, SecretsHider,
  RateLimiter
} from "hugbot"

// Use the builder function to construct and configure the bot.
// All components are optional.
const zephyr = BuildHugBot("Zephyr").fromComponents({
  AIClient: new HuggingFaceTextGenClient({
    languageModel: "HuggingFaceH4/zephyr-7b-beta", // link to the language model from HF
    // part of the full api link
    // full api link looks like this: "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"
    maxNewTokens: 256,
    doSample: true,
    temperature: 0.7,
    topK: 50,
    topP: 0.95,
  }),
  shortTermMemory: new ShortTermMemory({
    contextWindow: 2048,
  }),
  promptConstructor: new PromptConstructor({
    bos: "",
    system: "<|system|>\n",
    user: "<|user|>\n",
    bot: "<|assistant|>\n",
    closing: "</s>\n",
  }),
  respondTo: generateTextResponse,
  IObuffer: new IObuffer(),
  secretsHider: SecretsHider(),
  rateLimiter: new RateLimiter(1000)
}).build();

zephyr.respondTo("Hi!").then((response) => console.log(response));
```

# Components

All available HugBot components so far:
```typescript
 type HugBotEntity = {
  id: string;
  AIClient?: AIClient;
  shortTermMemory?: ShortTermMemory;
  promptConstructor?: PromptConstructor;
  respondTo?: GenerateResponse;
  IObuffer?: IObuffer;
  secretsHider?: SecretsHider;
  rateLimiter?: RateLimiter;
}

export {
  generateTextResponse, BuildHugBot, HugBotProxy,  BotStorage, mistralTokenizer,
  SecretsHider, HuggingFaceTextGenClient, AIClientMock, ShortTermMemory,
  PromptConstructor, MistralPromptConstructor, IObuffer, FCFSqueue, RateLimiter,
}
```

## BuildHugBot

Chatbot builder function for constructing and configuring bots, 
takes component instances and returns proxied HugBot entity.

```typescript
const BuildHugBot: (id: string) => {
    fromComponents: (components: Partial<HugBotComponents>) => {
        build: () => HugBot;
    };
}
```
===>
```typescript
interface HugBot {
  id: string;
  apiToken: (key: string | null) => Promise<Res>;
  respondTo: (userInput: string, apiToken?: string) => Promise<string>;
  onResponse: (...cb: Array<(res: string) => void>) => void;
  pushMessage: (msg: string) => void;
  setParams: (params: Partial<HugBotParams>) => void;
}
```


## generateTextResponse

Main method for interacting with HugBot. Runs all bot components to produce
ai response. Takes HugBot instance, user prompt and optional api token and returns string promise.

```typescript
type GenerateResponse = (HugBot: HugBotEntity, userInput: string, apiToken?: string) => Promise<string>;
```

## ShortTermMemory

Conversation memory buffer with tokenizer to count prompt tokens and truncate
memory entries to fit the prompt inside limited LLM token window.

Uses push() method to add memory entries:
```typescript
type MemoryEntry = {
  role: "user" | "ai";
  input: string;
}
```

Dumps current memory state with dump() method to be passed onto prompt constructor:
```typescript
type MemoryDump = {
  conversation: MemoryEntry[];
  systemPrompt: string;
  responseAffirmation: string;
  userInstruction: string;
}
```

You can set the following memory state properties:
- tokenizer - Tokenzer function used for token counting, can be set in constructor,
  takes string returns num, Mistral tokenizer is used by default;
- contextWindow - Memory buffer length in tokens;
- systemPrompt - "You are a helpful AI assistant.";
- responseAffirmation - Prepended to bot replies, can be used to coerce the bot into
  following any instructions, example: "Sure!", "Here you go:"
- userInstruction - added after user query, can be used for RAG and additional instructions.

Short term memory interface: 
```typescript
interface ShortTermMemory {
  push: (entry: MemoryEntry) => void;
  get dump(): MemoryDump;
}
```

## PromptConstructor

Used for prompt templating, takes an object describing 
ai prompt tags and current short term memory state dump:

```typescript
tags: {
  bos: "",
  system: "<|im_start|>system\n",
  user: "<|im_start|>user\n",
  bot: "<|im_start|>assistant\n",
  closing: "<|im_end|>\n",
}
```

Returns prompt template string =>

```typescript
 "<|im_start|>system
 You are a helpful AI assistant.<|im_end|>
 <|im_start|>user
 hi<|im_end|>
 <|im_start|>assistant
 Hello, how can I help you?<|im_end>
 <|im_start|>user
 Tell me something interesting<|im_end|>
 <|im_start>assistant"
```

Interface:
```typescript
interface PromptConstructor {
  getPromptTemplate: (memoryDump: MemoryDump) => string;
}
```

## MistralPromptConstructor

Dedicated Mistral prompt formatter because Mistrals have weird prompt format.

Returns prompt string that looks like this:
```typescript
"<s>[INST] {system_prompt}\n Hello, how are you? [/INST] I'm doing great. How can I help you today?</s> [INST] I'd like to show off how chat templating works! [/INST]"
```

## HuggingFaceTextGenClient

http client for HuggingFace Inference api.
You can find detailed description for all HuggingFace API params here:
https://huggingface.co/docs/api-inference/detailed_parameters

Available props:
```typescript
type HuggingFaceTextGenParams = {
  endPoint: string; // link to HuggingFace api end point: "https://api-inference.huggingface.co/models/"
  languageModel: string; // link to the language model, assigned in constructor.
  // example: "HuggingFaceH4/zephyr-7b-beta"
  // full api link example used to fetch ai responses: 
  // "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"
  // LLM hyperparameters:
  topK: number | undefined;
  topP: number | undefined;
  temperature: number;
  repetitionPenalty: number | undefined;
  maxNewTokens: number | undefined;
  maxTime: number | undefined;
  returnFullText: boolean;
  numReturnSequences: number;
  doSample: boolean;
  truncate: number | undefined;
  // Server options:
  waitForModel: boolean;
  useCache: boolean;
}
```

HuggingFace client exposes this interface to integrate with HugBot:
```typescript
interface AIClient {
  sendRequest: (prompt: string, apiToken?: string) => Promise<string>;
}
```
 
## AIClientMock

Fake AI client for testing purposes, returns random responses with random delays.

## IObuffer

This is used to implement event driven API with message queue.
The message queue is processed asynchronously by the bot. You can assign
multiple event listeners to handle bot responses using onResponse method.
Use pushMessage to add messages to the queue. IObuffer uses rate limiter,
you can set minimum delay between respondTo calls with rateLimit property
in constructor.

```typescript
interface IObuffer {
  pushMessage: (msg: string) => void;
  onResponse: (...cb: Array<(res: string) => void>) => void;
  removeEventListener: (name: string | "all") => void;
  set setBot(bot: HugBotEntity);
}
```

## HugBotProxy

Proxy layer for input validation, handling access and setters. Wraps HugBot entity instance before
returning it from the builder function with .build() method.

```typescript
const HugBotProxy: (bot: HugBotEntity) => HugBotEntity
```

## SecretsHider

Used to encrypt and obfuscate provided api key in memory during runtime.

```typescript
interface SecretsHider {
  set: (secret: string) => Promise<Res>;
  get: () => Promise<string | null | Res>;
  destroy: () => void;
}
```

## RateLimiter

Built in rate limiter module to prevent API abuse. Throws if spam is detected.
Constructor takes minimum delay betwen requests in milliseconds.

```typescript
interface RateLimiter {
  check: () => void | never;
}
```

## BotStorage

Bot storage container. Bot names mapped to their corresponding builder functions.
The bot builder function is called and the bot is instantiated when it's retrieved from
storage using the get method.

```typescript
type BotsInStorage = "StarChat" | "Zephyr" | "Hermes" | "Mixtral" | "Mistral";

const BotStorage: () => {
    put: (id: string, fn: () => HugBot) => {
        put: ...;
        get: (id: BotsInStorage) => HugBot;
    };
    get: (id: BotsInStorage) => HugBot;
}
```

# License

This project is licensed under the MIT License.


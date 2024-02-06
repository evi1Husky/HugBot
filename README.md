# HugBot 🤖

Chatbot agent for HuggingFace 🤗 Inference API text generation models.

## Features

- ✨ Free, no API key required.
- 💬 Chat bot conversation memory.
- 🛠️ Fully customizeble including system prompt, LLM hyperparameters, prompt tags etc.
- 🤖 Preconfigured chatbot models.
- 🧩 Proper LLM prompt templating using tags and examples provided in model docs and tokenizer configs.
- ⭐️ Works in browsers, Deno and Bun.

## Preconfigured chatbot models

- Zephyr: HuggingFaceH4 zephyr-7b-beta
- Hermes: NousResearch Nous-Hermes-2-Mixtral-8x7B-DPO
- TinyLlama: TinyLlama-1.1B-Chat-v1.0
- StarCoder: HuggingFaceH4 starchat-beta

## Install

```sh
npm i hugbot
```

## Usage

```typescript
import { botStorage } from "hugbot"

const zephyr = botStorage.get("Zephyr")
const response = await zephyr.respondTo("Hi!")
// respondTo returns a Promise with with generated AI response string.
// Optionally use an api token:
const response = await zephyr.respondTo("Hi!", apiToken)
```

## Build your own HugBot

```typescript
// Import all required components and a builder function
import { hugBot, HuggingFaceTextGenClient, PromptConstructor, 
ShortTermMemory } from "hugbot"

// Use the builder function to construct and configure the bot
const hermes = hugBot("Hermes")
  .withAiClient(new HuggingFaceTextGenClient)
  .withShortTermMemory(new ShortTermMemory)
  .withPromptConstructor(new PromptConstructor)
  .withParams({
    languageModel: "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
    systemPrompt: "You are a helpfull AI assistant.",
    temperature: 0.9,
    tags: {
      system: "<|im_start|>system\n",
      user: "<|im_start|>user\n",
      bot: "<|im_start|>assistant\n",
      closing: "<|im_end|>\n",
    }}).build()

hermes.respondTo("Hi!").then((response) => console.log(response))
```

## params

Use .withParams() function and .setParams() hugbot method for config.

All available params:

```typescript
type HugBotParams = {
  AIClient: IAIClient
  shortTermMemory: IShortTermMemory
  promptConstructor: IPromptConstructor
  languageModel: string // link to language model for ai client
  systemPrompt: string
  responseAffirmation: string // prepended befor every bot reply
  userInstruction: string // automatically add user instruction to every prompt
  endPoint: string
  contextWindow: number // chatbot conversation memory buffer size
  tokenizer: (text: string) => number // tokenizer function used to calculate 
  // ammount of tokens in conversation buffer to prevent overflow
  tags: PromptTags // prompt tags for prompt formatting
  // model hyperparams:
  topK: number | undefined
  topP: number | undefined
  temperature: number
  repetitionPenalty: number | undefined
  maxNewTokens: number | undefined
  maxTime: number | undefined
  returnFullText: boolean
  numReturnSequences: number
  doSample: boolean
  truncate: number | undefined
  //server options:
  waitForModel: boolean
  useCache: boolean
}

// Prompt tags example:
tags: {
  system: "<|system|>\n",
  user: "<|user|>\n",
  bot: "<|assistant|>\n",
  closing: "</s>\n",
}
```

## components

- hugBot - builder function for constructing and configuring chatbots
- HugBot - base hugbot class
- PromptConstructor - used for prompt templating
- ShortTermMemory - conversation memory buffer
- HuggingFaceTextGenClient - http client for Hugging Face free inference api
- AIClientMock - ai client stub for testing
- botStorage - custom map container storing preconfigured chatbot builder functions

## License

This project is licensed under the MIT License.


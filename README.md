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
import { Zephyr } from "hugbot"

const zephyr = Zephyr()
const response = await zephyr.respondTo("Hi!")
// respondTo returns a Promise with with generated AI response string.
// Optionally use an api token:
const response = await zephyr.respondTo("Hi!", apiToken)
// The chatbot doesn't handle storing and securing api tokens, 
// so you'll need to input it every time you call respondTo()
```

## Build your own HugBot

## License

This project is licensed under the MIT License.

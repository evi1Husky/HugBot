# HugBot 🤖

Chatbot agent for HuggingFace 🤗 Inference API text generation models.

## Features

- ✨ Free, no API key required.
- 💬 Chat bot conversation memory.
- 🛠️ Fully customizeble including system prompt, LLM hyperparameters, prompt tags etc.
- 🤖 Preconfigured model subclasses.
- 🧩 Proper LLM prompt templating using tags and examples provided in model docs and tokenizer configs.
- ⭐️ Works in browsers, Deno and Bun.

## Preconfigured Model Subclasses

- Zephyr: HuggingFaceH4 zephyr-7b-beta
- Hermes: NousResearch Nous-Hermes-2-Mixtral-8x7B-DPO
- TinyLlama: TinyLlama-1.1B-Chat-v1.0

## Install

```sh
npm i hugbot
```

## Usage

```typescript
import { Zephyr } from "hugbot";

const zephyr = new Zephyr();
const response = await zephyr.respondTo("Hi!");
```

## License

This project is licensed under the MIT License.

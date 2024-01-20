# HugBot

Chatbot agent for HuggingFace Inference API text generation models.

## features

- Free, works without api key.
- Adjustable chat bot conversation memory.
- Fully customizeble including system prompt, LLM hyperparameters, prompt tags etc.
- Preconfigured model subclasses.
- Proper LLM prompt templating using tags and examples provided in model docs.

## Preconfigured Model Subclasses 

- Zephyr: HuggingFaceH4 zephyr-7b-beta
- Hermes: NousResearch Nous-Hermes-2-Mixtral-8x7B-DPO

## Usage

```typescript
import { Zephyr } from "chatBots";

const zephyr = new Zephyr();
const response = await zephyr.respondTo("Hi!");
```

## License

This project is licensed under the MIT License.

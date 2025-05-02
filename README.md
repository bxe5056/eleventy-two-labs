### eleventy-two-labs

## ElevenLabs - Coding Assignment

## Conversational AI Demo: A Voice-Centric Learning Assistant

### Objective:

Build a demo application for a hypothetical education company using the ElevenLabs Conversational API. This project should showcase a creative use of voice AI to create an immersive, voice-first learning experience without traditional interfaces.

### Requirements:

Voice-First Interface: Design a single-page application with a voice-centric experience, eliminating traditional text chat interfaces in favor of natural conversation.

#### Technical Requirements:

- Integration of the ElevenLabs Conversational AI API. You can use our Conversational AI Starter on v0 as a starting point if you like.
- A clean, visually appealing interface with light branding of your choice.
- Technology: You can use any modern web framework. We recommend Next.js / React, but you're welcome to use what you're most comfortable with.

### Guidelines:

- **Focus**: Concentrate on creating an intuitive voice interaction flow for educational content delivery, with minor visual elements that complement the voice experience. Feel free to take shortcuts or mock functionality for any third-party integrations.
- **Time Commitment**: Try to limit yourself to no more than 4 hours. Focus on key features that demonstrate how voice AI can enhance learning experiences, but feel free to share what additional enhancements you would implement with more time.
- **Submission**: Package your project as a .zip file containing all source code. Provide a README with detailed instructions on setting up and running the project, including how to obtain and configure any necessary ElevenLabs API keys.
- **Demo**: Record a 2-3 minute demo of your project, showcasing the functionality.

### Evaluation:

Your submission will be evaluated on code quality, presentation, and functionality. We're particularly interested in how you reimagine educational interactions through voice. This project is intentionally open-ended to allow for creativity, but if you have any questions or need further clarification, please don't hesitate to reach out.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

# SpanishLearningAppWithElevenLabsVoiceAI

This application helps users practice Spanish conversation skills through an interactive voice interface powered by ElevenLabs Voice AI and Amazon Translate.

## Features

- Voice-based conversation with a Spanish tutor AI
- Real-time transcription of speech
- Automatic translation of Spanish to English (with delay to encourage learning)
- Color-coded conversation bubbles based on language detection
- Session tracking for practice history

## Setup

### ElevenLabs Configuration

This application requires an ElevenLabs Conversational AI agent. You'll need to:

1. Create an account at [elevenlabs.io](https://elevenlabs.io)
2. Create a conversational agent for Spanish tutoring

   1. Set the Agent Language to English
   1. Add Spanish as an Additional Language
   1. Leave first message blank
   1. Use this prompt for the System Prompt

      1. You are a Spanish language tutor engaged in a verbal conversation with the user. Your goal is to help the user practice and improve their spoken Spanish through natural, supportive conversation.

      Speak entirely in Spanish, unless the user directly asks for clarification or an explanation about a word, phrase, grammar rule, or instruction or you need to correct the user's Spanish grammar—in which case, you may respond in English briefly, then return to Spanish.

      Adjust your language level to the user’s responses: use simpler vocabulary and grammar if the user struggles, and increase complexity and overall message length as they improve.

      Encourage the user to repeat and practice key vocabulary and phrases relevant to the current topic.

      Gently correct any Spanish mistakes the user makes. Briefly explain the correction in English, and then ask the user to try again or repeat it. Then return to Spanish.

      Occasionally suggest short, practical roleplays (e.g., ordering at a restaurant, asking for directions) to give context to new vocabulary.

      Incorporate past vocabulary periodically to reinforce learning.

      Keep the tone warm, encouraging, and focused on helping the user gain confidence speaking Spanish.

   1. To potentially save on resource costs, set the LLM to GPT-4.1 Nano
   1. Set Temperature to 0.65
   1. NOTE: For testing purposes, I have limit token usage set to 20 tokens.
   1. Set Voice to Jamahal (or a different one if you prefer)
   1. Set Speed to 0.9 (or 0.8)
   1. Set Similarity to 0.8
   1. Set Silence end call timeout to 20 (or 30)
   1. Set max conversation duration to 300
   1. Add the following events to the Client Events list
      1. audio, interruption, user_transcript, agent_response, agent_response_correction

3. Copy the agent ID
4. Add the agent ID to your environment variables as listed below

### Amazon Translate Setup

For translation capabilities, the app uses Amazon Translate:

1. Create an AWS account if you don't have one
2. Create an IAM user with permissions for Amazon Translate
3. Generate access key and secret key for the IAM user
4. Add the following to your environment variables:
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - AWS_REGION (defaults to us-east-1)

## Environment Variables

Create a `.env.local` file in the root directory with:

```
NEXT_PUBLIC_AGENT_ID=your_elevenlabs_agent_id
NEXT_PUBLIC_VOICE_ID=your_public_voice_id
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_preferred_region
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

1. Click the microphone button to start a conversation
2. Speak in English or Spanish to the AI tutor
3. Listen to the AI's responses and practice your Spanish
4. Click the button again to end the session

The application will automatically show translations for Spanish text after a 15-second delay to encourage you to try understanding the content first.

---

TODO: Clear out console.logs()
TODO: Implement Lessons
TODO: Use less ElevenLabs Credits
TODO: Determine auto-user drop off bug in demo-mode
TODO: Add feature to input your own ElevenLabs Agent ID


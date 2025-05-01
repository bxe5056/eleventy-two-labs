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

# SpanishVoice - Voice-First Spanish Learning App

SpanishVoice is a voice-centric educational application designed to help users learn Spanish through natural conversation, leveraging the power of ElevenLabs Conversational AI.

## Features

- **Voice-First Learning:** Practice Spanish pronunciation and conversation skills through a natural voice interface
- **Structured Lessons:** Progress through organized content from beginner to advanced levels
- **Instant Feedback:** Get real-time pronunciation guidance and corrections
- **Adaptive Learning:** Content that adjusts to your skill level as you improve
- **Visual Reinforcement:** Minimal visual aids that complement the voice experience without distracting from it

## Technical Implementation

- Next.js 15 with React 19
- Tailwind CSS for styling
- Integration with ElevenLabs Conversational AI API via the official @11labs/react package
- Web Speech API for backup voice recognition

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An ElevenLabs API key (obtain from [ElevenLabs](https://elevenlabs.io/))
- An ElevenLabs Agent ID (create an agent through the ElevenLabs dashboard)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file in the root directory with your ElevenLabs API key:
   ```
   NEXT_PUBLIC_AGENT_ID=your_public_agent_id_here
   ```

### Development

Run the development server:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Setting Up ElevenLabs Conversational AI

### Creating an Agent

1. Create an account at [ElevenLabs](https://elevenlabs.io/)
2. Navigate to the "Conversational AI" section in your dashboard
3. Create a new agent:
   - Give it a name (e.g., "Spanish Tutor")
   - Select a voice (ideally with Spanish capabilities)
   - Configure the agent's personality and domain knowledge
   - Set the language to Spanish or Spanish/English bilingual

### Agent Configuration

1. Configure your agent's knowledge:

   - Add key phrases and vocabulary for Spanish learning
   - Set up example conversations to establish teaching patterns
   - Add pronunciation guides and language learning resources

2. Add a system prompt that defines your agent's behavior, for example:
   ```
   You are a Spanish language tutor. Your goal is to help the user learn Spanish through natural conversation.
   Speak primarily in Spanish but add English translations in parentheses when introducing new words or phrases.
   Correct the user's pronunciation or grammar mistakes gently, and encourage them to speak as much as possible.
   ```

### Integration

The app uses the official `@11labs/react` package for integration with ElevenLabs' Conversational AI:

1. You can enter your API key and Agent ID directly in the application
2. The application handles the WebSocket connection to the ElevenLabs API
3. Real-time transcription and speech synthesis are managed through the ElevenLabs services

## Usage

1. Start on the home page and click the microphone button to begin speaking
2. If no API key is configured, you'll be prompted to enter it along with your Agent ID
3. Speak in Spanish or English to interact with the AI tutor
4. The app will process your speech and respond with Spanish voice output through the ElevenLabs agent
5. Browse available lessons by clicking "Browse All Lessons"
6. Select a lesson to view vocabulary, phrases, and start practicing

## About This Demo

This application was created as a demonstration for ElevenLabs Conversational AI capabilities in an educational context. It showcases how voice AI can create an immersive, voice-first learning experience without traditional interfaces.

## Next Steps

With additional development time, the application could be enhanced with:

- More sophisticated language processing capabilities
- Progress tracking and personalized learning paths
- More extensive lesson content and difficulty levels
- Gamification elements to increase engagement
- Offline capabilities for learning on-the-go

## Environment Setup

This application uses ElevenLabs Conversational AI API. To set up your environment:

1. Create a `.env.local` file in the root directory with the following content:

```
# ElevenLabs API Key/Agent ID
NEXT_PUBLIC_AGENT_ID=your_elevenlabs_agent_id_here
```

2. Replace `your_elevenlabs_agent_id_here` with your actual ElevenLabs agent ID.

3. If you don't have an agent ID in the environment variables, the application will prompt you to enter your API key manually.

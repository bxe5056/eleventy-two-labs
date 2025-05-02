/**
 * ElevenLabs API Utils
 *
 * This file contains utility functions for interacting with the ElevenLabs API
 */

// API endpoints
const API_BASE_URL = "https://api.elevenlabs.io/v1";
const TEXT_TO_SPEECH_ENDPOINT = "/text-to-speech";

// Default voice ID for Spanish instructor
const DEFAULT_VOICE_ID = "pNInz6obpgDQGcFmaJgB"; // Example voice ID - replace with actual voice ID

/**
 * Get API key from environment variable
 */
export const getApiKey = (): string => {
  // Try to get from environment variable
  const envApiKey = process.env.NEXT_PUBLIC_AGENT_ID;

  // If environment variable exists, use it
  if (envApiKey) return envApiKey;

  return "";
};

/**
 * Check if API key is set
 */
export const hasApiKey = (): boolean => {
  return !!getApiKey();
};

/**
 * Convert text to speech using ElevenLabs API
 */
export const textToSpeech = async (
  text: string,
  voiceId: string = DEFAULT_VOICE_ID,
  modelId: string = "eleven_multilingual_v2",
  explicitAgentId?: string
): Promise<ArrayBuffer> => {
  // Use explicitly provided agent ID if available, otherwise use the default getter
  const apiKey = explicitAgentId || getApiKey();

  if (!apiKey) {
    throw new Error(
      "ElevenLabs API key is not set. Please check your NEXT_PUBLIC_AGENT_ID environment variable."
    );
  }

  const url = `${API_BASE_URL}${TEXT_TO_SPEECH_ENDPOINT}/${voiceId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
  }

  return await response.arrayBuffer();
};

/**
 * Play audio from ArrayBuffer
 */
export const playAudio = (audioData: ArrayBuffer): HTMLAudioElement => {
  const blob = new Blob([audioData], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);

  audio.onended = () => {
    URL.revokeObjectURL(url);
  };

  audio.play();
  return audio;
};

/**
 * Generate Spanish tutor response
 */
export const generateTutorResponse = async (
  userInput: string
): Promise<string> => {
  // This is a simple mock implementation
  // In a real app, you would call your LLM API here (OpenAI, ElevenLabs, etc.)

  if (
    userInput.toLowerCase().includes("hola") ||
    userInput.toLowerCase().includes("hello") ||
    userInput.toLowerCase().includes("hi")
  ) {
    return "¡Hola! ¿Cómo estás? (Hello! How are you?)";
  } else if (
    userInput.toLowerCase().includes("goodbye") ||
    userInput.toLowerCase().includes("adios")
  ) {
    return "¡Adiós! Hasta luego. (Goodbye! See you later.)";
  } else if (
    userInput.toLowerCase().includes("help") ||
    userInput.toLowerCase().includes("ayuda")
  ) {
    return "¿En qué puedo ayudarte? (How can I help you?)";
  } else if (
    userInput.toLowerCase().includes("learn") ||
    userInput.toLowerCase().includes("practice")
  ) {
    return "Vamos a practicar español. Repite después de mí: Buenos días. (Let's practice Spanish. Repeat after me: Good morning.)";
  } else {
    return "Lo siento, no entendí. ¿Puedes repetir eso? (I'm sorry, I didn't understand. Can you repeat that?)";
  }
};

/**
 * Set up the ElevenLabs speech recognition
 */
export const setupSpeechRecognition = () => {
  if (typeof window === "undefined") return null;

  // Browser compatibility check
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error("Speech recognition not supported in this browser");
    return null;
  }

  try {
    const recognition = new SpeechRecognition();

    // Configure speech recognition
    recognition.lang = "es-ES"; // Set language to Spanish
    recognition.continuous = false;
    recognition.interimResults = false;

    // Set a timeout to avoid hanging indefinitely on network issues
    recognition.maxAlternatives = 1;

    return recognition as unknown as typeof SpeechRecognition;
  } catch (error) {
    console.error("Failed to create speech recognition instance:", error);
    return null;
  }
};

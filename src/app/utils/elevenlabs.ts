// noinspection GrazieInspection

/**
 * ElevenLabs API Utils
 *
 * This file contains utility functions for interacting with the ElevenLabs API
 */

// API endpoints
const API_BASE_URL = "https://api.elevenlabs.io/v1";
const TEXT_TO_SPEECH_ENDPOINT = "/text-to-speech";

// Default voice ID for Spanish instructor
const DEFAULT_VOICE_ID = process.env.NEXT_PUBLIC_DEFAULT_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Default is Rachel

// For mock mode
let isMockMode = false;

// Sample Spanish responses for mock mode
const sampleResponses = [
  {
    triggers: ["hello", "hi", "hola", "hey"],
    responses: [
      "¡Hola! ¿Cómo estás hoy?",
      "¡Bienvenido! ¿En qué puedo ayudarte?",
      "¡Hola! Me alegro de verte.",
    ],
  },
  {
    triggers: ["how are you", "como estas", "what's up", "que tal"],
    responses: [
      "Estoy muy bien, gracias por preguntar. ¿Y tú?",
      "Todo bien. ¿Cómo va tu día?",
      "Estoy genial. ¿Y tú cómo estás?",
    ],
  },
  {
    triggers: ["help", "ayuda", "ayudame"],
    responses: [
      "Estoy aquí para ayudarte a practicar español. ¿Qué te gustaría aprender?",
      "Puedo ayudarte con vocabulario, gramática o conversación. ¿Qué prefieres?",
      "Dime en qué puedo ayudarte con tu español.",
    ],
  },
  {
    triggers: [
      "learn",
      "study",
      "practice",
      "aprender",
      "estudiar",
      "practicar",
    ],
    responses: [
      "¡Excelente! ¿Qué tema te gustaría practicar hoy?",
      "Hay muchos temas que podemos explorar. ¿Quieres practicar vocabulario, gramática o conversación?",
      "Podemos practicar con situaciones cotidianas. ¿Te gustaría hablar sobre comida, viajes o familia?",
    ],
  },
  {
    triggers: ["food", "comida", "eat", "restaurant", "comer"],
    responses: [
      "La comida española es deliciosa. Algunos platos populares son paella, tortilla española y jamón ibérico.",
      "En un restaurante español, puedes pedir platos como gazpacho, patatas bravas o croquetas.",
      "Para pedir comida en español puedes decir: 'Me gustaría...' o '¿Me puede traer...?'",
    ],
  },
  {
    triggers: ["travel", "vacation", "viaje", "vacaciones", "viajar"],
    responses: [
      "Viajar por países hispanohablantes es una gran manera de practicar. ¿Has visitado algún país donde se habla español?",
      "Si viajas a España, deberías visitar ciudades como Madrid, Barcelona, Sevilla y Granada.",
      "Para comunicarse mientras viajas, es útil aprender frases como: '¿Dónde está...?' o '¿Cómo llego a...?'",
    ],
  },
  {
    triggers: ["family", "familia", "parents", "children", "padres", "hijos"],
    responses: [
      "En español, los términos familiares incluyen: madre (mother), padre (father), hermano/a (brother/sister).",
      "La familia es muy importante en la cultura hispana. A menudo las familias son muy unidas.",
      "Hablemos de tu familia. ¿Tienes hermanos o hermanas?",
    ],
  },
  {
    triggers: ["weather", "tiempo", "clima", "temperatura"],
    responses: [
      "Para hablar del clima en español puedes decir: 'Hace sol', 'Está lloviendo', o 'Hace frío'.",
      "¿Qué tiempo hace hoy en tu ciudad?",
      "Las estaciones en español son: primavera, verano, otoño e invierno.",
    ],
  },
  {
    triggers: ["work", "job", "office", "trabajo", "oficina", "empleo"],
    responses: [
      "Para hablar de trabajo en español: 'Trabajo como...' o 'Mi profesión es...'",
      "¿A qué te dedicas? (What do you do for a living?)",
      "En una oficina española, saludarías diciendo 'Buenos días' por la mañana o 'Buenas tardes' después del mediodía.",
    ],
  },
  {
    triggers: ["thank", "thanks", "gracias"],
    responses: [
      "De nada. ¡Es un placer ayudarte!",
      "No hay de qué. ¿Hay algo más en lo que pueda ayudarte?",
      "El placer es mío. ¿Quieres continuar practicando?",
    ],
  },
  {
    triggers: ["goodbye", "bye", "adios", "hasta luego", "chao"],
    responses: [
      "¡Hasta luego! Espero verte pronto.",
      "¡Adiós! Que tengas un buen día.",
      "¡Hasta la próxima! Sigue practicando tu español.",
    ],
  },
];

// Default fallback responses when no triggers match
const fallbackResponses = [
  "Interesante. Cuéntame más sobre eso.",
  "No estoy seguro de entender. ¿Puedes explicarlo de otra manera?",
  "Sigamos practicando. ¿De qué te gustaría hablar ahora?",
  "Eso suena bien. ¿Puedes elaborar un poco más?",
  "Entiendo. ¿Y qué piensas sobre esto?",
  "¿Puedes decirme más sobre ese tema?",
  "Es una buena oportunidad para aprender nuevo vocabulario.",
];

/**
 * Generate a mock response for conversation
 */
export const generateMockResponse = (userInput: string): string => {
  if (!userInput) {
    return "¡Hola! Bienvenido a la práctica de español. ¿Cómo estás hoy?";
  }

  const inputLower = userInput.toLowerCase();

  // Try to find a matching response based on triggers
  for (const group of sampleResponses) {
    for (const trigger of group.triggers) {
      if (inputLower.includes(trigger)) {
        // Return a random response from the matching group
        const randomIndex = Math.floor(Math.random() * group.responses.length);
        return group.responses[randomIndex];
      }
    }
  }

  // If no triggers match, return a random fallback response
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
};

/**
 * Set mock mode
 */
export const setMockMode = (useMock: boolean): void => {
  isMockMode = useMock;
  console.log(`ElevenLabs API Mock Mode: ${useMock ? "Enabled" : "Disabled"}`);
};

/**
 * Get API key from environment variable
 */
export const getApiKey = (): string => {
  // If in mock mode, return a fake API key
  if (isMockMode) {
    return "mock-api-key";
  }

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
  // If in mock mode, always return true
  if (isMockMode) return true;

  return !!getApiKey();
};

/**
 * Generate a mock audio buffer (sine wave tone with patterns based on text)
 */
const generateMockAudioBuffer = (
  text: string,
  baseFrequency: number = 440
): ArrayBuffer => {
  if (typeof window === "undefined") {
    // Return an empty buffer if not in browser
    return new ArrayBuffer(0);
  }

  // Adjust duration based on text length (longer text = longer audio)
  const adjustedDuration = Math.max(1.5, Math.min(8, text.length / 15));

  const sampleRate = 44100;
  const numSamples = Math.floor(adjustedDuration * sampleRate);
  const buffer = new ArrayBuffer(numSamples * 2); // 16-bit samples
  const view = new DataView(buffer);

  // Create a more speech-like pattern based on text characteristics
  const wordCount = text.split(" ").length;
  const hasQuestion = text.includes("?");
  const isExclamation = text.includes("!");

  // Calculate frequency modulation parameters
  const frequencyRange = hasQuestion ? 120 : isExclamation ? 100 : 60;
  const modulationSpeed = wordCount / adjustedDuration;

  // Generate audio samples
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // Create a modulated frequency to sound more like speech rhythm
    let modulatedFreq = baseFrequency;

    // Add frequency variations based on the position in the sample
    // Creates a more speech-like pattern with pauses between "words"
    const position = t / adjustedDuration; // normalized position (0-1)

    // Word rhythm modulation (faster for exclamations, slower for questions)
    const wordModulation = Math.sin(2 * Math.PI * modulationSpeed * t) * 0.3;

    // Sentence modulation (questions rise at the end, statements fall)
    let sentenceModulation = 0;
    if (hasQuestion) {
      // Rise at the end for questions
      sentenceModulation = position > 0.7 ? (position - 0.7) * 1.5 : 0;
    } else {
      // Fall at the end for statements
      sentenceModulation = position > 0.8 ? (1 - position) * 0.5 - 0.1 : 0;
    }

    // Combine modulations
    modulatedFreq += wordModulation * frequencyRange;
    modulatedFreq += sentenceModulation * frequencyRange;

    // Add slight vibrato
    modulatedFreq += Math.sin(2 * Math.PI * 5 * t) * 3;

    // Volume envelope to create a more natural sound
    let amplitude = 0.5;

    // Fade in
    if (t < 0.1) {
      amplitude *= t / 0.1;
    }

    // Fade out
    if (t > adjustedDuration - 0.2) {
      amplitude *= (adjustedDuration - t) / 0.2;
    }

    // Pauses between "words" - creates rhythm
    const wordPause = 0.7 + 0.3 * Math.sin(2 * Math.PI * (wordCount / 2) * t);
    amplitude *= wordPause;

    // Apply amplitude to create the sample
    const sample =
      32767 * amplitude * Math.sin(2 * Math.PI * modulatedFreq * t);

    // Write 16-bit sample
    view.setInt16(i * 2, sample, true);
  }

  return buffer;
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
  // If in mock mode, return a mock audio buffer
  if (isMockMode) {
    console.log("Mock TTS:", text);

    // Base frequency changes based on whether it's a question, exclamation, or statement
    let baseFrequency = 385; // Default base frequency

    if (text.includes("?")) {
      baseFrequency = 415; // Slightly higher pitch for questions
    } else if (text.includes("!")) {
      baseFrequency = 405; // Medium pitch for exclamations
    }

    // Simulate a processing delay proportional to text length
    const delay = Math.min(300 + text.length * 10, 1500);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return generateMockAudioBuffer(text, baseFrequency);
  }

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

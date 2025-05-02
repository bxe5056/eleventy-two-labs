"use client";

import { useConversation } from "@11labs/react";
import { useCallback, useState, useEffect, useRef, JSX } from "react";
import { useElevenLabs } from "../context/ElevenLabsContext";
import { generateMockResponse } from "../utils/elevenlabs";

/**
 * Props for ConversationalAgent component
 * @property {function} [onConversationUpdate] - Optional callback for conversation updates
 */
interface ConversationalAgentProps {
  onConversationUpdate?: (message: string, isUser: boolean) => void;
}

/**
 * Interface for messages received from ElevenLabs API
 * @property {string} message - The message content
 * @property {"user" | "ai"} source - Who sent the message
 */
interface ElevenLabsMessage {
  message: string;
  source: "user" | "ai";
}

/**
 * Interface for message entries in conversation history
 * @property {string} text - The message text content
 * @property {boolean} isUser - Whether the message is from user (true) or AI (false)
 * @property {string} [translation] - Optional translation of the message
 * @property {boolean} [isSystemMessage] - Whether it's a system message (not from user or AI)
 * @property {"english" | "spanish" | "mixed"} [language] - Detected language of the message
 * @property {boolean} [showTranslation] - Whether to display translation
 * @property {number} [translationCountdown] - Countdown before showing translation
 * @property {boolean} [translationInProgress] - Whether translation is in progress
 * @property {boolean} [messageComplete] - Whether the message is complete (important for AI responses)
 */
interface MessageEntry {
  text: string;
  isUser: boolean;
  translation?: string;
  isSystemMessage?: boolean;
  language?: "english" | "spanish" | "mixed";
  showTranslation?: boolean;
  translationCountdown?: number;
  translationInProgress?: boolean;
  messageComplete?: boolean;
}

/**
 * Props for TranslationCountdown component
 * @property {number} initialSeconds - Initial countdown time in seconds
 * @property {function} onComplete - Callback when countdown completes
 * @property {function} getText - Function to get display text for current countdown
 */
interface TranslationCountdownProps {
  initialSeconds: number;
  onComplete: () => void;
  getText: (seconds: number) => string;
}

/**
 * Component that displays a countdown timer for translations
 * Shows a visual progress bar and countdown message
 */
function TranslationCountdown({
  initialSeconds,
  onComplete,
  getText,
}: TranslationCountdownProps) {
  // Track remaining seconds in countdown
  const [seconds, setSeconds] = useState(initialSeconds);

  // Calculate progress percentage for visual indicator
  const progressPercent = ((initialSeconds - seconds) / initialSeconds) * 100;

  // Set up the countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(onComplete, 100); // Small delay before completion
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    console.log(
      "Translation countdown started, will complete in",
      initialSeconds,
      "seconds"
    );

    // Clean up timer on unmount
    return () => {
      console.log("Countdown component unmounted, clearing timer");
      clearInterval(timer);
    };
  }, [onComplete, initialSeconds]);

  return (
    <div className="translation-countdown mt-2 border-t border-white/20 pt-2">
      <div className="flex items-center text-xs text-white/70">
        <svg
          className="animate-spin -ml-1 mr-2 h-3 w-3 text-white/60"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>{getText(seconds)}</span>
        <div className="ml-2 flex-1 bg-white/20 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main conversational agent component that provides speech interaction
 * Handles both real API and mock mode for demonstration purposes
 *
 * @param {ConversationalAgentProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export default function ConversationalAgent({
  onConversationUpdate,
}: ConversationalAgentProps): JSX.Element {
  // --- State Management ---
  // Error and connection states
  const [errorMessage, setErrorMessage] = useState("");
  const [agentId, setAgentId] = useState("");
  const [isGettingSignedUrl] = useState(false);

  // Conversation state
  const [, setTranscript] = useState("");
  const [messageHistory, setMessageHistory] = useState<MessageEntry[]>([]);
  const [agentResponse, setAgentResponse] = useState("");

  // Mock mode states
  const [mockConversationStatus, setMockConversationStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >("disconnected");
  const [mockIsSpeaking, setMockIsSpeaking] = useState(false);

  // --- References and Context ---
  const { useMockApi } = useElevenLabs();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Track when we last triggered a simulation
  const lastSimulationTime = useRef<number>(0);

  /**
   * Initialize ElevenLabs conversation with handlers
   * This is always initialized but only used when not in mock mode
   */
  const elevenlabsConversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
    },
    onDisconnect: () => console.log("Disconnected from ElevenLabs"),
    onMessage: (message: ElevenLabsMessage) => {
      if (!useMockApi) {
        // Only process messages when not in mock mode
        console.log("Message received from ElevenLabs:", message);

        if (message.message && message.source) {
          const isUser = message.source === "user";
          const messageText = message.message;

          console.log(`${isUser ? "User" : "AI"} message:`, messageText);

          // Detect language
          const language = detectLanguage(messageText);

          if (isUser) {
            setTranscript(messageText);
          } else {
            setAgentResponse(messageText);
          }

          // Add the message to history
          setMessageHistory((prev) => {
            // Check if this exact message is already the last message from this source
            const lastMessage = prev.length > 0 ? prev[prev.length - 1] : null;
            if (
              lastMessage &&
              lastMessage.isUser === isUser &&
              lastMessage.text === messageText
            ) {
              return prev; // Skip duplicate messages
            }

            // Create new message object with language detection
            const newMessage: MessageEntry = {
              text: messageText,
              isUser,
              language,
              showTranslation: false,
              translationInProgress: false,
              messageComplete: isUser, // User messages are complete immediately
            };

            return [...prev, newMessage];
          });

          if (onConversationUpdate) {
            onConversationUpdate(messageText, isUser);
          }
        }
      }
    },
    onError: (message: string) => {
      if (!useMockApi) {
        // Only process errors when not in mock mode
        console.error("ElevenLabs error:", message);
        setErrorMessage(`Error: ${message || "Connection failed"}`);
      }
    },
  });

  /**
   * Speaks text using browser's built-in speech synthesis for AI responses
   * Used for demo mode when ElevenLabs API is not available
   *
   * @param {string} text - Text to be spoken
   */
  const speakWithSynthesis = useCallback((text: string) => {
    // Check if speech synthesis is available
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis not supported in this browser");
      return;
    }

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Configure voice settings for Spanish
    utterance.lang = "es-ES";
    utterance.rate = 0.9; // Slightly slower than default
    utterance.pitch = 1;

    // Get Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(
      (voice) => voice.lang.includes("es") && !voice.name.includes("Google")
    );
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    // Set event handlers
    utterance.onstart = () => {
      console.log("AI speech synthesis started");
      setMockIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log("AI speech synthesis ended");
      setMockIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setMockIsSpeaking(false);
    };

    // Speak the text
    window.speechSynthesis.speak(utterance);
  }, []);

  /**
   * Speaks text using browser's built-in speech synthesis for user responses
   * Used for demo mode to give a different voice to the user
   *
   * @param {string} text - Text to be spoken
   */
  const speakUserWithSynthesis = useCallback((text: string) => {
    // Check if speech synthesis is available
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis not supported in this browser");
      return;
    }

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Configure voice settings for Spanish - different from AI voice
    utterance.lang = "es-ES";
    utterance.rate = 1.0; // Normal rate
    utterance.pitch = 1.2; // Higher pitch for differentiation

    // Get a different Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    // Try to get a different voice than the AI - prefer a female voice if available
    const userSpanishVoice = voices.find(
      (voice) => voice.lang.includes("es") && voice.name.includes("Google")
    );

    if (userSpanishVoice) {
      utterance.voice = userSpanishVoice;
    } else {
      // If no specific voice is found, adjust parameters more to differentiate
      utterance.pitch = 1.3;
      utterance.rate = 1.1;
    }

    // Set event handlers - we don't change mock speaking state for user voice
    utterance.onstart = () => {
      console.log("User speech synthesis started");
    };

    utterance.onend = () => {
      console.log("User speech synthesis ended");
    };

    utterance.onerror = (event) => {
      console.error("User speech synthesis error:", event);
    };

    // Speak the text
    window.speechSynthesis.speak(utterance);
  }, []);

  // --- API and Utility Functions ---

  /**
   * Simple mock translation function for demo mode
   * Translates Spanish to English using a basic dictionary
   *
   * @param {string} text - Text to translate
   * @returns {string} Translated text
   */
  const mockTranslate = useCallback((text: string): string => {
    // Very basic Spanish to English translations for demo purposes
    const translations: Record<string, string> = {
      hola: "hello",
      "buenos días": "good morning",
      "buenas tardes": "good afternoon",
      "buenas noches": "good night",
      "cómo estás": "how are you",
      "me llamo": "my name is",
      gracias: "thank you",
      "por favor": "please",
      adiós: "goodbye",
      "hasta luego": "see you later",
      sí: "yes",
      no: "no",
      "¿qué?": "what?",
      "¿cómo?": "how?",
      "¿dónde?": "where?",
      "¿cuándo?": "when?",
      "¿por qué?": "why?",
      // Add more common phrases as needed
    };

    // Simple word replacement - just for demonstration
    let translated = text.toLowerCase();
    Object.entries(translations).forEach(([spanish, english]) => {
      translated = translated.replace(new RegExp(spanish, "gi"), english);
    });

    return translated.charAt(0).toUpperCase() + translated.slice(1);
  }, []);

  // Simple mock translation from English to Spanish
  const mockTranslateToEnglish = useCallback((text: string): string => {
    // Basic Spanish to English translations for AI responses
    const translations: Record<string, string> = {
      "¡hola!": "Hello!",
      "buenos días": "Good morning",
      "buenas tardes": "Good afternoon",
      "buenas noches": "Good night",
      "¿cómo estás?": "How are you?",
      "me llamo": "My name is",
      gracias: "Thank you",
      "por favor": "Please",
      adiós: "Goodbye",
      "hasta luego": "See you later",
      "¿qué quieres aprender hoy?": "What do you want to learn today?",
      "¿cómo te puedo ayudar?": "How can I help you?",
      "¿entiendes?": "Do you understand?",
      "repite después de mí": "Repeat after me",
      "muy bien": "Very good",
      excelente: "Excellent",
      "¡Hola! Bienvenido a la práctica de español. ¿Cómo estás hoy?":
        "Hello! Welcome to Spanish practice. How are you today?",
      // Add more common phrases as needed
    };

    // Simple word replacement
    let translated = text;
    Object.entries(translations).forEach(([spanish, english]) => {
      translated = translated.replace(new RegExp(spanish, "gi"), english);
    });

    return translated;
  }, []);

  // Utility functions to handle both mock and real modes
  const getStatus = useCallback(() => {
    return useMockApi
      ? mockConversationStatus
      : elevenlabsConversation?.status || "disconnected";
  }, [useMockApi, mockConversationStatus, elevenlabsConversation?.status]);

  const getIsSpeaking = useCallback(() => {
    return useMockApi
      ? mockIsSpeaking
      : elevenlabsConversation?.isSpeaking || false;
  }, [useMockApi, mockIsSpeaking, elevenlabsConversation?.isSpeaking]);

  const startConversationSession = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (options?: any) => {
      if (useMockApi) {
        setMockConversationStatus("connecting");
        // Simulate connection delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setMockConversationStatus("connected");
        return true;
      } else if (elevenlabsConversation) {
        return await elevenlabsConversation.startSession(options);
      }
      return false;
    },
    [useMockApi, elevenlabsConversation]
  );

  const endConversationSession = useCallback(async () => {
    if (useMockApi) {
      setMockConversationStatus("disconnected");
      return true;
    } else if (elevenlabsConversation) {
      return await elevenlabsConversation.endSession();
    }
    return false;
  }, [useMockApi, elevenlabsConversation]);

  // startConversation handler
  const startConversation = useCallback(async () => {
    setErrorMessage("");
    console.log("Starting conversation with agent ID:", agentId);

    if (useMockApi) {
      console.log("Using mock mode for ElevenLabs conversation");

      // For mock mode, we can simulate starting a conversation instantly
      // Add a session start delimiter if there are previous messages
      if (messageHistory.length > 0) {
        const sessionStartTime = new Date().toLocaleTimeString();
        setMessageHistory((prev) => [
          ...prev,
          {
            text: `New session started at ${sessionStartTime}`,
            isUser: false,
            isSystemMessage: true,
          },
        ]);
      }

      // Start the mock session
      await startConversationSession();

      // Add a welcome message after "connecting"
      const welcomeMessage = generateMockResponse("");
      console.log("Adding mock welcome message:", welcomeMessage);

      setMessageHistory((prev) => [
        ...prev,
        {
          text: welcomeMessage,
          isUser: false,
          language: detectLanguage(welcomeMessage),
          showTranslation: false,
          translationInProgress: false,
          messageComplete: true,
        },
      ]);

      setAgentResponse(welcomeMessage);

      if (onConversationUpdate) {
        onConversationUpdate(welcomeMessage, false);
      }

      // Speak the welcome message using browser's speech synthesis
      speakWithSynthesis(welcomeMessage);

      return;
    }

    // Real API mode code
    try {
      // First check if we have the necessary API credentials
      if (!agentId) {
        setErrorMessage(
          "ElevenLabs API credentials are not configured. Please add your NEXT_PUBLIC_AGENT_ID to your environment variables or stay in demo mode."
        );
        console.error(
          "Missing ElevenLabs agent ID. Cannot connect to live API."
        );
        return;
      }

      // Request microphone permission
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (micError) {
        setErrorMessage(
          "Microphone access denied. Please allow microphone access to use the voice conversation feature."
        );
        console.error("Microphone access error:", micError);
        return;
      }

      // Add a session start delimiter if there are previous messages
      if (messageHistory.length > 0) {
        const sessionStartTime = new Date().toLocaleTimeString();
        setMessageHistory((prev) => [
          ...prev,
          {
            text: `New session started at ${sessionStartTime}`,
            isUser: false,
            isSystemMessage: true,
          },
        ]);
      }

      // Attempt to start the session
      console.log(
        "Attempting to start ElevenLabs session with agent ID:",
        agentId
      );

      // Start the session with ElevenLabs - use direct agent ID, no signed URL needed
      const success = await startConversationSession({ agentId });
      if (!success) {
        setErrorMessage(
          "Failed to establish connection with ElevenLabs. Please check your API credentials or try again later."
        );
        console.error("Failed to start ElevenLabs session");
      } else {
        console.log("ElevenLabs session started successfully");
        // Add a welcome message to inform the user that the connection is ready
        setMessageHistory((prev) => [
          ...prev,
          {
            text: "Connected to ElevenLabs. You can start speaking now.",
            isUser: false,
            isSystemMessage: true,
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setErrorMessage(
        `Failed to start conversation: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }, [
    agentId,
    messageHistory.length,
    useMockApi,
    startConversationSession,
    onConversationUpdate,
    speakWithSynthesis,
  ]);

  // stopConversation handler
  const stopConversation = useCallback(async () => {
    try {
      // If in mock mode, simulate ending the session
      if (useMockApi) {
        console.log("Ending mock conversation");

        // Add a goodbye message
        const goodbyeMessage =
          "¡Hasta luego! Gracias por practicar español conmigo hoy.";
        setMessageHistory((prev) => [
          ...prev,
          {
            text: goodbyeMessage,
            isUser: false,
            language: detectLanguage(goodbyeMessage),
            showTranslation: false,
            translationInProgress: false,
            messageComplete: true,
          },
        ]);

        // After a short delay, end the session
        setTimeout(async () => {
          await endConversationSession();

          // Add a session delimiter to the transcript
          const sessionEndTime = new Date().toLocaleTimeString();
          setMessageHistory((prev) => [
            ...prev,
            {
              text: `Session ended at ${sessionEndTime}`,
              isUser: false,
              isSystemMessage: true,
            },
          ]);
        }, 1000);

        return;
      }

      // For real mode, use the actual API
      await endConversationSession();

      // Add a session delimiter to the transcript
      const sessionEndTime = new Date().toLocaleTimeString();
      setMessageHistory((prev) => [
        ...prev,
        {
          text: `Session ended at ${sessionEndTime}`,
          isUser: false,
          isSystemMessage: true,
        },
      ]);
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  }, [useMockApi, endConversationSession]);

  const simulateUserInput = useCallback(() => {
    if (!useMockApi || getStatus() !== "connected" || getIsSpeaking()) {
      return;
    }

    // Get a random sample input
    const randomIndex = Math.floor(Math.random() * sampleUserInputs.length);
    const mockUserInput = sampleUserInputs[randomIndex];

    console.log("Simulating user input:", mockUserInput);

    // Add the user message to history
    setMessageHistory((prev) => [
      ...prev,
      {
        text: mockUserInput,
        isUser: true,
        language: detectLanguage(mockUserInput),
        showTranslation: false,
        translationInProgress: false,
        messageComplete: true,
      },
    ]);

    // Play the user message with speech synthesis
    speakUserWithSynthesis(mockUserInput);

    // Process the mock response after a delay
    setTimeout(() => {
      const mockResponse = generateMockResponse(mockUserInput);
      console.log("Generated mock response:", mockResponse);

      // Add the mock response to history
      setMessageHistory((prev) => [
        ...prev,
        {
          text: mockResponse,
          isUser: false,
          language: detectLanguage(mockResponse),
          showTranslation: false,
          translationInProgress: false,
          messageComplete: true,
        },
      ]);

      setAgentResponse(mockResponse);

      if (onConversationUpdate) {
        onConversationUpdate(mockResponse, false);
      }

      // Speak the response using browser's speech synthesis
      speakWithSynthesis(mockResponse);
    }, 1500 + Math.random() * 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    useMockApi,
    getStatus,
    getIsSpeaking,
    onConversationUpdate,
    speakWithSynthesis,
    speakUserWithSynthesis,
  ]);

  // useEffect hooks
  // Check for an API key and update UI when mode changes
  useEffect(() => {
    // If switched to live mode, check for API key
    if (!useMockApi) {
      const envAgentId = process.env.NEXT_PUBLIC_AGENT_ID;
      if (envAgentId) {
        setAgentId(envAgentId);
        console.log("Using API agent ID from environment variables");
      } else {
        console.warn("No ElevenLabs agent ID found in environment variables");
        setErrorMessage(
          "ElevenLabs API credentials are not configured. Please add your NEXT_PUBLIC_AGENT_ID to your environment variables or switch back to demo mode."
        );
      }
    } else {
      // Clear any API-related error messages when in demo mode
      if (errorMessage && errorMessage.includes("API credentials")) {
        setErrorMessage("");
      }
    }
  }, [useMockApi, errorMessage]);

  // Original useEffect to check for API key on mount
  useEffect(() => {
    // Only use environment variable
    const envAgentId = process.env.NEXT_PUBLIC_AGENT_ID;
    if (envAgentId) {
      setAgentId(envAgentId);
    }
  }, []);

  // Function to check if it's appropriate to simulate a user response

  // Function to trigger user simulation if conditions are right

  // Handle isSpeaking changes to detect when messages are complete
  // This effect marks AI messages as complete when speaking ends
  useEffect(() => {
    // Only run this when speaking state changes from true to false
    if (getIsSpeaking() === false) {
      // Use functional update to avoid circular dependencies
      setMessageHistory((prev) => {
        // Don't update if there's no change needed
        let needsUpdate = false;
        const newHistory = prev.map((msg) => {
          if (!msg.isUser && !msg.isSystemMessage && !msg.messageComplete) {
            needsUpdate = true;
            return { ...msg, messageComplete: true };
          }
          return msg;
        });

        // Only return new array if we actually made changes
        return needsUpdate ? newHistory : prev;
      });
    }
  }, [getIsSpeaking]); // Only depend on the speaking state

  // This effect triggers simulation after AI message completes
  // Separate from the above effect to avoid circular dependencies
  useEffect(() => {
    // Find the last message
    if (
      messageHistory.length === 0 ||
      !useMockApi ||
      getStatus() !== "connected"
    ) {
      return;
    }

    const lastMsg = messageHistory[messageHistory.length - 1];

    // If the last message is from the AI, complete, and we're not speaking
    if (
      !lastMsg.isUser &&
      !lastMsg.isSystemMessage &&
      lastMsg.messageComplete &&
      !getIsSpeaking()
    ) {
      // Add a delay before triggering simulation
      const timer = setTimeout(() => {
        if (!getIsSpeaking() && useMockApi && getStatus() === "connected") {
          const now = Date.now();
          // Prevent rapid re-triggering
          if (now - lastSimulationTime.current >= 2000) {
            console.log("Delayed simulation trigger after message completion");
            lastSimulationTime.current = now;
            simulateUserInput();
          }
        }
      }, 3000 + Math.random() * 2000);

      return () => clearTimeout(timer);
    }
  }, [messageHistory, useMockApi, getStatus, getIsSpeaking, simulateUserInput]);

  // Handle mock speaking state in useEffect
  useEffect(() => {
    if (useMockApi && mockConversationStatus === "connected") {
      // If a new AI message is added, set speaking to true temporarily
      const lastMessage = messageHistory[messageHistory.length - 1];
      if (lastMessage && !lastMessage.isUser && !lastMessage.isSystemMessage) {
        // Set speaking to true
        setMockIsSpeaking(true);

        // Calculate speaking duration based on message length
        const speakingDuration =
          Math.max(2, Math.min(7, lastMessage.text.length / 15)) * 1000;

        console.log(
          `Setting speaking state for ${speakingDuration}ms based on message length`
        );

        // After duration, set speaking to false
        const timer = setTimeout(() => {
          setMockIsSpeaking(false);
          console.log("Speaking completed");
        }, speakingDuration);

        return () => clearTimeout(timer);
      }
    }
  }, [useMockApi, mockConversationStatus, messageHistory]);

  // Additional fallback timer to check for missed simulations
  useEffect(() => {
    if (!useMockApi || getStatus() !== "connected") {
      return;
    }

    // Create a periodic check every 10 seconds to make sure we didn't miss a simulation
    const fallbackTimer = setInterval(() => {
      const timeSinceLastSimulation = Date.now() - lastSimulationTime.current;

      // If it's been more than 20 seconds since our last simulation, check if we should trigger one
      if (timeSinceLastSimulation > 20000) {
        console.log(
          "Fallback check: It's been more than 20 seconds since last simulation"
        );

        // Only trigger if the last message is from the AI and not a system message
        if (messageHistory.length > 0) {
          const lastMsg = messageHistory[messageHistory.length - 1];
          if (!lastMsg.isUser && !lastMsg.isSystemMessage && !getIsSpeaking()) {
            console.log("Fallback mechanism: Triggering missed simulation");
            lastSimulationTime.current = Date.now();
            simulateUserInput();
          }
        }
      }
    }, 10000);

    return () => clearInterval(fallbackTimer);
  }, [useMockApi, getStatus, messageHistory, getIsSpeaking, simulateUserInput]);

  // Calculate layout classes based on whether the transcript is showing
  const hasTranscript =
    messageHistory.length > 0 || errorMessage || getStatus() === "connected";
  const containerClasses = `voice-interaction flex ${
    hasTranscript ? "flex-col md:flex-row items-start" : "flex-col items-center"
  } gap-8 w-full max-w-6xl mx-auto`;

  // Simple language detection helper
  const detectLanguage = (text: string): "english" | "spanish" | "mixed" => {
    if (!text) return "english";
    console.log("Detecting language for:", text);

    // Spanish specific characters and common words
    const spanishPatterns = [
      /[áéíóúüñ¿¡]/i,
      /\b(el|la|los|las|un|una|unos|unas|y|en|de|con|por|para|es|son|está|están|hola|gracias|buenos|buenas|días|tardes|noches|cómo|qué|quién|dónde|cuándo|por qué)\b/i,
    ];

    // English specific common words
    const englishPatterns = [
      /\b(the|a|an|and|in|of|to|for|is|are|am|be|been|being|was|were|hello|thank|good|morning|afternoon|evening|night|how|what|who|where|when|why)\b/i,
    ];

    let spanishMatches = 0;
    let englishMatches = 0;

    // Check for Spanish patterns
    spanishPatterns.forEach((pattern) => {
      if (pattern.test(text)) {
        spanishMatches++;
        console.log("Spanish match found:", pattern);
      }
    });

    // Check for English patterns
    englishPatterns.forEach((pattern) => {
      if (pattern.test(text)) {
        englishMatches++;
        console.log("English match found:", pattern);
      }
    });

    console.log(
      `Language detection: Spanish matches: ${spanishMatches}, English matches: ${englishMatches}`
    );

    // If text has Spanish accents or significantly more Spanish words, call it Spanish
    if (spanishMatches > 0 && spanishMatches > englishMatches) {
      console.log("Detected as: spanish");
      return "spanish";
    }

    // If text has more English words than Spanish, call it English
    if (englishMatches > 0 && englishMatches >= spanishMatches) {
      console.log("Detected as: english");
      return "english";
    }

    // If it has both languages more or less equally, call it mixed but return as Spanish
    if (spanishMatches > 0 && englishMatches > 0) {
      console.log("Detected as: mixed");
      return "spanish";
    }

    // Default fallback - check for Spanish accents as a last resort
    const isSpanish = /[áéíóúüñ]/.test(text);
    console.log(
      "Detected as:",
      isSpanish ? "spanish" : "english",
      "(fallback)"
    );
    return isSpanish ? "spanish" : "english";
  };

  // Styles for message bubbles
  const messageStyles = `
    .message-bubble {
      padding: 0.75rem 1rem;
      border-radius: 1rem;
      max-width: 85%;
      position: relative;
      word-break: break-word;
    }
    
    .user-message {
      border-bottom-right-radius: 0.25rem;
    }
    
    .agent-message {
      border-bottom-left-radius: 0.25rem;
    }
    
    .spanish-text {
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
    }
    
    .english-text {
      box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
    }
    
    .mixed-text {
      box-shadow: 0 2px 4px rgba(168, 85, 247, 0.2);
    }
  `;

  // Real translation function using Amazon Translate API
  const translateText = async (
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<string> => {
    try {
      console.log(
        `Translation request: "${text}" from ${sourceLang} to ${targetLang}`
      );

      // Call our API endpoint that uses Amazon Translate
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sourceLang, targetLang }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`Translation API error (${response.status}):`, errorData);
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Translation API response:", data);

      // If we got a real translation from Amazon
      if (data.translatedText) {
        console.log(
          `Translation success (${data.source}):`,
          data.translatedText
        );
        return data.translatedText;
      }

      // Fallback to our mock functions if the API call failed
      console.warn(
        "Translation API returned no result, using mock translation"
      );
      let fallbackTranslation = text;

      if (sourceLang === "es" && targetLang === "en") {
        fallbackTranslation = mockTranslate(text);
      } else if (sourceLang === "auto" && targetLang === "en") {
        fallbackTranslation = mockTranslateToEnglish(text);
      }

      console.log("Fallback translation:", fallbackTranslation);
      return fallbackTranslation;
    } catch (error) {
      console.error("Translation error:", error);

      // Fallback to mock translations on error
      let fallbackTranslation = text;

      if (sourceLang === "es" && targetLang === "en") {
        fallbackTranslation = mockTranslate(text);
      } else if (sourceLang === "auto" && targetLang === "en") {
        fallbackTranslation = mockTranslateToEnglish(text);
      }

      console.log("Error fallback translation:", fallbackTranslation);
      return fallbackTranslation || text;
    }
  };

  // Handle translation for completed messages
  useEffect(() => {
    // Nothing to do here - translation countdown is now handled by the TranslationCountdown component
  }, [messageHistory]);

  // Sample user inputs for mock mode demonstration
  const sampleUserInputs = [
    "Hola, ¿cómo estás?",
    "Me gustaría practicar español",
    "¿Puedes hablarme sobre la comida española?",
    "¿Cómo se dice 'thank you' en español?",
    "Háblame sobre el clima en España",
    "¿Dónde puedo aprender más vocabulario?",
    "Me gusta viajar a países hispanohablantes",
    "¿Cuáles son algunos saludos comunes?",
    "Necesito practicar los verbos",
    "¿Puedes recomendarme algunos libros en español?",
  ];

  // Add auto-scroll function
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, []);

  // Add effect for auto-scrolling when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messageHistory, scrollToBottom]);

  // Load Spanish voices when the component mounts
  useEffect(() => {
    // Some browsers need this to get all voices
    if (window.speechSynthesis) {
      // Get voices right away (for Chrome and other browsers that load voices synchronously)
      window.speechSynthesis.getVoices();

      // Listen for the voiceschanged event (for browsers that load voices asynchronously)
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  return (
    <div className={containerClasses}>
      <style jsx>{messageStyles}</style>
      <div
        className={`flex flex-col items-center ${
          hasTranscript ? "" : "mx-auto"
        }`}
      >
        <button
          onClick={
            getStatus() === "connected" ? stopConversation : startConversation
          }
          disabled={getStatus() === "connecting" || isGettingSignedUrl}
          className={`pulse-button relative outline-none focus:ring-4 focus:ring-amber-300/50 dark:focus:ring-amber-700/50
            ${
              getStatus() === "connected"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600"
            } 
            text-white text-lg font-medium rounded-full p-4 w-56 h-56 md:w-64 md:h-64 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
          aria-label={
            getStatus() === "connected"
              ? "Stop conversation"
              : "Start conversation"
          }
        >
          <div className="text-center">
            {getStatus() === "connected" ? (
              <>
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <div
                    className="w-2 h-8 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-12 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                  <div
                    className="w-2 h-6 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "600ms" }}
                  ></div>
                  <div
                    className="w-2 h-10 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "900ms" }}
                  ></div>
                </div>
                <span className="block">
                  {getIsSpeaking() ? "Speaking..." : "Listening..."}
                </span>
                <span className="text-sm mt-1 block">
                  {getIsSpeaking() ? "Wait to Respond" : "Click to End Session"}
                </span>
              </>
            ) : getStatus() === "connecting" || isGettingSignedUrl ? (
              <>
                <div className="w-10 h-10 border-4 border-white rounded-full border-t-transparent animate-spin mx-auto mb-2"></div>
                <span className="block">
                  {isGettingSignedUrl ? "Getting URL..." : "Connecting..."}
                </span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 mx-auto mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                  />
                </svg>
                <span className="block">Start Conversation</span>
                <span className="text-sm mt-1 block">
                  Click to Begin Spanish Practice
                </span>
              </>
            )}
          </div>
        </button>

        <div className="mt-3 text-sm text-slate-600">
          Status: {getStatus()}
          {getStatus() === "connected" &&
            ` • ${getIsSpeaking() ? "Speaking" : "Listening"}`}
        </div>
      </div>

      {/* Transcript Panel - Now displayed side by side with the button on larger screens */}
      {hasTranscript && (
        <div className="transcript-panel flex-1 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-md text-left w-full min-h-[250px] flex flex-col">
          <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">
            Conversation
          </h3>

          {errorMessage && (
            <div className="error-message mb-4 text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 inline-block mr-1 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              {errorMessage}
            </div>
          )}

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto conversation-thread"
          >
            {/* Message history */}
            {messageHistory.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isSystemMessage
                    ? "justify-center"
                    : message.isUser
                    ? "justify-end"
                    : "justify-start"
                } mb-3`}
              >
                {message.isSystemMessage ? (
                  <div className="text-center text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-400 px-3 py-1 rounded-full">
                    {message.text}
                  </div>
                ) : (
                  <div
                    className={`message-bubble ${
                      message.isUser ? "user-message" : "agent-message"
                    } ${
                      message.language === "spanish"
                        ? "spanish-text bg-blue-500 dark:bg-blue-600"
                        : message.language === "english"
                        ? "english-text bg-green-500 dark:bg-green-600"
                        : "mixed-text bg-purple-500 dark:bg-purple-600"
                    }`}
                  >
                    <p
                      className={
                        message.isUser
                          ? "text-white"
                          : "text-white dark:text-white"
                      }
                    >
                      {message.text}
                    </p>

                    {/* Show countdown timer for translation */}
                    {message.messageComplete &&
                      message.language !== "english" &&
                      !message.showTranslation &&
                      !message.translationInProgress && (
                        <TranslationCountdown
                          initialSeconds={15}
                          onComplete={() => {
                            console.log(
                              "Translation countdown complete for message:",
                              message.text
                            );

                            // Start the translation process
                            const sourceLang =
                              message.language === "spanish" ? "es" : "auto";
                            console.log(
                              "Starting translation with source language:",
                              sourceLang
                            );

                            // Mark as in progress to prevent duplicate countdowns
                            setMessageHistory((current) => {
                              console.log(
                                "Marking message as translation in progress"
                              );
                              return current.map((msg) =>
                                msg === message
                                  ? { ...msg, translationInProgress: true }
                                  : msg
                              );
                            });

                            // Get the translation
                            translateText(message.text, sourceLang, "en")
                              .then((translatedText) => {
                                console.log(
                                  "Translation received:",
                                  translatedText
                                );
                                setMessageHistory((current) => {
                                  console.log(
                                    "Updating message with translation"
                                  );
                                  return current.map((currentMsg) => {
                                    if (
                                      currentMsg.text === message.text &&
                                      currentMsg.isUser === message.isUser
                                    ) {
                                      return {
                                        ...currentMsg,
                                        translation: translatedText,
                                        showTranslation: true,
                                      };
                                    }
                                    return currentMsg;
                                  });
                                });
                              })
                              .catch((err) => {
                                console.error("Translation error:", err);
                                // Still mark as translated with an error message
                                setMessageHistory((current) =>
                                  current.map((currentMsg) => {
                                    if (
                                      currentMsg.text === message.text &&
                                      currentMsg.isUser === message.isUser
                                    ) {
                                      return {
                                        ...currentMsg,
                                        translation: "Translation failed",
                                        showTranslation: true,
                                      };
                                    }
                                    return currentMsg;
                                  })
                                );
                              });
                          }}
                          getText={(seconds) => `Translation in ${seconds}s`}
                        />
                      )}

                    {/* Show translation after countdown completes */}
                    {message.translation && message.showTranslation && (
                      <p className="text-white/80 text-sm pt-1 border-t border-white/20 mt-1 italic">
                        {message.translation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Show a placeholder when connected but no messages */}
            {getStatus() === "connected" && messageHistory.length === 0 && (
              <div className="flex justify-start mb-3">
                <div className="message-bubble agent-message">
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-1 h-2 bg-slate-500 dark:bg-slate-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-1 h-3 bg-slate-500 dark:bg-slate-400 rounded-full animate-pulse"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="w-1 h-1.5 bg-slate-500 dark:bg-slate-400 rounded-full animate-pulse"
                      style={{ animationDelay: "600ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Typing indicator when agent is speaking */}
            {getIsSpeaking() && agentResponse && (
              <div className="flex justify-start mb-3">
                <div className="message-bubble agent-message">
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-1 h-2 bg-slate-500 dark:bg-slate-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-1 h-3 bg-slate-500 dark:bg-slate-400 rounded-full animate-pulse"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="w-1 h-1.5 bg-slate-500 dark:bg-slate-400 rounded-full animate-pulse"
                      style={{ animationDelay: "600ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}

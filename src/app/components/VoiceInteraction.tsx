"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getApiKey, playAudio, textToSpeech } from "../utils/elevenlabs";

interface VoiceInteractionProps {
  onConversationUpdate?: (message: string, isUser: boolean) => void;
  onError?: (errorMessage: string) => void;
  agentId?: string;
}

// Message history interface
interface MessageEntry {
  text: string;
  isUser: boolean;
  translation?: string;
}

// Define event interfaces for speech recognition
interface SpeechRecognitionResultList {
  [index: number]: { [index: number]: { transcript: string } };
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

export default function VoiceInteraction({
  onConversationUpdate,
  onError,
  agentId: propAgentId,
}: VoiceInteractionProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [, setTranslation] = useState("");
  const [showTranslation, setShowTranslation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [localAgentId, setLocalAgentId] = useState<string | null>(null);
  const [messageHistory, setMessageHistory] = useState<MessageEntry[]>([]);
  // Define a simple interface that matches what we need from SpeechRecognition
  interface SpeechRecognitionInstance {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start(): void;
    stop(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
  }
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle ElevenLabs response
  const handleElevenLabsResponse = useCallback(
    async (userInput: string) => {
      try {
        setIsProcessing(true);

        const audioData = await textToSpeech(
          userInput,
          undefined,
          undefined,
          propAgentId || localAgentId || undefined
        );

        audioRef.current = playAudio(audioData);

        setIsProcessing(false);
      } catch (error) {
        console.error("ElevenLabs error:", error);
        setErrorMessage(
          `Error processing speech: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        setIsProcessing(false);
      }
    },
    [propAgentId, localAgentId]
  );

  // Initialize speech recognition with a retry mechanism
  const initSpeechRecognition = useCallback(() => {
    const ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!ctor) throw new Error("no speech API");
    const recognition = new ctor() as unknown as SpeechRecognitionInstance;

    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognitionRef.current = recognition;
    return true;
  }, []);

  // Setup event handlers for speech recognition
  const setupRecognitionEventHandlers = useCallback(() => {
    const recognition = recognitionRef.current as SpeechRecognitionInstance;
    if (!recognition) return;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);

      setMessageHistory((prev) => [...prev, { text: result, isUser: true }]);
      onConversationUpdate?.(result, true);
      setRetryCount(0);
      setIsListening(false);
      handleElevenLabsResponse(result);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event.error);

      if (event.error === "network") {
        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);

        if (newRetryCount <= 3) {
          setErrorMessage(`Network error. Retrying (${newRetryCount}/3)...`);
          setTimeout(() => {
            stopListening();
            if (initSpeechRecognition()) {
              setupRecognitionEventHandlers();
              const recognition = recognitionRef.current;
              if (recognition) {
                (recognition as SpeechRecognitionInstance).start();
              }
              setIsListening(true);
            }
          }, 1000);
        } else {
          setIsListening(false);
          setErrorMessage(
            `Speech recognition network error. Please check your internet connection and try again.`
          );
        }
      } else {
        setIsListening(false);
        setErrorMessage(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      if (retryCount === 0) {
        setIsListening(false);
      }
    };
  }, [
    retryCount,
    onConversationUpdate,
    handleElevenLabsResponse,
    initSpeechRecognition,
  ]);

  // Set up error message handling
  useEffect(() => {
    if (errorMessage && onError) {
      onError(errorMessage);
    }
  }, [errorMessage, onError]);

  // Initialize speech recognition on component mount
  useEffect(() => {
    if (initSpeechRecognition()) {
      setupRecognitionEventHandlers();
    }

    // If a specific agent ID is passed as prop, use it first
    if (propAgentId) {
      setLocalAgentId(propAgentId);
      return;
    }

    // Otherwise, check for environment variable
    const apiKey = getApiKey();
    if (apiKey) {
      setLocalAgentId(apiKey);
    }

    // Cleanup function
    return () => {
      const recognition = recognitionRef.current;
      if (recognition) {
        const instance = recognition as SpeechRecognitionInstance;
        instance.onresult = null;
        instance.onerror = null;
        instance.onend = null;
      }

      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [propAgentId, initSpeechRecognition, setupRecognitionEventHandlers]);

  // Add translation timer effect
  useEffect(() => {
    let translationTimer: NodeJS.Timeout;

    if (transcript) {
      // Reset translation state when new transcript comes in
      setShowTranslation(false);
      setTranslation("");

      // Simple mock translation - in a real app, call a translation API
      const mockTranslate = (text: string) => {
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
        };

        // Simple word replacement - just for demonstration
        let translated = text.toLowerCase();
        Object.entries(translations).forEach(([spanish, english]) => {
          translated = translated.replace(new RegExp(spanish, "gi"), english);
        });

        return translated.charAt(0).toUpperCase() + translated.slice(1);
      };

      // Set timer to show translation after 20 seconds
      translationTimer = setTimeout(() => {
        const translatedText = mockTranslate(transcript);
        setTranslation(translatedText);
        setShowTranslation(true);

        // Update the last user message with translation
        setMessageHistory((prev) => {
          const updated = [...prev];
          for (let i = updated.length - 1; i >= 0; i--) {
            if (updated[i].isUser) {
              updated[i] = { ...updated[i], translation: translatedText };
              break;
            }
          }
          return updated;
        });
      }, 20000);
    }

    return () => {
      if (translationTimer) clearTimeout(translationTimer);
    };
  }, [transcript]);

  const handleMicrophoneClick = () => {
    // Clear previous error message
    setErrorMessage("");

    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const startListening = () => {
    setErrorMessage("");
    setTranscript("");
    setTranslation("");
    setShowTranslation(false);
    setRetryCount(0);

    // Check if browser supports speech recognition
    if (!recognitionRef.current) {
      // Try to re-initialize
      if (!initSpeechRecognition()) {
        setErrorMessage(
          "Speech recognition is not supported in this browser. Try Chrome or Edge."
        );
        return;
      }
    }

    try {
      if (recognitionRef.current) {
        (recognitionRef.current as SpeechRecognitionInstance).start();
        setIsListening(true);
      } else {
        setErrorMessage(
          "Speech recognition initialization failed. Please reload the page."
        );
      }
    } catch (err) {
      console.error("Failed to start speech recognition:", err);

      // If we get an error starting, try to re-initialize
      if (err instanceof DOMException && err.name === "InvalidStateError") {
        // The recognition is likely in a bad state, let's reset it
        if (recognitionRef.current) {
          const instance = recognitionRef.current as SpeechRecognitionInstance;
          instance.onresult = null;
          instance.onerror = null;
          instance.onend = null;
        }
        recognitionRef.current = null;

        // Reinitialize and try again
        if (initSpeechRecognition() && recognitionRef.current) {
          try {
            (recognitionRef.current as SpeechRecognitionInstance).start();
            setIsListening(true);
            return;
          } catch (secondErr) {
            console.error(
              "Failed second attempt to start speech recognition:",
              secondErr
            );
          }
        }
      }

      setErrorMessage(
        "Failed to start speech recognition. Please try again or reload the page."
      );
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        (recognitionRef.current as SpeechRecognitionInstance).stop();
      } catch (err) {
        console.error("Error stopping recognition:", err);
      }
    }
    setIsListening(false);
  };

  // Add a retry button
  const handleRetry = () => {
    setErrorMessage("");

    // Re-initialize speech recognition
    recognitionRef.current = null;
    initSpeechRecognition();

    // Start listening
    startListening();
  };

  // Calculate layout classes based on whether transcript is showing
  const hasTranscript = messageHistory.length > 0 || errorMessage;
  const containerClasses = `voice-interaction flex ${
    hasTranscript ? "flex-col md:flex-row items-start" : "flex-col items-center"
  } gap-4 w-full`;

  return (
    <div className={containerClasses}>
      <div
        className={`flex flex-col items-center ${
          hasTranscript ? "" : "mx-auto"
        }`}
      >
        <button
          onClick={handleMicrophoneClick}
          disabled={isProcessing}
          className={`pulse-button relative outline-none focus:ring-4 focus:ring-amber-300/50 dark:focus:ring-amber-700/50
            ${
              isListening
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600"
            } 
            text-white text-lg font-medium rounded-full p-4 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
          aria-label={isListening ? "Stop listening" : "Start speaking"}
        >
          <div className="text-center">
            {isListening ? (
              <>
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <div
                    className="w-1 h-4 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-1 h-6 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                  <div
                    className="w-1 h-3 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "600ms" }}
                  ></div>
                  <div
                    className="w-1 h-5 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "900ms" }}
                  ></div>
                </div>
                <span className="block text-sm">Listening...</span>
              </>
            ) : isProcessing ? (
              <>
                <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin mx-auto mb-2"></div>
                <span className="block text-sm">Processing...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 mx-auto mb-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                  />
                </svg>
                <span className="block text-sm">Tap to Speak</span>
              </>
            )}
          </div>
        </button>

        {errorMessage && !onError && (
          <div className="error-message mt-4 text-red-600 text-center p-3 bg-red-50 border border-red-200 rounded-lg max-w-md w-full">
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

            {errorMessage.includes("network") && (
              <button
                onClick={handleRetry}
                className="ml-2 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        )}
      </div>

      {hasTranscript && (
        <div className="transcript mt-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-left max-w-md w-full">
          <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-white">
            Conversation
          </h3>

          <div className="overflow-y-auto conversation-thread">
            {/* Display message history */}
            {messageHistory.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                } mb-3`}
              >
                <div
                  className={`message-bubble ${
                    message.isUser ? "user-message" : "agent-message"
                  }`}
                >
                  <p
                    className={
                      message.isUser
                        ? "text-white"
                        : "text-slate-800 dark:text-slate-200"
                    }
                  >
                    {message.text}
                  </p>
                  {message.isUser && message.translation && (
                    <p className="text-white/80 text-sm pt-1 border-t border-white/20 mt-1 italic">
                      {message.translation}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Processing indicator */}
            {isProcessing && (
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

            {/* Translation indicator */}
            {transcript &&
              !showTranslation &&
              messageHistory.some((m) => m.isUser) && (
                <div className="text-xs text-slate-500 mt-2 flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-3 w-3 text-amber-500"
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
                  Translation will appear shortly...
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

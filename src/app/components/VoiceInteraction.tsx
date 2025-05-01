"use client";

import { useEffect, useRef, useState } from "react";
import {
  generateTutorResponse,
  getApiKey,
  hasApiKey,
  playAudio,
  setupSpeechRecognition,
  textToSpeech,
} from "../utils/elevenlabs";

interface VoiceInteractionProps {
  onConversationUpdate?: (message: string, isUser: boolean) => void;
}

export default function VoiceInteraction({
  onConversationUpdate,
}: VoiceInteractionProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize speech recognition on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      recognitionRef.current = setupSpeechRecognition();

      // Check if API key is set either in env var or localStorage
      const hasKey = hasApiKey();
      setShowApiKeyInput(!hasKey);
    }

    return () => {
      // Cleanup
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
      }

      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Set up recognition event handlers
  useEffect(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);

      // Update conversation if callback exists
      if (onConversationUpdate) {
        onConversationUpdate(result, true);
      }

      // Stop listening and process with ElevenLabs
      setIsListening(false);
      handleElevenLabsResponse(result);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      setErrorMessage(`Speech recognition error: ${event.error}`);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  }, [onConversationUpdate]);

  const handleMicrophoneClick = () => {
    if (!hasApiKey() && !showApiKeyInput) {
      setShowApiKeyInput(true);
      return;
    }

    if (showApiKeyInput) {
      return;
    }

    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const startListening = () => {
    setErrorMessage("");
    setTranscript("");

    // Check if browser supports speech recognition
    if (!recognitionRef.current) {
      setErrorMessage(
        "Speech recognition is not supported in this browser. Try Chrome or Edge."
      );
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setErrorMessage("Failed to start speech recognition. Please try again.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Error stopping recognition:", err);
      }
    }
    setIsListening(false);
  };

  const handleElevenLabsResponse = async (userInput: string) => {
    try {
      setIsProcessing(true);

      // Generate AI response
      const response = await generateTutorResponse(userInput);

      // Update conversation if callback exists
      if (onConversationUpdate) {
        onConversationUpdate(response, false);
      }

      // Convert response to speech using ElevenLabs
      const audioData = await textToSpeech(response);

      // Play the audio
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
  };

  const handleSaveApiKey = () => {
    if (!apiKeyInput.trim()) {
      setErrorMessage("Please enter a valid API key");
      return;
    }

    // Save the API key
    localStorage.setItem("elevenlabs_api_key", apiKeyInput.trim());
    setShowApiKeyInput(false);
    setApiKeyInput("");
    setErrorMessage("");
  };

  return (
    <div className="voice-interaction flex flex-col items-center">
      {showApiKeyInput ? (
        <div className="api-key-form mb-6 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center max-w-md w-full">
          <h3 className="text-lg font-medium mb-3">
            ElevenLabs API Key Required
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Please enter your ElevenLabs API key to use the voice features. The
            public agent ID was not found in environment variables.
          </p>
          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="Enter your API key"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md mb-3 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
          />
          <button
            onClick={handleSaveApiKey}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Save API Key
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={handleMicrophoneClick}
            disabled={isProcessing}
            className={`pulse-button relative outline-none focus:ring-4 focus:ring-amber-300/50 dark:focus:ring-amber-700/50
              ${
                isListening
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600"
              } 
              text-white text-lg font-medium rounded-full p-4 w-56 h-56 md:w-64 md:h-64 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            aria-label={isListening ? "Stop listening" : "Start speaking"}
          >
            <div className="text-center">
              {isListening ? (
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
                  <span className="block">Listening...</span>
                </>
              ) : isProcessing ? (
                <>
                  <div className="w-10 h-10 border-4 border-white rounded-full border-t-transparent animate-spin mx-auto mb-2"></div>
                  <span className="block">Processing...</span>
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
                  <span className="block">Tap to Speak</span>
                </>
              )}
            </div>
          </button>

          {errorMessage && (
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
            </div>
          )}

          {transcript && !isProcessing && (
            <div className="transcript mt-6 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center max-w-md w-full">
              <p className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                You said:
              </p>
              <p className="italic text-slate-800 dark:text-slate-200 text-lg">
                {transcript}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

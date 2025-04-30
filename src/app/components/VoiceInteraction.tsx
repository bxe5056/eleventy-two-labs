"use client";

import { useState } from "react";

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

  // This would be replaced with your actual ElevenLabs API integration
  const mockElevenLabsResponse = async (userInput: string) => {
    setIsProcessing(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simple mock responses based on input
    let response = "";

    if (
      userInput.toLowerCase().includes("hola") ||
      userInput.toLowerCase().includes("hello") ||
      userInput.toLowerCase().includes("hi")
    ) {
      response = "¡Hola! ¿Cómo estás? (Hello! How are you?)";
    } else if (
      userInput.toLowerCase().includes("goodbye") ||
      userInput.toLowerCase().includes("adios")
    ) {
      response = "¡Adiós! Hasta luego. (Goodbye! See you later.)";
    } else if (
      userInput.toLowerCase().includes("help") ||
      userInput.toLowerCase().includes("ayuda")
    ) {
      response = "¿En qué puedo ayudarte? (How can I help you?)";
    } else if (
      userInput.toLowerCase().includes("learn") ||
      userInput.toLowerCase().includes("practice")
    ) {
      response =
        "Vamos a practicar español. Repite después de mí: Buenos días. (Let's practice Spanish. Repeat after me: Good morning.)";
    } else {
      response =
        "Lo siento, no entendí. ¿Puedes repetir eso? (I'm sorry, I didn't understand. Can you repeat that?)";
    }

    setIsProcessing(false);
    return response;
  };

  const handleMicrophoneClick = () => {
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
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setErrorMessage(
        "Speech recognition is not supported in this browser. Try Chrome or Edge."
      );
      return;
    }

    // This is a mock implementation - in a real app, you would implement actual
    // speech recognition using the Web Speech API or a similar library
    setIsListening(true);

    // Simulate speech recognition for demo purposes
    setTimeout(() => {
      setIsListening(false);
      const mockTranscript = "Hola, quiero aprender español.";
      setTranscript(mockTranscript);

      // Update conversation if callback exists
      if (onConversationUpdate) {
        onConversationUpdate(mockTranscript, true);
      }

      // Process with ElevenLabs (mock)
      handleElevenLabsResponse(mockTranscript);
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const handleElevenLabsResponse = async (userInput: string) => {
    const response = await mockElevenLabsResponse(userInput);

    // Update conversation if callback exists
    if (onConversationUpdate) {
      onConversationUpdate(response, false);
    }

    // In a real implementation, you would use the ElevenLabs API to convert
    // the text response to speech and play it back
    console.log("AI Response:", response);
  };

  return (
    <div className="voice-interaction flex flex-col items-center">
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
    </div>
  );
}

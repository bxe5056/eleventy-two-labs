"use client";

import { useState, useRef, useEffect } from "react";
import VoiceInteraction from "./VoiceInteraction";
import { getApiKey } from "../utils/elevenlabs";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ConversationInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "¡Hola! Bienvenido a SpanishVoice. ¿En qué puedo ayudarte hoy? (Hello! Welcome to SpanishVoice. How can I help you today?)",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const [currentLesson, ] = useState<string | null>(null);
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check for agent ID on component mount
  useEffect(() => {
    // Get agent ID from environment variable or localStorage
    setAgentId(getApiKey());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleConversationUpdate = (message: string, isUser: boolean) => {
    // Clear any previous errors when we get a successful conversation update
    setError(null);

    setMessages((prev) => [
      ...prev,
      { text: message, isUser, timestamp: new Date() },
    ]);

    // This is where you would handle lesson/exercise progression
    // based on conversation content
    if (!isUser && message.includes("Buenos días")) {
      setCurrentExercise("Greetings: Morning Greeting");
    }
  };

  // Handler for speech recognition errors
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // Handler to retry if there was an error
  const handleRetry = () => {
    setError(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto">
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 md:max-h-[600px] overflow-y-auto border border-slate-200 dark:border-slate-700">
        <div className="conversation-history space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!message.isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-red-500 flex items-center justify-center text-white font-bold mr-2 mt-1">
                  AI
                </div>
              )}

              <div
                className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                  message.isUser
                    ? "bg-gradient-to-r from-amber-500 to-red-500 text-white rounded-tr-none"
                    : "bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-tl-none"
                }`}
              >
                <p
                  className={`text-sm md:text-base ${
                    !message.isUser && "dark:text-slate-200"
                  }`}
                >
                  {message.text}
                </p>
                <p className="text-xs mt-2 opacity-70 text-right">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {message.isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 dark:bg-slate-600 flex items-center justify-center text-white font-bold ml-2 mt-1">
                  You
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />

          {/* Display error messages in the conversation */}
          {error && (
            <div className="error-message p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg text-red-600 dark:text-red-400 text-sm">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2 text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                <span>{error}</span>
              </div>
              <button
                onClick={handleRetry}
                className="mt-2 px-3 py-1 bg-white dark:bg-red-800/30 hover:bg-red-100 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 text-xs font-medium rounded-md transition-colors w-full"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <VoiceInteraction
          onConversationUpdate={handleConversationUpdate}
          onError={handleError}
          agentId={agentId || undefined}
        />

        {currentLesson && (
          <div className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-md p-5 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-amber-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                />
              </svg>
              <h3 className="font-semibold text-lg dark:text-white">
                Current Lesson
              </h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 pl-7">
              {currentLesson}
            </p>
          </div>
        )}

        {currentExercise && (
          <div className="w-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-amber-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
              <h3 className="font-semibold text-lg text-amber-800 dark:text-amber-500">
                Current Exercise
              </h3>
            </div>
            <p className="text-amber-700 dark:text-amber-400 pl-7">
              {currentExercise}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

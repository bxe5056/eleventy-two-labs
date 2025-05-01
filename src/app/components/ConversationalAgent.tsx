"use client";

import { useConversation } from "@11labs/react";
import { useCallback, useState, useEffect } from "react";
import { getApiKey } from "../utils/elevenlabs";

interface ConversationalAgentProps {
  onConversationUpdate?: (message: string, isUser: boolean) => void;
}

// Define types for ElevenLabs messages
interface ElevenLabsMessage {
  message: string;
  source: "user" | "ai";
}

// Message history interface
interface MessageEntry {
  text: string;
  isUser: boolean;
  translation?: string;
  isSystemMessage?: boolean;
}

export default function ConversationalAgent({
  onConversationUpdate,
}: ConversationalAgentProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [agentId, setAgentId] = useState("");
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPrivateAgent, setIsPrivateAgent] = useState(false);
  const [isGettingSignedUrl, setIsGettingSignedUrl] = useState(false);
  const [messageHistory, setMessageHistory] = useState<MessageEntry[]>([]);
  const [agentResponse, setAgentResponse] = useState("");

  // Initialize the conversation with ElevenLabs
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");

      // Add a welcome message to start the conversation and ensure transcript is visible
      // This helps in cases where the SDK doesn't immediately send a message
      //   setTimeout(() => {
      //     if (messageHistory.length === 0) {
      //       console.log("onConnect: Adding initial welcome message");
      //     //   const welcomeMessage =
      //     //     "";

      //     //   // Add the welcome message to the history
      //     //   setMessageHistory([{ text: welcomeMessage, isUser: false }]);
      //     //   setAgentResponse(welcomeMessage);

      //     //   if (onConversationUpdate) {
      //     //     onConversationUpdate(welcomeMessage, false);
      //     //   }
      //     }
      //   }, 1000);
    },
    onDisconnect: () => console.log("Disconnected from ElevenLabs"),
    onMessage: (message: ElevenLabsMessage) => {
      console.log("Message received from ElevenLabs:", message);

      if (message.message && message.source) {
        const isUser = message.source === "user";
        const messageText = message.message;

        console.log(`${isUser ? "User" : "AI"} message:`, messageText);

        if (isUser) {
          setTranscript(messageText);
        } else {
          setAgentResponse(messageText);
        }

        // Add message to history
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
          return [...prev, { text: messageText, isUser }];
        });

        if (onConversationUpdate) {
          onConversationUpdate(messageText, isUser);
        }
      }
    },
    onError: (message: string) => {
      console.error("ElevenLabs error:", message);
      setErrorMessage(`Error: ${message || "Connection failed"}`);
    },
  });

  // Check for API key on component mount
  useEffect(() => {
    // Only use environment variable
    const envAgentId = process.env.NEXT_PUBLIC_AGENT_ID;
    if (envAgentId) {
      setAgentId(envAgentId);
    }

    // Check for private agent setting
    const storedIsPrivate = localStorage.getItem("elevenlabs_is_private_agent");
    if (storedIsPrivate === "true") {
      setIsPrivateAgent(true);
    }
  }, []);

  // Add a useEffect to handle translation timer
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

  // Get a signed URL for private agents
  const getSignedUrl = async (): Promise<string> => {
    setIsGettingSignedUrl(true);
    try {
      const response = await fetch(`/api/get-signed-url?agent_id=${agentId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to get signed URL: ${errorData.error || response.statusText}`
        );
      }
      const data = await response.json();
      setIsGettingSignedUrl(false);
      return data.signedUrl;
    } catch (error) {
      setIsGettingSignedUrl(false);
      console.error("Error fetching signed URL:", error);
      setErrorMessage(
        `Failed to get signed URL: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error;
    }
  };

  const startConversation = useCallback(async () => {
    setErrorMessage("");
    console.log("Starting conversation with agent ID:", agentId);

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!agentId) {
        setErrorMessage(
          "Agent ID is not available. Please add NEXT_PUBLIC_AGENT_ID to your environment variables."
        );
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

      // For private agents, get a signed URL
      if (isPrivateAgent) {
        try {
          const signedUrl = await getSignedUrl();
          console.log("Starting session with signed URL");
          await conversation.startSession({
            signedUrl,
          });
        } catch (error) {
          return; // Error is already handled in getSignedUrl
        }
      } else {
        // For public agents, use the agent ID directly
        console.log("Starting session with agent ID");
        await conversation.startSession({
          agentId,
        });
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
    conversation,
    agentId,
    isPrivateAgent,
    messageHistory.length,
    onConversationUpdate,
  ]);

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession();

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
  }, [conversation]);

  // Calculate layout classes based on whether transcript is showing
  const hasTranscript =
    messageHistory.length > 0 ||
    errorMessage ||
    conversation.status === "connected";
  const containerClasses = `voice-interaction flex ${
    hasTranscript ? "flex-col md:flex-row items-start" : "flex-col items-center"
  } gap-8 w-full max-w-6xl mx-auto`;

  return (
    <div className={containerClasses}>
      <div
        className={`flex flex-col items-center ${
          hasTranscript ? "" : "mx-auto"
        }`}
      >
        <button
          onClick={
            conversation.status === "connected"
              ? stopConversation
              : startConversation
          }
          disabled={conversation.status === "connecting" || isGettingSignedUrl}
          className={`pulse-button relative outline-none focus:ring-4 focus:ring-amber-300/50 dark:focus:ring-amber-700/50
            ${
              conversation.status === "connected"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600"
            } 
            text-white text-lg font-medium rounded-full p-4 w-56 h-56 md:w-64 md:h-64 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
          aria-label={
            conversation.status === "connected"
              ? "Stop conversation"
              : "Start conversation"
          }
        >
          <div className="text-center">
            {conversation.status === "connected" ? (
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
                  {conversation.isSpeaking ? "Speaking..." : "Listening..."}
                </span>
                <span className="text-sm mt-1 block">
                  {conversation.isSpeaking
                    ? "Wait to Respond"
                    : "Click to End Session"}
                </span>
              </>
            ) : conversation.status === "connecting" || isGettingSignedUrl ? (
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
          Status: {conversation.status}
          {conversation.status === "connected" &&
            ` • ${conversation.isSpeaking ? "Speaking" : "Listening"}`}
        </div>
      </div>

      {/* Transcript Panel - Now displayed side by side with the button on larger screens */}
      {hasTranscript && (
        <div className="transcript-panel flex-1 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-md text-left max-w-md w-full min-h-[250px] flex flex-col">
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

          <div className="flex-1 overflow-y-auto conversation-thread">
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
                )}
              </div>
            ))}

            {/* Show a placeholder when connected but no messages */}
            {conversation.status === "connected" &&
              messageHistory.length === 0 && (
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
            {conversation.isSpeaking && agentResponse && (
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

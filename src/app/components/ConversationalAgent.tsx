"use client";

import { useConversation } from "@11labs/react";
import { useCallback, useState, useEffect } from "react";
import { getApiKey } from "../utils/elevenlabs";

interface ConversationalAgentProps {
  onConversationUpdate?: (message: string, isUser: boolean) => void;
}

// Define types for ElevenLabs messages
interface TranscriptMessage {
  type: "transcript";
  transcript: {
    text: string;
    is_final: boolean;
  };
}

interface SpeechUpdateMessage {
  type: "speech_update";
  speech_update: {
    text: string;
  };
}

// Union type for all possible message types
type ElevenLabsMessage = TranscriptMessage | SpeechUpdateMessage | any;

export default function ConversationalAgent({
  onConversationUpdate,
}: ConversationalAgentProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [agentId, setAgentId] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isPrivateAgent, setIsPrivateAgent] = useState(false);
  const [isGettingSignedUrl, setIsGettingSignedUrl] = useState(false);

  // Initialize the conversation with ElevenLabs
  const conversation = useConversation({
    onConnect: () => console.log("Connected to ElevenLabs"),
    onDisconnect: () => console.log("Disconnected from ElevenLabs"),
    onMessage: (message: ElevenLabsMessage) => {
      console.log("Message:", message);

      // Handle incoming messages
      if (message.type === "transcript") {
        if (message.transcript.is_final && message.transcript.text) {
          setTranscript(message.transcript.text);
          if (onConversationUpdate) {
            onConversationUpdate(message.transcript.text, true);
          }
        }
      } else if (message.type === "speech_update") {
        if (message.speech_update.text && onConversationUpdate) {
          onConversationUpdate(message.speech_update.text, false);
        }
      }
    },
    onError: (message: string) => {
      console.error("Error:", message);
      setErrorMessage(`Error: ${message || "Connection failed"}`);
    },
  });

  // Check for API key on component mount
  useEffect(() => {
    // First check for environment variable
    const envAgentId = process.env.NEXT_PUBLIC_AGENT_ID;

    if (envAgentId) {
      // If we have an environment variable, use it and don't show the input form
      setAgentId(envAgentId);
      setShowApiKeyInput(false);
      return;
    }

    // If no environment variable, check localStorage for agent ID
    const storedAgentId = localStorage.getItem("elevenlabs_agent_id");
    if (storedAgentId) {
      setAgentId(storedAgentId);
    } else {
      // If no agent ID found anywhere, show the input form
      setShowApiKeyInput(true);
    }

    // Check for stored API key
    const storedApiKey = localStorage.getItem("elevenlabs_api_key");
    if (!storedApiKey && !envAgentId) {
      setShowApiKeyInput(true);
    }

    // Check for private agent setting
    const storedIsPrivate = localStorage.getItem("elevenlabs_is_private_agent");
    if (storedIsPrivate === "true") {
      setIsPrivateAgent(true);
    }
  }, []);

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

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!agentId) {
        setErrorMessage(
          "Agent ID is required. Please enter it in the settings below."
        );
        return;
      }

      // For private agents, get a signed URL
      if (isPrivateAgent) {
        try {
          const signedUrl = await getSignedUrl();
          await conversation.startSession({
            signedUrl,
            authorization:
              localStorage.getItem("elevenlabs_api_key") || undefined,
          });
        } catch (error) {
          return; // Error is already handled in getSignedUrl
        }
      } else {
        // For public agents, use the agent ID directly
        await conversation.startSession({
          agentId,
          authorization:
            localStorage.getItem("elevenlabs_api_key") || undefined,
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
  }, [conversation, agentId, isPrivateAgent]);

  const stopConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  }, [conversation]);

  const handleSaveApiKey = () => {
    if (!apiKeyInput.trim()) {
      setErrorMessage("Please enter a valid API key");
      return;
    }

    // Save the API key to localStorage only - we'll use it when starting the session
    localStorage.setItem("elevenlabs_api_key", apiKeyInput.trim());

    setShowApiKeyInput(false);
    setApiKeyInput("");
    setErrorMessage("");
  };

  const handleSaveAgentId = (id: string) => {
    if (id.trim()) {
      localStorage.setItem("elevenlabs_agent_id", id.trim());
      setAgentId(id.trim());
    }
  };

  const handleTogglePrivateAgent = (isPrivate: boolean) => {
    setIsPrivateAgent(isPrivate);
    localStorage.setItem(
      "elevenlabs_is_private_agent",
      isPrivate ? "true" : "false"
    );
  };

  return (
    <div className="voice-interaction flex flex-col items-center">
      {showApiKeyInput ? (
        <div className="api-key-form mb-6 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center max-w-md w-full">
          <h3 className="text-lg font-medium mb-3">
            ElevenLabs API Key Required
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Please enter your ElevenLabs API key to use the voice features.
          </p>
          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="Enter your API key"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md mb-3 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
          />
          <div className="mb-3">
            <input
              type="text"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              placeholder="Enter your Agent ID (required)"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="private-agent"
              checked={isPrivateAgent}
              onChange={(e) => setIsPrivateAgent(e.target.checked)}
              className="mr-2"
            />
            <label
              htmlFor="private-agent"
              className="text-sm text-slate-600 dark:text-slate-400"
            >
              This is a private agent (requires server-side API key)
            </label>
          </div>
          <button
            onClick={handleSaveApiKey}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Save Settings
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={
              conversation.status === "connected"
                ? stopConversation
                : startConversation
            }
            disabled={
              conversation.status === "connecting" || isGettingSignedUrl
            }
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
                </>
              )}
            </div>
          </button>

          <div className="mt-3 text-sm text-slate-600">
            Status: {conversation.status}
            {conversation.status === "connected" &&
              ` • ${conversation.isSpeaking ? "Speaking" : "Listening"}`}
          </div>

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

          {transcript && (
            <div className="transcript mt-6 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center max-w-md w-full">
              <p className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                You said:
              </p>
              <p className="italic text-slate-800 dark:text-slate-200 text-lg">
                {transcript}
              </p>
            </div>
          )}

          {/* Agent configuration */}
          <div className="agent-config mt-6 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center max-w-md w-full">
            <div className="flex flex-col space-y-4">
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1 text-left">
                  Agent ID{" "}
                  {process.env.NEXT_PUBLIC_AGENT_ID ? "(from .env.local)" : ""}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    placeholder="Enter Agent ID"
                    className="flex-grow px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm"
                    disabled={!!process.env.NEXT_PUBLIC_AGENT_ID}
                  />
                  <button
                    onClick={() => handleSaveAgentId(agentId)}
                    className={`px-3 py-1 ${
                      process.env.NEXT_PUBLIC_AGENT_ID
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600"
                    } text-white text-sm font-medium rounded-md transition-colors`}
                    disabled={!!process.env.NEXT_PUBLIC_AGENT_ID}
                  >
                    Save
                  </button>
                </div>
                {process.env.NEXT_PUBLIC_AGENT_ID && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 text-left">
                    Using agent ID from environment variables
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="settings-private-agent"
                  checked={isPrivateAgent}
                  onChange={(e) => handleTogglePrivateAgent(e.target.checked)}
                  className="mr-2"
                />
                <label
                  htmlFor="settings-private-agent"
                  className="text-sm text-slate-600 dark:text-slate-400 text-left"
                >
                  Private agent (requires server-side API key)
                </label>
              </div>

              <button
                onClick={() => setShowApiKeyInput(true)}
                className="mt-2 px-3 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-md transition-colors w-full"
              >
                Edit API Settings
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

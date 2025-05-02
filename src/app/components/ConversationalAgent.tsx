"use client";

import { useConversation } from "@11labs/react";
import { useCallback, useState, useEffect } from "react";

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
  language?: "english" | "spanish" | "mixed";
  showTranslation?: boolean;
  translationCountdown?: number;
  translationInProgress?: boolean;
  messageComplete?: boolean;
}

// Translation countdown component for better rendering performance
function TranslationCountdown({
  initialSeconds,
  onComplete,
  getText,
}: {
  initialSeconds: number;
  onComplete: () => void;
  getText: (seconds: number) => string;
}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const progressPercent = ((initialSeconds - seconds) / initialSeconds) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(onComplete, 100); // Give it a slight delay before completion
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

export default function ConversationalAgent({
  onConversationUpdate,
}: ConversationalAgentProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [agentId, setAgentId] = useState("");
  const [transcript, setTranscript] = useState("");
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

        // Detect language
        const language = detectLanguage(messageText);

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

  // Simple mock translation functions
  const mockTranslate = (text: string): string => {
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
  };

  // Simple mock translation from English to Spanish
  const mockTranslateToEnglish = (text: string): string => {
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
      // Add more common phrases as needed
    };

    // Simple word replacement
    let translated = text;
    Object.entries(translations).forEach(([spanish, english]) => {
      translated = translated.replace(new RegExp(spanish, "gi"), english);
    });

    return translated;
  };

  // Add a useEffect to handle translation timer for user messages
  useEffect(() => {
    // Nothing to do here - we now handle user message translations
    // in the same way as AI messages via the countdown system
  }, [transcript]);

  // Get a signed URL for private agents
  const getSignedUrl = useCallback(async (): Promise<string> => {
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
  }, [agentId]);

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
        } catch {
          return; // The error is already handled in getSignedUrl
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
  }, [agentId, messageHistory.length, isPrivateAgent, conversation, getSignedUrl]);

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

    // If it has both languages more or less equally, call it mixed
    if (spanishMatches > 0 && englishMatches > 0) {
      console.log("Detected as: mixed");
      return "mixed";
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

  // Handle isSpeaking changes to detect when messages are complete
  useEffect(() => {
    if (!conversation.isSpeaking) {
      // When AI stops speaking, mark the last AI message as complete
      setMessageHistory((prev) => {
        for (let i = prev.length - 1; i >= 0; i--) {
          if (!prev[i].isUser && !prev[i].messageComplete) {
            const updated = [...prev];
            updated[i] = { ...updated[i], messageComplete: true };
            return updated;
          }
        }
        return prev;
      });
    }
  }, [conversation.isSpeaking]);

  // Handle translation for completed messages
  useEffect(() => {
    // Nothing to do here - translation countdown is now handled by the TranslationCountdown component
  }, [messageHistory]);

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
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback, useEffect } from "react";
import { useElevenLabs } from "../context/ElevenLabsContext";

/**
 * Interface for vocabulary items in a lesson
 * @property {string} spanish - The Spanish word or term
 * @property {string} english - The English translation
 * @property {string} [pronunciation] - Optional pronunciation guide
 */
interface VocabularyItem {
  spanish: string;
  english: string;
  pronunciation?: string;
}

/**
 * Interface for common phrases in a lesson
 * @property {string} spanish - The Spanish phrase
 * @property {string} english - The English translation
 * @property {string} usage - Context or information about when to use the phrase
 */
interface Phrase {
  spanish: string;
  english: string;
  usage: string;
}

/**
 * Props for the LessonContent component
 * @property {string} [lessonTitle] - Title of the lesson
 * @property {string} [category] - Category the lesson belongs to
 * @property {string} [level] - Difficulty level of the lesson
 */
interface LessonContentProps {
  lessonTitle?: string;
  category?: string;
  level?: "beginner" | "intermediate" | "advanced";
}

/**
 * Component to display lesson content including vocabulary and phrases
 * Provides a tabbed interface to switch between different content types
 */
export default function LessonContent({
  lessonTitle = "Basic Greetings",
  category = "Conversation",
  level = "beginner",
}: LessonContentProps) {
  // State to track which tab is currently active
  const [activeTab, setActiveTab] = useState<"vocabulary" | "phrases">(
    "vocabulary"
  );

  // Get useMockApi from ElevenLabs context
  const { useMockApi } = useElevenLabs();

  // Mock vocabulary data for the lesson
  const vocabularyItems: VocabularyItem[] = [
    { spanish: "Hola", english: "Hello", pronunciation: "OH-lah" },
    {
      spanish: "Buenos días",
      english: "Good morning",
      pronunciation: "BWEH-nohs DEE-ahs",
    },
    {
      spanish: "Buenas tardes",
      english: "Good afternoon",
      pronunciation: "BWEH-nahs TAR-dehs",
    },
    {
      spanish: "Buenas noches",
      english: "Good evening/night",
      pronunciation: "BWEH-nahs NO-chehs",
    },
    { spanish: "Adiós", english: "Goodbye", pronunciation: "ah-DYOHS" },
    {
      spanish: "Hasta luego",
      english: "See you later",
      pronunciation: "AHS-tah LWEH-goh",
    },
  ];

  // Mock phrases data for the lesson
  const phrases: Phrase[] = [
    {
      spanish: "¿Cómo estás?",
      english: "How are you?",
      usage: "Informal greeting with friends and family",
    },
    {
      spanish: "¿Cómo está usted?",
      english: "How are you?",
      usage: "Formal greeting with strangers or elders",
    },
    {
      spanish: "Muy bien, gracias. ¿Y tú?",
      english: "Very well, thank you. And you?",
      usage: 'Common response to "¿Cómo estás?"',
    },
    {
      spanish: "Encantado/a de conocerte",
      english: "Pleased to meet you",
      usage: "When meeting someone for the first time",
    },
  ];

  /**
   * Get appropriate CSS classes for the level badge based on difficulty
   * @param {string} level - The difficulty level
   * @returns {string} CSS classes for styling the badge
   */
  const getLevelBadgeColor = (level: string): string => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  /**
   * Speaks text using browser's built-in speech synthesis
   * Used for demo mode to pronounce Spanish words and phrases
   *
   * @param {string} text - Text to be spoken
   */
  const speakWithSynthesis = useCallback((text: string) => {
    // Check if speech synthesis is available
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis not supported in this browser");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Configure voice settings for Spanish
    utterance.lang = "es-ES";
    utterance.rate = 0.8; // Slightly slower for learning purposes
    utterance.pitch = 1;

    // Get Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find((voice) => voice.lang.includes("es"));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    // Set event handlers
    utterance.onstart = () => {
      console.log("Speech synthesis started for:", text);
    };

    utterance.onend = () => {
      console.log("Speech synthesis ended");
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
    };

    // Speak the text
    window.speechSynthesis.speak(utterance);
  }, []);

  /**
   * Handles the play pronunciation button click
   * In demo mode, uses browser speech synthesis
   * In live mode, would connect to ElevenLabs API (not implemented)
   *
   * @param {string} text - Spanish text to pronounce
   */
  const handlePlayPronunciation = useCallback(
    (text: string) => {
      if (useMockApi) {
        // In demo mode, use browser's speech synthesis
        speakWithSynthesis(text);
      } else {
        // In live mode, you would connect to ElevenLabs or another TTS service
        // For now, just show an alert
        alert(`TODO: Use ElevenLabs API to play pronunciation for "${text}"`);
      }
    },
    [useMockApi, speakWithSynthesis]
  );

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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 w-full max-w-3xl mx-auto border border-slate-200 dark:border-slate-700">
      {/* Lesson Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {lessonTitle}
          </h2>
          <div className="flex gap-2 mt-3">
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-xs px-3 py-1 rounded-full font-medium">
              {category}
            </span>
            <span
              className={`${getLevelBadgeColor(
                level
              )} text-xs px-3 py-1 rounded-full font-medium`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 text-amber-500 dark:text-amber-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex space-x-8 -mb-px">
            <button
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "vocabulary"
                  ? "border-amber-500 text-amber-600 dark:text-amber-500"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
              onClick={() => setActiveTab("vocabulary")}
            >
              Vocabulary
            </button>
            <button
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "phrases"
                  ? "border-amber-500 text-amber-600 dark:text-amber-500"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
              onClick={() => setActiveTab("phrases")}
            >
              Phrases
            </button>
          </nav>
        </div>
      </div>

      {/* Lesson Content Area */}
      <div className="lesson-content">
        {/* Vocabulary Tab Content */}
        {activeTab === "vocabulary" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Essential Vocabulary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vocabularyItems.map((item, index) => (
                <div
                  key={index}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-xl text-slate-900 dark:text-white">
                        {item.spanish}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300">
                        {item.english}
                      </p>
                    </div>
                    <button
                      className="text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 p-2 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                      aria-label="Play pronunciation"
                      onClick={() => handlePlayPronunciation(item.spanish)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  {item.pronunciation && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 pl-2 border-l-2 border-amber-200 dark:border-amber-900/50">
                      Pronunciation:{" "}
                      <span className="font-medium">{item.pronunciation}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phrases Tab Content */}
        {activeTab === "phrases" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Common Phrases
            </h3>
            <div className="space-y-4">
              {phrases.map((phrase, index) => (
                <div
                  key={index}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-xl text-slate-900 dark:text-white">
                        {phrase.spanish}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300">
                        {phrase.english}
                      </p>
                    </div>
                    <button
                      className="text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 p-2 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                      aria-label="Play pronunciation"
                      onClick={() => handlePlayPronunciation(phrase.spanish)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 pl-3 border-l-2 border-amber-200 dark:border-amber-900/50">
                    <span className="font-medium">Usage:</span> {phrase.usage}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

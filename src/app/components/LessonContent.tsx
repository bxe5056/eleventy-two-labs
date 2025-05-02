"use client";

import { useState } from "react";

interface VocabularyItem {
  spanish: string;
  english: string;
  pronunciation?: string;
}

interface Phrase {
  spanish: string;
  english: string;
  usage: string;
}

interface LessonContentProps {
  lessonTitle?: string;
  category?: string;
  level?: "beginner" | "intermediate" | "advanced";
}

export default function LessonContent({
  lessonTitle = "Basic Greetings",
  category = "Conversation",
  level = "beginner",
}: LessonContentProps) {
  const [activeTab, setActiveTab] = useState<"vocabulary" | "phrases">(
    "vocabulary"
  );

  // Mock vocabulary data
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

  // Mock phrases data
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

  const getLevelBadgeColor = (level: string) => {
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

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 w-full max-w-3xl mx-auto border border-slate-200 dark:border-slate-700">
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

      <div className="lesson-content">
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
                      onClick={() =>
                        alert(`TODO: Play pronunciation for "${item.spanish}"`)
                      }
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
                      onClick={() =>
                        alert(
                          `TODO: Play pronunciation for "${phrase.spanish}"`
                        )
                      }
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
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 pl-2 border-l-2 border-amber-200 dark:border-amber-900/50">
                    Usage: <span className="font-medium">{phrase.usage}</span>
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

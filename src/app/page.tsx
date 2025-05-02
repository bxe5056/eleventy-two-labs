"use client";

import React, {JSX} from "react";
import ConversationalAgent from "./components/ConversationalAgent";
import Link from "next/link";

/**
 * Interface for lesson card data
 * @property {string} id - Unique identifier for the lesson
 * @property {string} title - Title of the lesson
 * @property {string} category - Category the lesson belongs to
 * @property {"beginner" | "intermediate" | "advanced"} level - Difficulty level
 * @property {string} description - Brief description of the lesson
 */
interface LessonCard {
  id: string;
  title: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
}

/**
 * Home page component for the SpanishVoice application
 * Contains hero section, conversation agent, and lesson cards
 *
 * @returns {JSX.Element} Rendered page component
 */
export default function Home(): JSX.Element {
  // Mock lessons data - shared with lessons page
  const lessons: LessonCard[] = [
    {
      id: "basic-greetings",
      title: "Basic Greetings",
      category: "Conversation",
      level: "beginner",
      description: "Learn essential Spanish greetings for everyday situations.",
    },
    {
      id: "ordering-food",
      title: "Ordering Food",
      category: "Practical",
      level: "beginner",
      description:
        "Master the vocabulary and phrases needed to order food in Spanish.",
    },
    {
      id: "asking-directions",
      title: "Asking for Directions",
      category: "Travel",
      level: "beginner",
      description: "Learn how to ask for and understand directions in Spanish.",
    },
    {
      id: "describing-people",
      title: "Describing People",
      category: "Vocabulary",
      level: "intermediate",
      description:
        "Build vocabulary to describe people's appearance and personality.",
    },
    {
      id: "past-tense",
      title: "Past Tense Conversations",
      category: "Grammar",
      level: "intermediate",
      description: "Practice using past tense in natural conversations.",
    },
    {
      id: "subjunctive-mood",
      title: "Subjunctive Mood",
      category: "Grammar",
      level: "advanced",
      description: "Master the complex subjunctive mood in Spanish.",
    },
  ];

  /**
   * Get CSS classes for level badge based on difficulty
   * @param {string} level - The difficulty level
   * @returns {string} CSS classes for styling
   */
  const getLevelColor = (level: string) => {
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
   * Get CSS classes for category badge based on lesson type
   * @param {string} category - The lesson category
   * @returns {string} CSS classes for styling
   */
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Conversation":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Grammar":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "Vocabulary":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
      case "Practical":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "Travel":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  return (
    <div
      id="top"
      className="bg-gradient-to-b from-white to-amber-50 dark:from-slate-900 dark:to-slate-800"
    >
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-500 to-red-600 bg-clip-text text-transparent leading-tight">
            &iexcl;Hola! Welcome to SpanishVoice
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
            Learn Spanish through natural conversation with our voice-first
            approach
          </p>

          <div className="flex flex-col items-center mb-16">
            <ConversationalAgent />
            <p className="mt-6 text-slate-600 dark:text-slate-400">
              Click the button and speak to begin your Spanish journey
            </p>
          </div>
        </div>
      </section>

      {/* Lessons Section */}
      <section
        id="lessons-section"
        className="py-16 px-4 md:px-8 bg-slate-50 dark:bg-slate-900/80"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-500 to-red-600 bg-clip-text text-transparent">
              Spanish Lessons
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
              Choose from our collection of voice-first Spanish lessons designed
              to help you learn through natural conversation
            </p>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className="group cursor-pointer text-left"
              >
                <div className="h-full bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col border border-slate-200 dark:border-slate-700">
                  {/* Accent bar */}
                  <div className="h-3 bg-gradient-to-r from-amber-500 to-red-500"></div>

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Category and level badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span
                        className={`${getCategoryColor(
                          lesson.category
                        )} text-xs px-2 py-1 rounded-full font-medium`}
                      >
                        {lesson.category}
                      </span>
                      <span
                        className={`${getLevelColor(
                          lesson.level
                        )} text-xs px-2 py-1 rounded-full font-medium`}
                      >
                        {lesson.level.charAt(0).toUpperCase() +
                          lesson.level.slice(1)}
                      </span>
                    </div>

                    {/* Lesson title */}
                    <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                      {lesson.title}
                    </h2>

                    {/* Lesson description */}
                    <p className="text-slate-600 dark:text-slate-300 text-sm flex-1 mb-6">
                      {lesson.description}
                    </p>

                    {/* Card footer */}
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-500 group-hover:text-amber-700 dark:group-hover:text-amber-400 flex items-center gap-1">
                        Start Lesson
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </span>

                      <span className="text-sm flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                        <span>10&ndash;15 min</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 bg-white dark:bg-slate-800 shadow-inner">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Why Learn with SpanishVoice?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-700/50 hover:shadow-xl transition">
              <div className="bg-amber-100 dark:bg-amber-900/20 w-16 h-16 rounded-lg mb-6 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-amber-600 dark:text-amber-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Conversation Practice
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Engage in natural Spanish conversations on everyday topics to
                build your confidence
              </p>
            </div>

            <div className="card p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-700/50 hover:shadow-xl transition">
              <div className="bg-red-100 dark:bg-red-900/20 w-16 h-16 rounded-lg mb-6 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Pronunciation Feedback
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Get real-time guidance on your Spanish pronunciation with
                instant corrections
              </p>
            </div>

            <div className="card p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md bg-white dark:bg-slate-700/50 hover:shadow-xl transition">
              <div className="bg-indigo-100 dark:bg-indigo-900/20 w-16 h-16 rounded-lg mb-6 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-indigo-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Adaptive Learning</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Lessons that adjust to your proficiency level as you improve,
                focusing on what you need most
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 md:px-8 bg-amber-50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-center">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="bg-white dark:bg-slate-700 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                  <span className="text-2xl font-bold bg-gradient-to-br from-amber-500 to-red-500 bg-clip-text text-transparent">
                    1
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose a Lesson</h3>
              <p className="text-slate-600 dark:text-slate-300 max-w-xs">
                Browse our collection of Spanish lessons and select one that
                interests you
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="bg-white dark:bg-slate-700 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                  <span className="text-2xl font-bold bg-gradient-to-br from-amber-500 to-red-500 bg-clip-text text-transparent">
                    2
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Practice by Speaking
              </h3>
              <p className="text-slate-600 dark:text-slate-300 max-w-xs">
                Engage in a natural conversation with our voice assistant to
                practice what you&apos;ve learned
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-white dark:bg-slate-700 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold bg-gradient-to-br from-amber-500 to-red-500 bg-clip-text text-transparent">
                  3
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Learn & Improve</h3>
              <p className="text-slate-600 dark:text-slate-300 max-w-xs">
                Get personalized feedback and track your progress as you build
                your Spanish skills
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

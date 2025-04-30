"use client";

import React from "react";
import Link from "next/link";

interface LessonCard {
  id: string;
  title: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
}

export default function LessonsPage() {
  // Mock lessons data
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

  const getCategoryColor = (category: string) => {
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
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-20">
      <div className="bg-gradient-to-r from-amber-500 to-red-500 py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Spanish Lessons
          </h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Choose from our collection of voice-first Spanish lessons designed
            to help you learn through natural conversation
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <Link
              href={`/lessons/${lesson.id}`}
              key={lesson.id}
              className="group"
            >
              <div className="h-full bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col border border-slate-200 dark:border-slate-700">
                <div className="h-3 bg-gradient-to-r from-amber-500 to-red-500"></div>
                <div className="p-6 flex-1 flex flex-col">
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

                  <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                    {lesson.title}
                  </h2>

                  <p className="text-slate-600 dark:text-slate-300 text-sm flex-1 mb-6">
                    {lesson.description}
                  </p>

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
                      <span>10-15 min</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

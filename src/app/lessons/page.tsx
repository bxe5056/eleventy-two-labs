"use client";

import React from "react";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
}

// Mock lessons data - same as the home page
const lessons: Lesson[] = [
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

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Conversation":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "Practical":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "Travel":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    case "Vocabulary":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400";
    case "Grammar":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    default:
      return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300";
  }
};

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

export default function LessonsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-gradient-to-r from-amber-500 to-red-500 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Spanish Lessons
          </h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Choose from our collection of voice-first Spanish lessons designed
            to help you learn through natural conversation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/lessons/${lesson.id}`}
              className="group cursor-pointer text-left"
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

                  <p className="text-slate-600 dark:text-slate-300 text-sm flex-1">
                    {lesson.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

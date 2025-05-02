"use client";

import React, { use } from "react";
import Link from "next/link";
import ConversationalAgent from "@/app/components/ConversationalAgent";
import LessonContent from "@/app/components/LessonContent";
import {Lesson} from "@/app/lessons/page";

interface LessonPageProps {
  params: Promise<{
    id: string;
  }>;
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

export default function LessonPage({ params }: LessonPageProps) {
  // Unwrap the params Promise using React.use()
  // React.use() can be used to handle promises directly within a component.
  // When a promise is passed to use(), React will suspend the component's
  // rendering until the promise resolves. Once the promise resolves,
  // the component will resume rendering with the resolved value.
  const resolvedParams = use(params);
  const lesson = lessons.find((l) => l.id === resolvedParams.id);

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-slate-50 dark:bg-slate-900">
        <div className="w-full max-w-md text-center p-8 bg-white dark:bg-slate-800 shadow-lg rounded-xl border border-slate-200 dark:border-slate-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
            Lesson Not Found
          </h1>
          <p className="mb-8 text-slate-600 dark:text-slate-300">
            We couldn&#39;t find the lesson you&#39;re looking for.
          </p>
          <Link
            href="/#lessons-section"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-red-500 text-white rounded-full hover:shadow-lg transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
            Back to All Lessons
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-20">
      <div className="bg-gradient-to-r from-amber-500 to-red-500 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/#lessons-section"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to All Lessons
          </Link>

          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            {lesson.title}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl">
            {lesson.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <LessonContent
              lessonTitle={lesson.title}
              category={lesson.category}
              level={lesson.level}
            />
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-amber-500 dark:text-amber-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Practice Speaking
                </h2>
              </div>
              <ConversationalAgent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

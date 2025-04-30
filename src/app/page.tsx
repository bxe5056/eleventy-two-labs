"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import VoiceInteraction from "./components/VoiceInteraction";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white to-amber-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-500 to-red-600 bg-clip-text text-transparent leading-tight">
            ¡Hola! Welcome to SpanishVoice
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
            Learn Spanish through natural conversation with our voice-first
            approach
          </p>

          <div className="flex flex-col items-center mb-16">
            <VoiceInteraction />
            <p className="mt-6 text-slate-600 dark:text-slate-400">
              Click the button and speak to begin your Spanish journey
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              href="/lessons"
              className="btn btn-primary text-base rounded-full px-8 py-3 flex items-center gap-2 group"
            >
              Browse All Lessons
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
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
                <div
                  className="absolute top-1/2 left-full h-0.5 w-full bg-amber-300 dark:bg-amber-900/50 hidden md:block"
                  aria-hidden="true"
                ></div>
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
                <div
                  className="absolute top-1/2 left-full h-0.5 w-full bg-amber-300 dark:bg-amber-900/50 hidden md:block"
                  aria-hidden="true"
                ></div>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Practice by Speaking
              </h3>
              <p className="text-slate-600 dark:text-slate-300 max-w-xs">
                Engage in a natural conversation with our voice assistant to
                practice what you've learned
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

"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import React, { useEffect } from "react";
import { ElevenLabsProvider, useElevenLabs } from "./context/ElevenLabsContext";
import { setMockMode } from "./utils/elevenlabs";
import "./globals.css";

// Configure Next.js Inter font with a Latin subset
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Toggle component for switching between live API and demo mode
 * Uses the ElevenLabs context to manage state
 */
function MockModeToggle() {
  const { useMockApi, toggleMockApi } = useElevenLabs();

  // Update the elevenlabs utility when the context changes
  useEffect(() => {
    setMockMode(useMockApi);
  }, [useMockApi]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-300">
        {useMockApi ? "Demo Mode" : "Live API"}
      </span>
      <button
        onClick={toggleMockApi}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
          useMockApi ? "bg-amber-600" : "bg-slate-600"
        }`}
        role="switch"
        aria-checked={useMockApi}
      >
        <span className="sr-only">
          {useMockApi ? "Disable Demo Mode" : "Enable Demo Mode"}
        </span>
        <span
          className={`${
            useMockApi ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </button>
    </div>
  );
}

/**
 * Main application layout component
 * Contains the header, main content area, and footer
 */
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-slate-800/90 backdrop-blur-md shadow-sm border-b border-slate-700 py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <Link
                href="/"
                className="font-bold text-2xl bg-gradient-to-r from-amber-500 to-red-600 bg-clip-text text-transparent"
              >
                SpanishVoice
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  href="/"
                  className="text-slate-200 hover:text-indigo-400 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/#lessons-section"
                  className="text-slate-200 hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Lessons
                </Link>
                <MockModeToggle />
                <Link href="/#top" className="btn btn-primary rounded-full">
                  Start Speaking
                </Link>
              </nav>

              {/* Mobile Menu Button */}
              <button className="md:hidden text-slate-200 hover:bg-slate-700/50 p-2 rounded-lg transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-grow">{children}</main>

          {/* Footer */}
          <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                  <h3 className="font-bold text-xl mb-4 bg-gradient-to-r from-amber-500 to-red-600 bg-clip-text text-transparent">
                    SpanishVoice
                  </h3>
                  <p className="text-slate-600 mb-4 max-w-md">
                    A voice-first Spanish learning application designed to help
                    you learn through natural conversation.
                  </p>
                  <p className="text-slate-500 text-sm">
                    Powered by ElevenLabs Conversational AI
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-slate-900">
                    Quick Links
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/"
                        className="text-slate-600 hover:text-amber-600 transition-colors"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/#lessons-section"
                        className="text-slate-600 hover:text-amber-600 transition-colors cursor-pointer"
                      >
                        Lessons
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-slate-900">Contact</h4>
                  <p className="text-slate-600">
                    For inquiries or support, please contact us at:
                  </p>
                  <a
                    href="mailto:spanishvoice@bentheitguy.me"
                    className="text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    spanishvoice@bentheitguy.me
                  </a>
                </div>
              </div>
              <div className="border-t border-slate-200 mt-8 pt-8 text-center">
                <p className="text-slate-500 text-sm">
                  © {new Date().getFullYear()}{" "}
                  <a
                    href="https://bentheitguy.me"
                    className="text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    BenTheITGuy
                  </a>
                  . All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

/**
 * Root layout component that wraps the application with the ElevenLabs provider
 * This is the main entry point for the application
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ElevenLabsProvider>
      <AppLayout>{children}</AppLayout>
    </ElevenLabsProvider>
  );
}

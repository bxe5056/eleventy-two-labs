"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-10 bg-slate-800/90 backdrop-blur-md shadow-sm border-b border-slate-700 py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <Link
                href="/"
                className="font-bold text-2xl bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"
              >
                SpanishVoice
              </Link>
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
                <Link href="/#top" className="btn btn-primary rounded-full">
                  Start Speaking
                </Link>
              </nav>
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
          <main className="flex-grow">{children}</main>
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

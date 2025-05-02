"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * Type definition for the ElevenLabs context
 * @property {boolean} useMockApi - Flag indicating if the application should use mock data instead of real API calls
 * @property {() => void} toggleMockApi - Function to toggle between mock and real API modes
 */
type ElevenLabsContextType = {
  useMockApi: boolean;
  toggleMockApi: () => void;
};

// Create context with undefined as the default value
const ElevenLabsContext = createContext<ElevenLabsContextType | undefined>(
  undefined
);

/**
 * Provider component for ElevenLabs context
 * Manages the mock/real API mode state and persists it to localStorage
 */
export function ElevenLabsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // State to track if we should use mock API responses instead of real API calls
  const [useMockApi, setUseMockApi] = useState(true);

  // Initialize state on component mount - force demo mode by default
  useEffect(() => {
    // Clear any previously stored value to ensure we start in demo mode
    localStorage.removeItem("elevenlabs-mock-mode");
    console.log("ElevenLabs context initialized in demo mode");

    // Then set it explicitly to true
    localStorage.setItem("elevenlabs-mock-mode", "true");
    setUseMockApi(true);
  }, []);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    console.log("Mock mode toggled:", useMockApi ? "Demo Mode" : "Live API");
    localStorage.setItem("elevenlabs-mock-mode", useMockApi.toString());
  }, [useMockApi]);

  /**
   * Toggle between mock API and real API modes
   */
  const toggleMockApi = () => {
    setUseMockApi((prev) => !prev);
  };

  return (
    <ElevenLabsContext.Provider value={{ useMockApi, toggleMockApi }}>
      {children}
    </ElevenLabsContext.Provider>
  );
}

/**
 * Custom hook to use the ElevenLabs context
 * @returns {ElevenLabsContextType} The ElevenLabs context values
 * @throws {Error} If used outside of ElevenLabsProvider
 */
export function useElevenLabs(): ElevenLabsContextType {
  const context = useContext(ElevenLabsContext);
  if (context === undefined) {
    throw new Error("useElevenLabs must be used within an ElevenLabsProvider");
  }
  return context;
}

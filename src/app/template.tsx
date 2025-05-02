// This is a Server Component that can export metadata
import React from "react";
import { metadata } from "./metadata";

export { metadata };

export default function Template({ children }: { children: React.ReactNode }) {
  return children;
}

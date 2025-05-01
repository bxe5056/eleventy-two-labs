// This is a Server Component that can export metadata
import { metadata } from "./metadata";

export { metadata };

export default function Template({ children }: { children: React.ReactNode }) {
  return children;
}

/// <reference types="astro/client" />

// PostHog is attached to window by the snippet in Base.astro (production only),
// so it's optional everywhere it's used.
interface Window {
  posthog?: {
    capture: (event: string, properties?: Record<string, unknown>) => void;
  };
}

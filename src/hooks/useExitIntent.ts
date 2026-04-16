"use client";

import { useEffect, useState, useCallback } from "react";

interface UseExitIntentOptions {
  threshold?: number; // Pixels from top to trigger
  delay?: number; // Delay before allowing trigger (ms)
  cookieDays?: number; // Days to remember dismissal
}

export function useExitIntent(options: UseExitIntentOptions = {}) {
  const { threshold = 50, delay = 1000, cookieDays = 30 } = options;

  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const dismiss = useCallback(() => {
    setShowExitIntent(false);
    setHasTriggered(true);

    // Set cookie to remember dismissal
    const expires = new Date();
    expires.setDate(expires.getDate() + cookieDays);
    document.cookie = `exitIntentDismissed=true; expires=${expires.toUTCString()}; path=/`;
  }, [cookieDays]);

  useEffect(() => {
    // Check if already dismissed via cookie
    if (document.cookie.includes("exitIntentDismissed=true")) {
      setHasTriggered(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves through the top
      if (e.clientY <= threshold && !hasTriggered) {
        setShowExitIntent(true);
        setHasTriggered(true);
      }
    };

    // Delay before enabling exit intent
    const timeoutId = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [threshold, delay, hasTriggered]);

  return { showExitIntent, dismiss };
}

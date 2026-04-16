"use client";

import { WelcomeMat } from "./WelcomeMat";
import { useExitIntent } from "@/hooks/useExitIntent";

export function ExitIntent() {
  const { showExitIntent, dismiss } = useExitIntent({
    threshold: 50,
    delay: 5000, // Wait 5 seconds before enabling
    cookieDays: 30,
  });

  return (
    <WelcomeMat
      isOpen={showExitIntent}
      onClose={dismiss}
    />
  );
}

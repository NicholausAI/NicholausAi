import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Space_Grotesk, JetBrains_Mono, Oswald, Syne, League_Spartan } from "next/font/google";
// Temporarily disabled - causing errors
// import { StickyBar, ExitIntent } from "@/components/email";
import "./globals.css";
import { ExitIntentAudit } from "@/components/email/ExitIntentAudit";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Nicholaus.ai | AI Systems & Automation",
    template: "%s | Nicholaus.ai",
  },
  description:
    "AI agents, automation systems, and growth strategies for service businesses. Save 20+ hours a week with systems that actually work.",
  keywords: [
    "AI agents",
    "AI automation",
    "service business automation",
    "Google Ads automation",
    "lead generation",
    "AI systems",
    "business automation",
    "AI engineering",
    "Nicholaus",
    "agent engineering",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Nicholaus.ai | AI Systems & Automation",
    description:
      "AI agents, automation systems, and growth strategies for service businesses. Save 20+ hours a week with systems that actually work.",
    type: "website",
    locale: "en_US",
    siteName: "Nicholaus.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicholaus.ai | AI Systems & Automation",
    description:
      "AI agents, automation systems, and growth strategies for service businesses. Save 20+ hours a week with systems that actually work.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${syne.variable} ${leagueSpartan.variable} ${oswald.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
        <ExitIntentAudit />
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={`${process.env.NEXT_PUBLIC_UMAMI_URL || "https://cloud.umami.is"}/script.js`}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}

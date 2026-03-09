import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const AIAssistant = dynamic(() => import("@/components/AIAssistant"), { ssr: false });

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const GlobalClickAnimator = dynamic(() => import("@/components/GlobalClickAnimator"), { ssr: false });

export const metadata: Metadata = {
  title: "Smart Career Path | AI-Powered Career Recommendation",
  description:
    "Discover your ideal career path with AI. For students and career changers—academics, interests, and aspirations in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-slate-50 text-slate-900">
        <GlobalClickAnimator />
        {children}
        <AIAssistant />
      </body>
    </html>
  );
}

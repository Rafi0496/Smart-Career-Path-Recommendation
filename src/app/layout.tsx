import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const AIAssistant = dynamic(() => import("@/components/AIAssistant"), { ssr: false });
const GlobalClickAnimator = dynamic(() => import("@/components/GlobalClickAnimator"), { ssr: false });
const LoginAcknowledgement = dynamic(() => import("@/components/LoginAcknowledgement"), { ssr: false });

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

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
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('career_path_theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <GlobalClickAnimator />
        <LoginAcknowledgement />
        {children}
        <AIAssistant />
      </body>
    </html>
  );
}

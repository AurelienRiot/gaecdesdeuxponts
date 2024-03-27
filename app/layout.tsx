import type { Metadata } from "next";
import {
  Roboto_Mono as FontMono,
  Playfair_Display as FontDisplay,
  Playfair as FontSerif,
  Inter as FontSans,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProviders } from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "GAEC des Deux Ponts",
  description: "GAEC des Deux Ponts",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});
const fontDisplay = FontDisplay({
  subsets: ["latin"],
  variable: "--font-display",
});

const fontSerif = FontSerif({
  subsets: ["latin"],
  variable: "--font-serif",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={cn(
          "  min-h-dvh bg-background font-serif antialiased",
          fontMono.variable,
          fontDisplay.variable,
          fontSerif.variable,
          fontSans.variable,
        )}
      >
        <AuthProviders>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <TooltipProvider delayDuration={100} skipDelayDuration={0}>
              {children}
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </AuthProviders>
      </body>
    </html>
  );
}

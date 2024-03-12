import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProviders } from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "GAEC des Deux Ponts",
  description: "GAEC des Deux Ponts",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
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
          "   min-h-dvh bg-background font-sans antialiased",
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

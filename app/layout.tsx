import type { Metadata } from "next";
import {
  Roboto_Mono as FontMono,
  Playfair_Display as FontDisplay,
  EB_Garamond as FontSerif,
  Inter as FontSans,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProviders } from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ProductsProvider } from "@/context/products-context";
import { CSPostHogProvider } from "@/lib/analytics/provider";

export const metadata: Metadata = {
  title: "Laiterie du Pont Robert",
  description: "Laiterie du Pont Robert",
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
        id="root"
        className={cn(
          "  relative min-h-dvh bg-background font-serif antialiased ",
          fontMono.variable,
          fontDisplay.variable,
          fontSerif.variable,
          fontSans.variable,
        )}
      >
        <AuthProviders>
          <CSPostHogProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <TooltipProvider delayDuration={100} skipDelayDuration={0}>
                <ProductsProvider isPro={false}>
                  <DebugScreens />
                  {children}
                </ProductsProvider>
              </TooltipProvider>
              <Toaster />
            </ThemeProvider>{" "}
          </CSPostHogProvider>
        </AuthProviders>
      </body>
    </html>
  );
}

const DebugScreens = () => {
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="fixed bottom-0 left-0 z-50 bg-foreground p-2 text-background">
        <ul className="text-xs font-semibold">
          <li className="block xs:hidden">{" < 400px"}</li>
          <li className="hidden xs:block sm:hidden">{"xs > 400px "}</li>
          <li className="hidden sm:block md:hidden">{"sm > 640px "}</li>
          <li className="hidden md:block lg:hidden">{"md > 768px "}</li>
          <li className="hidden lg:block xl:hidden">{"lg > 1024x "}</li>
          <li className="hidden xl:block 2xl:hidden">{"xl > 1220px"}</li>
          <li className="hidden 2xl:block 3xl:hidden">{"2xl > 1440px"}</li>
          <li className="hidden 3xl:block">{"3xl > 1700px"}</li>
        </ul>
      </div>
    );
  }

  return null;
};

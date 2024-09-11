import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CSPostHogProvider } from "@/providers/posthog-provider";
import { cn } from "@/lib/utils";
import { AuthProviders } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import ConfirmDialogProvider from "@/providers/confirm-dialog-provider";
import type { Metadata } from "next";
import {
  Playfair_Display as FontDisplay,
  Roboto_Mono as FontMono,
  Inter as FontSans,
  EB_Garamond as FontSerif,
} from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.laiteriedupontrobert.fr"),
  keywords: [
    "Lait cru Massérac",
    "Lait cru Avessac",
    "Lait bio Massérac",
    "Vente directe lait cru local",
    "Ferme Massérac",
    "Lait bio Loire-Atlantique",
    "Lait cru Loire-Atlantique",
  ],
  title: {
    default: "Laiterie du Pont Robert",
    template: `%s | Laiterie du Pont Robert`,
  },
  description:
    "Venez chercher votre lait cru, frais et bio directement dans notre ferme à Massérac, aux heures de la traite 8h30-9h30/18h-19h du lundi au samedi",
  openGraph: {
    images: [
      "https://www.laiteriedupontrobert.fr/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fferme.77874bf1.webp&w=3840&q=75",
      "https://www.laiteriedupontrobert.fr/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fposter.d2c91e30.webp&w=3840&q=75",
    ],
  },
  manifest: "/manifest.json",
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
    <html lang="fr" className="scroll-p-16 scroll-smooth" suppressHydrationWarning>
      <body
        id="root"
        className={cn(
          "relative min-h-dvh bg-background font-serif text-foreground antialiased",
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
                <ConfirmDialogProvider>
                  <Toaster />
                  <DebugScreens />
                  {children}
                </ConfirmDialogProvider>
              </TooltipProvider>
            </ThemeProvider>
          </CSPostHogProvider>
        </AuthProviders>
      </body>
    </html>
  );
}

const DebugScreens = () => {
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="fixed bottom-0 left-0 z-[1200] bg-foreground p-2 text-background">
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

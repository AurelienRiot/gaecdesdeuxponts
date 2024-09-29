"use client";
import { useSession } from "next-auth/react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_URL.startsWith("https://www.laiteriedupontrobert.fr")) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: "/ingest",
    ui_host: "https://eu.i.posthog.com",
  });
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_URL.startsWith("https://www.laiteriedupontrobert.fr")) {
    return <>{children}</>;
  }

  return (
    <PostHogProvider client={posthog}>
      <PostHogWrapper>{children}</PostHogWrapper>
    </PostHogProvider>
  );
}

function PostHogWrapper({ children }: { children: React.ReactNode }) {
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      if (session.data.user.role === "admin" || session.data.user.role === "readOnlyAdmin") {
        posthog.opt_out_capturing();
        return;
      }
      posthog.identify(session.data.user?.id, {
        name: session.data.user?.name,
        email: session.data.user?.email,
      });
    } else if (session.status === "unauthenticated") {
      posthog.reset();
    }
  }, [session]);

  return children;
}

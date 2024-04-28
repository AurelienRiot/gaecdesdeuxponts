// app/providers.js
"use client";
import { useSession } from "next-auth/react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "development") {
    console.log("No PostHogProvider");
    return <>{children}</>;
  }
  if (typeof window !== "undefined") {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      // api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
      api_host: "/ingest",
      ui_host: "https://eu.i.posthog.com",
    });
  }
  console.log("PostHogProvider");
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

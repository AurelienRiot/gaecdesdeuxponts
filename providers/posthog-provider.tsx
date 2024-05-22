"use client";
import { useSession } from "next-auth/react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

if (typeof window !== "undefined" && process.env.NODE_ENV !== "development") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://eu.i.posthog.com",
  });
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "development") {
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
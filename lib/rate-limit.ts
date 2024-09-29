import { headers } from "next/headers";

const idToRequestCount = new Map<string, number>(); // keeps track of individual users
const rateLimiter = {
  windowStart: Date.now(),
  windowSize: 2 * 60 * 1000, // Milliseconds (2 minute)
  maxRequests: 10,
};

export const rateLimit = async (role?: string | null) => {
  const ip = headers().get("x-forwarded-for") ?? headers().get("remote-addr") ?? "unknown";
  if (role === "admin" || role === "readOnlyAdmin") {
    return false;
  }

  // Check and update current window
  const now = Date.now();
  const isNewWindow = now - rateLimiter.windowStart > rateLimiter.windowSize;
  if (isNewWindow) {
    rateLimiter.windowStart = now;
    idToRequestCount.set(ip, 1);
    return false;
  }

  // Check and update current request limits
  const currentRequestCount = idToRequestCount.get(ip) ?? 0;
  console.log(currentRequestCount, rateLimiter.maxRequests);
  if (currentRequestCount >= rateLimiter.maxRequests) return true;
  idToRequestCount.set(ip, currentRequestCount + 1);

  return false;
};

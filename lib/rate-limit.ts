import { decode } from "next-auth/jwt";
import { cookies, headers } from "next/headers";

const secret = process.env.NEXTAUTH_SECRET;
const idToRequestCount = new Map<string, number>(); // keeps track of individual users
const rateLimiter = {
  windowStart: Date.now(),
  windowSize: 2 * 60 * 1000, // Milliseconds (2 minute)
  maxRequests: 5,
};

export const rateLimit = async () => {
  const ip = headers().get("x-forwarded-for") ?? headers().get("remote-addr") ?? "unknown";
  const tokenEncoded = cookies().get("__Secure-next-auth.session-token")?.value;
  try {
    if (tokenEncoded) {
      const token = await decode({ token: tokenEncoded, secret });
      if (token?.role === "admin" || token?.role === "readOnlyAdmin") {
        return false;
      }
    }
  } catch (error) {}

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

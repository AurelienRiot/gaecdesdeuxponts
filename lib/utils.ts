import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Address } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function numberFormat2Decimals(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export const currencyFormatter = (() => {
  const formatFunction = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "symbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format;

  return {
    format: (value: number) => formatFunction(value).replace(/\s/g, ""),
  };
})();

export function roundToDecimals(number: number, decimals: number) {
  return Math.round(number * 10 ** decimals) / 10 ** decimals;
}

export function getPercentage(tax: number) {
  return `${(tax * 100) % 100}%`;
}

export const addressFormatter = (
  address: { line1?: string | null; postalCode?: string | null; city?: string | null; country?: string | null } | null,
  full = true,
) => {
  if (!address || !address.line1) {
    return "";
  }
  if (full) {
    return `${address.line1}, ${address.postalCode}, ${address.city}, ${address.country}`;
  }
  return `${address.line1}, ${address.postalCode}, ${address.city}`;
};

export function addDelay(ms: number, signal?: AbortSignal) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(resolve, ms);
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        reject(new DOMException("Aborted", "AbortError"));
      });
    }
  });
}

export const checkIfUrlAccessible = async (url: string): Promise<boolean> => {
  const response = await fetch(url, {
    method: "HEAD",
    cache: "no-store",
  })
    .then((response) => {
      return response.ok;
    })
    .catch((error) => {
      return false;
    });
  return response;
};

export const mergeWithoutDuplicates = <T extends { id: string }>(firstList: T[], secondList: T[]): T[] => {
  const combined = [...firstList, ...secondList];
  const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
  return unique;
};

export function svgToDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const formatFrenchPhoneNumber = (phoneNumber: string | null): string => {
  if (!phoneNumber) return "";
  if (phoneNumber.startsWith("+33")) {
    return (
      phoneNumber
        .replace("+33", "0")
        .match(/.{1,2}/g)
        ?.join(" ") || ""
    );
  }
  return phoneNumber;
};

export function isDesktopSafari() {
  if (typeof navigator === "undefined") return false;
  const userAgent = navigator.userAgent.toLowerCase();
  return (
    userAgent.includes("safari") &&
    !userAgent.includes("mobile") &&
    !userAgent.includes("chrome") &&
    !userAgent.includes("android")
  );
}

export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export async function devOnly<T>(fn: () => Promise<T>) {
  if (process.env.NODE_ENV === "development") {
    return await fn();
  }
  return null;
}

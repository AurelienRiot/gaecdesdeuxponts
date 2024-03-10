import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { fr } from "date-fns/locale";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export const dateFormatter = (date: Date) => {
  return format(date, "d MMMM yyyy", { locale: fr });
};

export function addDelay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const checkIfUrlAccessible = async (url: string): Promise<boolean> => {
  const response = await fetch(url, {
    method: "HEAD",
  })
    .then((response) => {
      return response.ok;
    })
    .catch((error) => {
      return false;
    });
  return response;
};

import { formatInTimeZone } from "date-fns-tz";
import { addDays } from "date-fns/addDays";
import { fr } from "date-fns/locale";

export const timeZone = "Europe/Paris";
export const ONE_DAY = 24 * 60 * 60 * 1000;

export const dateFormatter = (date: Date, options?: { hours?: boolean; days?: boolean; customFormat?: string }) => {
  if (options?.customFormat) return formatInTimeZone(date, timeZone, options.customFormat, { locale: fr });

  if (options?.hours) return formatInTimeZone(date, timeZone, "d MMMM yyyy, HH:mm", { locale: fr });

  if (options?.days) return formatInTimeZone(date, timeZone, "EEEE d MMMM yyyy", { locale: fr });

  return formatInTimeZone(date, timeZone, "d MMMM yyyy", { locale: fr });
};

export const MIN_DAYS_FOR_PICK_UP = 3;

export const isDateDisabled = (date: Date) => {
  return date.getDay() === 0 || date < addDays(new Date(), MIN_DAYS_FOR_PICK_UP);
};

export function formDateDayMonth(date: Date) {
  return `${date.getDate()} ${new Date(2024, date.getMonth(), 1).toLocaleString("fr", {
    month: "short",
  })}`;
}

export function getLocalIsoString(date: Date) {
  return formatInTimeZone(date, timeZone, "yyyy-MM-dd");
}

export const dateMonthYear = (dates: (Date | null)[]) => {
  const orderDates = (dates.filter((date) => date !== null) as Date[]).sort((a, b) => a.getTime() - b.getTime());
  const months = new Set(
    orderDates.map((date) =>
      date.toLocaleString("fr-FR", {
        month: "long",
      }),
    ),
  );
  const year = orderDates[0].getFullYear();
  return `${Array.from(months).join(" - ")} ${year}`;
};

export const getDaysBetweenDates = ({
  from,
  to,
  day,
}: { from: Date | undefined; to: Date | undefined; day: number }) => {
  if (!from || !to) return;
  const days: Date[] = [];
  const currentDate = new Date(from);

  currentDate.setDate(currentDate.getDate() + ((day - currentDate.getDay() + 7) % 7));

  while (currentDate <= new Date(to)) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7);
  }
  return days;
};

export function groupedDatesByMonth(dates: Date[]) {
  const groupMonth = dates.reduce(
    (acc, date) => {
      const month = date.getMonth();
      if (!acc[month]) acc[month] = [];
      acc[month].push(date);
      return acc;
    },
    {} as Record<number, Date[]>,
  );

  // Sort the keys (months) and create a new ordered object
  const orderedGroupMonth = Object.keys(groupMonth)
    .sort((a, b) => Number(a) - Number(b))
    .reduce(
      (acc, key) => {
        const monthName = new Date(0, Number(key)).toLocaleString("fr", { month: "long" });
        acc[monthName] = groupMonth[Number(key)].sort((a, b) => a.getTime() - b.getTime());
        return acc;
      },
      {} as Record<string, Date[]>,
    );

  return orderedGroupMonth;
}

export function getDayName(dayNumber: number) {
  const date = new Date();
  date.setDate(date.getDate() - date.getDay() + dayNumber); // Set date to the given day number

  return new Intl.DateTimeFormat("fr-FR", { weekday: "long" }).format(date);
}

export function getMonthName(monthNumber: number) {
  const date = new Date();
  date.setMonth(monthNumber); // Set month to the given month number

  return new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(date);
}

export const getRelativeDate = (date: Date) => {
  const currentDate = new Date();

  // Calculate the absolute difference in days, rounding to the nearest integer
  const daysDifference = Math.round((new Date(date).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

  // Check if the date is the same as the current date
  const sameDay =
    currentDate.getDate() === new Date(date).getDate() &&
    currentDate.getMonth() === new Date(date).getMonth() &&
    currentDate.getFullYear() === new Date(date).getFullYear();

  if (sameDay) {
    return "Aujourd'hui";
  }

  // Handle cases for tomorrow, yesterday, and other ranges
  if (daysDifference === 1) {
    return "Demain";
  }
  if (daysDifference === -1) {
    return "Hier";
  }
  if (daysDifference > 1) {
    return `dans ${daysDifference} jours`;
  }
  if (daysDifference < -1) {
    return `Il y a ${Math.abs(daysDifference)} jours`;
  }
};

export function getDaysInFuture(dates: Date[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureDates = dates.filter((date) => new Date(date).getTime() >= today.getTime());

  return futureDates;
}

export function getNextDay(dates: Date[]) {
  if (dates.length === 0) {
    return null;
  }
  const closestFutureDate = dates.reduce((a, b) => {
    return a.getTime() < b.getTime() ? a : b;
  });
  return closestFutureDate;
}

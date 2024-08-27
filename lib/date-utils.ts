import { fr } from "date-fns/locale";
import { addDays, format } from "date-fns";

export const dateFormatter = (date: Date, options?: { hours?: boolean; days?: boolean }) => {
  if (options?.hours) return format(date, "d MMMM yyyy, HH:mm", { locale: fr });
  if (options?.days) return format(date, "EEEE d MMMM yyyy", { locale: fr });
  return format(date, "d MMMM yyyy", { locale: fr });
};

export const MIN_DAYS = 3;

export const isDateDisabled = (date: Date) => {
  return date.getDay() === 0 || date < addDays(new Date(), MIN_DAYS);
};

export function formDateDayMonth(date: Date) {
  return `${date.getDate()} ${new Date(2024, date.getMonth(), 1).toLocaleString("fr", {
    month: "short",
  })}`;
}

export const dateMonthYear = (date: Date) => {
  return `${date.toLocaleString("fr-FR", {
    month: "long",
  })} ${date.getFullYear()}`;
};

export const getTuesdaysBetweenDates = (from: Date | undefined, to: Date | undefined) => {
  if (!from || !to) return;
  const tuesdays: Date[] = [];
  const currentDate = new Date(from);

  // Set the current date to the first Tuesday on or after the start date
  currentDate.setDate(currentDate.getDate() + ((2 - currentDate.getDay() + 7) % 7));

  while (currentDate <= new Date(to)) {
    // tuesdays.push(new Date(new Date(currentDate).setHours(18, 0, 0, 0)));
    tuesdays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7); // Move to the next Tuesday
  }
  // tuesdays.map((date) => console.log(dateFormatter(date)));
  return tuesdays;
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

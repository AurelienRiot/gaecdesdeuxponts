import { fr } from "date-fns/locale";
import { addDays, format } from "date-fns";

export const dateFormatter = (date: Date) => {
  return format(date, "d MMMM yyyy", { locale: fr });
};

export const MIN_DAYS = 3;

export const isDateDisabled = (date: Date) => {
  return date.getDay() === 0 || date < addDays(new Date(), MIN_DAYS);
};

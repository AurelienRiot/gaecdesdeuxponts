import { DAYS_OF_WEEK, formatHours } from "@/lib/date-utils";
import type { ShopHours } from "./display-hours";

export function getShopStatus(weekHours: ShopHours[], currentDayIndex: number): { isOpen?: boolean; label: string } {
  const now = new Date();
  const currentDayData = weekHours.find((dayData) => dayData.day === currentDayIndex);
  if (!currentDayData) return { label: "" };

  // Check if the shop is open all day
  if (currentDayData.isAllDay) {
    return {
      isOpen: true,
      label: `Ouvert toute la journée`,
    };
  }

  // Helper to strip date and compare just times
  const toTime = (d: Date) => new Date(d).getHours() * 60 + new Date(d).getMinutes();
  const nowTime = toTime(now);

  // Given open/close pairs, returns intervals [ [open1, close1], [open2, close2]? ]
  const intervals = currentDayData.isClosed
    ? []
    : ([
        [new Date(currentDayData.openHour1), new Date(currentDayData.closeHour1)],
        currentDayData.openHour2 && currentDayData.closeHour2
          ? [new Date(currentDayData.openHour2), new Date(currentDayData.closeHour2)]
          : null,
      ].filter(Boolean) as [Date, Date][]);

  // Check if currently open
  for (const [openT, closeT] of intervals) {
    const start = toTime(openT);
    const end = toTime(closeT);
    if (nowTime >= start && nowTime < end) {
      // Currently open
      return {
        isOpen: true,
        label: `Ouvert jusqu'à ${formatHours(closeT)}`,
      };
    }
  }

  // If not open, find next opening time
  // Search same day then subsequent days
  const findNextOpen = () => {
    // Start searching from current day intervals for times after now
    for (const [openT] of intervals) {
      const start = toTime(openT);
      if (start > nowTime) {
        // Next open time is later today
        return {
          isOpen: false,
          label: `Fermé. Ouverture aujourd'hui à ${formatHours(openT)}`,
        };
      }
    }

    // If no more openings today, check following days
    for (let i = 1; i < 7; i++) {
      const idx = (currentDayIndex + i) % 7;
      const dayData = weekHours[idx];
      if (dayData.isAllDay) {
        return {
          isOpen: false,
          label: `Fermé. Ouverture ${DAYS_OF_WEEK[dayData.day].toLowerCase()} toute la journée`,
        };
      }
      if (!dayData.isClosed) {
        const upcomingIntervals = [
          [dayData.openHour1, dayData.closeHour1],
          dayData.openHour2 && dayData.closeHour2 ? [dayData.openHour2, dayData.closeHour2] : null,
        ].filter(Boolean) as [Date, Date][];

        if (upcomingIntervals.length > 0) {
          // Next open on another day
          const [nextOpenTime] = upcomingIntervals[0];
          return {
            isOpen: false,
            label: `Fermé. Ouverture ${DAYS_OF_WEEK[dayData.day].toLowerCase()} à ${formatHours(nextOpenTime)}`,
          };
        }
      }
    }

    // If no openings at all in the upcoming schedule
    return { isOpen: false, label: `Fermé.` };
  };

  return findNextOpen();
}

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DAYS_OF_WEEK, formatHours } from "@/lib/date-utils";
import type { z } from "zod";
import type { shopHoursSchema } from "../../app/(routes)/admin/shops/[shopId]/_components/shop-schema";
import { getShopStatus } from "./open-shop";
import { cn } from "@/lib/utils";

export type ShopHours = z.infer<typeof shopHoursSchema>;

function DisplayHours({ shopHours }: { shopHours: ShopHours[] }) {
  const currentDay = new Date().getDay();
  const currentHours = shopHours?.find((hours) => hours.day === currentDay);

  if (!currentHours) {
    return null;
  }
  return (
    <>
      <DisplayShopStatus shopHours={shopHours} currentDay={currentDay} />
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            Voir toutes les horraires
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Horraires</DialogTitle>
          </DialogHeader>

          <DisplayHoursContent shopHours={shopHours} currentDay={currentDay} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export function DisplayShopStatus({ shopHours, currentDay }: { shopHours: ShopHours[]; currentDay: number }) {
  const shopStatus = getShopStatus(shopHours, currentDay);
  return (
    <p className={cn("font-semibold ", shopStatus.isOpen ? "text-green-500" : "text-red-500")}>{shopStatus.label}</p>
  );
}

export function DisplayHoursContent({ shopHours, currentDay }: { shopHours: ShopHours[]; currentDay: number }) {
  return (
    <div className="space-y-4">
      <DisplayShopStatus shopHours={shopHours} currentDay={currentDay} />
      <ul className="space-y-2">
        {shopHours
          .sort((a, b) => (a.day === currentDay ? -1 : b.day === currentDay ? 1 : 0))
          .map((hours) => (
            <li
              key={hours.day}
              className={`flex flex-col  sm:flex-row  justify-between gap-4 items-center p-3 rounded-lg transition-colors ${
                hours.day === currentDay ? "bg-primary/10" : "bg-secondary"
              }`}
            >
              <span className="font-medium">{DAYS_OF_WEEK[hours.day]}</span>
              <DisplayHour hours={hours} />
            </li>
          ))}
      </ul>
    </div>
  );
}

function DisplayHour({ hours }: { hours: ShopHours }) {
  if (hours.isClosed) {
    return <span className="text-red-500">Fermé</span>;
  }

  if (hours.isAllDay) {
    return <span className="text-green-500">24h/24</span>;
  }
  return (
    <div className="whitespace-nowrap">
      <span>{formatHours(hours.openHour1)}</span>
      {" - "}
      <span>{formatHours(hours.closeHour1)}</span>

      {hours.openHour2 && hours.closeHour2 && (
        <>
          <span className="mx-1">&</span>
          <span>{formatHours(hours.openHour2)}</span>
          {" - "}
          <span>{formatHours(hours.closeHour2)}</span>
        </>
      )}
    </div>
  );
}

export default DisplayHours;

import type { z } from "zod";
import type { shopHoursSchema } from "../../app/(routes)/admin/shops/[shopId]/_components/shop-schema";
import { DAYS_OF_WEEK, formatHours } from "@/lib/date-utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function DisplayHours({ shopHours }: { shopHours: z.infer<typeof shopHoursSchema>[] }) {
  const currentDay = new Date().getDay();
  const currentHours = shopHours?.find((hours) => hours.day === currentDay);

  if (!currentHours) {
    return null;
  }
  return (
    <>
      <p className="mt-2">
        <span className="font-medium">{DAYS_OF_WEEK[currentDay]}: </span>
        <DisplayHour hours={currentHours} />
      </p>
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
          <div className="mt-4">
            <ul className="space-y-2">
              {shopHours.map((hours) => (
                <li key={hours.day} className="flex justify-between items-center bg-secondary py-1 px-2 rounded-sm">
                  <span className="font-medium">{DAYS_OF_WEEK[hours.day]}</span>
                  <span className="text-gray-600">
                    <DisplayHour hours={hours} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DisplayHour({ hours }: { hours: z.infer<typeof shopHoursSchema> }) {
  if (hours.isClosed) {
    return <span className="text-red-500">Fermé</span>;
  }
  return (
    <>
      <span>{formatHours(hours.openHour1)}</span>
      {" - "}
      <span>{formatHours(hours.closeHour1)}</span>
      {hours.openHour2 && hours.closeHour2 && (
        <>
          <br />
          <span>{formatHours(hours.openHour2)}</span>
          {" - "}
          <span>{formatHours(hours.closeHour2)}</span>
        </>
      )}
    </>
  );
}

export default DisplayHours;
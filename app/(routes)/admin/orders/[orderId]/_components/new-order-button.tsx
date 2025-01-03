"use client";

import DateModal from "@/components/date-modal";
import { Checkbox, type CheckedState } from "@/components/ui/checkbox";
import { baseLabelVariants, Label } from "@/components/ui/label";
import { calendarOrderSchema } from "@/components/zod-schema/calendar-orders";
import useKy from "@/hooks/use-ky";
import { addDays } from "date-fns";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useOrdersQueryClient } from "@/hooks/use-query/orders-query";

function getNextAvailableDate(availableDays?: number[]): Date | null {
  if (!availableDays || availableDays.length === 0) {
    return null;
  }
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  currentDate = addDays(currentDate, 1);

  for (let i = 0; i < 7; i++) {
    const dayOfWeek = currentDate.getDay();
    if (availableDays.includes(dayOfWeek)) {
      return currentDate;
    }
    currentDate = addDays(currentDate, 1);
  }

  return null;
}

export function createNewOrderUrl({ date, userId, orderId }: { date: Date; userId: string; orderId?: string }) {
  const urlParams = new URLSearchParams();
  urlParams.set("dateOfShipping", date.toISOString());
  urlParams.set("userId", userId);
  orderId && urlParams.set("newOrderId", orderId);
  return `/admin/orders/new?${urlParams.toString()}`;
}

function NewOrderButton({
  userId,
  orderId,
  dateOfPickUp,
  defaultDaysOrders,
}: { userId: string; orderId: string; dateOfPickUp: Date; defaultDaysOrders?: number[] }) {
  const router = useRouter();
  const [noConfirmation, setNoConfirmation] = useState<CheckedState>(false);
  const { mutateOrders } = useOrdersQueryClient();
  const { ky } = useKy("/api/order", calendarOrderSchema);
  const nextDay = getNextAvailableDate(defaultDaysOrders);

  const onDayClick = async (date?: Date) => {
    if (!date) {
      toast.error("Veuillez choisir une date");
      return;
    }
    const hours = dateOfPickUp.getHours();
    const minutes = dateOfPickUp.getMinutes();
    const seconds = dateOfPickUp.getSeconds();
    const milliseconds = dateOfPickUp.getMilliseconds();
    const dateOfShipping = new Date(date.setHours(hours, minutes, seconds, milliseconds));
    const url = createNewOrderUrl({ date: dateOfShipping, userId, orderId });
    if (!noConfirmation) {
      router.replace(url);
    } else {
      ky({
        data: { dateOfShipping, userId, newOrderId: orderId },
        onSuccess: (result) => {
          mutateOrders((prev) => prev.concat(result));
        },
        onError: () => router.push(url),
        options: {
          method: "POST",
        },
      });

      router.back();
    }
  };
  return (
    <>
      <DateModal
        onValueChange={onDayClick}
        highlighted={nextDay ? [nextDay] : []}
        triggerClassName=" w-44 border-dashed border-2 text-primary"
        trigger={
          <>
            {" "}
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle commande
          </>
        }
      />
      <label htmlFor="skip-confirmation" className="flex gap-2 pl-2 items-center  cursor-pointer ">
        <Checkbox id="skip-confirmation" checked={noConfirmation} onCheckedChange={setNoConfirmation} />
        <span className={baseLabelVariants + "cursor-pointer"}>Créer sans confirmation</span>
      </label>
    </>
  );
}

export default NewOrderButton;

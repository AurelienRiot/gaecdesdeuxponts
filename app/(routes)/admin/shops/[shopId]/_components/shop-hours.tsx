"use client";

import CheckboxForm from "@/components/chekbox-form";
import { Icons } from "@/components/icons";
import SelectSheet from "@/components/select-sheet";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { baseInputClassName } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { generateTimeOptions } from "@/components/ui/time-picker";
import { DAYS_OF_WEEK, formatHours } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import { defaultHours } from "./shop-form";
import type { shopHoursSchema } from "./shop-schema";

const timeOptions = generateTimeOptions(new Date(), 0, 23);
const timeOptionsValues = timeOptions.map((date) => ({ label: formatHours(date), value: { key: date.toISOString() } }));

type ShopHoursFormProps = { shopHours: z.infer<typeof shopHoursSchema>[] };

function ShopHoursModal() {
  const form = useFormContext<ShopHoursFormProps>();
  const shopHours = form.watch("shopHours");
  const [open, setOpen] = useState(false);

  function setDefaultDays() {
    const defaulShopHours = Array.from({ length: 7 }, (_, day) => ({
      day,
      isClosed: false,
      openHour1: defaultHours.openHour1,
      closeHour1: defaultHours.closeHour1,
    }));

    form.setValue("shopHours", defaulShopHours);
    setOpen(true);
  }
  return (
    <>
      <div className="space-y-2">
        <Label>Horaires</Label>
        {shopHours.length === 0 ? (
          <div>
            <Button type="button" variant={"outline"} onClick={setDefaultDays}>
              Ajouter les horraires
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <Button type="button" variant={"outline"} onClick={() => setOpen(true)}>
                Modifier les horraires
              </Button>
              {/* <DisplayHours shopHours={shopHours} /> */}
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Modifier les horraires"
        description=""
        className="max-h-[90%] max-w-[95%] overflow-y-auto p-2"
        // modal={false}
      >
        <div className="space-y-2 relative">
          {shopHours.map((_, dayIndex) => (
            <ShopHour dayIndex={dayIndex} key={dayIndex} />
          ))}
        </div>
      </Modal>
    </>
  );
}

function ShopHour({ dayIndex }: { dayIndex: number }) {
  const form = useFormContext<ShopHoursFormProps>();
  const hours = form.watch(`shopHours.${dayIndex}`);

  function removeTimeSlot() {
    form.setValue(`shopHours.${dayIndex}.openHour2`, undefined);
    form.setValue(`shopHours.${dayIndex}.closeHour2`, undefined);
  }
  function addTimeSlot() {
    form.setValue(`shopHours.${dayIndex}.openHour2`, defaultHours.openHour2);
    form.setValue(`shopHours.${dayIndex}.closeHour2`, defaultHours.closeHour2);
  }

  return (
    <div className="flex items-center w-full justify-between space-x-2 border p-2 rounded ">
      <div className={cn("flex flex-row w-full gap-2 justify-center ", !hours.isClosed && "flex-col")}>
        <FormField
          control={form.control}
          name={`shopHours.${dayIndex}.day`}
          render={({ field }) => (
            <FormItem className="flex items-center justify-center">
              <FormControl>
                <div className={cn(baseInputClassName, "w-24 text-center justify-center")}>
                  {DAYS_OF_WEEK[field.value]}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`shopHours.${dayIndex}.isClosed`}
          render={({ field }) => (
            <FormItem className="flex items-center justify-center">
              <FormControl>
                <CheckboxForm
                  title="Fermé"
                  description=""
                  className="h-10 w-24 px-2 "
                  labelClassName="p-1 flex justify-center items-center "
                  ref={field.ref}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      {!hours.isClosed && (
        <div className="space-y-2">
          <div className="flex items-center justify-between space-x-1">
            <FormField
              control={form.control}
              name={`shopHours.${dayIndex}.openHour1`}
              render={({ field }) => <HourComponent value={field.value} onChange={field.onChange} />}
            />
            <Minus className="size-2" />
            <FormField
              control={form.control}
              name={`shopHours.${dayIndex}.closeHour1`}
              render={({ field }) => <HourComponent value={field.value} onChange={field.onChange} />}
            />
          </div>
          {hours.openHour2 && (
            <div className="flex items-center justify-between space-x-1">
              <FormField
                control={form.control}
                name={`shopHours.${dayIndex}.openHour2`}
                render={({ field }) => <HourComponent value={field.value} onChange={field.onChange} />}
              />
              <Minus className="size-2" />
              <FormField
                control={form.control}
                name={`shopHours.${dayIndex}.closeHour2`}
                render={({ field }) => <HourComponent value={field.value} onChange={field.onChange} />}
              />
            </div>
          )}
          <div className="flex items-center justify-center space-x-2">
            <Button type="button" variant="outline" size="icon" onClick={addTimeSlot} disabled={!!hours.openHour2}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon" onClick={removeTimeSlot} disabled={!hours.openHour2}>
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function HourComponent({
  value,
  onChange,
  title,
}: { value?: Date | null; onChange: (value?: Date) => void; title?: string }) {
  return (
    <FormItem>
      <FormControl>
        <SelectSheet
          values={timeOptionsValues}
          onSelected={(value) => {
            if (!value) {
              return;
            }
            onChange(new Date(value.key));
          }}
          title={title || "Heure"}
          selectedValue={value?.toISOString()}
          trigger={
            <Button variant="outline" className={cn("w-24 justify-between")}>
              {formatHours(value)}
              <Icons.Clock className="ml-auto h-4 w-4" />
            </Button>
          }
        />
      </FormControl>
    </FormItem>
  );
}

export default ShopHoursModal;

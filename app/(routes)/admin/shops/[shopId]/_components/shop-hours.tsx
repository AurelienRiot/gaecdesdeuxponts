"use client";

import CheckboxForm from "@/components/chekbox-form";
import { Icons } from "@/components/icons";
import { Button, IconButton } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { baseInputClassName } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { WheelPicker, type WheelPickerItem } from "@/components/ui/wheel-picker";
import { DAYS_OF_WEEK, formatHours } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { Clipboard, Copy, Minus, Plus } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import { defaultHours } from "./shop-form";
import type { shopHoursSchema } from "./shop-schema";

type ShopHoursFormProps = { shopHours: z.infer<typeof shopHoursSchema>[] };

function ShopHoursModal() {
  const form = useFormContext<ShopHoursFormProps>();
  const shopHours = form.watch("shopHours");
  const [open, setOpen] = useState(false);
  const [savedHours, setSavedHours] = useState<z.infer<typeof shopHoursSchema> | null>(null);

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
            <ShopHour dayIndex={dayIndex} key={dayIndex} savedHours={savedHours} setSavedHours={setSavedHours} />
          ))}
        </div>
      </Modal>
    </>
  );
}

function ShopHour({
  dayIndex,
  savedHours,
  setSavedHours,
}: {
  dayIndex: number;
  savedHours: z.infer<typeof shopHoursSchema> | null;
  setSavedHours: Dispatch<
    SetStateAction<{
      day: number;
      isClosed: boolean;
      openHour1: Date;
      closeHour1: Date;
      openHour2?: Date | null | undefined;
      closeHour2?: Date | null | undefined;
    } | null>
  >;
}) {
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

  function pasteHours() {
    if (savedHours) {
      form.setValue(`shopHours.${dayIndex}`, { ...savedHours, day: dayIndex });
    }
  }

  return (
    <div className="flex items-center w-full justify-between space-x-2 border p-2 rounded relative min-h-[90px]  ">
      <div className="relative self-stretch flex-col justify-between flex">
        <IconButton Icon={Copy} onClick={() => setSavedHours(hours)} iconClassName="size-3" />
        <IconButton Icon={Clipboard} onClick={pasteHours} iconClassName="size-3" />
      </div>

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
  const [open, setOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<string>(value ? String(value.getHours()) : "8");
  const [selectedMinute, setSelectedMinute] = useState<string>(value ? String(value.getMinutes()) : "0");

  const hours: WheelPickerItem[] = Array.from({ length: 24 }, (_, i) => ({
    value: String(i),
    label: String(i),
  }));
  const minutes: WheelPickerItem[] = Array.from({ length: 12 }, (_, i) => ({
    value: String(i * 5),
    label: String(i * 5),
  }));

  function handleSave() {
    const newDate = new Date();
    newDate.setHours(Number(selectedHour), Number(selectedMinute), 0, 0);
    onChange(newDate);
    setOpen(false);
  }

  useEffect(() => {
    if (value) {
      setSelectedHour(String(value.getHours()));
      setSelectedMinute(String(value.getMinutes()));
    }
  }, [value]);

  return (
    <FormItem>
      <FormControl>
        <Sheet
          open={open}
          onOpenChange={(o) => {
            if (!o) handleSave();
            setOpen(o);
          }}
        >
          <SheetTrigger asChild>
            <Button variant="outline" className={cn("w-20 justify-between px-3")}>
              {formatHours(value)}
              <Icons.Clock className=" h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side={"bottom"} className="pb-6">
            <div className="mx-auto w-full max-w-sm ">
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between  ">{title || "Heure"}</SheetTitle>
                <SheetDescription>{"Choisissez une heure"}</SheetDescription>
              </SheetHeader>
              <div className="flex gap-4 items-center justify-center">
                <WheelPicker items={hours} value={selectedHour} onChange={setSelectedHour} className="w-12" />
                <span className="text-3xl mb-2">:</span>
                <WheelPicker items={minutes} value={selectedMinute} onChange={setSelectedMinute} className="w-12" />
              </div>
              {/* <SheetFooter className="flex sm:justify-between gap-4  mt-4">
                <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
                  Annuler
                </Button>
                <Button className="w-full" onClick={handleSave}>
                  Valider
                </Button>
              </SheetFooter> */}
            </div>
          </SheetContent>
        </Sheet>
      </FormControl>
    </FormItem>
  );
}

export default ShopHoursModal;

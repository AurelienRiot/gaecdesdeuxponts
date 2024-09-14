"use client";

import SelectSheet from "@/components/select-sheet";
import { Button } from "@/components/ui/button";
import { dateFormatter } from "@/lib/date-utils";
import { constructQueryString } from "@/lib/search-params";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

function SelectShippingDay({
  shippingDays,
  selectedShippingDay,
  nextDay,
}: { shippingDays: Date[]; selectedShippingDay: Date; nextDay: Date }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <>
      <SelectSheet
        title="Selectionner la date"
        trigger={dateFormatter(selectedShippingDay, { days: true })}
        values={shippingDays.map((day) => ({
          label: dateFormatter(day, { days: true }),
          value: day.toISOString(),
          highlight: day.toISOString() === nextDay.toISOString(),
        }))}
        selectedValue={selectedShippingDay.toISOString()}
        onSelected={(value) => {
          router.push(constructQueryString({ newParamKey: "shippingDay", newParamValue: value.value, searchParams }), {
            scroll: false,
          });
        }}
      />
      {/* <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">{dateFormatter(selectedShippingDay, { days: true })}</Button>
        </SheetTrigger>
        <SheetContent side={"bottom"} className="pb-6">
          <div className="mx-auto w-full max-w-sm ">
            <SheetHeader>
              <SheetTitle>Selectionner la date</SheetTitle>
            </SheetHeader>
            <DisplayDate
              setOpen={setOpen}
              shippingDays={shippingDays}
              selectedShippingDay={selectedShippingDay}
              nextDay={nextDay}
            />
          </div>
        </SheetContent>
      </Sheet> */}
    </>
  );
}

export default SelectShippingDay;

export function DisplayDate({
  shippingDays,
  selectedShippingDay,
  setOpen,
  nextDay,
}: { shippingDays: Date[]; selectedShippingDay: Date; setOpen: (open: boolean) => void; nextDay: Date }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (
      scrollRef.current &&
      itemRefs.current[shippingDays.findIndex((day) => day.toDateString() === selectedShippingDay.toDateString())]
    ) {
      const selectedItem =
        itemRefs.current[shippingDays.findIndex((day) => day.toDateString() === selectedShippingDay.toDateString())];
      if (selectedItem) {
        selectedItem.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [selectedShippingDay, shippingDays]);

  // useEffect(() => {
  //   let ticking = false;

  //   const handleScroll = () => {
  //     if (!ticking) {
  //       window.requestAnimationFrame(() => {
  //         if (!scrollRef.current) return;
  //         const container = scrollRef.current;
  //         const containerRect = container.getBoundingClientRect();
  //         const containerCenterY = containerRect.top + containerRect.height / 2;
  //         for (const item of itemRefs.current) {
  //           if (!item) return;
  //           const itemRect = item.getBoundingClientRect();
  //           const itemCenterY = itemRect.top + itemRect.height / 2;
  //           const distance = Math.abs(containerCenterY - itemCenterY);
  //           const maxDistance = containerRect.height / 2;
  //           const scale = Math.max(0.7, 1 - (distance / maxDistance) * 0.3); // Adjust scale as needed

  //           item.style.transform = `scale(${scale})`;
  //         }

  //         ticking = false;
  //       });
  //       ticking = true;
  //     }
  //   };

  //   const container = scrollRef.current;
  //   if (container) {
  //     container.addEventListener("scroll", handleScroll);
  //     // Call it initially to set the scales
  //     handleScroll();
  //   }

  //   return () => {
  //     if (container) {
  //       container.removeEventListener("scroll", handleScroll);
  //     }
  //   };
  // }, [shippingDays]);
  return (
    <div className="relative">
      <div ref={scrollRef} className="max-h-[35dvh] overflow-y-auto  flex flex-col gap-2 relative py-6">
        {shippingDays.map((day, index) => (
          <Button
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            variant={
              day.toDateString() === selectedShippingDay.toDateString()
                ? "green"
                : day.toDateString() === nextDay.toDateString()
                  ? "secondary"
                  : "outline"
            }
            key={day.toISOString()}
            onClick={() => {
              setOpen(false);
              router.push(
                constructQueryString({ newParamKey: "shippingDay", newParamValue: day.toISOString(), searchParams }),
                {
                  scroll: false,
                },
              );
            }}
          >
            {dateFormatter(day, { days: true })}
          </Button>
        ))}
      </div>
      <div className="inset-0 absolute from-background to-background bg-[linear-gradient(to_bottom,_var(--tw-gradient-from)_0%,_transparent_15%,_transparent_85%,_var(--tw-gradient-to)_100%)] pointer-events-none select-none" />
    </div>
  );
}

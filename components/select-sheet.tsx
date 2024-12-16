"use client";
import { sanitizeString } from "@/lib/id";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { dateFormatter } from "@/lib/date-utils";
import { NameWithImage } from "./user";
import { getUserName } from "./table-custom-fuction";

export type ValueType<T extends { key: string }> = {
  label: React.ReactNode;
  value: T;
  search: string;
  highlight?: boolean;
};

function filterValues<T extends { key: string }>(values: ValueType<T>[], filter: string) {
  return values.filter((v) => v.search.includes(sanitizeString(filter)));
}

function SelectSheet<T extends { key: string }>({
  values,
  onSelected,
  trigger,
  selectedValue,
  defaultValue,
  title,
  description,
  className,
  triggerClassName,
  isSearchable,
}: {
  trigger: React.ReactNode | string;
  onSelected: (selected?: T) => void;
  values: ValueType<T>[];
  selectedValue?: string | null;
  defaultValue?: string | null;
  title: string;
  description?: string;
  className?: string;
  triggerClassName?: string;
  isSearchable?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filter, setFilter] = React.useState("");
  // const inputRef = React.useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const filteredValues = isSearchable ? filterValues(values, filter) : values;

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    if (!newOpen) {
      setFilter("");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {typeof trigger === "string" ? (
          <Button className={triggerClassName} variant="outline">
            {trigger}
          </Button>
        ) : (
          trigger
        )}
      </SheetTrigger>
      <SheetContent side={isMobile && isSearchable ? "top" : "bottom"} className="pb-6">
        <div className={cn("mx-auto w-full max-w-sm relative", className)}>
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between  ">
              <span>{title}</span>
              {!!defaultValue && (
                <Button
                  variant={"outline"}
                  onClick={() => {
                    onSelected(undefined);
                    handleOpenChange(false);
                  }}
                  type="button"
                  size={"xs"}
                  className="border-dashed text-xs whitespace-nowrap font-normal font-serif"
                >
                  {defaultValue}
                </Button>
              )}
            </SheetTitle>
            {!!description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          <SelectSheetContent
            values={filteredValues}
            onSelected={(selected) => {
              onSelected(selected);
              handleOpenChange(false);
            }}
            selectedValue={selectedValue}
          />
          {isSearchable && (
            <div className="absolute right-0 top-10 w-full mx-auto flex justify-center px-8">
              <Input
                autoFocus
                id="filter"
                className="w-full max-w-md border transition-opacity rounded-md p-2 shadow-md"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter..."
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SelectSheetContent<T extends { key: string }>({
  values,
  onSelected,
  selectedValue,
}: {
  onSelected: (selected: T) => void;
  values: ValueType<T>[];
  selectedValue?: string | null;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  React.useEffect(() => {
    if (scrollRef.current && itemRefs.current[values.findIndex((value) => value.value.key === selectedValue)]) {
      const selectedItem = itemRefs.current[values.findIndex((value) => value.value.key === selectedValue)];
      if (selectedItem) {
        selectedItem.scrollIntoView({
          behavior: "instant",
          block: "center",
        });
      }
    }
  }, [selectedValue, values]);

  return (
    <div className="relative">
      <ScrollArea ref={scrollRef} className="max-h-[50dvh] overflow-y-auto relative pb-8 pt-14">
        <div className=" flex flex-col gap-2 items-center justify-center">
          {values.map((value, index) => (
            <Button
              id={value.value.key}
              style={{ touchAction: "pan-y" }}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              variant={value.value.key === selectedValue ? "green" : value.highlight ? "secondary" : "outline"}
              className="w-full"
              key={value.value.key + index}
              onClick={() => {
                onSelected(value.value);
              }}
            >
              {value.label}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="inset-0 absolute from-background to-background bg-[linear-gradient(to_bottom,_var(--tw-gradient-from)_0%,_transparent_10%,_transparent_90%,_var(--tw-gradient-to)_100%)] pointer-events-none select-none" />
    </div>
  );
}

export default SelectSheet;

export function createDateValues(dates: Date[], highlightDate?: Date) {
  return dates.map((day) => ({
    label: dateFormatter(day, { days: true }),
    value: { key: day.toISOString() },
    highlight: day.toISOString() === highlightDate?.toISOString(),
    search: sanitizeString(dateFormatter(day, { days: true })),
  }));
}

export function createUserValues(
  users: { name?: string | null; company?: string | null; email?: string | null; id: string }[],
) {
  return users.map((user) => ({
    label: <NameWithImage name={getUserName(user)} displayImage={false} />,
    value: { key: user.id },
    search: sanitizeString(user.company + " " + user.name),
  }));
}

export function createShopValues(shops: { name: string; id: string; imageUrl?: string | null }[]) {
  return shops.map((shop) => ({
    label: <NameWithImage name={shop.name} image={shop.imageUrl} />,
    value: { key: shop.id },
    search: sanitizeString(shop.name),
  }));
}

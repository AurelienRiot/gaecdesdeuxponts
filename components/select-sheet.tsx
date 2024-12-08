"use client";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

export type ValueType<T extends { key: string }> = { label: React.ReactNode; value: T; highlight?: boolean };

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
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {typeof trigger === "string" ? (
          <Button className={triggerClassName} variant="outline">
            {trigger}
          </Button>
        ) : (
          trigger
        )}
      </SheetTrigger>
      <SheetContent side={"bottom"} className="pb-6">
        <div className={cn("mx-auto w-full max-w-sm ", className)}>
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between  ">
              <span>{title}</span>
              {!!defaultValue && (
                <Button
                  variant={"outline"}
                  onClick={() => {
                    onSelected(undefined);
                    setIsOpen(false);
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
            values={values}
            onSelected={(selected) => {
              onSelected(selected);
              setIsOpen(false);
            }}
            selectedValue={selectedValue}
          />
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
      <ScrollArea ref={scrollRef} className="max-h-[50dvh] overflow-y-auto relative py-8">
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

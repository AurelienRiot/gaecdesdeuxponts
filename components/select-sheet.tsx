"use client";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

type SelectSheetContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SelectSheetContext = React.createContext<SelectSheetContextType | undefined>(undefined);

export function useSelectSheetContext() {
  const context = React.useContext(SelectSheetContext);

  if (context === undefined) {
    throw new Error("useSelectSheetContext must be used within a SelectSheetContext.Provider");
  }

  return context;
}

type ValueType = { label: React.ReactNode; value: string; highlight?: boolean };

function SelectSheet({
  values,
  onSelected,
  trigger,
  selectedValue,
  title,
  description,
  className,
  triggerClassName,
}: {
  trigger: React.ReactNode | string;
  onSelected: (selected: string) => void;
  values: ValueType[];
  selectedValue?: string | null;
  title: string;
  description?: string;
  className?: string;
  triggerClassName?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <SelectSheetContext.Provider value={{ isOpen, setIsOpen }}>
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
              <SheetTitle>{title}</SheetTitle>
              {!!description && <SheetDescription>{description}</SheetDescription>}
            </SheetHeader>
            <SelectSheetContent values={values} onSelected={onSelected} selectedValue={selectedValue} />
          </div>
        </SheetContent>
      </Sheet>
    </SelectSheetContext.Provider>
  );
}

function SelectSheetContent({
  values,
  onSelected,
  selectedValue,
}: { onSelected: (selected: string) => void; values: ValueType[]; selectedValue?: string | null }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const { setIsOpen } = useSelectSheetContext();

  React.useEffect(() => {
    if (scrollRef.current && itemRefs.current[values.findIndex((value) => value.value === selectedValue)]) {
      const selectedItem = itemRefs.current[values.findIndex((value) => value.value === selectedValue)];
      if (selectedItem) {
        selectedItem.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [selectedValue, values]);

  return (
    <div className="relative">
      <div ref={scrollRef} className="max-h-[35dvh] overflow-y-auto  flex flex-col gap-2 relative py-6">
        {values.map((value, index) => (
          <Button
            style={{ touchAction: "pan-y" }}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            variant={value.value === selectedValue ? "green" : value.highlight ? "secondary" : "outline"}
            key={value.value}
            onClick={() => {
              setIsOpen(false);
              onSelected(value.value);
            }}
          >
            {value.label}
          </Button>
        ))}
      </div>
      <div className="inset-0 absolute from-background to-background bg-[linear-gradient(to_bottom,_var(--tw-gradient-from)_0%,_transparent_15%,_transparent_85%,_var(--tw-gradient-to)_100%)] pointer-events-none select-none" />
    </div>
  );
}

export default SelectSheet;

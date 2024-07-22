"use client";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollToTarget } from "@/lib/scroll-to-traget";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { ProductChart } from "./product-chart";

function PerUserItems({
  data,
}: {
  data: Record<string, Record<string, { name: string; positiveQuantity: number; negativeQuantity: number }>>;
}) {
  const [user, setUser] = useState(Object.keys(data)[0]);
  const [open, setOpen] = useState(false);

  function onValueChange(value: string) {
    setUser(value);
    setOpen(false);
  }

  const chartData = Object.values(data[user]).flatMap((item) => {
    const data = [];
    if (item.positiveQuantity !== 0) {
      data.push({ name: item.name, quantity: item.positiveQuantity });
    }
    if (item.negativeQuantity !== 0) {
      data.push({ name: item.name, quantity: item.negativeQuantity });
    }
    return data;
  });

  console.log(chartData);

  return (
    <div id="user-input" className="space-y-4 pt-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn("w-48 justify-between", user ? "" : "text-muted-foreground")}
          >
            {user ?? "Nom du client"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" avoidCollisions={false} className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Nom du client" onFocus={() => ScrollToTarget("user-input")} />
            <CommandList>
              {Object.entries(data).map(([key, value]) => (
                <CommandItem key={key} value={key} onSelect={onValueChange}>
                  <Check className={cn("mr-2 h-4 w-4", key === user ? "opacity-100" : "opacity-0")} />
                  {key}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <ProductChart chartData={chartData} />
    </div>
  );
}

export default PerUserItems;

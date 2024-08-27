import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Shop } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import { ScrollToTarget } from "@/lib/scroll-to-traget";
import type { AMAPFormValues } from "./amap-schema";

const SelectShop = ({ shops }: { shops: Shop[] }) => {
  const form = useFormContext<AMAPFormValues>();
  const [open, setOpen] = useState(false);
  const shopId = form.watch("shopId");

  function onValueChange(value: string | undefined) {
    if (!value) {
      return;
    }
    const shop = shops.find((shop) => shop.id === value);
    if (!shop) {
      toast.error("Magasin introuvable");
      return;
    }
    form.setValue("shopId", value);
    setOpen(false);
  }

  return (
    <FormField
      control={form.control}
      name="shopId"
      render={({ field }) => (
        <FormItem className="w-48">
          <FormLabel id="shop-input" className="flex items-center justify-between gap-2">
            <span>AMAP</span>
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                key={shopId || "domicile"}
                variant="outline"
                role="combobox"
                disabled={form.formState.isSubmitting}
                className={cn("min-w-48 justify-between", shopId ? "text-primary" : "text-muted-foreground")}
              >
                {shops.find((shop) => shop.id === shopId)?.name || "Choisir l'AMAP"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" avoidCollisions={false} className="w-[200px] p-0">
              <Command>
                <CommandInput onFocus={() => ScrollToTarget("shop-input")} placeholder="Nom du magasin" />
                <CommandList>
                  {shops.map((shop) => (
                    <CommandItem key={shop.id} value={shop.id} keywords={[shop.name]} onSelect={onValueChange}>
                      <Check className={cn("mr-2 h-4 w-4", shopId === shop.id ? "opacity-100" : "opacity-0")} />
                      {shop.imageUrl && (
                        <Image
                          src={shop.imageUrl}
                          alt={shop.name}
                          width={16}
                          height={16}
                          sizes="200px"
                          className="mr-2 object-contain"
                        />
                      )}
                      {shop.name}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectShop;

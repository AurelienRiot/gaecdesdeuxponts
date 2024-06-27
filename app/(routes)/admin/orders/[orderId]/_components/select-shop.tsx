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
import type { OrderFormValues } from "./order-shema";

const SelectShop = ({ shops }: { shops: Shop[] }) => {
  const form = useFormContext<OrderFormValues>();
  const [open, setOpen] = useState(false);
  const shopId = form.watch("shopId");

  function onValueChange(value: string | undefined) {
    if (!value) {
      form.setValue("shopId", undefined);
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
          <FormLabel className="flex items-center justify-between gap-2">
            <span>Lieu de retrait</span>
            <Button
              variant={"outline"}
              onClick={() => onValueChange(undefined)}
              type="button"
              size={"xs"}
              className="border-dashed text-xs"
            >
              Réninitialiser
            </Button>
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                key={shopId || "domicile"}
                variant="outline"
                role="combobox"
                disabled={form.formState.isSubmitting}
                className={cn("min-w-48 justify-between")}
              >
                {shops.find((shop) => shop.id === shopId)?.name || "A domicile"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Nom du magasin" />
                <CommandList>
                  {shops.map((shop) => (
                    <CommandItem key={shop.id} value={shop.id} keywords={[shop.name]} onSelect={onValueChange}>
                      <Check className={cn("mr-2 h-4 w-4", shopId === shop.id ? "opacity-100" : "opacity-0")} />
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

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { UserWithAddress } from "@/types";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { OrderFormValues } from "./order-form";

const SelectUser = ({ users }: { users: UserWithAddress[] }) => {
  const form = useFormContext<OrderFormValues>();
  const [open, setOpen] = useState(false);

  function onValueChange(value: string) {
    const user = users.find((user) => user.id === value);
    if (!user) {
      toast.error("Utilisateur introuvable");
      return;
    }
    form.setValue("userId", value);
    form.setValue("name", user.name ? user.name : user.email || "");
  }

  return (
    <FormField
      control={form.control}
      name="userId"
      render={({ field }) => (
        <FormItem className="w-48">
          <FormLabel>Client</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                disabled={form.formState.isSubmitting}
                className={cn(
                  "min-w-48 justify-between",
                  field.value ? "" : "text-muted-foreground",
                )}
              >
                {form.getValues("name")
                  ? form.getValues("name")
                  : "Nom du client"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Nom du client" />
                <CommandList>
                  {users.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                      keywords={[user.name || "", user.email || ""]}
                      onSelect={onValueChange}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === user.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {user.name}
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

export default SelectUser;

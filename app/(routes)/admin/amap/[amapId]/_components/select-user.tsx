import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollToTarget } from "@/lib/scroll-to-traget";
import { cn } from "@/lib/utils";
import type { User } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type { AMAPFormValues } from "./amap-schema";

const SelectUser = ({ users }: { users: User[] }) => {
  const form = useFormContext<AMAPFormValues>();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const userId = form.watch("userId");
  const name = (() => {
    const user = users.find((user) => user.id === userId);
    return user?.company || user?.name || user?.email?.split("@")[0];
  })();

  function onValueChange(value: string) {
    const user = users.find((user) => user.id === value);

    if (!user) {
      toast.error("Utilisateur introuvable");
      return;
    }
    if (!user.completed) {
      router.push(`/admin/users/${user.id}?incomplete=true`);
      toast.error("Utilisateur incomplet", { position: "top-center" });
      return;
    }
    form.setValue("userId", value);
    setOpen(false);
  }

  return (
    <FormField
      control={form.control}
      name="userId"
      render={({ field }) => (
        <FormItem className="w-48">
          <FormLabel id="user-input">Client</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                ref={field.ref}
                variant="outline"
                role="combobox"
                disabled={form.formState.isSubmitting}
                className={cn("w-48 justify-between", field.value ? "" : "text-muted-foreground")}
              >
                {name ?? "Nom du client"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" avoidCollisions={false} className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Nom du client" onFocus={() => ScrollToTarget("user-input")} />
                <CommandList>
                  {users.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                      keywords={[user.name || "", user.email || "", user.company || ""]}
                      onSelect={onValueChange}
                    >
                      <Check className={cn("mr-2 h-4 w-4", field.value === user.id ? "opacity-100" : "opacity-0")} />
                      {user.company || user.name || user.email?.split("@")[0]}
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

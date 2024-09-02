import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { UserWithAddress } from "@/types";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type { OrderFormValues } from "./order-shema";
import { ScrollToTarget } from "@/lib/scroll-to-traget";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SelectUser = ({ users }: { users: UserWithAddress[] }) => {
  const form = useFormContext<OrderFormValues>();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const userId = form.watch("userId");
  const name = (() => {
    const user = users.find((user) => user.id === userId);
    return user?.company || user?.name || user?.email?.split("@")[0];
  })();
  const image = users.find((user) => user.id === userId)?.image;

  function onValueChange(value: string) {
    const user = users.find((user) => user.id === value);

    if (!user) {
      toast.error("Utilisateur introuvable");
      return;
    }
    if (!user.completed) {
      router.push(`/admin/users/${user.id}`);
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
        <FormItem className="w-48 ">
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
                {name ? (
                  <>
                    <Image
                      src={image ? image : "/skeleton-image.webp"}
                      alt="user"
                      width={16}
                      height={16}
                      className="mr-2 object-contain rounded-sm"
                    />
                    {name}
                  </>
                ) : (
                  "Nom du client"
                )}
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
                      {field.value === user.id ? (
                        <Check className={cn("mr-2 h-4 w-4")} />
                      ) : (
                        <Image
                          src={user.image ? user.image : "/skeleton-image.webp"}
                          alt="user"
                          width={16}
                          height={16}
                          className="mr-2 object-contain rounded-sm"
                        />
                      )}
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

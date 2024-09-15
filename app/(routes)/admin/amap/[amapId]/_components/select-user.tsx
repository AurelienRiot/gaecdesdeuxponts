import SelectSheet from "@/components/select-sheet";
import { getUserName } from "@/components/table-custom-fuction";
import { NameWithImage } from "@/components/table-custom-fuction/common-cell";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type { AMAPFormValues } from "./amap-schema";

const SelectUser = ({ users }: { users: User[] }) => {
  const form = useFormContext<AMAPFormValues>();
  const router = useRouter();
  const userId = form.watch("userId");
  const name = (() => {
    const user = users.find((user) => user.id === userId);
    return user ? getUserName(user) : undefined;
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
  }

  return (
    <FormField
      control={form.control}
      name="userId"
      render={({ field }) => (
        <FormItem className="w-48">
          <FormLabel id="user-input">Client</FormLabel>
          <SelectSheet
            triggerClassName="w-full"
            title="Selectionner le client"
            trigger={
              name ? (
                <Button variant="outline" className="w-full">
                  <NameWithImage name={name} displayImage={false} />
                </Button>
              ) : (
                "Nom de client"
              )
            }
            selectedValue={userId}
            values={users.map((user) => ({
              label: <NameWithImage name={getUserName(user)} displayImage={false} />,
              value: { key: user.id },
            }))}
            onSelected={(value) => {
              onValueChange(value.key);
            }}
          />

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectUser;

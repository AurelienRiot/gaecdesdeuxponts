import SelectSheet from "@/components/select-sheet";
import { NameWithImage } from "@/components/table-custom-fuction/common-cell";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { UserWithAddress } from "@/types";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type { OrderFormValues } from "./order-schema";

export function getUserName(user: { name?: string | null; company?: string | null; email?: string | null }) {
  return user.company || user.name || user.email?.split("@")[0] || "";
}

const SelectUser = ({ users }: { users: UserWithAddress[] }) => {
  const form = useFormContext<OrderFormValues>();
  const router = useRouter();
  const userId = form.watch("userId");
  const name = (() => {
    const user = users.find((user) => user.id === userId);
    return user ? getUserName(user) : undefined;
  })();
  const image = users.find((user) => user.id === userId)?.image;

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
        <FormItem className=" flex flex-col gap-2 ">
          <FormLabel id="user-input">Client</FormLabel>
          <SelectSheet
            triggerClassName="w-full"
            title="Selectionner le client"
            trigger={
              name ? (
                <Button variant="outline" className="w-full">
                  <NameWithImage name={name} image={image} />
                </Button>
              ) : (
                "Nom de client"
              )
            }
            selectedValue={userId}
            values={users.map((user) => ({
              label: <NameWithImage name={getUserName(user)} image={user.image} />,
              value: user.id,
            }))}
            onSelected={(value) => {
              onValueChange(value);
            }}
          />

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectUser;

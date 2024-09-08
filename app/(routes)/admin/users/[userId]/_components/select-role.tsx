import FancySwitch, { type OptionObject } from "@/components/ui/fancy-switch";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import type { UserFormValues } from "./user-schema";

const roleType: OptionObject[] = [
  { value: "pro", label: "Professionnel" },
  { value: "user", label: "Particulier" },
  { value: "trackOnlyUser", label: "Suivie uniquement" },
];

function SelectRole({ display }: { display: boolean }) {
  const form = useFormContext<UserFormValues>();
  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Type de l'utilisateur :{" "}
            <span className="font-bold">{roleType.find((role) => role.value === field.value)?.label}</span>
          </FormLabel>
          <FormControl>
            <FancySwitch
              value={field.value}
              onChange={field.onChange}
              options={roleType}
              className="lg:flex rounded-md border p-2 w-fit "
              highlighterClassName={display ? "bg-primary rounded-full" : "opacity-0"}
              aria-label="Order type"
              radioClassName={cn(
                "relative mx-2 flex h-9 cursor-pointer items-center justify-center rounded-full px-3.5 text-sm font-medium transition-colors focus:outline-none data-[checked]:text-primary-foreground",
              )}
              highlighterIncludeMargin={true}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SelectRole;

import { useFormContext } from "react-hook-form";
import type { UserFormValues } from "./user-schema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

function SelectRole() {
  const form = useFormContext<UserFormValues>();
  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de l'utilisateur</FormLabel>
          <RadioGroup value={field.value} onValueChange={field.onChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="r1" />
              <Label htmlFor="r1">Normal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pro" id="r2" />
              <Label htmlFor="r2">Professionnel</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="trackOnlyUser" id="r3" />
              <Label htmlFor="r3">Suivie seulement</Label>
            </div>
          </RadioGroup>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SelectRole;

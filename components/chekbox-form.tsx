import { forwardRef } from "react";
import { Checkbox, type CheckedState } from "./ui/checkbox";
import { FormControl, FormDescription, FormItem, FormLabel } from "./ui/form";

interface CheckboxFormProps {
  checked?: boolean;
  onCheckedChange: (checked: CheckedState) => void;
  disabled?: boolean;
  title: string;
  description: string;
}

const CheckboxForm = forwardRef<HTMLButtonElement, CheckboxFormProps>(
  ({ checked, onCheckedChange, disabled, title, description }, ref) => {
    return (
      <FormItem className="flex h-20  flex-row items-start space-x-3 space-y-0 rounded-md border bg-background">
        <FormLabel className="p-4 flex cursor-pointer flex-row items-start space-x-3 space-y-0 w-full h-full">
          <FormControl>
            <Checkbox checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} ref={ref} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="cursor-pointer">{title}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
        </FormLabel>
      </FormItem>
    );
  },
);

CheckboxForm.displayName = "CheckboxForm";

export default CheckboxForm;

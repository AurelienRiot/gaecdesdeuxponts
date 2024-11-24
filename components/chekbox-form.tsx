import { forwardRef } from "react";
import { Checkbox, type CheckedState } from "./ui/checkbox";
import { FormControl, FormDescription, FormItem, FormLabel } from "./ui/form";
import { cn } from "@/lib/utils";

interface CheckboxFormProps {
  checked?: boolean;
  onCheckedChange: (checked: CheckedState) => void;
  disabled?: boolean;
  title: string;
  description: string;
  className?: string;
  labelClassName?: string;
}

const CheckboxForm = forwardRef<HTMLButtonElement, CheckboxFormProps>(
  ({ checked, onCheckedChange, disabled, title, description, className, labelClassName }, ref) => {
    return (
      <FormItem
        className={cn("flex h-20  flex-row items-start space-x-3 space-y-0 rounded-md border bg-background", className)}
      >
        <FormLabel
          className={cn(
            "p-4 flex cursor-pointer flex-row items-start space-x-3 space-y-0 w-full h-full",
            labelClassName,
          )}
        >
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

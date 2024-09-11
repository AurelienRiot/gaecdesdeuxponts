import * as React from "react";

import { cn, isSafari } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const baseInputClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return <input type={type} className={cn(baseInputClassName, className)} ref={ref} {...props} />;
});
Input.displayName = "Input";

const NumberInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, onChange, value, type, ...props }, ref) => {
    const safari = isSafari();
    if (!safari) {
      return (
        <input
          type={"number"}
          className={cn(baseInputClassName, className)}
          ref={ref}
          value={value ?? ""}
          onChange={onChange}
          {...props}
        />
      );
    }
    function handleOnchange(e: React.ChangeEvent<HTMLInputElement>) {
      // Get the current value of the input
      let value = e.target.value;

      // Replace commas with periods
      value = value.replace(/,/g, ".");

      // Check if the value is a valid number
      // Create a new input event with the modified value
      const modifiedEvent = {
        ...e,
        target: {
          ...e.target,
          value,
        },
      };

      // Call the onChange prop with the new event object
      return onChange?.(modifiedEvent as React.ChangeEvent<HTMLInputElement>);
    }

    return (
      <input
        type={"text"}
        className={cn(baseInputClassName, className)}
        ref={ref}
        value={value ?? ""}
        onChange={handleOnchange}
        {...props}
      />
    );
  },
);
NumberInput.displayName = "NumberInput";

export { Input, NumberInput };

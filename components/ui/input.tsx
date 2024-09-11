import * as React from "react";

import useIsComponentMounted from "@/hooks/use-mounted";
import { cn, isDesktopSafari } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const baseInputClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return <input type={type} className={cn(baseInputClassName, className)} ref={ref} {...props} />;
});
Input.displayName = "Input";

const NumberInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, onChange, value, type, ...props }, ref) => {
    const safari = isDesktopSafari();
    const isMounted = useIsComponentMounted();
    if (!safari || !isMounted) {
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
      let value = e.target.value;
      value = value.replace(/,/g, ".");
      const modifiedEvent = {
        ...e,
        target: {
          ...e.target,
          value,
        },
      };
      return onChange?.(modifiedEvent);
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

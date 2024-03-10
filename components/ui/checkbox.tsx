"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      `peer relative h-4 w-4 shrink-0 rounded-md border border-primary ring-offset-background transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
      data-[state=checked]:bg-primary
      data-[state=unchecked]:bg-transparent 
      `,
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="absolute inset-0 -left-[1px] animate-checkbox-out    items-center    overflow-hidden text-transparent  data-[state=checked]:animate-checkbox-in ">
      <Check className="absolute h-4 w-4 shrink-0" />
    </CheckboxPrimitive.Indicator>
    <CheckboxPrimitive.Indicator className=" absolute inset-0 left-[1px] top-[1px] hidden items-center data-[state=indeterminate]:flex  ">
      <Loader2 className="absolute h-3 w-3 shrink-0 animate-spin text-primary " />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };

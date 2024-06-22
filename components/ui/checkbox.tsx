"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type CheckedState = boolean | 'indeterminate';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      `peer relative h-4 w-4 shrink-0 rounded-md border border-primary bg-background ring-offset-background transition-all delay-200 duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
    data-[state=checked]:bg-primary  data-[state=checked]:delay-0 
    `,
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      forceMount
      className="peer absolute inset-0 -bottom-[1px] -left-[1px] grid grid-cols-[0fr] items-center  transition-all delay-0 duration-500  data-[state=checked]:grid-cols-[1fr]   data-[state=indeterminate]:grid-cols-[0fr] data-[state=checked]:delay-200 data-[state=indeterminate]:delay-0 "
    >
      <div className="overflow-hidden transition-all">
        <Check className=" h-4 w-4 shrink-0 text-primary-foreground" />
      </div>
    </CheckboxPrimitive.Indicator>
    <div className=" absolute inset-0 left-[1px] top-[1px] flex items-center opacity-0 transition-all delay-200 peer-data-[state=indeterminate]:opacity-100  ">
      <Loader2 className="absolute h-3 w-3 shrink-0 animate-spin text-primary " />
    </div>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox,type CheckedState };

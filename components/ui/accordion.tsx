"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        `justify-left relative flex flex-1 items-start bg-primary py-4 pl-14 text-sm font-medium text-primary-foreground transition-all duration-200 hover:underline data-[state=open]:bg-gradient-to-b data-[state=open]:from-secondary data-[state=open]:to-primary-foreground 
        data-[state=open]:text-secondary-foreground
        sm:text-base md:text-lg lg:text-xl  [&[data-state=closed]>svg.plus]:scale-100 [&[data-state=closed]>svg.square]:scale-0 [&[data-state=closed]]:text-primary-foreground [&[data-state=open]>svg.plus]:scale-0 `,
        className,
      )}
      {...props}
    >
      <svg
        className="square absolute left-0 top-1/2 h-11 w-11 shrink-0  translate-x-[4px] translate-y-[-20px] stroke-2 transition-transform duration-500"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        aria-hidden
      >
        <rect x="5" y="5" rx="5" ry="5" width="22" height="22" />
      </svg>

      <svg
        className="plus absolute left-0 top-1/2 mx-4 h-5 w-5 shrink-0 translate-y-[-8px] transition-transform duration-500"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden
      >
        <rect width="2" height="20" x="9" y="0" />
      </svg>
      <svg
        aria-hidden
        className="absolute left-0 top-1/2 mx-4 h-5 w-5 shrink-0  "
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <rect width="20" height="2" x="0" y="0" />
      </svg>

      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden    bg-primary-foreground  px-4 font-bold text-primary transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down ",
      className,
    )}
    {...props}
  >
    <div className="pb-4 pt-0 transition-opacity duration-200 ease-out">
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

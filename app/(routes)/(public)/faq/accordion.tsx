"use client";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";

type AccordionContextValue = {
  value: string[] | undefined;
  onValueChange: (value: string[] | undefined) => void;
};

const AccordionContext = React.createContext<AccordionContextValue>(
  {} as AccordionContextValue,
);

// const Accordion = AccordionPrimitive.Root;

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  Omit<
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>,
    "value" | "onValueChange" | "type"
  >
>(({ className, children, defaultValue, ...props }, ref) => {
  const [value, onValueChange] = React.useState<string[] | undefined>(
    undefined,
  );
  return (
    <AccordionPrimitive.Root
      ref={ref}
      type="multiple"
      // collapsible
      onValueChange={onValueChange}
      value={value}
      defaultValue={
        Array.isArray(defaultValue)
          ? defaultValue
          : defaultValue
            ? [defaultValue]
            : undefined
      }
      {...props}
    >
      <AccordionContext.Provider value={{ value, onValueChange }}>
        <div
          className={cn(
            "rounded-[calc((var(--radius)-2px)-1px)]   bg-background",
            className,
          )}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    </AccordionPrimitive.Root>
  );
});
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={
      " group relative    rounded-md  bg-border p-0.5  transition-all duration-200 ease-out data-[state=open]:bg-gradient-to-r data-[state=open]:from-neutral-900 data-[state=open]:to-slate-900"
    }
    {...props}
  >
    <div
      className={cn(
        "rounded-[calc((var(--radius)-2px)-1px)]   bg-background",
        className,
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Item>
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        `z-10 w-full cursor-pointer  bg-gradient-to-r from-neutral-900 to-slate-900 bg-clip-text p-4 text-left  text-xl font-semibold text-transparent group-first:rounded-t-md group-last:rounded-b-md `,
        className,
      )}
      {...props}
    />
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
    value: string;
  }
>(({ className, children, value, ...props }, ref) => {
  const { value: values, onValueChange } = React.useContext(AccordionContext);
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-10 overflow-hidden transition-all  data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col justify-between   ">
        {children}
        <div className="mt-8 h-[40px] w-full"></div>
        <button
          onClick={() => onValueChange(values?.filter((v) => v !== value))}
          className="group/button absolute bottom-0 left-0 flex w-full items-center justify-center gap-1 rounded-b-md bg-gradient-to-r from-neutral-900 to-slate-900 py-2 font-semibold text-white   opacity-0 transition-opacity  duration-200 group-data-[state=open]:opacity-100    "
        >
          <span>Fermer</span>
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 transition-transform group-hover/button:-rotate-45"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </AccordionPrimitive.Content>
  );
});
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export const Accordion2 = ({
  data,
}: {
  data: {
    question: string;
    answer: string[];
  }[];
}) => {
  const [question, setQuestion] = React.useState<string | undefined>(undefined);
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className=" relative mt-8 flex w-full flex-col gap-4 "
      value={question}
      onValueChange={setQuestion}
    >
      {data.map((faq, index) => (
        <AccordionPrimitive.Item
          key={index}
          value={`item-${index}`}
          className=" group relative    rounded-md  bg-border p-0.5  transition-all duration-200 ease-out data-[state=open]:bg-gradient-to-r data-[state=open]:from-neutral-900 data-[state=open]:to-slate-900"
        >
          <div className="rounded-[calc((var(--radius)-2px)-1px)]   bg-background">
            <AccordionPrimitive.Trigger className="z-10 w-full cursor-pointer  bg-gradient-to-r from-neutral-900 to-slate-900 bg-clip-text p-4 text-left  text-xl font-semibold text-transparent group-first:rounded-t-md group-last:rounded-b-md">
              {faq.question}
            </AccordionPrimitive.Trigger>
            <AccordionPrimitive.Content className="z-10 transition-all  data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className=" flex flex-col justify-between   transition-opacity duration-200 ease-out ">
                <ul className=" space-y-4 bg-gradient-to-r from-neutral-900 to-slate-900 bg-clip-text py-2 text-sm text-transparent list-check-green-600">
                  {faq.answer.map((point, pointIndex) => (
                    <li className="mx-4" key={pointIndex}>
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 h-[40px] w-full"></div>
                <button
                  // onClick={() => setQuestion("")}
                  className="group/button absolute bottom-0 left-0 flex w-full items-center justify-center gap-1 rounded-b-md bg-gradient-to-r from-neutral-900 to-slate-900 py-2 font-semibold text-white  opacity-0 transition-all group-data-[state=open]:opacity-100 "
                >
                  <span>Fermer</span>
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4 transition-transform group-hover/button:-rotate-45"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </AccordionPrimitive.Content>
          </div>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
};
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

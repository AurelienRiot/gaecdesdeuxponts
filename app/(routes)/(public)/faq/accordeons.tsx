"use client";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { useState } from "react";

export const Accordion2 = ({
  data,
}: {
  data: {
    question: string;
    answer: string[];
  }[];
}) => {
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className=" relative mt-8 flex w-full flex-col gap-4 "
      value={value}
      onValueChange={setValue}
    >
      <style jsx>
        {`
          .border-highlight::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 0; /* Ensure it's below the content */
            background: linear-gradient(
              to right,
              var(--neutral-900),
              var(--slate-900)
            );
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none; /* Prevent it from capturing clicks */
          }
          .border-highlight.data-[state="open"]::before {
            opacity: 1;
          }
        `}
      </style>

      {data.map((faq, index) => (
        <AccordionPrimitive.Item
          key={index}
          value={`item-${index}`}
          onMouseEnter={() => setValue(`item-${index}`)}
          className=" group relative   rounded-md  bg-border p-0.5  transition-all data-[state=open]:bg-gradient-to-r data-[state=open]:from-neutral-900 data-[state=open]:to-slate-900
          "
        >
          <div className="rounded-[calc((var(--radius)-2px)-1px)]   bg-background">
            <AccordionPrimitive.Trigger className="z-10 w-full cursor-default bg-gradient-to-r from-neutral-900 to-slate-900 bg-clip-text p-4 text-left  text-xl font-semibold text-transparent group-first:rounded-t-md group-last:rounded-b-md">
              {faq.question}
            </AccordionPrimitive.Trigger>
            <AccordionPrimitive.Content className="z-10 transition-all  data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className=" flex flex-col justify-between   transition-opacity duration-200 ease-out ">
                <ul className=" list-check-green-600 space-y-4 bg-gradient-to-r from-neutral-900 to-slate-900 bg-clip-text py-2 text-sm text-transparent">
                  {faq.answer.map((point, pointIndex) => (
                    <li className="mx-4" key={pointIndex}>
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 h-[40px] w-full"></div>
                <button className="group/button absolute bottom-0 left-0 flex w-full items-center justify-center gap-1 rounded-b-md bg-gradient-to-r from-neutral-900 to-slate-900 py-2 font-semibold text-white  opacity-0 transition-all group-data-[state=open]:opacity-100 ">
                  <span>En savoir plus</span>
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

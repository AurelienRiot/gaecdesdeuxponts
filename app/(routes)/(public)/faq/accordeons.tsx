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
      className="mt-8 flex w-full flex-col gap-4"
      value={value}
      onValueChange={setValue}
    >
      {data.map((faq, index) => (
        <AccordionPrimitive.Item
          key={index}
          value={`item-${index}`}
          onMouseEnter={() => setValue(`item-${index}`)}
          className="group relative cursor-pointer overflow-hidden rounded-lg border-2 border-violet-600 "
        >
          <AccordionPrimitive.Trigger className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text p-4 text-left text-xl font-medium text-transparent group-first:rounded-t-md group-last:rounded-b-md">
            {faq.question}
          </AccordionPrimitive.Trigger>
          <AccordionPrimitive.Content className="transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className=" flex flex-col justify-between   transition-opacity duration-200 ease-out">
              <ul className=" list-inside list-disc space-y-1 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text py-2 text-sm text-transparent">
                {faq.answer.map((point, pointIndex) => (
                  <li className="" key={pointIndex}>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="h-[40px] w-full"></div>
              <button className="group/button absolute bottom-0 left-0 flex w-full items-center justify-center gap-1 rounded-b-md bg-gradient-to-r from-violet-600 to-indigo-600 py-2 text-white opacity-0  transition-all group-data-[state=open]:opacity-100 group-data-[state=open]:duration-500">
                <span>En savoir plus</span>
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover/button:translate-x-1"
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
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
};

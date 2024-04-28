"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ScrollToTarget = ({
  className,
  text,
  target,
}: {
  className?: string;
  text: string;
  target: string;
}) => {
  const scrollToTarget = () => {
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <Button
      className={cn("cursor-pointer text-base hover:underline", className)}
      asChild
    >
      <a onClick={() => scrollToTarget()} aria-label={`Scroll to ${text}`}>
        {" "}
        {text}
      </a>
    </Button>
  );
};

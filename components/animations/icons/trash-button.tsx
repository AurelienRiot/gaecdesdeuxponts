import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const TrashButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { svgClassName?: string }>(
  ({ svgClassName, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant: "destructive", size: "sm" }),
          "group/delete cursor-pointer select-none flex items-center gap-2 justify-start",
          className,
        )}
        {...props}
      >
        {children}
        <TrashSVG className={svgClassName} />
      </button>
    );
  },
);

function TrashSVG({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(" overflow-visible size-5", className)}
    >
      <g className=" group-hover/delete:-translate-y-px group-hover/delete:rotate-12 transition-transform origin-[87.5%_25%] ">
        <path d="M3 6h18" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </g>
      <path
        className="group-hover/delete:translate-y-px transition-transform "
        d="M19 8v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V8"
      />
      <line className="group-hover/delete:translate-y-px transition-transform " x1="10" x2="10" y1="11" y2="17" />
      <line className="group-hover/delete:translate-y-px transition-transform " x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

export default TrashButton;

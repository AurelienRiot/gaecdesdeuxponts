"use client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  url?: string;
}

const ButtonBackward = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, disabled, type = "button", url, ...props }, ref) => {
    const router = useRouter();
    const handleClick = () => {
      if (url) {
        router.push(url);
      } else {
        router.back();
      }
    };
    return (
      <button
        className={cn(
          "w-auto rounded-full  border-transparent px-8 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-primary-foreground font-semibold   animate-shine bg-gradient-to-r from-primary via-primary/75 to-primary   bg-[length:400%_100%] ",
          className
        )}
        onClick={handleClick}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        <HiArrowNarrowLeft className="w-6 h-6 " />
      </button>
    );
  }
);

ButtonBackward.displayName = "Button";

export default ButtonBackward;

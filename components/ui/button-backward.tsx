"use client";
import { cn } from "@/lib/utils";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  url?: string;
}

const ButtonBackward = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, disabled, type = "button", url, onClick, ...props }, ref) => {
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
          "w-auto animate-shine rounded-full border-transparent bg-gradient-to-r from-primary via-primary/75 to-primary bg-[length:400%_100%] px-8 py-3 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        onClick={onClick || handleClick}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        <MoveLeft className="h-6 w-6" />
      </button>
    );
  },
);

ButtonBackward.displayName = "Button";

export default ButtonBackward;

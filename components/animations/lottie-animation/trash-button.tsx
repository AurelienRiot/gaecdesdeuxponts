"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import * as React from "react";
import TrashV2 from "./trashV2.json";

interface TrashButtonProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "onMouseEnter" | "onMouseLeave"
    >,
    VariantProps<typeof buttonVariants> {
  iconClassName?: string;
  color?: string;
}

export const TrashButton = React.forwardRef<
  HTMLButtonElement,
  TrashButtonProps
>(
  (
    {
      className,
      variant,
      size,
      color = "hsl(var(--destructive-foreground))",
      iconClassName,
      children,
      ...props
    },
    ref,
  ) => {
    const lottieRef = React.useRef<LottieRefCurrentProps>(null);

    const handleMouseEnter = () => {
      if (!lottieRef.current) return;
      lottieRef.current.setDirection(1); // Play forward
      lottieRef.current.play();
    };

    const handleMouseLeave = () => {
      if (!lottieRef.current) return;
      lottieRef.current.setDirection(-1); // Play backward
      lottieRef.current.play();
    };

    React.useEffect(() => {
      if (
        
        lottieRef?.current?.animationContainerRef.current
      ) {
        const svgElements =
          lottieRef.current.animationContainerRef.current.querySelectorAll(
            "path",
          );
          for (const element of svgElements) {
            if (element.getAttribute("stroke") === "rgb(0,0,0)") {
              element.setAttribute("stroke", color);
            }
          }
       
      }
    }, [color]);

    return (
      <button
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
        <Lottie
          lottieRef={lottieRef}
          animationData={TrashV2}
          className={iconClassName}
          loop={false}
          autoplay={false}
        />
      </button>
    );
  },
);

TrashButton.displayName = "TrashButton";

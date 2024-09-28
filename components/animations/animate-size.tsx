import { cn } from "@/lib/utils";
import * as React from "react";

export interface AnimateProps extends React.HTMLAttributes<HTMLDivElement> {
  display?: boolean;
}

const AnimateHeightOuter = React.forwardRef<HTMLDivElement, AnimateProps>(
  ({ className, display, children, ...props }, ref) => {
    return (
      <div
        data-state={display}
        className={cn(
          "group/height grid grid-rows-[0fr] data-[state=true]:grid-rows-[1fr]  transition-all duration-500 ",
          className,
        )}
        ref={ref}
        {...props}
        aria-hidden={!display}
      >
        {children}
      </div>
    );
  },
);
AnimateHeightOuter.displayName = "AnimateHeightOuter";

const AnimateHeightInner = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("overflow-hidden group-data-[state=false]/height:py-0 transition-all", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);
AnimateHeightInner.displayName = "AnimateHeightInner";

const AnimateHeight = React.forwardRef<HTMLDivElement, AnimateProps>(({ display, children, ...props }, ref) => {
  return (
    <AnimateHeightOuter display={display}>
      <AnimateHeightInner ref={ref} {...props}>
        {children}
      </AnimateHeightInner>
    </AnimateHeightOuter>
  );
});
AnimateHeight.displayName = "AnimateHeight";

const AnimateWidthOuter = React.forwardRef<HTMLDivElement, AnimateProps>(
  ({ className, display, children, ...props }, ref) => {
    return (
      <div
        data-state={display}
        className={cn(
          "group/width grid grid-cols-[0fr] data-[state=true]:grid-cols-[1fr] transition-all duration-500 ",
          className,
        )}
        ref={ref}
        {...props}
        aria-hidden={!display}
      >
        {children}
      </div>
    );
  },
);
AnimateWidthOuter.displayName = "AnimateWidthOuter";

const AnimateWidthInner = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("overflow-hidden group-data-[state=false]/width:px-0 transition-all", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);
AnimateWidthInner.displayName = "AnimateWidthInner";

const AnimateWidth = React.forwardRef<HTMLDivElement, AnimateProps>(({ display, children, ...props }, ref) => {
  return (
    <AnimateWidthOuter display={display}>
      <AnimateWidthInner ref={ref} {...props}>
        {children}
      </AnimateWidthInner>
    </AnimateWidthOuter>
  );
});
AnimateWidth.displayName = "AnimateWidth";

export { AnimateHeightOuter, AnimateHeightInner, AnimateHeight, AnimateWidthOuter, AnimateWidthInner, AnimateWidth };

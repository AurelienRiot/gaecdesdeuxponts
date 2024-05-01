import { cn } from "@/lib/utils";

type SkeletonProps =
  | (React.HTMLAttributes<HTMLDivElement> & {
      as?: "div";
    })
  | (React.HTMLAttributes<HTMLSpanElement> & {
      as?: "span";
    });

function Skeleton({ className, as = "div", ...props }: SkeletonProps) {
  return (
    <>
      {as === "div" ? (
        <div
          className={cn(
            "animate-[pulse_1s_ease-in-out_infinite] rounded-md bg-muted-foreground/50",
            className,
          )}
          {...props}
        />
      ) : (
        <span
          className={cn(
            "block animate-[pulse_1s_ease-in-out_infinite] rounded-md bg-muted-foreground/50",
            className,
          )}
          {...props}
        />
      )}
    </>
  );
}

export { Skeleton };

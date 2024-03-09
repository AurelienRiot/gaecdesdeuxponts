import { cn } from "@/lib/utils";

type SkeletonProps =
  | (React.HTMLAttributes<HTMLDivElement> & {
      className?: string;
      as?: "div";
    })
  | (React.HTMLAttributes<HTMLSpanElement> & {
      className?: string;
      as?: "span";
    });

function Skeleton({ className, as = "div", ...props }: SkeletonProps) {
  return (
    <>
      {as === "div" ? (
        <div
          className={cn(
            "animate-pulse rounded-md bg-muted-foreground/50",
            className,
          )}
          {...props}
        />
      ) : (
        <span
          className={cn(
            "animate-pulse rounded-md bg-muted-foreground/50",
            className,
          )}
          {...props}
        />
      )}
    </>
  );
}

export { Skeleton };

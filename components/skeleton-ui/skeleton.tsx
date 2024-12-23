import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";

const skeletonVariants = cva("block rounded-md animate-[pulse_1s_ease-in-out_infinite]  bg-muted-foreground/50 ", {
  variants: {
    variant: {
      default: " ",
      green: "bg-green-500/50",
    },
    size: {
      default: "h-4 w-40",
      xs: "h-2 w-20",
      sm: "h-3 w-24",
      lg: "h-6 w-60",
      xl: "h-8 w-80",
      icon: "size-6 rounded-full",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type SkeletonProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof skeletonVariants>;

export function Skeleton({ className, variant, size, ...props }: SkeletonProps) {
  return <span className={cn(skeletonVariants({ variant, size, className }))} {...props} />;
}

export function SkeletonText({ lines = 10 }: { lines?: number }) {
  const sizes = ["default", "xs", "sm", "lg", "xl"] as const;
  return (
    <div className="space-y-4">
      {[...Array(lines)].map((_, index) => (
        <Skeleton key={index} size={sizes[Math.floor(Math.random() * sizes.length)]} />
      ))}
    </div>
  );
}

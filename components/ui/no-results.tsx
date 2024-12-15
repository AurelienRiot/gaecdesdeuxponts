import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const NoResults = ({ text, className, ...props }: HTMLAttributes<HTMLDivElement> & { text?: string }) => {
  return (
    <div className={cn("flex h-full w-full items-center justify-center text-neutral-500", className)} {...props}>
      {text ?? "Aucun résultat"}
    </div>
  );
};

export default NoResults;

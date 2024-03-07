import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { cn } from "@/lib/utils";

const Loading = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex flex-col flex-wrap items-center justify-center min-h-0 mt-20",
        className
      )}
    >
      <div className=" relative w-[40vw]  h-2 bg-primary-foreground rounded border-2 overflow-hidden">
        <div className="absolute h-full rounded bg-primary animate-load-bar"></div>
        <div
          style={{ animationDelay: `500ms` }}
          className="absolute h-full rounded bg-primary animate-load-bar"
        ></div>
      </div>
      <div className="flex items-center self-center min-h-0 p-4 space-x-4 justify-self-center place-self-center">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] max-w-full " />
          <Skeleton className="h-4 w-[200px]  max-w-full" />
        </div>
      </div>
    </div>
  );
};

export default Loading;

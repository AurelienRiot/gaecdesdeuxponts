import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { cn } from "@/lib/utils";

const Loading = ({ className }: { className?: string }) => {
  return (
    <div className={cn("mt-20 flex min-h-0 flex-col flex-wrap items-center justify-center", className)}>
      <div className=" relative h-2  w-[40vw] overflow-hidden rounded border-2 bg-primary-foreground">
        <div className="absolute h-full animate-load-bar rounded bg-primary"></div>
        <div style={{ animationDelay: `500ms` }} className="absolute h-full animate-load-bar rounded bg-primary"></div>
      </div>
      <div className="flex min-h-0 items-center space-x-4 place-self-center self-center justify-self-center p-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] max-w-full " />
          <Skeleton className="h-4 w-[200px]  max-w-full" />
        </div>
      </div>
    </div>
  );
};

export default Loading;

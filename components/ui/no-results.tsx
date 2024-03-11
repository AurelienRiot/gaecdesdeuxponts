import { cn } from "@/lib/utils";

const NoResults = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center text-neutral-500",
        className,
      )}
    >
      Aucun résultat
    </div>
  );
};

export default NoResults;

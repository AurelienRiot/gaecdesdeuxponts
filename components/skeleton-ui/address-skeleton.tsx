import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

const SkeletonAdressInput = ({ label }: { label: string }) => {
  return (
    <div className="justify-left  flex w-full items-center gap-1">
      <span className="inline min-w-max text-sm">{label + " :"}</span>

      <div className="flex h-6 w-full items-center justify-center rounded-md border px-2 py-1 text-sm">
        <Skeleton className="h-4 w-full rounded-full" />
      </div>
    </div>
  );
};

export const SkeletonAdressForm = ({ className }: { className?: string }) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-col gap-2">
        <div>Adresse</div>
        <div>
          <Skeleton className="h-6 w-40 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-1 ">
        <SkeletonAdressInput label="Adresse" />
        <SkeletonAdressInput label="Complément d'adresse" />
        <SkeletonAdressInput label="Ville" />
        <SkeletonAdressInput label="Code postal" />
        <SkeletonAdressInput label="Région" />
      </div>
    </div>
  );
};

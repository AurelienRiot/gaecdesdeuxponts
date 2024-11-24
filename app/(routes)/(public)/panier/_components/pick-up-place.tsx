import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { Shop } from "@prisma/client";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import { makeCartUrl } from "./summary";

const farmShopId = process.env.NEXT_PUBLIC_FARM_ID;

const PickUpPlace = ({
  date,
  shopId,
  setOpen,
  shops,
  className,
  role,
}: {
  date: Date | undefined;
  shopId: string | undefined;
  setOpen: Dispatch<SetStateAction<boolean>>;
  shops: Shop[];
  className?: string;
  role: string | undefined;
}) => {
  const router = useRouter();
  return (
    <>
      {role === "pro" || role === "admin" ? (
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="domicile" className="text-base font-medium text-secondary-foreground">
            Livraison à domicile
          </Label>
          <Switch
            id="domicile"
            checked={shopId === "domicile"}
            onCheckedChange={(check) =>
              router.push(makeCartUrl(check ? "domicile" : undefined, date), {
                scroll: false,
              })
            }
          />
        </div>
      ) : null}
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="farm-pickup" className="text-base font-medium text-secondary-foreground">
          Venir chercher à la ferme
        </Label>
        <Switch
          id="farm-pickup"
          checked={shopId === farmShopId}
          onCheckedChange={(check) =>
            router.push(makeCartUrl(check ? farmShopId : undefined, date), {
              scroll: false,
            })
          }
        />
      </div>
      {shopId !== "domicile" && shopId !== farmShopId ? (
        <div className={cn("relative   flex items-center justify-between ", className)}>
          <div className="text-base font-medium text-secondary-foreground">Lieu de retrait</div>
          <Button
            variant={"outline"}
            className={cn("w-[240px] pl-3 text-left font-normal", !date && "text-muted-foreground")}
            onClick={() => setOpen((open) => !open)}
          >
            {shopId ? shops.find((shop) => shop.id === shopId)?.name : <span>Choisir un lieu</span>}
            <Icons.pinMap data-state={!!shopId} className="ml-auto h-4 w-4 opacity-100 data-[state=false]:opacity-50" />
          </Button>
        </div>
      ) : null}
    </>
  );
};

export default PickUpPlace;

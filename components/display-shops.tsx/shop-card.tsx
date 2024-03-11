"use client";
import { AlertModal } from "@/components/ui/alert-modal-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, haversine } from "@/lib/utils";
import { Shop } from "@prisma/client";
import { ClipboardEdit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef, useState } from "react";
import { formatPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import { deleteShop } from "../../app/(routes)/admin/shops/[shopId]/components/server-actions";
import { Icons } from "../icons";

type ShopCardProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> & {
  shop: Shop;
  coordinates: { long: number | undefined; lat: number | undefined };
  display: "admin" | "find" | "cart" | "profile";
  onSelect?: (shopId: string) => void;
};

export const ShopCard = forwardRef<HTMLDivElement, ShopCardProps>(
  ({ shop, coordinates, display, className, onSelect, ...props }, ref) => {
    const distance = haversine(coordinates, { lat: shop.lat, long: shop.long });
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const onDelete = async () => {
      const deletesh = await deleteShop({ id: shop.id });
      if (!deletesh.success) {
        toast.error(deletesh.message);
        setOpen(false);
      } else {
        router.push(`/admin/categories`);
        router.refresh();
        toast.success("Magasin supprimé");
      }
      setOpen(false);
    };

    return (
      <>
        {display === "admin" && (
          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
          />
        )}
        <Card
          data-state={display}
          className={cn(
            "jutify-between flex h-full w-full min-w-[300px] flex-col ",
            className,
          )}
          {...props}
          ref={ref}
        >
          <CardHeader>
            <CardTitle>{shop.name}</CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <CardDescription className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {shop.description}
                </CardDescription>
              </TooltipTrigger>
              <TooltipContent>
                <CardDescription className="max-w-[300px]">
                  {shop.description}
                </CardDescription>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {!!shop.address && (
              <CardDescription>
                <span className="font-bold">Adresse :</span>{" "}
                {/* <Link
              href={`https://maps.google.com/?q=${shop.address}`}
              className="inline p-1 underline-offset-2 hover:underline"
              target="_blank"
            > */}
                {shop.address}
                {/* </Link> */}
              </CardDescription>
            )}
            {!!shop.phone && (
              <CardDescription>
                <span className="font-bold">Téléphone :</span>{" "}
                {formatPhoneNumber(shop.phone)}
              </CardDescription>
            )}
            {!!shop.email && (
              <CardDescription>
                {" "}
                <span className="font-bold">Mail :</span> {shop.email}
              </CardDescription>
            )}
            {!!shop.website && (
              <CardDescription>
                {" "}
                <span className="font-bold">Site internet :</span>{" "}
                {shop.website}
              </CardDescription>
            )}
            {distance !== undefined && (
              <CardDescription>
                {" "}
                <span className="font-bold">Distance :</span>{" "}
                <span className="underline underline-offset-2">
                  {Math.round(distance)} kilometers
                </span>
              </CardDescription>
            )}
          </CardContent>
          {display === "admin" && (
            <CardFooter className="flex flex-row items-end justify-between  gap-2">
              <Button
                variant="destructive"
                onClick={() => setOpen(true)}
                className="hover:underline"
              >
                Supprimer
              </Button>
              <Button
                variant={"expandIcon"}
                iconPlacement="right"
                Icon={ClipboardEdit}
                asChild
              >
                <Link href={`/admin/shops/${shop.id}`}>Modifier</Link>
              </Button>
            </CardFooter>
          )}
          {display === "cart" && (
            <CardFooter className="flex flex-row  justify-center  gap-2">
              <Button
                variant={"expandIcon"}
                iconPlacement="right"
                Icon={Icons.pinMap}
                className="place-items-end"
                onClick={() => {
                  onSelect?.(shop.id);
                  setOpen(false);
                }}
              >
                Selectionner
              </Button>
            </CardFooter>
          )}
        </Card>
      </>
    );
  },
);

ShopCard.displayName = "ShopCard";

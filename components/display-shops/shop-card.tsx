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
import { AutosizeTextarea } from "../ui/autosize-textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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
            "flex h-full w-full min-w-[300px] max-w-[90vw] flex-col justify-between ",
            className,
          )}
          ref={ref}
          {...props}
        >
          <CardHeader>
            <CardTitle>{shop.name}</CardTitle>
            <CardInfo description={shop.description} />
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {!!shop.address && (
              <CardDescription>
                <span className="font-bold">Adresse :</span>{" "}
                <Button asChild variant={"link"} className="px-0">
                  <Link
                    href={`https://maps.google.com/?q=${shop.address}`}
                    target="_blank"
                  >
                    {shop.address}
                  </Link>
                </Button>
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
                <span className="font-bold">Mail :</span>{" "}
                {shop.email.toLocaleLowerCase()}
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

const CardInfo = ({ description }: { description: string }) => {
  if (!description) {
    return null;
  }
  return (
    <Popover>
      <PopoverTrigger>
        <CardDescription className="overflow-hidden text-ellipsis whitespace-nowrap underline-offset-2 hover:underline">
          <Icons.search className="mb-1 mr-1 inline h-4 w-4 self-center" />{" "}
          {description}
        </CardDescription>
      </PopoverTrigger>
      <PopoverContent
        className={
          " hide-scrollbar z-[101]   w-[400px] max-w-[90vw]    overscroll-none border-4 border-border p-0 outline-none"
        }
        align="center"
        side="bottom"
      >
        <AutosizeTextarea
          className="flex resize-none items-center justify-center border-none bg-transparent pt-4 text-sm outline-none focus-visible:ring-0 disabled:cursor-default disabled:opacity-100"
          value={description}
          disabled
        />
      </PopoverContent>
    </Popover>
  );
};

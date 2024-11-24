import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { haversine } from "@/lib/math";
import { cn, formatFrenchPhoneNumber } from "@/lib/utils";
import type { FullShop } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";
import { Icons } from "../icons";
import { AutosizeTextarea } from "../ui/autosize-textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import DisplayHours from "./display-hours";
import ShopDeleteButton from "./shop-delete-button";

type ShopCardProps = React.HTMLAttributes<HTMLDivElement> & {
  shop: FullShop;
  coordinates: { long: number | undefined; lat: number | undefined };
  display: "admin" | "find" | "profile" | "cart";
};

export const ShopCard = forwardRef<HTMLDivElement, ShopCardProps>(
  ({ shop, coordinates, display, className, children, ...props }, ref) => {
    const distance = haversine(coordinates, { lat: shop.lat, long: shop.long });

    return (
      <>
        <Card
          data-state={display}
          className={cn("relative flex h-full w-full min-w-[300px]  max-w-[90vw] flex-col justify-between ", className)}
          ref={ref}
          {...props}
        >
          <CardHeader>
            <CardTitle className="flex  items-center justify-left  gap-6">
              {shop.imageUrl ? (
                <Image
                  src={shop.imageUrl}
                  alt={shop.name}
                  width={64}
                  height={64}
                  className="rounded-sm object-contain h-16 w-auto max-w-[25%]"
                />
              ) : null}
              <span className="text-balance text-center text-lg sm:text-xl lg:text-2xl">{shop.name}</span>
            </CardTitle>
            <CardInfo description={shop.description} type={shop.type} />
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {!!shop.address && (
              <Button asChild variant={"link"} className="justify-start px-0">
                <Link href={`https://maps.google.com/?q=${shop.address} ${shop.name} `} target="_blank">
                  {shop.address}
                </Link>
              </Button>
            )}
            {!!shop.phone && (
              <Link href={`tel:${shop.phone}`} target="_blank">
                {formatFrenchPhoneNumber(shop.phone)}
              </Link>
            )}
            {!!shop.email && (
              <Link href={`mailto:${shop.email.toLocaleLowerCase()}`} target="_blank">
                {shop.email.toLocaleLowerCase()}
              </Link>
            )}
            {!!shop.website && (
              <Link href={shop.website} target="_blank" className="overflow-hidden text-ellipsis whitespace-nowrap">
                {shop.website}
              </Link>
            )}
            {shop.shopHours && <DisplayHours shopHours={shop.shopHours} />}
            {distance !== undefined && (
              <div>
                {" "}
                <span className="font-bold">Distance :</span>{" "}
                <span className="underline underline-offset-2">{Math.round(distance)} kilometers</span>
              </div>
            )}
          </CardContent>
          {display === "admin" && <ShopDeleteButton shopId={shop.id} />}
          {children}
        </Card>
      </>
    );
  },
);

ShopCard.displayName = "ShopCard";

export const CardInfo = ({ description, type }: { description: string; type: string }) => {
  const typeText =
    type === "sell"
      ? "Acheter nos produits"
      : type === "product"
        ? "Acheter les produits fais avec notre lait"
        : type === "amap"
          ? "Commander nos produits laitiers"
          : "Acheter nos produits ainsi que les produits fait avec notre lait";
  if (!description) {
    return <p className="text-center">{typeText}</p>;
  }
  return (
    <Popover>
      <PopoverTrigger>
        {typeText}
        <CardDescription className="overflow-hidden text-ellipsis whitespace-nowrap underline-offset-2 hover:underline">
          <Icons.search className="mb-1 mr-1 inline h-4 w-4 self-center" /> {description}
        </CardDescription>
      </PopoverTrigger>
      <PopoverContent
        className={
          "  w-[400px]   max-w-[90vw] overscroll-none    border-4 border-border p-0 outline-none hide-scrollbar"
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

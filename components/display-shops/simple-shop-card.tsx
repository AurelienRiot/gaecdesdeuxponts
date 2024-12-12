import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Shop } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { typeTextRecord } from ".";
import { buttonVariants } from "../ui/button";

export function SimpleShopCard({
  shop,
  coordinates,
  className,
}: {
  shop: Shop;
  coordinates?: { long: number | undefined; lat: number | undefined };
  className?: string;
}) {
  const typeText = typeTextRecord[shop.type];

  return (
    <Card className={cn("relative flex flex-col justify-between w-full max-w-xs p-4", className)}>
      <CardHeader className="p-0 mb-2">
        <CardTitle className="flex items-center gap-4">
          {shop.imageUrl ? (
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm">
              <Image
                src={shop.imageUrl}
                alt={shop.name}
                width={64}
                height={64}
                className="h-full w-full object-contain"
              />
            </div>
          ) : null}
          <span className="text-center text-base sm:text-md lg:text-lg break-words">{shop.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 mb-4">
        <p className="text-sm sm:text-base">{typeText}</p>
      </CardContent>
      <CardFooter className="p-0">
        <Link
          href={`/ou-nous-trouver/${shop.id}`}
          className={cn(buttonVariants({ variant: "default" }), "w-full hover:underline")}
        >
          En savoir plus
        </Link>
      </CardFooter>
    </Card>
  );
}

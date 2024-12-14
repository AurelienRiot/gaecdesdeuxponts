import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Shop } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import DisplayTags from "./display-tags";
import { ArrowRightCircle, Icon, Plus, PlusCircle } from "lucide-react";

export function SimpleShopCard({
  shop,
  coordinates,
  className,
}: {
  shop: Shop;
  coordinates?: { long: number | undefined; lat: number | undefined };
  className?: string;
}) {
  return (
    <Card className={cn("relative flex flex-col justify-between w-full max-w-xs p-4 gap-6", className)}>
      <CardHeader className="p-0 mb-2">
        <CardTitle className="flex items-center justify-center gap-4 h-16">
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
      <CardContent className="p-0 space-y-4">
        {/* <p className="text-sm sm:text-base">{typeText}</p> */}
        <DisplayTags shopTags={shop.tags} />
        <Link
          href={`https://maps.google.com/?q=${shop.address} ${shop.name} `}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "link" }), "justify-start px-0 text-blue-700 font-semibold text-md")}
        >
          {shop.address}
        </Link>
      </CardContent>
      <CardFooter className="p-0">
        <Link
          href={`/ou-nous-trouver/${shop.id}`}
          className={cn(buttonVariants({ variant: "default" }), "w-full items-center flex hover:underline group")}
        >
          <span>En savoir plus</span>
          <ArrowRightCircle className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </CardFooter>
    </Card>
  );
}

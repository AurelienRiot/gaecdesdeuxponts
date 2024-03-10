import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { haversine } from "@/lib/utils";
import { Shop } from "@prisma/client";

export const ShopCard = ({
  shop,
  coordinates,
}: {
  shop: Shop;
  coordinates: { long: number | undefined; lat: number | undefined };
}) => {
  const distance = haversine(coordinates, { lat: shop.lat, long: shop.long });

  return (
    <Card className="flex h-full w-full min-w-[300px] flex-col ">
      <CardHeader>
        <CardTitle>{shop.name}</CardTitle>
        <CardDescription>{shop.description}</CardDescription>
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
            <span className="font-bold">Téléphone :</span> {shop.phone}
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
            <span className="font-bold">Site internet :</span> {shop.website}
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
    </Card>
  );
};

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import  type { Shop } from "@prisma/client";
import Image from "next/image";

const MarkerCard = ({ shop }: { shop: Shop }) => {
  return (
    <Card className="flex h-full w-full min-w-[300px] max-w-[90vw] flex-col justify-between">
      <CardHeader>
        <CardTitle className="flex cursor-pointer items-center justify-start gap-2">
          {shop.imageUrl ? (
            <span className="relative aspect-square h-[30px] rounded-sm bg-transparent transition-transform hover:scale-150">
              <Image
                src={shop.imageUrl}
                alt={shop.name}
                fill
                sizes="(max-width: 768px) 45px, (max-width: 1200px) 45px, 45px"
                className="rounded-sm object-cover"
              />
            </span>
          ) : null}
          <span className="text-lg sm:text-xl lg:text-2xl">{shop.name}</span>
        </CardTitle>
        {/* <CardInfo description={store.description} /> */}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {!!shop.address && (
          <Button asChild variant={"link"} className="justify-start px-0">
            <a
              href={`https://maps.google.com/?q=${shop.address} ${shop.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {shop.address}
            </a>
          </Button>
        )}
        {!!shop.phone && (
          <a
            href={`tel:${shop.phone}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {shop.phone}
          </a>
        )}
        {!!shop.email && (
          <a
            href={`mailto:${shop.email.toLocaleLowerCase()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {shop.email.toLocaleLowerCase()}
          </a>
        )}
        {!!shop.website && (
          <a href={shop.website} target="_blank" rel="noopener noreferrer">
            {shop.website}
          </a>
        )}
      </CardContent>
    </Card>
  );
};

export default MarkerCard;

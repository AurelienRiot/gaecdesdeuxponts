"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Icons } from "../icons";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatFrenchPhoneNumber } from "@/lib/utils";
import type { Shop } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: Shop[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getDirection = () => {
      if (containerRef.current) {
        if (direction === "left") {
          containerRef.current.style.setProperty("--animation-direction", "forwards");
        } else {
          containerRef.current.style.setProperty("--animation-direction", "reverse");
        }
      }
    };
    const getSpeed = () => {
      if (containerRef.current) {
        if (speed === "fast") {
          containerRef.current.style.setProperty("--animation-duration", "40s");
        } else if (speed === "normal") {
          containerRef.current.style.setProperty("--animation-duration", "60s");
        } else {
          containerRef.current.style.setProperty("--animation-duration", "80s");
        }
      }
    };
    function addAnimation() {
      if (containerRef.current && scrollerRef.current) {
        const scrollerContent = Array.from(scrollerRef.current.children);

        for (const item of scrollerContent) {
          const duplicatedItem = item.cloneNode(true);
          if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem);
          }
        }

        getDirection();
        getSpeed();
        setStart(true);
      }
    }
    addAnimation();
  }, [direction, speed]);
  const [start, setStart] = useState(false);

  return (
    <div
      ref={containerRef}
      className={cn(
        " relative z-20  max-w-[95vw] overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <div
        ref={scrollerRef}
        className={cn(
          " flex w-max min-w-full shrink-0 flex-nowrap gap-4 ",
          start && "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((shop, idx) => (
          <ShopCard shop={shop} key={idx} />
        ))}
      </div>
    </div>
  );
};

const StarRating = ({ rating }: { rating: number }) => {
  const normalizedRating = (rating / 10) * 5;

  const fullStars = Math.floor(normalizedRating);
  const halfStar = normalizedRating % 1 !== 0 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div title={`Note: ${rating} sur 10`} className="star-rating">
      {[...Array(fullStars)].map((_, i) => (
        <Icons.star key={`full-${i}`} className="inline size-4 fill-yellow-500 text-yellow-500" />
      ))}
      {[...Array(halfStar)].map((_, i) => (
        <Icons.HalfFilledStar key={`half-filled-${i}`} className="inline size-4" />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Icons.star key={`full-${i}`} className="inline size-4 fill-gray-400 text-gray-400" />
      ))}
    </div>
  );
};

function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Card className="max-w-sm flex flex-col justify-between">
      <CardTitle className="flex  cursor-pointer items-center justify-center gap-2 pt-2">
        {shop.imageUrl ? (
          <span className=" relative size-16 rounded-sm bg-transparent transition-transform hover:scale-150">
            <Image
              src={shop.imageUrl}
              alt={shop.name}
              fill
              sizes="(max-width: 768px) 45px, (max-width: 1200px) 45px, 45px"
              className="rounded-sm object-contain"
            />
          </span>
        ) : null}
        <span className="text-balance text-center  sm:text-lg lg:text-xl">{shop.name}</span>
      </CardTitle>
      <CardInfo description={shop.description} />

      <CardContent className="flex flex-col gap-2 text-xs">
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
          <Link href={shop.website} target="_blank">
            {shop.website}
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

export const CardInfo = ({ description }: { description: string }) => {
  if (!description) {
    return null;
  }
  return (
    <Popover>
      <PopoverTrigger>
        <CardDescription className="overflow-hidden text-xs text-ellipsis px-4 whitespace-nowrap underline-offset-2 hover:underline">
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

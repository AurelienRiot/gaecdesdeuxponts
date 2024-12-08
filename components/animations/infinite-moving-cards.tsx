"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatFrenchPhoneNumber } from "@/lib/utils";
import type { Shop, Link as ShopLink } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CardInfo } from "../display-shops/shop-card";
import { Icons } from "../icons";
import { DisplayLink } from "../user";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: (Shop & { links: ShopLink[] })[];
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

function ShopCard({ shop }: { shop: Shop & { links: ShopLink[] } }) {
  return (
    <Card className="max-w-sm flex flex-col justify-center ">
      <CardHeader className="py-2">
        <CardTitle className="flex  cursor-pointer items-center justify-left  gap-6">
          {shop.imageUrl ? (
            <Image
              src={shop.imageUrl}
              alt={shop.name}
              width={64}
              height={64}
              className="rounded-sm object-contain h-10 sm:h-16 w-auto max-w-[20%]"
            />
          ) : null}
          <span className="text-balance text-center text-lg sm:text-xl lg:text-2xl">{shop.name}</span>
        </CardTitle>
        <CardInfo description={shop.description} type={shop.type} />
      </CardHeader>

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
        <div className="flex gap-2">
          {shop.links.map(({ value, label }) => (
            <DisplayLink key={value} value={value} label={label} className="px-0" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

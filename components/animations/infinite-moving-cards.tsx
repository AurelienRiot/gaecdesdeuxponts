"use client";

import { cn } from "@/lib/utils";
import type { FullShop } from "@/types";
import React, { useEffect, useState } from "react";
import { SimpleShopCard } from "../display-shops/simple-shop-card";
import { Icons } from "../icons";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: FullShop[];
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
          <SimpleShopCard shop={shop} key={idx} />
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

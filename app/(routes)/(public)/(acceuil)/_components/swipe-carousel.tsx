"use client";
import { cn } from "@/lib/utils";
import type { Category } from "@prisma/client";
import { motion, useMotionValue } from "framer-motion";
import {type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";
import { ProductCard } from "./nos-produits";

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 5;
const DRAG_BUFFER = 50;

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

export const SwipeCarousel = ({
  className,
  categories,
}: {
  className?: string;
  categories: Category[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const dragX = useMotionValue(0);

  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, [categories?.length]);

  useEffect(() => {
    let intervalRef = null;

    if (!isHovered) {
      intervalRef = setInterval(() => {
        const x = dragX.get();

        if (x === 0) {
          setImgIndex((pv) => {
            if (pv === (categories?.length ?? 1) - 1) {
              return 0;
            }
            return pv + 1;
          });
        }
      }, AUTO_DELAY);
    }

    return () => {
      if (intervalRef) {
        clearInterval(intervalRef);
      }
    };
  }, [dragX, categories, isHovered]);

  if (!categories) {
    return null;
  }

  const onDragEnd = () => {
    const x = dragX.get();

    if (x <= -DRAG_BUFFER && imgIndex < categories.length - 1) {
      setImgIndex((pv) => pv + 1);
    } else if (x >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex((pv) => pv - 1);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden  py-8", className)}
    >
      <motion.div
        drag="x"
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        style={{
          x: dragX,
          width: `${categories.length * containerWidth}px`,
        }}
        animate={{
          translateX: -imgIndex * containerWidth,
        }}
        transition={SPRING_OPTIONS}
        onDragEnd={onDragEnd}
        className="flex cursor-grab  active:cursor-grabbing"
      >
        {categories.map((category, idx) => (
          <motion.div
            key={idx}
            animate={{
              scale: imgIndex === idx ? 0.95 : 0.85,
            }}
            transition={SPRING_OPTIONS}
            className="flex w-full flex-col items-center justify-center"
          >
            <ProductCard
              index={idx}
              key={category.id}
              name={category.name}
              description={category.description || ""}
              href={`/category/${encodeURIComponent(category.name)}`}
              imageUrl={category.imageUrl}
              className="w-[350px] "
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          </motion.div>
        ))}
      </motion.div>

      <Dots
        imgIndex={imgIndex}
        setImgIndex={setImgIndex}
        categories={categories}
      />
    </div>
  );
};

const Dots = ({
  imgIndex,
  setImgIndex,
  categories,
}: {
  imgIndex: number;
  setImgIndex: Dispatch<SetStateAction<number>>;
  categories: Category[];
}) => {
  return (
    <div className="mt-2 flex w-full justify-center gap-2">
      {categories.map((_, idx) => {
        return (
          <button
          type="button"
            aria-label={`Image ${idx + 1} sur ${categories.length}`}
            key={idx}
            onClick={() => setImgIndex(idx)}
            className={`h-3 w-3 rounded-full transition-colors ${
              idx === imgIndex
                ? "bg-neutral-500 dark:bg-neutral-300"
                : "bg-neutral-300 dark:bg-neutral-500"
            }`}
          />
        );
      })}
    </div>
  );
};

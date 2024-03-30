"use client";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
const ConicColor = {
  white: "rgba(255, 255, 255, 0) 75%, rgb(255, 255, 255) 100%)",
  purple: "rgba(167, 139, 250, 0) 75%, rgb(167, 139, 250) 100%)",
  multicolor:
    "hsl(360, 100%, 50%),hsl(315, 100%, 50%),  hsl(270, 100%, 50%),  hsl(225, 100%, 50%),  hsl(180, 100%, 50%),  hsl(135, 100%, 50%),  hsl(90, 100%, 50%),    hsl(45, 100%, 50%),  hsl(0, 100%, 50%))",
};

export const ConicGradientBorder = ({
  className,
  color,
}: {
  className?: string;
  color: keyof typeof ConicColor;
}) => {
  const rotation = useMotionValue(0);
  const backgroundImage = useMotionTemplate`conic-gradient(from ${rotation}turn, ${ConicColor[color]}`;
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );

    if (prefersReducedMotion) {
      rotation.set(0);
      return;
    }

    const duration = 3000;
    const animate = () => {
      const elapsedTime = performance.now() % duration;
      const progress = elapsedTime / duration;
      rotation.set(progress);
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [rotation, prefersReducedMotion]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 ">
      <motion.div
        className={cn(
          " mask-with-browser-support absolute -inset-[1px] rounded-full border border-transparent bg-origin-border",
          className,
        )}
        style={{
          backgroundImage,
        }}
      ></motion.div>
    </div>
  );
};

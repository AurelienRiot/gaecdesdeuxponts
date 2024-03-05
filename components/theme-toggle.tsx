"use client";

import { Button } from "@/components/ui/button";
import { interpolate } from "flubber";
import {
  motion,
  useAnimate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // className="bg-primary-foreground text-primary dark:border-2 "
  // >
  //   <SunIcon className="absolute rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100 h-6 w-6  " />
  //   <MoonIcon className="absolute  h-6 w-6   rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0  " />
  return (
    <Button
      variant={"rounded"}
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light");
        console.log(theme);
      }}
      size="icon"
      className="bg-primary-foreground text-primary rounded-full  px-0 py-0 "
    >
      <AnimatedIcon
        className="duration-300 transition-all h-6 w-6 "
        theme={theme}
      />

      <span className="sr-only w-0">Toggle theme</span>
    </Button>
  );
}

const AnimatedIcon = ({
  className,
  theme,
}: {
  className: string;
  theme: string | undefined;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [scope, animate] = useAnimate();
  const progress = useMotionValue(theme === "dark" ? 0 : 1);
  const indexOfPath = useMotionValue(theme === "dark" ? 1 : 0);
  const strokeWidth = useTransform(progress, [0, 1], [3, 0]);

  const path = useTransform(progress, [0, 1], [sun, moon], {
    mixer: (a, b) => interpolate(a, b, { maxSegmentLength: 1 }),
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted)
    return (
      <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={moon} />
      </svg>
    );

  const animatePath = () => {
    progress.stop();
    animate(progress, indexOfPath.get(), {
      duration: 0.5,
      ease: "easeInOut",
    });
    if (indexOfPath.get() === 0) {
      indexOfPath.set(1);
    } else {
      indexOfPath.set(0);
    }
  };

  return (
    <motion.svg
      className={className}
      ref={scope}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={animatePath}
    >
      <motion.path d={path} />
      <motion.path d={ray1} strokeWidth={strokeWidth} />
      <motion.path d={ray2} strokeWidth={strokeWidth} />
      <motion.path d={ray3} strokeWidth={strokeWidth} />
      <motion.path d={ray4} strokeWidth={strokeWidth} />
      <motion.path d={ray5} strokeWidth={strokeWidth} />
      <motion.path d={ray6} strokeWidth={strokeWidth} />
      <motion.path d={ray7} strokeWidth={strokeWidth} />
      <motion.path d={ray8} strokeWidth={strokeWidth} />
    </motion.svg>
  );
};

const sun = "M 8 12 a 4 4 0 0 1 8 0 a 4 4 0 0 1 -8 0";
const moon = "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z";
const ray1 = "M12 2v2";
const ray2 = "M12 20v2";
const ray3 = "m4.93 4.93 1.41 1.41";
const ray4 = "m17.66 17.66 1.41 1.41";
const ray5 = "M2 12h2";
const ray6 = "M20 12h2";
const ray7 = "m6.34 17.66-1.41 1.41";
const ray8 = "m19.07 4.93-1.41 1.41";

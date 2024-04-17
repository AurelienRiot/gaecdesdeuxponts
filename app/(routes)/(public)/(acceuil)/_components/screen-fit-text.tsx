"use client";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const ScreenFitText = ({ text }: { text: string }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const { scrollYProgress } = useScroll();
  const [initialFontSize, setInitialFontSize] = useState(100);
  const fontSizeResize = useTransform(
    scrollYProgress,
    [0, 0.02],
    [initialFontSize, 20],
  );
  const fontSize = useMotionTemplate`${fontSizeResize}px`;

  useEffect(() => {
    const adjustFontSize = () => {
      const container = containerRef.current;
      const text = textRef.current;
      const imageMain = document.getElementById("image-main");
      if (container && text && imageMain) {
        const containerWidth = container.offsetWidth;
        const textWidth = text.scrollWidth;
        const currentFontSize = parseFloat(text.style.fontSize);
        const newFontSize = Math.round(
          (containerWidth / textWidth) * currentFontSize - 3,
        );
        setInitialFontSize(newFontSize);
        console.log(text.offsetHeight);
        imageMain.style.marginTop = text.offsetHeight - 64 + "px";
      }
    };

    adjustFontSize();
    window.addEventListener("resize", adjustFontSize);

    return () => window.removeEventListener("resize", adjustFontSize);
  }, [text, initialFontSize]);

  return (
    <div
      className="absolute left-0 top-0 z-[100] flex min-h-16 w-full items-center overflow-hidden bg-background"
      ref={containerRef}
    >
      <motion.span
        className="mx-auto flex min-h-16 items-center justify-center whitespace-nowrap text-center font-mono  font-bold uppercase "
        ref={textRef}
        style={{ fontSize }}
      >
        {text}
      </motion.span>
    </div>
  );
};

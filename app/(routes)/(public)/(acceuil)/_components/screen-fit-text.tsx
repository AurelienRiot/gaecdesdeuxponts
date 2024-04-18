"use client";
import { cn } from "@/lib/utils";
import {
  useMotionTemplate,
  useScroll,
  useTransform,
  motion,
  easeInOut,
} from "framer-motion";
import { useEffect, useRef } from "react";

export const ScreenFitText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className={cn(
        "bg-trasparent z-[100] flex min-h-16 w-full  items-center justify-center  overflow-hidden rounded-b-md ",
        className,
      )}
      ref={containerRef}
    >
      <TextSVG text={text} />
    </div>
  );
};

const TextSVG = ({ text }: { text: string }) => {
  const { scrollYProgress } = useScroll();
  const textRef = useRef<SVGSVGElement>(null);
  const Width = useTransform(scrollYProgress, [0, 0.02], [100, 40], {
    ease: easeInOut,
  });
  const width = useMotionTemplate`${Width}%`;

  useEffect(() => {
    const adjustMarginTop = () => {
      const text = textRef.current;
      const imageMain = document.getElementById("image-main");
      if (text && imageMain) {
        const marginTop =
          text.getBoundingClientRect().height - 64 > 0
            ? text.getBoundingClientRect().height - 64
            : 0;
        imageMain.style.marginTop = `${marginTop}px`;
      }
    };

    adjustMarginTop();
    window.addEventListener("resize", adjustMarginTop);

    return () => window.removeEventListener("resize", adjustMarginTop);
  }, [text]);

  return (
    <motion.svg
      style={{ width }}
      ref={textRef}
      className="min-h-16 rounded-b-md bg-background px-2 transition-[width] sm:py-2"
      viewBox="0 0 63.618359 3.9511108"
      preserveAspectRatio="xMidYMid meet"
    >
      <g id="layer1" transform="translate(-10.195957,-59.363581)">
        <text
          style={{
            fontStyle: "normal",
            fontVariant: "normal",
            fontWeight: "normal",
            fontStretch: "normal",
            fontSize: "5.64444px",
            fontFamily: "Phosphate",
            fontVariantLigatures: "normal",
            fontVariantCaps: "normal",
            fontVariantNumeric: "normal",
            fontVariantEastAsian: "normal",
            textAlign: "center",
            textAnchor: "middle",
            fill: "#000000",
            strokeWidth: "0",
          }}
          x="41.906357"
          y="63.218735"
          id="text432"
        >
          <tspan
            id="tspan430"
            style={{
              fontStyle: "normal",
              fontVariant: "normal",
              fontWeight: "normal",
              fontStretch: "normal",
              fontSize: "5.64444px",
              fontFamily: "Phosphate",
              fontVariantLigatures: "normal",
              fontVariantCaps: "normal",
              fontVariantNumeric: "normal",
              fontVariantEastAsian: "normal",
              strokeWidth: "0",
            }}
            x="41.906357"
            y="63.218735"
          >
            {text}
          </tspan>
        </text>
      </g>
    </motion.svg>
  );
};

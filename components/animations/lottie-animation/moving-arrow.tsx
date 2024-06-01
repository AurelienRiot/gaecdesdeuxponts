"use client";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import arrowDown from "./arrowDown.json";
import * as React from "react";

interface MovingArrowProps {
  className?: string;
  color?: string;
}

const MovingArrow = ({
  color = "hsl(var(--destructive))",
  className,
}: MovingArrowProps) => {
  const lottieRef = React.useRef<LottieRefCurrentProps>(null);

  React.useEffect(() => {
    if (lottieRef.current && lottieRef.current.animationContainerRef.current) {
      const svgElements =
        lottieRef.current.animationContainerRef.current.querySelectorAll(
          "path",
        );
      svgElements.forEach((element: SVGPathElement) => {
        if (element.getAttribute("stroke") === "rgb(0,0,0)") {
          element.setAttribute("stroke", color);
        }
      });
    }
  }, [color]);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={arrowDown}
      className={className}
    />
  );
};

export default MovingArrow;

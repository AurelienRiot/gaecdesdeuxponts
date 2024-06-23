"use client";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
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
    if (lottieRef?.current?.animationContainerRef.current) {
      const svgElements =
        lottieRef.current.animationContainerRef.current.querySelectorAll(
          "path",
        );
        for (const element of svgElements) {
          if (element.getAttribute("stroke") === "rgb(0,0,0)") {
            element.setAttribute("stroke", color);
          }}
     
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

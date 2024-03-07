"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export type HTMLElements =
  | "div"
  | "section"
  | "article"
  | "span"
  | "header"
  | "footer"
  | "aside"
  | "nav"
  | "ul"
  | "li"
  | "ol"
  | "div"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "a"
  | "button";

export const motionVariant = {
  fade: {
    variations: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
  right: {
    variations: {
      initial: { opacity: 0, x: 100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 100 },
    },
  },
  left: {
    variations: {
      initial: { opacity: 0, x: -100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -100 },
    },
  },
  top: {
    variations: {
      initial: { opacity: 0, y: -100 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -100 },
    },
  },
  bottom: {
    variations: {
      initial: { opacity: 0, y: 100 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 100 },
    },
  },
  scaleY: {
    variations: {
      initial: { scaleY: 0 },
      animate: { scaleY: 1 },
      exit: { scaleY: 0 },
    },
  },
  scaleX: {
    variations: {
      initial: { scaleX: 0 },
      animate: { scaleX: 1 },
      exit: { scaleX: 0 },
    },
  },
};

type VisibleElementProps = Pick<
  React.HTMLAttributes<HTMLElement>,
  "onMouseEnter" | "onMouseLeave" | "onClick"
> & {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: keyof typeof motionVariant;
  as?: HTMLElements;

  amount?: number;
  duration?: number;
};
export const VisibleElement: React.FC<VisibleElementProps> = ({
  children,
  className,
  id,
  variant = "fade",
  as = "div",
  amount = 0.1,
  duration = 0.4,
  ...props
}) => {
  const elementRef = useRef(null);
  const isInView = useInView(elementRef, { amount });

  const MotionComponent = motion[as];

  return (
    <MotionComponent
      ref={elementRef}
      variants={motionVariant[variant].variations}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      exit="exit"
      transition={{ duration: duration }}
      className={className}
      id={id}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

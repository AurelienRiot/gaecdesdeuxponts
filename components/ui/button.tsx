import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all ring-offset-background  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        green: "bg-green-500 text-primary-foreground hover:bg-green-500/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        markdown: "font-normal bg-primary text-primary-foreground hover:bg-primary/90",
        // will-change-transform
        rounded:
          "w-auto rounded-full bg-primary text-primary-foreground px-5 py-3 disabled:cursor-not-allowed disabled:opacity-50  font-semibold hover:opacity-75  ",
        shadow:
          " bg-green-500 border-2 shadow-[-5px_5px_0_black] dark:shadow-[-5px_5px_0_white] hover:bg-green-500/90 border-black active:shadow-none dark:active:shadow-none",
        expandIcon: "group relative text-primary-foreground bg-primary hover:bg-primary/90",
        ringHover:
          "bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2",
        shine:
          "text-primary-foreground animate-shine bg-gradient-to-r from-primary via-primary/50 to-primary bg-[length:400%_100%] ",
        gooeyRight:
          "text-primary-foreground relative bg-primary z-0 overflow-hidden transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r from-zinc-400 before:transition-transform before:duration-1000  hover:before:translate-x-[0%] hover:before:translate-y-[0%] ",
        gooeyLeft:
          "text-primary-foreground relative bg-primary z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-400 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%] ",
        linkHover1:
          "relative after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300",
        linkHover2:
          "relative after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300",
        heartbeat: " animate-heartbeat  bg-green-500  text-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-8 px-2 rounded-md",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface IconProps {
  Icon: React.ElementType;
  iconPlacement: "left" | "right";
}

interface IconRefProps {
  Icon?: never;
  iconPlacement?: undefined;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export type ButtonIconProps = IconProps | IconRefProps;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps & ButtonIconProps>(
  ({ className, variant, size, asChild = false, iconPlacement, Icon, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {Icon && iconPlacement === "left" && (
          <div className="group-hover:translate-x-100 w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:pr-2 group-hover:opacity-100 ">
            <Icon />
          </div>
        )}
        <Slottable>{props.children}</Slottable>
        {Icon && iconPlacement === "right" && (
          <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:ml-2 group-hover:w-5 group-hover:translate-x-0 group-hover:opacity-100 ">
            <Icon />
          </div>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

const LoadingButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, disabled, children, type = "button", ...props }, ref) => {
    return (
      <button
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        <>
          {disabled && <Loader2 className={cn("h-4 w-4 animate-spin", children ? "mr-2" : "")} />}
          {children}
        </>
      </button>
    );
  },
);
LoadingButton.displayName = "LoadingButton";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  Icon: React.ElementType;
  iconClassName?: string;
  noStyle?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, noStyle, Icon, iconClassName, title, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          noStyle
            ? ""
            : "flex items-center justify-center rounded-full border bg-background p-2 shadow-md transition-all hover:scale-110 active:scale-95",
          className,
          props.disabled ? "cursor-not-allowed opacity-50 hover:scale-100 active:scale-100" : "",
        )}
        {...props}
      >
        {props.disabled ? (
          <Loader2 className={cn("animate-spin", iconClassName)} />
        ) : (
          <Icon className={iconClassName} />
        )}
        <span className="sr-only">{title}</span>
      </button>
    );
  },
);

IconButton.displayName = "IconButton";

export { Button, buttonVariants, IconButton, LoadingButton };

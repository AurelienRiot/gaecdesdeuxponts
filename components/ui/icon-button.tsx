import { cn } from "@/lib/utils";
import type{ MouseEventHandler } from "react";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  icon: React.ReactElement<any>;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      onClick={onClick}
      className={cn(
        "rounded-full flex items-center justify-center bg-background border shadow-md p-2 hover:scale-110 transition-all active:scale-95",
        className
      )}
    >
      {icon}
    </button>
  );
};

export default IconButton;

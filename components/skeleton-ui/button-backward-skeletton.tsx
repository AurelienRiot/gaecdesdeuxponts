import { cn } from "@/lib/utils";
import { MoveLeft } from "lucide-react";

const ButtonBackwardSkeletton = ({
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "w-auto animate-shine rounded-full border-transparent bg-gradient-to-r from-primary via-primary/75 to-primary bg-[length:400%_100%] px-8 py-3 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <MoveLeft className="h-6 w-6" />
    </button>
  );
};

export default ButtonBackwardSkeletton;

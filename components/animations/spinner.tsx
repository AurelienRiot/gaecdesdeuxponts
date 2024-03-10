import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type SpinnerProps = React.ComponentProps<typeof Loader2>;

const Spinner = ({ className, size = 50, ...props }: SpinnerProps) => {
  return (
    <Loader2
      className={cn("animate-spin text-primary ", className)}
      size={size}
      {...props}
    />
  );
};
export default Spinner;

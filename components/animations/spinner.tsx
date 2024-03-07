import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

type SpinnerProps = React.ComponentProps<typeof Loader>;

const Spinner = ({ className, size = 50, ...props }: SpinnerProps) => {
  return (
    <Loader
      className={cn("animate-spin text-sky-500 ", className)}
      size={size}
      {...props}
    />
  );
};
export default Spinner;

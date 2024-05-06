import { cn, currencyFormatter } from "@/lib/utils";
import { Skeleton } from "../skeleton-ui/skeleton";

interface CurrencyProps {
  value?: number | null;
  className?: string;
}

const Currency: React.FC<CurrencyProps> = ({ value, className }) => {
  if (typeof value !== "number") return <Skeleton className="h-4 w-12" />;
  return (
    <span
      className={cn(
        `inline   items-center font-sans font-medium tabular-nums text-primary `,
        className,
      )}
    >
      {`${currencyFormatter.format(value)} `}
    </span>
  );
};

export default Currency;

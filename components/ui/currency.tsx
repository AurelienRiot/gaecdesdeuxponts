import { cn, currencyFormatter } from "@/lib/utils";
import { Skeleton } from "../skeleton-ui/skeleton";
import { getUnitLabel } from "../product/product-function";
import type{ Unit } from "@prisma/client";

interface CurrencyProps {
  value?: number | null;
  unit?: Unit | null;
  className?: string;
}

const Currency: React.FC<CurrencyProps> = ({ value, className, unit }) => {
  if (typeof value !== "number") return <Skeleton className="h-4 w-12" />;
  return (
    <span
      className={cn(
        `inline   items-center font-sans font-medium tabular-nums text-primary `,
        className,
      )}
    >
      {`${currencyFormatter.format(value)} `} {getUnitLabel(unit).price}
    </span>
  );
};

export default Currency;

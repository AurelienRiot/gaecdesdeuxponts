"use client";

import { cn, currencyFormatter } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CurrencyProps {
  value: number;
  className?: string;
  classNameLogo?: string;
  displayText?: boolean;
  displayLogo?: boolean;
}

const Currency: React.FC<CurrencyProps> = ({ value, className }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <span
      className={cn(
        `inline   items-center font-semibold tabular-nums text-primary `,
        className,
      )}
    >
      {`${currencyFormatter.format(value)} `}
    </span>
  );
};

export default Currency;

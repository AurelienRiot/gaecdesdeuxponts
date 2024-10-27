"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const AutoCloseSheet = ({
  setIsOpen,
}: {
  setIsOpen: () => void;
}) => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (pathName && searchParams) {
      setIsOpen();
    }
  }, [pathName, searchParams, setIsOpen]);

  return null;
};

export default AutoCloseSheet;

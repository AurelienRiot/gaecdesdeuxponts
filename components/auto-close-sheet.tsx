"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const AutoCloseSheet = ({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    setIsOpen(false);
  }, [pathName, searchParams, setIsOpen]);

  return null;
};

export default AutoCloseSheet;

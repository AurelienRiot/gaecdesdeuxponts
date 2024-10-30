"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const AutoCloseSheet = ({
  onChange,
}: {
  onChange: () => void;
}) => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [prevState, setPrevState] = useState<{ pathname: string; search: string }>({
    pathname: pathName,
    search: searchParams.toString(),
  });
  useEffect(() => {
    if (pathName !== prevState.pathname || searchParams.toString() !== prevState.search) {
      onChange();
      setPrevState({
        pathname: pathName,
        search: searchParams.toString(),
      });
    }
  }, [pathName, prevState, onChange, searchParams]);

  return null;
};

export default AutoCloseSheet;

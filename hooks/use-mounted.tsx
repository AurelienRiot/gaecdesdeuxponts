"use client";

import { useEffect, useState } from "react";

const useIsComponentMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};

export default useIsComponentMounted;

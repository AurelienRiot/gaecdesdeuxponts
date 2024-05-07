import { usePathname } from "next/navigation";
import { useEffect } from "react";

const AutoCloseSheet = ({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const pathName = usePathname();
  useEffect(() => {
    setIsOpen(false);
  }, [pathName, setIsOpen]);

  return null;
};

export default AutoCloseSheet;

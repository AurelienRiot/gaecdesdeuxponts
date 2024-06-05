"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import BugReportModal from "./bug-report-modal";
import useIsComponentMounted from "@/hooks/use-mounted";

const BugReport = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMounted = useIsComponentMounted();
  if (!isMounted) return null;

  return (
    <>
      <BugReportModal
        isOpen={isOpen}
        setIsOpen={(isOpen) => {
          setIsOpen(isOpen);
        }}
      />

      <Button
        onClick={() => setIsOpen(true)}
        variant={"link"}
        className={className}
      >
        Rapporter un bug
      </Button>
    </>
  );
};

export default BugReport;

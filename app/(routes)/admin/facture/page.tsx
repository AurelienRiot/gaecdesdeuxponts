"use client";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const DisplayPDF = dynamic(() => import("./pdf"), {
  ssr: false,
});

const TestPage = () => {
  return (
    <div className="flex h-screen w-full gap-8">
      <DisplayPDF />
      <Button
        onClick={() => {
          window.location.reload();
        }}
      >
        Recharger la page
      </Button>
    </div>
  );
};

export default TestPage;

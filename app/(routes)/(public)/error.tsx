"use client";

import ButtonBackward from "@/components/ui/button-backward";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <>
      <div className="grid h-screen px-4 bg-primary-foreground place-content-center">
        <div className="text-center ">
          <p className="text-2xl font-bold tracking-tight text-primary">
            Erreur
          </p>

          <h1
            className={`font-black text-left  text-primary tracking-[-15px] text-9xl font-SourceCodePro animate-[glitch_1s_linear_infinite] 
          before:clip-path-polygon-[0_0,_100%_0,_100%_33%,_0_33%]
          before:animate-[glitch-top_1s_linear_infinite] before:content-['500'] before:absolute before:left-0
          after:animate-[glitch-bottom_1s_linear_infinite] after:content-['500'] after:absolute after:left-0
          after:clip-path-polygon-[0_67%,_100%_67%,_100%_100%,_0_100%]
          `}
          >
            500
          </h1>

          <p className="mt-4 mb-4 text-gray-500 dark:text-gray-400">
            Erreur de chargement de la page
          </p>

          <Button
            className="block mx-auto mb-4"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => window.location.reload()
            }
          >
            Réessayer
          </Button>
          <ButtonBackward />
        </div>
      </div>
    </>
  );
}

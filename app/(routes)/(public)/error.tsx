"use client";

import ButtonBackward from "@/components/ui/button-backward";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <div className="grid h-screen place-content-center bg-primary-foreground px-4">
        <div className="text-center ">
          <p className="text-2xl font-bold tracking-tight text-primary">Erreur</p>

          <h1
            className={`animate-[glitch_1s_linear_infinite] text-left  font-[SourceCodePro] text-9xl font-black tracking-[-15px] text-primary 
          before:absolute
          before:left-0 before:animate-[glitch-top_1s_linear_infinite] before:content-['500'] before:clip-path-polygon-[0_0,_100%_0,_100%_33%,_0_33%]
          after:absolute after:left-0 after:animate-[glitch-bottom_1s_linear_infinite] after:content-['500']
          after:clip-path-polygon-[0_67%,_100%_67%,_100%_100%,_0_100%]
          `}
          >
            500
          </h1>

          <p className="mb-4 mt-4 text-gray-500 dark:text-gray-400">Erreur de chargement de la page</p>

          <Button className="mx-auto mb-4 block" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
          <ButtonBackward />
        </div>
      </div>
    </>
  );
}

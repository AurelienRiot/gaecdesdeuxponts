"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import Link from "next/link";

const CookiesBanner = () => {
  const { getValue, setValue } = useLocalStorage("cookies-banner");

  const [isVisible, setIsVisible] = useState(false);

  const handleAccept = () => {
    setValue({ accept: true });
    setIsVisible(false);
  };

  const handleReject = () => {
    setValue({ accept: false });
    setIsVisible(false);
  };

  useEffect(() => {
    if (getValue() === undefined) {
      setIsVisible(true);
    }
  }, [getValue]);

  if (!isVisible) {
    return null;
  }
  return (
    <div className="fixed inset-x-0  bottom-0 z-50     flex flex-col items-center justify-between gap-2 rounded-t-lg bg-black p-8 text-sm text-white lg:flex-row">
      <p className="max-w-4xl">
        En cliquant sur « Accepter tous les cookies », vous acceptez le stockage de cookies sur votre appareil pour
        améliorer la navigation sur le site, analyser son utilisation et contribuer à nos efforts de marketing.{" "}
        <Link href="/pdf/Politique-de-confidentialite.pdf" className=" font-bold underline" target="_blank">
          Politique de confidentialité
        </Link>
        .
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          onClick={handleReject}
          className=" rounded bg-gray-600 px-4 py-2 font-bold text-white hover:bg-gray-700"
        >
          Tout refuser
        </Button>
        <Button
          onClick={handleAccept}
          className=" rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
        >
          Autoriser tous les cookies
        </Button>
      </div>
    </div>
  );
};

export default CookiesBanner;

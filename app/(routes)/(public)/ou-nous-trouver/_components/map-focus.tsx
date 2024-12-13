"use client";
import type { Suggestion } from "@/actions/adress-autocompleteFR";
import { sortShops } from "@/components/display-shops/address-input";
import SearchAddress from "@/components/search-address";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import type { FullShop } from "@/types";
import { posthog } from "posthog-js";
import {} from "posthog-js/react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Marker, useMap } from "react-leaflet";
import { toast } from "sonner";
import LocationMarker from "./location-marker";
import { MakePin } from "./marker-pin";

const MapFocus = ({
  className,
  shops,
}: {
  className?: string;
  shops: FullShop[];
}) => {
  const { getValue } = useLocalStorage("cookies-banner");
  const [pin, setPin] = useState<{ label: string; lat: number; long: number } | undefined>(undefined);
  const map = useMap();

  function onSelectAddress({ label, longitude, latitude }: Suggestion) {
    const { accept } = getValue();

    if (accept) {
      posthog?.capture("localisation_trouvée", {
        latitude,
        longitude,
        adresse: label,
      });
    }
    if (!longitude || !latitude) {
      toast.error("Erreur");
      return;
    }

    map.setView([latitude, longitude], 13);
    setPin({
      label: "Votre position",
      lat: latitude,
      long: longitude,
    });
  }

  return (
    <>
      <LocationMarker shops={shops} setPin={setPin} className="absolute right-3 top-3 z-[1000]" />
      <SearchAddress
        onValueChange={onSelectAddress}
        triggerClassName={cn("z-[400]  w-44  transition-all  p-4  shadow-md text-[0.65rem] ", className)}
      />
      {!!pin && <Marker position={[pin.lat, pin.long]} icon={MakePin("green", pin.label, null)}></Marker>}
    </>
  );
};

export default MapFocus;

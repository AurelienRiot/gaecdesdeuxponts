"use client";
import { LocationAutocomplete, Suggestion } from "@/actions/adress-autocompleteFR";
import { sortShops } from "@/components/display-shops/address-input";
import { IconButton } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import type { Shop } from "@prisma/client";
import { Locate } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useMap } from "react-leaflet";
import { toast } from "sonner";

const LocationMarkerFunction = ({
  className,
  setCoordinates,
  setPin,
  setSortedShops,
  shops,
}: {
  className?: string;
  setCoordinates: Dispatch<SetStateAction<{ long: number | undefined; lat: number | undefined }>>;
  setSortedShops: Dispatch<SetStateAction<Shop[]>>;
  shops: Shop[];
  setPin: Dispatch<SetStateAction<{ label: string; lat: number; long: number } | undefined>>;
}) => {
  const map = useMap();
  const { getValue } = useLocalStorage("cookies-banner");
  const posthog = usePostHog();

  const onAddressFound = async ({
    address,
    latitude,
    longitude,
  }: { address?: string; latitude: number; longitude: number }) => {
    map.setView([latitude, longitude], 12);
    const { accept } = getValue();

    setPin({
      label: "Votre position",
      lat: latitude,
      long: longitude,
    });

    setCoordinates({
      long: longitude,
      lat: latitude,
    });
    setSortedShops(sortShops({ lat: latitude, long: longitude, shops }));
    if (accept) {
      posthog?.capture("localisation_trouvée", {
        latitude,
        longitude,
        adresse: address ?? "Erreur de localisation",
      });
    }
  };

  return <LocationMarker className={className} iconClassName="size-4 " onAddressFound={onAddressFound} />;
};

export default LocationMarkerFunction;

export const LocationMarker = ({
  onAddressFound,
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
  onAddressFound: ({ address, latitude, longitude }: { address?: string; latitude: number; longitude: number }) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handleLocationFound = async (e: GeolocationPosition) => {
    const { latitude, longitude } = e.coords;
    const address = await LocationAutocomplete({ latitude, longitude });
    if (address.length === 0) {
      onAddressFound({ latitude, longitude });
      setLoading(false);
      return;
    }

    onAddressFound({ address: address[0].label, latitude, longitude });
    setLoading(false);
  };

  const handleClick = async () => {
    setLoading(true);
    if (!navigator.geolocation) {
      toast.error("Votre navigateur ne supporte pas la localisation.", {
        position: "top-center",
      });
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(handleLocationFound, (e) => {
      toast.error("Veuillez autoriser la localisation.", {
        position: "top-center",
      });
      setLoading(false);
    });
  };

  return (
    <IconButton
      type="button"
      Icon={Locate}
      disabled={loading}
      className={cn("p-1 inline ml-3", className)}
      iconClassName={cn("size-3", iconClassName)}
      onClick={handleClick}
      title="Trouver votre position"
    />
  );
};

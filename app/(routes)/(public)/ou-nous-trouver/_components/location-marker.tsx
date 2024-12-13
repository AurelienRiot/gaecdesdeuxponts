import { locationAutocomplete } from "@/actions/adress-autocompleteFR";
import { sortShops } from "@/components/display-shops/address-input";
import { IconButton } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import type { FullShop } from "@/types";
import { Locate } from "lucide-react";
import posthog from "posthog-js";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useMap } from "react-leaflet";

import { toast } from "sonner";

const LocationMarkerFunction = ({
  className,
  setPin,
  shops,
}: {
  className?: string;
  shops: FullShop[];
  setPin: Dispatch<SetStateAction<{ label: string; lat: number; long: number } | undefined>>;
}) => {
  const map = useMap();
  const { getValue } = useLocalStorage("cookies-banner");

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

    if (accept) {
      posthog.capture("localisation_trouvée", {
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
    console.log({ latitude, longitude });
    const address = await locationAutocomplete({ latitude, longitude });
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
      if (e.code === 1) {
        toast.error("Veuillez autoriser la localisation.", {
          position: "top-center",
        });
      } else {
        toast.error("Impossible de trouver votre position.", {
          position: "top-center",
        });
      }

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

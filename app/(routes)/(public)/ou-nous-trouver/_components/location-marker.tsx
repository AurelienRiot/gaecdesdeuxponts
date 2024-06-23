import AddressAutocomplete, {
  LocationAutocomplete,
} from "@/actions/adress-autocompleteFR";
import { IconButton } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Locate } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import  type { Dispatch, SetStateAction } from "react";
import { useMap } from "react-leaflet";
import { toast } from "sonner";

const LocationMarker = ({
  className,
  setCoordinates,
  setPin,
}: {
  className?: string;
  setCoordinates: Dispatch<
    SetStateAction<{ long: number | undefined; lat: number | undefined }>
  >;
  setPin: Dispatch<
    SetStateAction<{ label: string; lat: number; long: number } | undefined>
  >;
}) => {
  const map = useMap();
  const { getValue } = useLocalStorage("cookies-banner");
  const posthog = usePostHog();

  const handleLocationFound = async (e: GeolocationPosition) => {
    const { latitude, longitude } = e.coords;

    map.setView([latitude, longitude], 10);
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
    if (accept) {
      const temp = await LocationAutocomplete({ latitude, longitude });

      posthog?.capture("localisation_trouvée", {
        latitude,
        longitude,
        adresse: temp.length > 0 ? temp[0].label : "Erreur de localisation",
      });
    }
  };

  const handleClick = () => {
    navigator.geolocation.getCurrentPosition(handleLocationFound, () =>
      toast.error("Veuillez autoriser la localisation.", {
        position: "top-center",
      }),
    );
  };

  return (
    <IconButton
      Icon={Locate}
      className={className}
      iconClassName="size-4 "
      onClick={handleClick}
      title="Trouver votre position"
    />
  );
};

export default LocationMarker;

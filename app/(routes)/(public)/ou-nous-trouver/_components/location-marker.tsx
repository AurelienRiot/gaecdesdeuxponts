import { IconButton } from "@/components/ui/button";
import { Locate } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { Dispatch, SetStateAction } from "react";
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
  const posthog = usePostHog();

  const handleLocationFound = (e: GeolocationPosition) => {
    const { latitude, longitude } = e.coords;
    posthog?.capture("location_found", { latitude, longitude });
    map.setView([latitude, longitude], 10);

    setPin({
      label: "Votre position",
      lat: latitude,
      long: longitude,
    });

    setCoordinates({
      long: longitude,
      lat: latitude,
    });
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
    />
  );
};

export default LocationMarker;

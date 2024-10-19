import { destination as dest, origin as ori } from "@/app/(routes)/admin/direction/_components/direction-schema";
const googleDirectionUrl = "https://www.google.fr/maps/dir";

export const createDirectionUrl = ({
  origin = ori.label,
  destination = dest.label,
  addresses,
}: {
  origin?: string;
  destination?: string;
  addresses: string[];
}) => `${googleDirectionUrl}/${origin}/${addresses.join("/")}/${destination}`;

const googleMapsLink = "https://maps.google.com/?q=";
const appleMapsLink = "https://maps.apple.com/?q=";
const wazeLink = "https://waze.com/ul?q=";

export function getMapLinks({
  address,
  name,
  service = "google",
}: { address: string; name?: string | null; service?: "google" | "apple" | "waze" }) {
  switch (service) {
    case "google":
      return `${googleMapsLink}${encodeURIComponent(address)} ${name && encodeURIComponent(name)}`;
    case "apple":
      return `${appleMapsLink}${encodeURIComponent(address)} ${name && encodeURIComponent(name)}`;
    case "waze":
      return `${wazeLink}${encodeURIComponent(address)} ${name && encodeURIComponent(name)}`;
  }
}

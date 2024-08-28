import Link from "next/link";
import { BiMap } from "react-icons/bi";

function DisplayAddress({ address }: { address: string | undefined }) {
  if (!address) {
    return null;
  }
  return (
    <Link
      href={`https://maps.google.com/?q=${address}`}
      target="_blank"
      className="text-red-500 font-semibold mt-4 inline-block"
    >
      <span className="flex items-center space-x-1">
        <BiMap className="h-4 w-4" />
        <span>Adresse</span>
      </span>
    </Link>
  );
}

export default DisplayAddress;

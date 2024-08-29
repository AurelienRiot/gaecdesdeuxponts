import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiMap } from "react-icons/bi";

function DisplayAddress({ address }: { address: string | undefined }) {
  if (!address) {
    return null;
  }
  return (
    <Button asChild variant={"outline"} className="text-red-500 font-semibold  inline-block">
      <Link href={`https://maps.google.com/?q=${address}`} target="_blank">
        <span className="flex items-center space-x-1">
          <BiMap className="h-4 w-4" />
          <span>Adresse</span>
        </span>
      </Link>
    </Button>
  );
}

export default DisplayAddress;

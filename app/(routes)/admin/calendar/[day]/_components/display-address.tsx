import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BiMap } from "react-icons/bi";

function DisplayAddress({ address, className }: { address: string | undefined; className?: string }) {
  if (!address) {
    return null;
  }
  return (
    <Button asChild variant={"outline"} className={cn("text-primary font-semibold  inline-block", className)}>
      <Link href={`https://maps.google.com/?q=${address}`} target="_blank">
        <span className="flex items-center justify-center space-x-1">
          <BiMap className="h-4 w-4" />
          <span>Adresse</span>
        </span>
      </Link>
    </Button>
  );
}

export default DisplayAddress;

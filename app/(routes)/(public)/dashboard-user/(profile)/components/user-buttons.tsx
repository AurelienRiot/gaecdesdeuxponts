import { LogoutButtonText } from "@/components/auth/auth-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsGear } from "react-icons/bs";

export const UserButtons = ({ isPro }: { isPro: boolean }) => {
  return (
    <>
      <Link href="/dashboard-user/settings" className=" text-3xl ">
        <span className="inline-flex cursor-pointer items-center gap-2 hover:underline">
          <BsGear size={20} /> Paramètres
        </span>
      </Link>
      <LogoutButtonText />
      {isPro && (
        <Button asChild>
          <Link href="/pro" className="text-3xl">
            Passer en professionnel
          </Link>
        </Button>
      )}
    </>
  );
};

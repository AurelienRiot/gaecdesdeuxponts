import { LogoutButtonText } from "@/components/auth/auth-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const UserButtons = ({ isPro }: { isPro?: boolean }) => {
  return (
    <>
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

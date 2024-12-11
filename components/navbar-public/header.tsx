import Image from "next/image";
import Link from "next/link";
import { logoBio, logoFondBlanc } from "../images";
import AuthLink from "./auth-link";
import { CartButton } from "./cart-button";
import { MainNav } from "./main-nav";
import MobileNav from "./mobile-nav";

export const dynamic = "force-dynamic";

const PublicHeader = () => {
  return (
    <header className="fixed top-0 z-[1100] flex h-16 w-full items-center justify-between bg-background px-4 py-4 shadow-md sm:px-6">
      <div className="flex items-center justify-center gap-4">
        <MobileNav>
          <MainNav orientation="vertical" className="mt-10" />
        </MobileNav>
        <Link href="/" className="block">
          <Image alt="Logo" className="h-16 w-auto rounded-md py-1" src={logoFondBlanc} width={80} height={80} />
        </Link>
        <Image
          alt="Logo Agriculture-biologique"
          className=" h-16 w-auto rounded-md bg-neutral-50 p-1 block"
          src={logoBio}
          width={64}
          height={54}
        />
      </div>

      <MainNav className="hidden lg:block" />
      <div className={"flex items-center sm:gap-x-4 sm:pr-2"}>
        <AuthLink className="hidden sm:block" />
        {/* <ThemeToggle /> */}
        <CartButton />
      </div>
    </header>
  );
};

export default PublicHeader;

import Link from "next/link";
import MobileNav from "./mobile_nav";
import Image from "next/image";
import { MainNav } from "./main-nav";
import AuthLink from "./auth-link";
import { ThemeToggle } from "../theme-toggle";
import { CartButton } from "./cart-button";

const PublicHeader = () => {
  return (
    <header className="fixed top-0   z-30 flex h-16 w-full items-center justify-between bg-background px-4 py-4  shadow-md  sm:px-6 ">
      <div className="flex items-center justify-center gap-4">
        <MobileNav>
          <MainNav orientation="vertical" className="mt-10" />
        </MobileNav>
        <Link href="/" className="hidden xs:block">
          <Image
            alt="Logo"
            className="h-16 w-auto rounded-md "
            src="/logo-rect.webp"
            width={155.86}
            height={56}
          />
        </Link>
      </div>

      <MainNav className="hidden lg:block " />
      <div className={"flex items-center sm:gap-x-4 sm:pr-2"}>
        <AuthLink className="hidden sm:block" />
        <ThemeToggle />
        <CartButton />
      </div>
    </header>
  );
};

export default PublicHeader;

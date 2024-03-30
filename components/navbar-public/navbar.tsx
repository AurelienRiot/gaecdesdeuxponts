"use client";
import MainNav from "@/components/navbar-public/main-nav";
import NavbarAction from "@/components/navbar-public/navbar-actions";
import Image from "next/image";
import Link from "next/link";
import MobileNav from "./mobile-nav";

const NavBar = () => {
  // const [navState, setNavState] = useState<"open" | "close">("open");
  // const { scrollY } = useScroll();

  // useMotionValueEvent(scrollY, "change", (latest) => {
  //   const scrollThreshold = 30;
  //   const previous = scrollY.getPrevious() || 0;
  //   const direction = latest > previous ? "down" : "up";

  //   if (direction === "down" && latest - previous > scrollThreshold) {
  //     setNavState("close");
  //   } else if (direction === "up") {
  //     setNavState("open");
  //   }
  // });

  return (
    <div
      // data-nav-state={navState}
      className={`fixed top-0 z-30 flex h-16 w-full items-center justify-between rounded-md   bg-background px-4 shadow-md transition-all duration-300 data-[nav-state=close]:h-0 data-[nav-state=close]:border-0 sm:px-6 lg:px-4`}
    >
      <MainNav className="hidden lg:flex " />
      <MobileNav className="ml-2 lg:hidden" />
      <div className="flex items-center justify-center  xl:absolute xl:left-1/2 xl:top-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2 ">
        <Link
          href="/"
          className="relative ml-4 hidden items-center gap-2 text-primary transition-all hover:scale-105 sm:flex lg:ml-0"
        >
          <Image
            src="/logo-rond.png"
            alt="logo"
            width={50}
            height={50}
            className="rounded-md"
          />
          <p className="font-mono  text-xl font-bold text-primary">
            {" "}
            Laiterie du Pont Robert
          </p>
        </Link>
      </div>

      <NavbarAction />
    </div>
  );
};

export default NavBar;

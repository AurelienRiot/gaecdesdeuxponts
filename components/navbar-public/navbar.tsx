"use client";
import MainNav from "@/components/navbar-public/main-nav";
import NavbarAction from "@/components/navbar-public/navbar-actions";
import { useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import MobileNav from "./mobile-nav";
import { Category } from "@prisma/client";

const NavBar = ({ categories }: { categories: Promise<Category[]> }) => {
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
      className={`fixed top-0 z-30 flex h-16 w-full items-center justify-between overflow-hidden rounded-b-md border-b-2 border-border bg-background px-4 transition-all duration-300 data-[nav-state=close]:h-0 data-[nav-state=close]:border-0 sm:px-6 lg:px-4 `}
    >
      <div className="flex items-center">
        <Link
          href="/"
          className="relative ml-4 hidden items-center transition-all hover:scale-105 sm:flex lg:ml-0"
        >
          <Image
            src="/icone.webp"
            alt="logo"
            width={48}
            height={48}
            className="rounded-md"
          />
          {/* <p className="text-lg font-bold text-primary sm:text-xl">
                      {" "}
                      RIOT TECH
                    </p> */}
        </Link>
        <MainNav className="hidden lg:flex " categories={categories} />
        <MobileNav className="ml-2 lg:hidden" categories={categories} />
      </div>
      <NavbarAction />
    </div>
  );
};

export default NavBar;

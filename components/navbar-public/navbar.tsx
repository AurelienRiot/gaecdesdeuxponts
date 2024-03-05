"use client";
import MainNav from "@/components/navbar-public/main-nav";
import NavbarAction from "@/components/navbar-public/navbar-actions";
import Container from "@/components/ui/container";
import { useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import MobileNav from "./mobile-nav";

const NavBar = () => {
  const [navState, setNavState] = useState<"open" | "close">("open");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const scrollThreshold = 30;
    const previous = scrollY.getPrevious() || 0;
    const direction = latest > previous ? "down" : "up";

    if (direction === "down" && latest - previous > scrollThreshold) {
      setNavState("close");
    } else if (direction === "up" && previous - latest > scrollThreshold) {
      setNavState("open");
    }
  });

  return (
    <div
      data-nav-state={navState}
      className={`fixed top-0 z-30 w-full h-16 data-[nav-state=close]:h-0 bg-background data-[nav-state=close]:border-0 border-b-2 border-border overflow-hidden transition-all duration-300 flex items-center `}
    >
      <Container className="relative flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-4">
        <div className="flex items-center">
          <Link
            href="/"
            className="ml-4 hidden items-center transition-all hover:scale-105 sm:flex lg:ml-0 w-12 h-12 relative"
          >
            <Image
              src="/icone.jpeg"
              alt="logo"
              fill
              sizes="(max-width: 768px) 50px, (max-width: 1200px) 50px, 50px"
            />
            {/* <p className="text-lg font-bold text-primary sm:text-xl">
                      {" "}
                      RIOT TECH
                    </p> */}
          </Link>
          <div className="hidden lg:flex lg:items-center">
            <MainNav />
          </div>
          <MobileNav className="ml-2 lg:hidden" />
        </div>

        <NavbarAction />
      </Container>
    </div>
  );
};

export default NavBar;

"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MainNav } from "./main-nav";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger>
        <HamburgerMenuIcon className="h-6 w-6 lg:hidden" />
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className=" min-w-[30vw] max-w-[90vw]   overflow-x-visible"
      >
        <SheetHeader>
          <SheetTitle className="justify-left flex items-center">
            <Link onClick={() => setIsOpen(false)} href="/">
              <Image
                alt="Logo"
                className="h-16 w-auto "
                src="/logo-rect.webp"
                width={155.86}
                height={56}
              />
            </Link>
          </SheetTitle>
          {/* <SheetDescription className="justify-left flex items-center pl-2">
            Contenue de votre panier
          </SheetDescription> */}
        </SheetHeader>
        <MainNav orientation="vertical" />
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;

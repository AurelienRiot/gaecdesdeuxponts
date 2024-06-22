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
import { Suspense, useState } from "react";
import AutoCloseSheet from "../auto-close-sheet";

const MobileNav = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Suspense fallback={null}>
        {" "}
        <AutoCloseSheet setIsOpen={setIsOpen} />{" "}
      </Suspense>
      <Sheet onOpenChange={setIsOpen} open={isOpen}>
        <SheetTrigger>
          <HamburgerMenuIcon className="h-6 w-6 lg:hidden" />
          <span className="sr-only">Ouvrir le menu de navigation</span>
        </SheetTrigger>
        <SheetContent
          side={"left"}
          className="min-w-[30vw] max-w-[90vw] overflow-x-visible px-2 py-8 xs:px-6"
        >
          <SheetHeader>
            <SheetTitle className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/">
                <Image
                  alt="Logo"
                  className="h-16 w-auto rounded-md"
                  src="/logo-rect.webp"
                  width={186}
                  height={56}
                />
              </Link>
              <Image
                alt="Logo Agriculture-biologique"
                className="h-16 w-auto rounded-md bg-neutral-50 p-1"
                src="/Agriculture-biologique.png"
                width={67}
                height={56}
              />
            </SheetTitle>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileNav;

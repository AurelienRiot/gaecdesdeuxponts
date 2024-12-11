"use client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import AutoCloseSheet from "../auto-close-sheet";
import { logoFondBlanc } from "../images";

const MobileNav = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Suspense fallback={null}>
        {" "}
        <AutoCloseSheet onChange={() => setIsOpen(false)} />
      </Suspense>
      <Sheet onOpenChange={setIsOpen} open={isOpen}>
        <SheetTrigger>
          <HamburgerMenuIcon className="h-6 w-6 lg:hidden" />
          <span className="sr-only">Ouvrir le menu de navigation</span>
        </SheetTrigger>
        <SheetContent side={"left"} className=" w-[90vw] overflow-x-visible px-2 py-8 xs:px-6">
          <SheetHeader>
            <SheetTitle className="flex flex-wrap items-center justify-center gap-8 px-4 ">
              <Link href="/">
                <Image alt="Logo" className="h-20 w-auto rounded-md p-1" src={logoFondBlanc} width={80} height={80} />
              </Link>
              <Image
                alt="Logo Agriculture-biologique"
                className="h-20 w-auto rounded-md bg-neutral-50 p-1"
                src="/Agriculture-biologique.png"
                width={70}
                height={80}
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

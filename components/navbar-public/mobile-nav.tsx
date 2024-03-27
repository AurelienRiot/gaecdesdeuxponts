"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, StoreIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { use, useState } from "react";

import { Category } from "@prisma/client";
import { publicRoutes } from "./main-nav";
import Image from "next/image";

type MobileNavProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger> & {
  categories: Promise<Category[]>;
};

export default function MobileNav({
  className,
  categories,
  ...props
}: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);

  const routes = publicRoutes(pathname);

  const CategoriesRoutes = use(categories);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild {...props}>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select"
          className={cn(
            "  group relative h-10 w-10 rounded-full transition-colors duration-300   data-[state=open]:bg-destructive  data-[state=open]:text-destructive-foreground ",
            className,
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="absolute left-[10px] top-[18px] h-4  w-4 transition-transform duration-300 group-data-[state=open]:translate-x-[5px] group-data-[state=open]:translate-y-[-2px] group-data-[state=open]:-rotate-45 "
            viewBox="0 0 24 24"
            aria-hidden
          >
            <line x1="2" y1="2" x2="22" y2="2"></line>
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="absolute left-[10px] top-[13px] h-4 w-4 transition-transform duration-300 group-data-[state=open]:translate-x-[-4px] group-data-[state=open]:translate-y-[3px] group-data-[state=open]:rotate-45  "
            viewBox="0 0 24 24"
            aria-hidden
          >
            <line x1="2" y1="2" x2="14" y2="2"></line>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="absolute left-[15px] top-[23px] h-4  w-4 transition-transform duration-300 group-data-[state=open]:translate-x-[-5px] group-data-[state=open]:translate-y-[-3px] group-data-[state=open]:rotate-45 "
            viewBox="0 0 24 24"
            aria-hidden
          >
            <line x1="2" y1="2" x2="14" y2="2"></line>
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="h-auto w-[50vw] min-w-[400px] ">
        <Command>
          <CommandList className="">
            <CommandItem
              className=" relative   flex cursor-pointer items-center justify-center text-primary aria-selected:bg-background aria-selected:text-primary sm:hidden"
              onSelect={() => {
                router.push("/");
                setOpen(false);
              }}
            >
              <Image
                src="/icone.webp"
                alt="logo"
                width={48}
                height={48}
                className="mr-2 rounded-md"
              />
              <p className="font-mono text-lg font-bold text-primary sm:text-xl">
                {" "}
                Laiterie du Pont Robert
              </p>
            </CommandItem>
            <CommandSeparator className="sm:hidden" />
            <CommandItem>
              <Popover open={openProduct} onOpenChange={setOpenProduct}>
                <PopoverTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpenProduct((open) => !open);
                    }}
                    className="test-sm cursor-pointer pl-0"
                  >
                    <StoreIcon className=" mr-2 h-4 w-4" />
                    Nos Produis
                    <ChevronDown
                      className={cn(
                        "ml-4 h-4 w-4 transition-transform",
                        openProduct ? "rotate-0" : "-rotate-90",
                      )}
                    />
                  </CommandItem>
                </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  align="start"
                  className="z-50 w-[200px]"
                >
                  {CategoriesRoutes.map((category) => {
                    const href = `/category/${category.id}`;
                    const label = category.name;
                    const active = pathname.startsWith(
                      `/category/${category.id}`,
                    );
                    return (
                      <Button asChild key={href} variant={"link"}>
                        <Link
                          href={href}
                          className={cn(
                            active && "bg-primary text-primary-foreground",
                          )}
                          onClick={() => {
                            setOpenProduct(false);
                            setOpen(false);
                          }}
                        >
                          {label}
                        </Link>
                      </Button>
                    );
                  })}
                </PopoverContent>
              </Popover>
            </CommandItem>
            {routes.map(({ href, label, active, Icone }) => (
              <CommandItem
                key={href}
                onSelect={() => {
                  router.push(href);
                  setOpen(false);
                }}
                className="test-sm cursor-pointer"
              >
                <Icone className="mr-2 h-4 w-4" />
                {label}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
type DisplayRoutesProps = {
  routes: { href: string; label: string; active: boolean }[];
  setOpen: (state: boolean) => void;
  openProduct: boolean;
  setOpenProduct: (state: boolean) => void;
};
const DisplayRoutes = ({
  routes,
  setOpen,
  openProduct,
  setOpenProduct,
}: DisplayRoutesProps) => {
  return (
    <CommandItem
      aria-expanded={openProduct}
      onSelect={() => setOpenProduct(!openProduct)}
      className="test-sm relative cursor-pointer"
    >
      {"  "} <StoreIcon className="mr-2 h-4 w-4 " /> Produits
      <ChevronDown
        className={cn(
          "relative top-[1px] ml-1 h-3 w-3 transition duration-200",
          openProduct ? "" : "-rotate-90",
        )}
        aria-hidden="true"
      />
      <ul
        // className="absolute left-20 top-6 z-40 grid w-auto gap-2 rounded-lg border-2 border-border bg-popover p-4"
        data-state={openProduct}
        className="absolute left-20  top-6 z-40 grid w-auto gap-1 rounded-lg border-2 border-border  bg-popover py-4  opacity-100 transition-all duration-300  data-[state=false]:z-0 data-[state=false]:opacity-0 "
      >
        {routes.map((route) => (
          <li key={route.href}>
            <Link
              href={route.href}
              onClick={() => {
                setOpenProduct(false);
                setOpen(false);
              }}
              className={cn(
                route.active
                  ? "text-popover-foreground "
                  : "text-muted-foreground ",
                "block w-full rounded-lg px-4 py-1  text-sm font-medium leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              )}
            >
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </CommandItem>
  );
};

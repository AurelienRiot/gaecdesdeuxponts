"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { adminRoutes } from "./main-nav";
import AutoCloseSheet from "../auto-close-sheet";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface MobileNavProps extends PopoverTriggerProps {}

export default function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const routes = adminRoutes(pathname);

  return (
    <>
      <Suspense fallback={null}>
        {" "}
        <AutoCloseSheet setIsOpen={setOpen} />{" "}
      </Suspense>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            aria-label="Selectionner"
            className={cn("w-[75px] justify-between ", className)}
          >
            <Menu className="mr-2 h-4 w-4" />

            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="h-auto w-[200px] p-0">
          <Command>
            <CommandList>
              {/* <CommandInput placeholder="recherche" /> */}
              {/* <CommandEmpty> Aucun résultat</CommandEmpty> */}
              <CommandGroup>
                {routes.map((route) => (
                  <CommandItem
                    key={route.href}
                    value={route.label}
                    onSelect={() => {
                      router.push(route.href);
                    }}
                    className="test-sm cursor-pointer"
                  >
                    <route.Icone className="mr-2 h-4 w-4" />
                    {route.label}
                    <Check className={cn("ml-auto h-4 w-4", route.active ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

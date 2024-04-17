"use client";
import IconButton from "@/components/ui/icon-button";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  CircleUserRound,
  Package,
  Settings,
  Store,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const ProfilNavBar = ({ isPro }: { isPro?: boolean }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const routes = isPro ? ProfilProRoutes : ProfilRoutes;

  return (
    <div
      className={
        " absolute bottom-0 left-0 top-0 z-20 flex  h-full flex-col items-center justify-start gap-4 overflow-hidden  bg-background p-4 shadow-lg transition-transform duration-500 "
      }
    >
      <IconButton
        onClick={() => setOpen(!open)}
        icon={
          <ChevronLeft
            data-state={open}
            className="h-4 w-4  transition-transform duration-500 data-[state=false]:rotate-180"
          />
        }
        data-state={open}
        className=" flex w-full items-center justify-center  transition-transform duration-500"
      />
      {routes.map(({ Icon, title, href }) => {
        const active = pathname === href;
        return (
          <button
            key={title}
            onClick={() => {
              router.push(href);
              setOpen(false);
            }}
            data-state={open}
            className={
              "justify-left relative flex w-[200px] items-center gap-2 rounded-md px-4 py-2 transition-transform duration-500 hover:opacity-80 data-[state=false]:w-[50px]"
            }
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {active && (
              <motion.div
                layoutId="clickedbutton"
                data-state={open}
                transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                className={
                  "absolute inset-0 rounded-md bg-gray-200 data-[state=true]:ml-2 dark:bg-zinc-800 "
                }
              />
            )}
            <Icon className="relative size-4 shrink-0 " />
            <span
              data-state={open}
              className="relative whitespace-nowrap transition-opacity data-[state=false]:opacity-0"
            >
              {title}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export const ProfilRoutes = [
  {
    title: "Profil",
    Icon: CircleUserRound,
    href: "/dashboard-user",
  },
  {
    title: "Conmmandes",
    Icon: Package,
    href: "/dashboard-user/orders",
  },
  {
    title: "Modifier le profil",
    Icon: Settings,
    href: "/dashboard-user/settings",
  },
];

const ProfilProRoutes = [
  ...ProfilRoutes,
  {
    title: "Produits Pro",
    Icon: Store,
    href: "/dashboard-user/produits-pro",
  },
];

export { ProfilNavBar };

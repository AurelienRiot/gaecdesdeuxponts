"use client";
import { IconButton } from "@/components/ui/button";
import { useUserContext } from "@/context/user-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronLeft, CircleUserRound, Package, Settings, Store, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { TbFileInvoice } from "react-icons/tb";

const ProfilNavBar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUserContext();
  const router = useRouter();
  const [visible, setVisible] = useState(!user?.name && (pathname === "/profile" || pathname === "/profile/commandes"));

  // const routes = user?.role === "pro" ? ProfilProRoutes : ProfilRoutes;
  const routes = ProfilRoutes;

  return (
    <>
      <aside
        className={
          " absolute bottom-0 left-0 top-0 z-20 flex  h-full flex-col items-center justify-start gap-4 overflow-hidden  rounded-r-md bg-background p-4 shadow-lg transition-all duration-500 "
        }
      >
        <IconButton
          onClick={() => setOpen(!open)}
          Icon={ChevronLeft}
          iconClassName={"h-4 w-4  transition-all duration-500  group-data-[state=true]/icon:rotate-0  rotate-180"}
          title={open ? "fermer" : "ouvrir"}
          data-state={open}
          className="group/icon flex w-full items-center justify-center  transition-all duration-500"
        />
        {routes.map(({ Icon, title, href }, index) => {
          const active = isActiveRoute(href, pathname);
          return (
            <button
              type="button"
              key={title}
              onClick={() => {
                router.push(href);
                setOpen(false);
              }}
              data-state={open}
              className={
                "justify-left relative flex w-[200px] items-center gap-2 rounded-md px-4 py-2 transition-all duration-500 group data-[state=false]:w-[50px]"
              }
            >
              {active && (
                <motion.div
                  layoutId="clickedbutton"
                  data-state={open}
                  transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                  className={"absolute z-[-1] inset-0 rounded-md bg-gray-200 data-[state=true]:ml-2 dark:bg-zinc-800 "}
                />
              )}
              <Icon
                className={cn(
                  "relative size-4 transition-colors shrink-0 group-hover:text-green-500",
                  active ? "text-green-500" : "",
                )}
              />
              <span
                data-state={open}
                className="relative whitespace-nowrap transition-all data-[state=false]:opacity-0"
              >
                {title}
              </span>
            </button>
          );
        })}
      </aside>

      <NewMessageUser expand={open} visible={visible} setVisible={setVisible} />
    </>
  );
};

function NewMessageUser({
  expand,
  visible,
  setVisible,
}: { expand?: boolean; visible?: boolean; setVisible: Dispatch<SetStateAction<boolean>> }) {
  return (
    <>
      <style jsx>{`
   
      .bubble:before {
        content: "";
        width: 0px;
        height: 0px;
        position: absolute;
        border-left: 24px solid #22C55D;
        border-right: 12px solid transparent;
        border-top: 12px solid #22C55D;
        border-bottom: 20px solid transparent;
        left: 6px;
        bottom: -24px;
        opacity: 0.95;
      }
      `}</style>
      <div
        data-state={visible}
        data-expand={expand}
        className={
          "bubble data-[state=false]:hidden data-[expand=true]:left-36 transition-all duration-500 rounded-xl absolute top-40 left-14 z-30 bg-green-500/95   text-center p-5 "
        }
      >
        Compléter votre profile{" "}
        <IconButton
          className="absolute -top-2 -right-2 p-1"
          Icon={X}
          onClick={() => setVisible(false)}
          iconClassName="size-4 text-destructive"
        ></IconButton>
      </div>
    </>
  );
}

const isActiveRoute = (href: string, pathname: string): boolean => {
  if (href === "/profile") {
    return pathname === href;
  }
  return pathname.startsWith(href);
};

export const ProfilRoutes = [
  {
    title: "Profile",
    Icon: CircleUserRound,
    href: "/profile",
  },
  {
    title: "Commandes",
    Icon: Package,
    href: "/profile/commandes",
  },
  {
    title: "Factures",
    Icon: TbFileInvoice,
    href: "/profile/factures",
  },
  {
    title: "Modifier votre profile",
    Icon: Settings,
    href: "/profile/parametres",
  },
];

const ProfilProRoutes = [
  ...ProfilRoutes,
  {
    title: "Produits Pro",
    Icon: Store,
    href: "/profile/produits-pro",
  },
];

export { ProfilNavBar };

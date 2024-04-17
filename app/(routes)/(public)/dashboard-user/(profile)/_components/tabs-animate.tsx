"use client";

import IconButton from "@/components/ui/icon-button";
import { addDelay, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  CircleUserRound,
  Package,
  Settings,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Suspense,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { OrderTable } from "./order-table";
import ProTab from "./pro-tab";
import ProfilTab from "./profil-tab";
import { UserFromWrapper } from "./user-form";

export const initialTabs: Tab[] = [
  {
    title: "Profil",
    icon: CircleUserRound,
    value: "user",
  },
  {
    title: "Conmmandes",
    icon: Package,
    value: "orders",
  },
  {
    title: "Modifier le profil",
    icon: Settings,
    value: "settings",
  },
  {
    title: "Prduits Pro",
    icon: Store,
    value: "store",
  },
];

type Tab = {
  title: string;
  icon: React.ElementType;
  value: "user" | "orders" | "settings" | "store";
};

export const Tabs = ({
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
  pro,
  activeTab,
}: {
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  pro: boolean;
  activeTab: string;
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [tabs, setTabs] = useState<Tab[]>(
    moveSelectedTabToTop(activeTab as Tab["value"], initialTabs),
  );
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const changeTabs = async () => {
      setTabs(moveSelectedTabToTop(activeTab as Tab["value"], initialTabs));
      await addDelay(500);
      setHovering(false);
    };
    changeTabs();
  }, [activeTab]);

  return (
    <TabsContext.Provider value={{ tabs, setTabs, hovering, setHovering }}>
      <>
        <div
          className={cn(
            " absolute bottom-0 left-0 top-0 z-20 flex  flex-col items-center justify-start gap-4 overflow-hidden bg-background  p-4 shadow-lg transition-transform duration-500 [perspective:1000px]",
            containerClassName,
          )}
        >
          <IconButton
            onClick={() => setOpen(!open)}
            // onMouseEnter={() => setOpen(!open)}
            icon={
              <ChevronLeft
                data-state={open}
                className="h-4 w-4  transition-transform duration-500 data-[state=false]:rotate-180"
              />
            }
            data-state={open}
            className=" flex w-full items-center justify-center  transition-transform duration-500"
          />
          {initialTabs.map((tab, idx) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.title}
                onClick={() => {
                  router.push("/dashboard-user?tab=" + tab.value);
                  setOpen(false);
                }}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                data-state={open}
                className={cn(
                  "justify-left relative flex w-[200px] items-center gap-2 rounded-md px-4 py-2 transition-transform duration-500 hover:opacity-80 data-[state=false]:w-[50px]",
                  tabClassName,
                )}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {tabs[0].value === tab.value && (
                  <motion.div
                    layoutId="clickedbutton"
                    data-state={open}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                    className={cn(
                      "absolute inset-0 rounded-md bg-gray-200 data-[state=true]:ml-2 dark:bg-zinc-800 ",
                      activeTabClassName,
                    )}
                  />
                )}
                <IconComponent className="relative size-4 shrink-0 " />
                <span
                  data-state={open}
                  className="relative whitespace-nowrap transition-opacity data-[state=false]:opacity-0"
                >
                  {tab.title}
                </span>
              </button>
            );
          })}
        </div>
        <div className="relative ml-24 mt-5 h-full w-full sm:ml-28 sm:mt-10">
          <FadeInDiv tab={initialTabs[0]} className={cn("", contentClassName)}>
            <ProfilTab />
          </FadeInDiv>
          <FadeInDiv tab={initialTabs[1]} className={cn("", contentClassName)}>
            <OrderTable />
          </FadeInDiv>
          <FadeInDiv tab={initialTabs[2]} className={cn("", contentClassName)}>
            <UserFromWrapper />
          </FadeInDiv>
          <FadeInDiv tab={initialTabs[3]} className={cn("", contentClassName)}>
            {pro && (
              <Suspense fallback={null}>
                <ProTab />{" "}
              </Suspense>
            )}
          </FadeInDiv>
        </div>
      </>
    </TabsContext.Provider>
  );
};

export const FadeInDiv = ({
  className,
  children,
  tab,
}: {
  className?: string;
  tab: Tab;
  children?: React.ReactNode;
}) => {
  const { tabs, hovering } = useTabsContext();
  const isActive = (tab: Tab) => {
    return tab.value === tabs[0].value;
  };
  const idx = tabs.findIndex((t) => t.value === tab.value);
  return (
    <motion.div
      key={tab.value}
      layoutId={tab.value}
      style={{
        scale: 1 - idx * 0.1,
        top: hovering ? idx * -50 : 0,
        zIndex: -idx,
        opacity: idx < 3 ? 1 - idx * 0.3 : 0,
        scrollBehavior: "smooth",
      }}
      animate={{
        y: isActive(tab) ? [0, 40, 0] : 0,
      }}
      className={cn(
        " absolute left-0 top-0 h-[95%] w-full overflow-y-auto rounded-2xl border bg-gradient-to-br from-neutral-50 to-stone-100 shadow-md  dark:bg-gradient-to-br dark:from-stone-950  dark:to-neutral-950 sm:h-[90%] ",
        className,
      )}
      id={"tab-container-" + tab.value}
    >
      {children}
    </motion.div>
  );
};

type TabsContextType = {
  tabs: Tab[];
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  hovering: boolean;
  setHovering: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TabsContext = createContext<TabsContextType | undefined>(
  undefined,
);

export function useTabsContext() {
  const context = useContext(TabsContext);

  if (context === undefined) {
    throw new Error("useTabsContext must be used within a TabsProvider");
  }

  return context;
}

export const moveSelectedTabToTop = (value: Tab["value"], tabs: Tab[]) => {
  const index = tabs.findIndex((tab) => tab.value === value);
  if (index > 0) {
    const newTabs = [...tabs];
    const [selectedTab] = newTabs.splice(index, 1);
    newTabs.unshift(selectedTab);
    return newTabs;
  }

  return tabs;
};

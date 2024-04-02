"use client";

import IconButton from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  CircleUserRound,
  Lock,
  Package,
  Settings,
} from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

const ICONS = {
  user: CircleUserRound,
  settings: Settings,
  password: Lock,
  orders: Package,
};

export type Tab = {
  title: string;
  iconId: keyof typeof ICONS;
  content?: string | React.ReactNode | any;
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {
  const { tabs, setTabs } = useTabsContext();
  const [open, setOpen] = useState(false);

  const [hovering, setHovering] = useState(false);

  return (
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
        ></IconButton>
        {propTabs.map((tab, idx) => {
          const IconComponent = ICONS[tab.iconId];
          return (
            <button
              key={tab.title}
              onClick={() => {
                setTabs((prev) => moveSelectedTabToTop(tab.iconId, prev));
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
              {tabs[0].iconId === tab.iconId && (
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
      <FadeInDiv
        tabs={tabs}
        key={tabs[0].iconId}
        hovering={hovering}
        className={cn("", contentClassName)}
      />
    </>
  );
};

export const FadeInDiv = ({
  className,
  tabs,
  hovering,
}: {
  className?: string;
  key?: string;
  tabs: Tab[];
  hovering?: boolean;
}) => {
  const isActive = (tab: Tab) => {
    return tab.iconId === tabs[0].iconId;
  };
  return (
    <div className="relative ml-24 h-full w-full sm:ml-28">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.iconId}
          layoutId={tab.iconId}
          style={{
            scale: 1 - idx * 0.1,
            top: hovering ? idx * -50 : 0,
            zIndex: -idx,
            opacity: idx < 3 ? 1 - idx * 0.1 : 0,
          }}
          animate={{
            y: isActive(tab) ? [0, 40, 0] : 0,
          }}
          className={cn(
            "absolute left-0 top-0 h-[95%]  w-full  overflow-hidden rounded-2xl border bg-gradient-to-br from-stone-50 to-neutral-50 pt-5 text-xl font-bold shadow-md dark:bg-gradient-to-br  dark:from-stone-950 dark:to-neutral-950 md:text-4xl",
            className,
          )}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};

type TabsContextType = {
  tabs: Tab[];
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
};

export const TabsContext = createContext<TabsContextType | undefined>(
  undefined,
);

export const TabsProvider: React.FC<{
  children: React.ReactNode;
  initialTabs: Tab[];
  activeTab: string;
}> = ({ children, initialTabs, activeTab }) => {
  const [tabs, setTabs] = useState<Tab[]>(
    moveSelectedTabToTop(activeTab, initialTabs),
  );

  useEffect(() => {
    setTabs(moveSelectedTabToTop(activeTab, initialTabs));
  }, [activeTab, initialTabs]);
  return (
    <TabsContext.Provider value={{ tabs, setTabs }}>
      {children}
    </TabsContext.Provider>
  );
};

export function useTabsContext() {
  const context = useContext(TabsContext);

  if (context === undefined) {
    throw new Error("useTabsContext must be used within a TabsProvider");
  }

  return context;
}

export const moveSelectedTabToTop = (iconId: string, tabs: Tab[]) => {
  const index = tabs.findIndex((tab) => tab.iconId === iconId);
  if (index > 0) {
    const newTabs = [...tabs];
    const [selectedTab] = newTabs.splice(index, 1);
    newTabs.unshift(selectedTab);
    return newTabs;
  }

  return tabs;
};

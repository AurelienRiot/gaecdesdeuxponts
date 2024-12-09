"use client";
import { cn, roundToDecimals } from "@/lib/utils";
import type { ProductWithMain } from "@/types";
import type { Role } from "@prisma/client";
import { TabsContent } from "@radix-ui/react-tabs";
import * as React from "react";
import { DisplayProductIcon } from "./product";
import { getUserName } from "./table-custom-fuction";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { NameWithImage } from "./user";

type ValueType<V extends { key: string }> = { label: React.ReactNode; value: V; highlight?: boolean };
type TabsType<T> = { label: string; value: T }[];

function SelectSheetWithTabs<V extends { key: string }, T extends string>({
  tabsValues,
  tabs,
  onSelected,
  trigger = "Selectionner",
  selectedValue,
  title,
  description,
  className,
  triggerClassName,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: {
  trigger?: React.ReactNode | string;
  onSelected: (selected: V) => void;
  tabsValues: { values: ValueType<V>[]; tab: T }[];
  tabs: TabsType<T>;
  selectedValue?: string | null;
  title: string;
  description?: string;
  className?: string;
  triggerClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [contentHeight, setContentHeight] = React.useState("auto");
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [currentTab, setCurrentTab] = React.useState<string | undefined>(
    tabsValues.find((value) => value.values.find((v) => v.value.key === selectedValue))?.tab,
  );

  const [_open, _setOpen] = React.useState(false);
  const open = openProp ?? _open;

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChangeProp) {
      onOpenChangeProp(newOpen); // Call the external handler if provided
    } else {
      _setOpen(newOpen); // Otherwise, update the internal state
    }
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (contentRef.current && currentTab) {
        setContentHeight(`${contentRef.current.scrollHeight + 49}px`);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [currentTab]);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {typeof trigger === "string" ? (
          <Button type="button" className={triggerClassName} variant="outline">
            {trigger}
          </Button>
        ) : (
          trigger
        )}
      </SheetTrigger>
      <SheetContent
        side={"bottom"}
        className="pb-6  transition-all overflow-hidden will-change-auto"
        style={{ height: contentHeight }}
      >
        <div ref={contentRef} className={cn("mx-auto w-full max-w-md space-y-4 ", className)}>
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {!!description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full w-full space-y-4">
            <TabsList className="flex w-full gap-2 overflow-x-auto">
              {tabs.map((tab) => {
                const selectedValues = tabsValues.find((value) => value.tab === tab.value)?.values;
                if (!selectedValues || selectedValues.length === 0) return null;
                return (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <SelectContent
              setIsOpen={handleOpenChange}
              // values={value.values}
              tabsValues={tabsValues}
              onSelected={onSelected}
              currentTab={currentTab}
              selectedValue={selectedValue}
            />
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SelectContent<V extends { key: string }, T extends string>({
  onSelected,
  selectedValue,
  setIsOpen,
  tabsValues,
  currentTab,
}: {
  onSelected: (selected: V) => void;
  selectedValue?: string | null;
  tabsValues: { values: ValueType<V>[]; tab: T }[];
  setIsOpen: (open: boolean) => void;
  currentTab?: string | undefined;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  // const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  React.useEffect(() => {
    const tabValues = tabsValues.find((value) => value.values.some((v) => v.value.key === selectedValue));
    if (!tabValues || tabValues?.tab !== currentTab) {
      setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 0);
      return;
    }
    if (scrollRef.current && selectedValue) {
      setTimeout(() => {
        const selectedItem = document.getElementById(selectedValue);
        if (selectedItem) {
          selectedItem.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 0);
    }
  }, [selectedValue, tabsValues, currentTab]);

  return (
    <div className="relative">
      <ScrollArea ref={scrollRef} className="max-h-[50dvh]  overflow-y-auto pt-4  py-8">
        <>
          {tabsValues.map(
            (tabValues) =>
              tabValues.values.length > 0 && (
                <TabsContent
                  key={tabValues.tab}
                  value={tabValues.tab}
                  className=" w-full flex flex-col gap-2 relative "
                >
                  {tabValues.values.map((value, index) => (
                    <Button
                      style={{ touchAction: "pan-y" }}
                      id={value.value.key}
                      className="h-fit"
                      variant={value.value.key === selectedValue ? "green" : value.highlight ? "secondary" : "outline"}
                      key={value.value.key + index}
                      onClick={() => {
                        setIsOpen(false);
                        onSelected(value.value);
                      }}
                    >
                      {value.label}
                    </Button>
                  ))}
                </TabsContent>
              ),
          )}
        </>
      </ScrollArea>
      <div className="inset-0 absolute from-background to-background bg-[linear-gradient(to_bottom,_var(--tw-gradient-from)_0%,_transparent_10%,_transparent_90%,_var(--tw-gradient-to)_100%)] pointer-events-none select-none" />
    </div>
  );
}

export default SelectSheetWithTabs;

export function getUserTab(
  users: {
    name?: string | null;
    id: string;
    company?: string | null;
    email?: string | null;
    role: Role;
    image?: string | null;
  }[],
) {
  const groupedRoles = users.reduce(
    (acc, user) => {
      // Find or create the group for the user's role
      let group = acc.find((item) => item.tab === user.role);
      if (!group) {
        group = { values: [], tab: user.role };
        acc.push(group);
      }
      const name = getUserName(user);
      // Add the user's ID and label to the group's values
      group.values.push({
        value: { key: user.id, name },
        label: <NameWithImage name={name} image={user.image} />,
      });

      return acc;
    },
    [] as { values: { value: { key: string; name: string }; label: React.ReactNode }[]; tab: Role }[], // Initialize as an empty array
  );
  for (const group of groupedRoles) {
    group.values.sort((a, b) => {
      return a.value.name.localeCompare(b.value.name);
    });
  }

  const tabs = [
    { value: "pro", label: "Professionnel" },
    { value: "user", label: "Particulier" },
    { value: "trackOnlyUser", label: "Suivie uniquement" },
  ];

  return { tabsValue: groupedRoles, tabs };
}

// type ProductTabType = "favories" | "others" | "biocoop";

export function getProductTabs(products: ProductWithMain[], favoriteProducts: string[] = []) {
  const groupedProducts = products.reduce(
    (acc, product) => {
      const isFavorite = favoriteProducts.includes(product.id);
      const tab = isFavorite ? "favories" : product.product.categoryName || "others";

      let group = acc.find((item) => item.tab === tab);
      if (!group) {
        group = { values: [], tab };
        acc.push(group);
      }

      group.values.push({
        label: (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2">
              {product.product.isPro && (
                <Badge variant="orange" className="mr-2">
                  Pro
                </Badge>
              )}
              <DisplayProductIcon icon={product.icon} />
              <span className="font-bold ">{product.name}</span>
            </div>
            <p className="ml-2">
              {` ${roundToDecimals(product.price, 2)}€ TTC (${roundToDecimals(product.price / product.tax, 2)}€ HT)`}
            </p>
          </div>
        ),
        value: { key: product.id },
      });

      return acc;
    },
    [] as { values: ValueType<{ key: string }>[]; tab: string }[],
  );

  const sortedGroups = groupedProducts.sort((a, b) => {
    if (a.tab === "favories") return -1;
    if (b.tab === "favories") return 1;
    return a.tab.localeCompare(b.tab);
  });

  const tabs = sortedGroups.map((group) => ({
    value: group.tab,
    label: group.tab === "favories" ? "Favoris" : group.tab,
  }));

  return {
    tabsValues: sortedGroups,
    tabs,
  };
}

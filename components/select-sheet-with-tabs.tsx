"use client";
import { cn, roundToDecimals } from "@/lib/utils";
import type { ProductWithMain } from "@/types";
import type { Role, User } from "@prisma/client";
import { TabsContent } from "@radix-ui/react-tabs";
import * as React from "react";
import { biocoopProducts, DisplayProductIcon, priorityMap } from "./product";
import { getUserName } from "./table-custom-fuction";
import { NameWithImage } from "./table-custom-fuction/common-cell";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";

type ValueType<V extends { key: string }> = { label: React.ReactNode; value: V; highlight?: boolean };
type TabsType<T> = { label: string; value: T }[];

function SelectSheetWithTabs<V extends { key: string }, T extends string>({
  tabsValues,
  tabs,
  onSelected,
  trigger,
  selectedValue,
  title,
  description,
  className,
  triggerClassName,
}: {
  trigger: React.ReactNode | string;
  onSelected: (selected: V) => void;
  tabsValues: { values: ValueType<V>[]; tab: T }[];
  tabs: TabsType<T>;
  selectedValue?: string | null;
  title: string;
  description?: string;
  className?: string;
  triggerClassName?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [contentHeight, setContentHeight] = React.useState("auto");
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [currentTab, setCurrentTab] = React.useState<string | undefined>(
    tabsValues.find((value) => value.values.find((v) => v.value.key === selectedValue))?.tab,
  );

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (contentRef.current && currentTab) {
        setContentHeight(`${contentRef.current.scrollHeight + 49}px`);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [currentTab]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
              setIsOpen={setIsOpen}
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
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentTab?: string | undefined;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  // const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  React.useEffect(() => {
    const tabValues = tabsValues.find((value) => value.values.some((v) => v.value.key === selectedValue));
    if (!tabValues || tabValues?.tab !== currentTab) {
      setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 400);
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
      }, 400);
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

export function sortUserByRole(users: User[]) {
  const groupedRoles = users.reduce(
    (acc, user) => {
      // Find or create the group for the user's role
      let group = acc.find((item) => item.tab === user.role);
      if (!group) {
        group = { values: [], tab: user.role };
        acc.push(group);
      }

      // Add the user's ID and label to the group's values
      group.values.push({
        value: { key: user.id },
        label: <NameWithImage name={getUserName(user)} image={user.image} />,
      });

      return acc;
    },
    [] as { values: { value: { key: string }; label: React.ReactNode }[]; tab: Role }[], // Initialize as an empty array
  );
  return groupedRoles;
}

type ProductTabType = "favories" | "others" | "biocoop";

export function sortProductByTabType(products: ProductWithMain[]) {
  const groupedRoles = products.reduce(
    (acc, product) => {
      const tab = biocoopProducts.includes(product.name)
        ? "biocoop"
        : priorityMap[product.name]
          ? "favories"
          : "others";
      let group = acc.find((item) => item.tab === tab);
      if (!group) {
        group = { values: [], tab };
        acc.push(group);
      }

      // Add the user's ID and label to the group's values
      group.values.push({
        label: (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2">
              {product.product.isPro && (
                <Badge variant="orange" className="mr-2">
                  Pro
                </Badge>
              )}
              <DisplayProductIcon name={product.name} />
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
    [] as { values: { value: { key: string }; label: React.ReactNode }[]; tab: ProductTabType }[], // Initialize as an empty array
  );
  return groupedRoles;
}

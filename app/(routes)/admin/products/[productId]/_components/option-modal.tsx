"use client";
import type { OptionsArray } from "@/components/product";
import { Button, IconButton } from "@/components/ui/button";
import { Command, CommandInput, CommandItem, CommandListModal } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useServerAction from "@/hooks/use-server-action";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { createOption } from "../_actions/create-option";
import { deleteOption } from "../_actions/delete-option";
import { updateOption } from "../_actions/update-option";
import type { ModalOptionType } from "./product-schema";

type OptionModalContextType = {
  option: ModalOptionType | null;
  setOption: React.Dispatch<React.SetStateAction<ModalOptionType | null>>;
  isOptionModalOpen: boolean;
  setIsOptionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const OptionModalContext = createContext<OptionModalContextType | undefined>(undefined);

export const OptionModalProvider: React.FC<{
  children: React.ReactNode;
  productIds: string[];
  optionsArray: OptionsArray;
}> = ({ children, productIds, optionsArray }) => {
  const [option, setOption] = useState<ModalOptionType | null>(null);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

  return (
    <OptionModalContext.Provider value={{ option, setOption, isOptionModalOpen, setIsOptionModalOpen }}>
      {children}
      <OptionModal optionsArray={optionsArray} productIds={productIds} />
    </OptionModalContext.Provider>
  );
};

export function useOptionModal() {
  const context = useContext(OptionModalContext);

  if (context === undefined) {
    throw new Error("useOptionModal must be used within a OptionModalProvider");
  }

  return context;
}

function OptionModal({ productIds, optionsArray }: { productIds: string[]; optionsArray: OptionsArray }) {
  const { serverAction: updateOptionAction } = useServerAction(updateOption);
  const { serverAction: createOptionAction } = useServerAction(createOption);
  const { option, isOptionModalOpen, setIsOptionModalOpen } = useOptionModal();
  const [name, setName] = useState(option?.name || "");
  const router = useRouter();

  useEffect(() => {
    if (!option) return;
    setName(option.name);
  }, [option]);

  const closeModal = async () => {
    if (!option) {
      toast.error("Erreur");
      return;
    }
    function onSuccess() {
      setIsOptionModalOpen(false);
      router.refresh();
    }
    option.optionIds.length > 0
      ? await updateOptionAction({ data: { name, optionIds: option.optionIds }, onSuccess })
      : await createOptionAction({ data: { name, index: option.index, productIds }, onSuccess });
  };

  return (
    <Modal title="Option" isOpen={isOptionModalOpen} onClose={closeModal}>
      <Optionform optionsArray={optionsArray} name={name} setName={setName} />
    </Modal>
  );
}

const Optionform = ({
  optionsArray,
  name,
  setName,
}: {
  optionsArray: OptionsArray;
  name: string;
  setName: (name: string) => void;
}) => {
  const [openName, setOpenName] = useState(false);
  const { serverAction } = useServerAction(deleteOption);
  const [search, setSearch] = useState("");
  const { option, setIsOptionModalOpen } = useOptionModal();

  const onDelete = () => {
    if (!option) return;
    if (option.optionIds.length === 0) {
      setIsOptionModalOpen(false);
      return;
    }

    serverAction({
      data: { optionIds: option.optionIds },
      onSuccess: () => {
        setIsOptionModalOpen(false);
      },
    });
  };

  // const changeOptionName = (newName: string) => {
  //   products.map((_, productIndex) => {
  //     form.setValue(`products.${productIndex}.options.${optionIndex}.name`, newName);
  //   });
  // };

  // const moveOptionLeft = () => {
  //   if (optionIndex > 0) {
  //     const newOptions = [...options];
  //     const temp = { ...newOptions[optionIndex - 1], index: optionIndex };
  //     newOptions[optionIndex - 1] = {
  //       ...newOptions[optionIndex],
  //       index: optionIndex - 1,
  //     };
  //     newOptions[optionIndex] = temp;
  //     products.map((_, productIndex) => {
  //       form.setValue(`products.${productIndex}.options`, newOptions);
  //     });
  //     setListChanges((prev) => prev + 1);
  //   }
  // };

  // const moveOptionRigth = () => {
  //   if (optionIndex < products.length - 1) {
  //     const newOptions = [...options];
  //     const temp = { ...newOptions[optionIndex + 1], index: optionIndex };
  //     newOptions[optionIndex + 1] = {
  //       ...newOptions[optionIndex],
  //       index: optionIndex + 1,
  //     };
  //     newOptions[optionIndex] = temp;
  //     products.map((_, productIndex) => {
  //       form.setValue(`products.${productIndex}.options`, newOptions);
  //     });
  //     setListChanges((prev) => prev + 1);
  //   }
  // };

  return (
    <div className="relative w-48">
      <Label className="flex gap-2">
        <span className="flex items-center">{`Nom de l'option ${(option?.index || 0) + 1}`}</span>
        {/* <IconButton
              Icon={ChevronLeft}
              className={optionIndex === 0 ? "opacity-0" : ""}
              iconClassName={"size-4"}
              onClick={moveOptionLeft}
              type="button"
            />
            <IconButton
              Icon={ChevronRight}
              className={optionIndex === options.length - 1 ? "opacity-0" : ""}
              iconClassName="size-4"
              onClick={moveOptionRigth}
              type="button"
            /> */}
      </Label>
      <Popover open={openName} onOpenChange={setOpenName}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn("min-w-48 justify-between", name ? "" : "text-muted-foreground")}
          >
            {name || "Nom de l'option"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] z-[1300] p-0">
          <Command>
            <CommandInput value={search} onValueChange={setSearch} placeholder="Nom de l'option" />
            <CommandListModal>
              {optionsArray.map(({ name: optionName }) => (
                <CommandItem
                  key={optionName}
                  value={optionName}
                  onSelect={(currentValue) => {
                    setName(currentValue);
                    setOpenName(false);
                    setSearch("");
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", name === optionName ? "opacity-100" : "opacity-0")} />
                  {optionName}
                </CommandItem>
              ))}
              {!!search && (
                <CommandItem
                  value={search}
                  className="cursor-pointer"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onSelect={() => {
                    setName(search);
                    setOpenName(false);
                    setSearch("");
                  }}
                >
                  {" "}
                  <Check className={"mr-2 h-4 w-4 opacity-0"} />
                  {`Créer "${search}"`}
                </CommandItem>
              )}
            </CommandListModal>
          </Command>
        </PopoverContent>
      </Popover>
      <IconButton
        type="button"
        onClick={onDelete}
        className="absolute -left-2 top-4 bg-destructive p-1 text-destructive-foreground"
        iconClassName="size-3"
        Icon={X}
      />
    </div>
  );
};

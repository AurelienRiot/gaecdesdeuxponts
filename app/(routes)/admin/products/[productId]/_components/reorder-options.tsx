"use client";

import { IconButton } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import useServerAction from "@/hooks/use-server-action";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { Grip, ListOrdered } from "lucide-react";
import { useEffect, useState } from "react";
import { useRaisedShadow } from "../../../calendar/_components/use-raised-shadow";
import updateOptionsIndex from "../_actions/update-options-index";
import { useRouter } from "next/navigation";

function ReorderOptions({
  options,
}: {
  options:
    | {
        id: string;
        name: string;
        index: number;
        optionIds: string[];
      }[]
    | null;
}) {
  const [localOptions, setLocalOptions] = useState<string[]>(options?.map((o) => o.id) || []);
  const [open, setOpen] = useState(false);
  const { serverAction } = useServerAction(updateOptionsIndex);
  const router = useRouter();

  function onClose() {
    if (!options || !localOptions) return;
    const newOrder = options.map((o) => ({ index: localOptions.indexOf(o.id), optionIds: o.optionIds }));
    setOpen(false);
    serverAction({
      data: newOrder,
      onSuccess: () => {
        router.refresh();
      },
    });
  }

  useEffect(() => {
    if (!options) return;
    setLocalOptions(options.map((o) => o.id));
  }, [options]);
  if (!options || options.length < 2) return null;

  return (
    <>
      <IconButton iconClassName="size-3" onClick={() => setOpen(true)} Icon={ListOrdered} />
      <Modal title="Option" isOpen={open} onClose={onClose}>
        <Reorder.Group
          as="ul"
          values={localOptions}
          onReorder={setLocalOptions}
          className="flex flex-col gap-2   relative max-h-[70dvh] p-2"
          style={{ overflowY: "scroll" }}
          axis="y"
          layoutScroll
        >
          {localOptions.map((id) => {
            const option = options.find((o) => o.id === id);
            if (!option) return null;
            return <OrderOption key={option.id} optionId={option.id} optionName={option.name} />;
          })}
        </Reorder.Group>
      </Modal>
    </>
  );
}

function OrderOption({ optionName, optionId }: { optionName: string; optionId: string }) {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  const controls = useDragControls();

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    controls.start(e);
  };

  return (
    <Reorder.Item
      style={{ boxShadow, y }}
      value={optionId}
      id={optionId}
      dragListener={false}
      dragControls={controls}
      as="li"
      className={`p-2 border rounded-md flex gap-2 transition-colors bg-background`}
    >
      <div
        onPointerDown={handlePointerDown}
        style={{ touchAction: "none" }}
        className="flex gap-2 items-center justify-center p-2 cursor-pointer"
      >
        <Grip className="size-4" />
      </div>

      <span className="p-2 select-none pointer-events-none">{optionName}</span>
    </Reorder.Item>
  );
}

export default ReorderOptions;

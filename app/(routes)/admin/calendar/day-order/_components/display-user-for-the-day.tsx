"use client";
import { getUserName } from "@/components/table-custom-fuction";
import { NameWithImage } from "@/components/table-custom-fuction/common-cell";
import NoResults from "@/components/ui/no-results";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { Grip } from "lucide-react";
import { memo, useEffect, useState } from "react";
import type { GetDayOrdersType } from "../_functions/get-day-orders";
import type { GetUsersType } from "../_functions/get-users";
import UserModal from "./user-modal";
import { nanoid } from "@/lib/id";
import useServerAction from "@/hooks/use-server-action";
import updateDayOrder from "../_actions/update-day-order";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function DisplayUserForTheDay({
  dayOrdersForDay,
  users,
  day,
  index,
}: {
  dayOrdersForDay: GetDayOrdersType[number]["dayOrderUsers"] | undefined;
  users: GetUsersType;
  day: string;
  index: number;
}) {
  const { serverAction } = useServerAction(updateDayOrder);
  const [localDayOrdersForDay, setLocalDayOrdersForDay] = useState(dayOrdersForDay?.map(({ userId }) => userId));
  useEffect(() => {
    setLocalDayOrdersForDay(dayOrdersForDay?.map(({ userId }) => userId));
  }, [dayOrdersForDay]);

  function onUpdateDayOrder() {
    console.log(localDayOrdersForDay);
    if (!localDayOrdersForDay || localDayOrdersForDay.length === 0) {
      toast.error("Veuillez sélectionner au moins un client");
      return;
    }
    serverAction({ data: { userIds: localDayOrdersForDay, day: index } });
  }
  return (
    <div className="w-[320px] h-full  space-y-2 relative flex-shrink-0 ">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold capitalize text-center flex justify-between items-center p-2 mx-auto">
          {day}
        </h2>
        <UserModal
          users={users.filter(({ id }) => !localDayOrdersForDay?.includes(id))}
          onValueChange={(userId) =>
            setLocalDayOrdersForDay((prev) => (prev && prev?.length > 0 ? [...prev, userId] : [userId]))
          }
        />
      </div>
      {localDayOrdersForDay && localDayOrdersForDay.length > 0 ? (
        <Button variant={"green"} className="w-full" onClick={onUpdateDayOrder}>
          Mettre a jour
        </Button>
      ) : null}
      {localDayOrdersForDay ? (
        <ScrollArea className="  overflow-auto p-2" style={{ height: `calc(100% - 50px)` }}>
          <Reorder.Group
            as="ul"
            values={localDayOrdersForDay}
            onReorder={setLocalDayOrdersForDay}
            className="flex flex-col gap-2   relative"
            axis="y"
            layoutScroll
          >
            {localDayOrdersForDay.map((userId, index) => {
              const user = users.find((user) => user.id === userId);
              if (!user) {
                return <NoResults key={userId} />;
              }
              return <OrderItem key={userId} user={user} />;
            })}
          </Reorder.Group>
        </ScrollArea>
      ) : (
        "Aucun client pour ce jour"
      )}
    </div>
  );
}

function OrderItem({ user }: { user: GetUsersType[number] }) {
  // const y = useMotionValue(0);
  // const boxShadow = useRaisedShadow(y);
  const controls = useDragControls();
  const backgroundColor = useMotionValue("var(--background)");

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    controls.start(e);
    backgroundColor.set("var(--blue-300)");
  };

  return (
    <Reorder.Item
      // style={{ boxShadow, y }}
      value={user.id}
      dragListener={false}
      dragControls={controls}
      onDragEnd={() => {
        backgroundColor.set("var(--background)");
      }}
      as="li"
      style={{ backgroundColor }}
      className={`p-2 border rounded-md flex gap-2 transition-colors`}
    >
      <div onPointerDown={handlePointerDown} className="flex gap-2 items-center justify-center p-2 cursor-pointer">
        <Grip className="size-4" />
      </div>
      <NameWithImage
        name={getUserName(user)}
        image={user.image}
        imageSize={12}
        className="p-2 select-none pointer-events-none"
      />
    </Reorder.Item>
  );
}

export default DisplayUserForTheDay;

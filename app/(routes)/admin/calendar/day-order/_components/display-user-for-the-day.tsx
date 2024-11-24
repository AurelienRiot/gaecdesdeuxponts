"use client";
import { getUserName } from "@/components/table-custom-fuction";
import { NameWithImage } from "@/components/user";
import { LoadingButton } from "@/components/ui/button";
import NoResults from "@/components/ui/no-results";
import type { UserForOrderType } from "@/components/zod-schema/user-for-orders-schema";
import useServerAction from "@/hooks/use-server-action";
import scrollToLastChild from "@/lib/scroll-to-last-child";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { Grip } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRaisedShadow } from "../../_components/use-raised-shadow";
import updateDayOrder from "../_actions/update-day-order";
import type { GetDayOrdersType } from "../_functions/get-day-orders";
import UserModal from "./user-modal";

function DisplayUserForTheDay({
  dayOrdersForDay,
  users,
  day,
  index,
}: {
  dayOrdersForDay: GetDayOrdersType[number]["dayOrderUsers"] | undefined;
  users: UserForOrderType[];
  day: string;
  index: number;
}) {
  const containerRef = useRef<HTMLUListElement>(null);
  const { serverAction, loading } = useServerAction(updateDayOrder);
  const [localDayOrdersForDay, setLocalDayOrdersForDay] = useState(dayOrdersForDay?.map(({ userId }) => userId));
  useEffect(() => {
    setLocalDayOrdersForDay(dayOrdersForDay?.map(({ userId }) => userId));
  }, [dayOrdersForDay]);

  function onUpdateDayOrder() {
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
          onValueChange={(userId) => {
            setLocalDayOrdersForDay((prev) => (prev && prev?.length > 0 ? [...prev, userId] : [userId]));
            scrollToLastChild(containerRef.current);
          }}
        />
      </div>
      {localDayOrdersForDay && localDayOrdersForDay.length > 0 ? (
        <LoadingButton disabled={loading} variant={"green"} className="w-full" onClick={onUpdateDayOrder}>
          Mettre a jour
        </LoadingButton>
      ) : null}
      {localDayOrdersForDay ? (
        <Reorder.Group
          as="ul"
          ref={containerRef}
          values={localDayOrdersForDay}
          onReorder={setLocalDayOrdersForDay}
          className="flex flex-col gap-2   p-2 relative"
          style={{ height: `calc(100dvh - 280px)`, overflowY: "scroll" }}
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
      ) : (
        "Aucun client pour ce jour"
      )}
    </div>
  );
}

function OrderItem({ user }: { user: UserForOrderType }) {
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
      value={user.id}
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

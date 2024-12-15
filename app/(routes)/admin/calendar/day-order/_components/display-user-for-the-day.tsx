"use client";
import DeleteButton from "@/components/animations/icons/delete";
import { getUserName } from "@/components/table-custom-fuction";
import NoResults from "@/components/ui/no-results";
import { NameWithImage } from "@/components/user";
import type { UserForOrderType } from "@/components/zod-schema/user-for-orders-schema";
import { DAYS_OF_WEEK } from "@/lib/date-utils";
import scrollToLastChild from "@/lib/scroll-to-last-child";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { Grip } from "lucide-react";
import { useRef } from "react";
import { useRaisedShadow } from "../../_components/use-raised-shadow";
import UserModal from "./user-modal";

function DisplayUserForTheDay({
  users,
  localDayOrdersForDay,
  setLocalDayOrdersForDay,
  day,
}: {
  localDayOrdersForDay: string[] | undefined;
  setLocalDayOrdersForDay: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  users: UserForOrderType[];
  day: number;
}) {
  const containerRef = useRef<HTMLUListElement>(null);

  return (
    <div className="w-full h-full  space-y-2 relative flex-shrink-0 ">
      <div className="flex justify-end items-center">
        <h2 className="text-xl -z-10 font-semibold absolute inset-x-0 capitalize text-center p-2">
          {DAYS_OF_WEEK[day]}
        </h2>
        <UserModal
          className="mr-auto"
          users={users.filter(({ id }) => !localDayOrdersForDay?.includes(id))}
          onValueChange={(userId) => {
            setLocalDayOrdersForDay((prev) => (prev && prev?.length > 0 ? [...prev, userId] : [userId]));
            scrollToLastChild(containerRef.current);
          }}
        />
      </div>
      {localDayOrdersForDay && localDayOrdersForDay.length > 0 ? (
        <Reorder.Group
          as="ul"
          ref={containerRef}
          values={localDayOrdersForDay}
          onReorder={setLocalDayOrdersForDay}
          className="flex flex-col gap-2   p-2 relative"
          style={{ height: `calc(100dvh - 180px)`, overflowY: "scroll" }}
          axis="y"
          layoutScroll
        >
          {localDayOrdersForDay.map((userId, index) => {
            const user = users.find((user) => user.id === userId);
            if (!user) {
              return <NoResults style={{ height: `calc(100dvh - 180px)` }} key={userId} />;
            }
            return <OrderItem key={userId} user={user} setLocalDayOrdersForDay={setLocalDayOrdersForDay} />;
          })}
        </Reorder.Group>
      ) : (
        <NoResults style={{ height: `calc(100dvh - 180px)` }} text="Aucun client pour ce jour" />
      )}
    </div>
  );
}

function OrderItem({
  user,
  setLocalDayOrdersForDay,
}: { user: UserForOrderType; setLocalDayOrdersForDay: React.Dispatch<React.SetStateAction<string[] | undefined>> }) {
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
      <DeleteButton
        onClick={() => setLocalDayOrdersForDay((prev) => prev?.filter((id) => id !== user.id))}
        type="button"
        className="justify-self-end"
        svgClassName="size-4 text-destructive"
      />
    </Reorder.Item>
  );
}

export default DisplayUserForTheDay;

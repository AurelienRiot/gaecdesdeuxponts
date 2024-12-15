"use client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import NoResults from "@/components/ui/no-results";
import type { UserForOrderType } from "@/components/zod-schema/user-for-orders-schema";
import useServerAction from "@/hooks/use-server-action";
import { DAYS_OF_WEEK } from "@/lib/date-utils";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import updateDayOrder from "../_actions/update-day-order";
import type { GetDayOrdersType } from "../_functions/get-day-orders";
import DisplayUserForTheDay from "./display-user-for-the-day";

type UserForTheDayProps = GetDayOrdersType[number];

type UserForTheDayContextType = {
  userForTheDay: UserForTheDayProps | null;
  setUserForTheDay: React.Dispatch<React.SetStateAction<UserForTheDayProps | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserForTheDayModalContext = createContext<UserForTheDayContextType | undefined>(undefined);

export const UserForTheDayModalProvider: React.FC<{
  children: React.ReactNode;
  users: UserForOrderType[];
}> = ({ children, users }) => {
  const [userForTheDay, setUserForTheDay] = useState<UserForTheDayProps | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <UserForTheDayModalContext.Provider value={{ userForTheDay, setUserForTheDay, open, setOpen }}>
      {children}
      <UserModal users={users} />
    </UserForTheDayModalContext.Provider>
  );
};

export function useUserForTheDayModal() {
  const context = useContext(UserForTheDayModalContext);

  if (context === undefined) {
    throw new Error("useUserForTheDayModal must be used within a UserForTheDayModalProvider");
  }

  return context;
}

function UserModal({ users }: { users: UserForOrderType[] }) {
  const { userForTheDay, open, setOpen } = useUserForTheDayModal();
  const { serverAction } = useServerAction(updateDayOrder);
  const [localDayOrdersForDay, setLocalDayOrdersForDay] = useState(
    userForTheDay?.dayOrderUsers.map(({ userId }) => userId),
  );

  useEffect(() => {
    setLocalDayOrdersForDay(userForTheDay?.dayOrderUsers.map(({ userId }) => userId));
  }, [userForTheDay]);

  function onClose() {
    if (!localDayOrdersForDay || !userForTheDay) {
      toast.error("Veuillez sélectionner au moins un client");
      return;
    }
    serverAction({ data: { userIds: localDayOrdersForDay, day: userForTheDay.day } });
    setOpen(false);
  }
  return (
    <Modal title="Information du client" className="p-4 max-h-[95vh] h-full " isOpen={open} onClose={onClose}>
      {userForTheDay ? (
        <DisplayUserForTheDay
          setLocalDayOrdersForDay={setLocalDayOrdersForDay}
          localDayOrdersForDay={localDayOrdersForDay}
          day={userForTheDay.day}
          users={users}
        />
      ) : (
        <NoResults />
      )}
    </Modal>
  );
}

export function ModalTrigger({ day, userForTheDay }: { day: number; userForTheDay: UserForTheDayProps }) {
  const { setOpen, setUserForTheDay } = useUserForTheDayModal();

  return (
    <Button
      className="w-40 mx-auto "
      onClick={() => {
        setUserForTheDay(userForTheDay);
        setOpen(true);
      }}
    >
      {DAYS_OF_WEEK[day]}
    </Button>
  );
}

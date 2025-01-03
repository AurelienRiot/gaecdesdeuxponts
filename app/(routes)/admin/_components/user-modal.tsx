"use client";
import DisplayHours from "@/components/display-shops/display-hours";
import { getMapLinks } from "@/components/google-events";
import { StatusCell } from "@/components/table-custom-fuction/cell-orders";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import NoResults from "@/components/ui/no-results";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DisplayLink } from "@/components/user";
import type { CalendarOrderType } from "@/components/zod-schema/calendar-orders";
import type { UserForOrderType } from "@/components/zod-schema/user-for-orders-schema";
import { useOrdersQuery } from "@/hooks/use-query/orders-query";
import { useUsersQuery } from "@/hooks/use-query/users-query";
import { dateFormatter } from "@/lib/date-utils";
import { cn, formatFrenchPhoneNumber } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { createContext, useContext, useState } from "react";
import DisplayItem from "../calendar/_components/display-item";

type UserModalContextType = {
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  isUserModalOpen: boolean;
  setIsUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserModalContext = createContext<UserModalContextType | undefined>(undefined);

export const UserModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  return (
    <UserModalContext.Provider value={{ userId, setUserId, isUserModalOpen, setIsUserModalOpen }}>
      {children}
      <Modal
        title="Information du client"
        className="p-4"
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
      >
        <UserModal />
      </Modal>
    </UserModalContext.Provider>
  );
};

export function useUserModal() {
  const context = useContext(UserModalContext);

  if (context === undefined) {
    throw new Error("useUserModal must be used within a UserModalProvider");
  }

  return context;
}

function UserModal() {
  const { data: users } = useUsersQuery();
  const { data: orders } = useOrdersQuery();
  const { userId, setIsUserModalOpen } = useUserModal();

  if (!userId) {
    <>
      <p>Aucun client selectionné</p>
      <Button variant={"outline"} className="w-full" onClick={() => setIsUserModalOpen(false)}>
        Fermer
      </Button>
    </>;
  }
  const user = users?.find((user) => user.id === userId);
  if (!user) {
    return (
      <>
        <p>Client introuvable</p>
        <Button variant={"outline"} className="w-full" onClick={() => setIsUserModalOpen(false)}>
          Fermer
        </Button>
      </>
    );
  }
  const userOrders = orders
    ? orders
        .filter((otherOrder) => {
          return otherOrder.userId === user.id;
        })
        .sort((a, b) => b.shippingDate.getTime() - a.shippingDate.getTime())
    : [];
  return (
    <>
      <UserInfo user={user} userOrders={userOrders} />
      <div className="flex justify-between gap-4">
        <Button variant={"outline"} className="w-full" onClick={() => setIsUserModalOpen(false)}>
          Fermer
        </Button>
        <Button variant={"green"} asChild className="w-full">
          <Link onClick={() => setIsUserModalOpen(false)} href={`/admin/users/${user.id}`}>
            Consulter
          </Link>
        </Button>
      </div>
    </>
  );
}

const UserInfo = ({ user, userOrders }: { user: UserForOrderType; userOrders: CalendarOrderType[] }) => {
  return (
    <div className="px-2 py-3 ">
      <div className="flex items-center mb-4 gap-4">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "Unknown User"}
            width={48}
            height={48}
            className="rounded-sm object-contain"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 font-semibold text-xs">{user.name?.charAt(0)}</span>
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold">{user.company || user.name || "Unknown User"}</h2>
          <Link
            href={`mailto:${user.email}`}
            target="_blank"
            className="text-sm text-gray-500
          block"
          >
            {user.email}
          </Link>

          {!!user.phone && (
            <Link href={`tel:${user.phone}`} target="_blank">
              {formatFrenchPhoneNumber(user.phone)}
            </Link>
          )}
        </div>
      </div>
      <ScrollArea className="max-h-[50dvh] overflow-y-auto pb-2">
        {user.company ? (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Nom</h3>

            <p className="mt-1 text-sm text-gray-900 px-2">{user.name}</p>
          </div>
        ) : null}
        {user.address ? (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
            <Button asChild variant={"link"} className="mt-1 text-sm p-0 text-blue-700 px-2">
              <Link href={getMapLinks({ address: user.address, name: user.company })} target="_blank">
                {user.address}
              </Link>
            </Button>
          </div>
        ) : null}
        {user.shopHours.length > 0 ? (
          <div className="mb-4 space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Horraires</h3>
            <DisplayHours shopHours={user.shopHours} />
          </div>
        ) : null}

        {user.links.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Liens</h3>

            {user.links.map(({ value, label }) => (
              <DisplayLink key={value} value={value} label={label} />
            ))}
          </div>
        )}
        {user.notes ? (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Notes</h3>

            <AutosizeTextarea className="border-0 focus-visible:ring-0 select-text" readOnly value={user.notes} />
          </div>
        ) : null}
        <DisplayUserOrders userId={user.id} userOrders={userOrders} />
      </ScrollArea>
    </div>
  );
};

function DisplayUserOrders({ userOrders, userId }: { userOrders: CalendarOrderType[]; userId: string }) {
  const { setIsUserModalOpen } = useUserModal();

  return (
    <div className="mb-4 space-y-2">
      <h3 className="text-sm font-medium text-gray-500 flex items-center justify-start">
        Commandes
        <Link
          onClick={() => setIsUserModalOpen(false)}
          className={cn(buttonVariants({ variant: "link" }), "text-xs text-gray-500")}
          href={`/admin/users/${userId}/all-orders`}
        >
          (Voir les toutes les commandes)
        </Link>
      </h3>

      {userOrders.length > 0 ? (
        userOrders.map((order) => (
          <div key={order.id} className="space-y-2 p-3 rounded-md bg-secondary">
            <h4 className="text-xs font-semibold capitalize text-center flex justify-between items-center text-primary">
              <span>
                {new Date(order.shippingDate).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
                  ? "Aujourd'hui"
                  : dateFormatter(new Date(order.shippingDate), { days: true })}
              </span>
            </h4>
            <div>
              <h4 className="text-xs font-semibold">Produits :</h4>
              <DisplayItem items={order.productsList} />
            </div>
            <div className="flex justify-between items-center">
              <StatusCell status={order.status} />
              <Button asChild variant="secondary" className="text-sm border-dashed border">
                <Link onClick={() => setIsUserModalOpen(false)} href={`/admin/orders/${order.id}`}>
                  Éditer
                </Link>
              </Button>
            </div>
          </div>
        ))
      ) : (
        <NoResults text="Aucune commande" />
      )}
    </div>
  );
}

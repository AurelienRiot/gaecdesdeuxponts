"use client";
import { getMapLinks } from "@/components/google-events";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import NoResults from "@/components/ui/no-results";
import { dateFormatter } from "@/lib/date-utils";
import { formatFrenchPhoneNumber } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
import type { CalendarOrdersType } from "../_functions/get-orders";
import DisplayItem from "./display-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusCell } from "@/components/table-custom-fuction/cell-orders";

type UserModalProps = CalendarOrdersType["user"] & { orders: CalendarOrdersType[]; date: Date };

type UserModalContextType = {
  user: UserModalProps | null;
  setUser: React.Dispatch<React.SetStateAction<UserModalProps | null>>;
  isUserModalOpen: boolean;
  setIsUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserModalContext = createContext<UserModalContextType | undefined>(undefined);

export const UserModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<UserModalProps | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  return (
    <UserModalContext.Provider value={{ user, setUser, isUserModalOpen, setIsUserModalOpen }}>
      {children}
      <UserModal />
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
  const router = useRouter();
  const { user, isUserModalOpen, setIsUserModalOpen } = useUserModal();
  return (
    <Modal
      title="Information du client"
      className="p-4"
      isOpen={isUserModalOpen}
      onClose={() => setIsUserModalOpen(false)}
    >
      {user ? (
        <>
          <UserInfo />
          <div className="flex justify-between gap-4">
            <Button variant={"outline"} className="w-full" onClick={() => setIsUserModalOpen(false)}>
              Fermer
            </Button>
            <Button
              variant={"green"}
              className="w-full"
              onClick={() => {
                () => setIsUserModalOpen(false);
                router.push(`/admin/users/${user.id}`);
              }}
            >
              Consulter
            </Button>
          </div>
        </>
      ) : (
        <>
          <p>Aucun client sélectionné</p>
          <Button variant={"outline"} className="w-full" onClick={() => setIsUserModalOpen(false)}>
            Fermer
          </Button>
        </>
      )}
    </Modal>
  );
}

const UserInfo = () => {
  const { user } = useUserModal();
  if (!user) return <NoResults />;
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

        {user.notes ? (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Notes</h3>

            <AutosizeTextarea className="border-0 focus-visible:ring-0 select-text" readOnly value={user.notes} />
          </div>
        ) : null}
        {user.links.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Liens</h3>

            {user.links.map(({ value, label }) => (
              <Button key={value} asChild variant={"link"}>
                <Link href={value} target="_blank">
                  {label}
                </Link>
              </Button>
            ))}
          </div>
        )}
        <DisplayUserOrders />
      </ScrollArea>
    </div>
  );
};

function DisplayUserOrders() {
  const { user } = useUserModal();
  if (!user) return null;

  return (
    <div className="mb-4 space-y-2">
      <h3 className="text-sm font-medium text-gray-500">
        {user.orders.length > 1 ? "Commandes précedentes" : "Commande précedente"}
      </h3>

      {user.orders.map((order) => (
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
              <Link href={`/admin/orders/${order.id}`}>Éditer</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

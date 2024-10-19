"use client";
import { AnimateHeight } from "@/components/animations/animate-size";
import { StatusCell } from "@/components/table-custom-fuction/cell-orders";
import { NameWithImage } from "@/components/table-custom-fuction/common-cell";
import { Button, IconButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, formatFrenchPhoneNumber } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { CalendarOrdersType } from "../_functions/get-orders";
import DisplayItem from "./display-item";
import Image from "next/image";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";
import { getMapLinks } from "@/components/google-events";

interface DisplayOrderProps {
  order: CalendarOrdersType;
  className?: string;
  newOrder?: boolean;
}

const DisplayOrder: React.FC<DisplayOrderProps> = ({ order, className, newOrder }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  return (
    <>
      <UserModal open={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} user={order.user} />
      <Card className={cn("w-full max-w-sm ", className)}>
        <CardHeader
          className="flex relative items-center justify-start py-2 px-4 cursor-pointer "
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {newOrder && <IconButton className="size-4 p-0.5 text-green-500 absolute top-0.5 left-0.5 " Icon={Check} />}
          <div className="grid grid-cols-11  items-center w-full">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsUserModalOpen(true);
              }}
              className="col-span-5  "
            >
              <NameWithImage
                name={order.name}
                image={order.user.image}
                imageSize={12}
                completed={order.user.completed}
              />
            </button>

            <StatusCell status={order.status} className="col-span-5 justify-center" />
            <div className="flex justify-end">
              <ChevronDown
                data-state={isExpanded}
                className="h-4 w-4 data-[state=true]:rotate-180 transition-transform duration-500"
              />
            </div>
          </div>
        </CardHeader>
        <AnimateHeight display={isExpanded}>
          <CardContent className="py-2 px-4">
            <div className="space-y-2">
              <div className="flex justify-left">
                <Link href={order.shopId ? `/admin/shops/${order.shopId}` : "#"} className="font-bold">
                  {order.shopName}
                </Link>
                {/* <p>{order.id}</p> */}
              </div>
              <div>
                <h4 className="text-xs font-semibold">Produits :</h4>
                <DisplayItem items={order.productsList} />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold">Total : {order.totalPrice}</p>
                  {/* <p className="text-[10px] text-gray-500">Livraison {relativeDate}</p> */}
                </div>
                <Button asChild variant="secondary" className="text-sm border-dashed border">
                  <Link href={`/admin/orders/${order.id}`}>Éditer</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </AnimateHeight>
      </Card>
    </>
  );
};

export default DisplayOrder;

function UserModal({ onClose, user, open }: { open: boolean; onClose: () => void; user?: CalendarOrdersType["user"] }) {
  const router = useRouter();
  return (
    <Modal title="Information du client" isOpen={open} onClose={onClose}>
      {user ? (
        <>
          <UserInfo user={user} />
          <div className="flex justify-between gap-4">
            <Button variant={"outline"} className="w-full" onClick={onClose}>
              Fermer
            </Button>
            <Button
              variant={"green"}
              className="w-full"
              onClick={() => {
                onClose();
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
          <Button variant={"outline"} className="w-full" onClick={onClose}>
            Fermer
          </Button>
        </>
      )}
    </Modal>
  );
}

const UserInfo = ({ user }: { user: CalendarOrdersType["user"] }) => (
  <div className="px-4 py-5 ">
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
        <p className="text-sm text-gray-500">{user.email}</p>
        {!!user.phone && <p>{formatFrenchPhoneNumber(user.phone)}</p>}
      </div>
    </div>
    <div className="max-h-[40dvh] overflow-y-auto px-4">
      {user.company ? (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Nom</h3>

          <p className="mt-1 text-sm text-gray-900">{user.name}</p>
        </div>
      ) : null}
      {user.address ? (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
          <Button asChild variant={"link"} className="mt-1 text-sm p-0 text-blue-700">
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
    </div>
  </div>
);

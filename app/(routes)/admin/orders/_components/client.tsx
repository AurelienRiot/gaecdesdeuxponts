"use client";

import OrderCard, { type OrderCardProps } from "@/components/display-orders/order-card";
import { Button, LoadingButton } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import NoResults from "@/components/ui/no-results";
import { Separator } from "@/components/ui/separator";
import { addHours } from "date-fns";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";

interface OrderClientProps {
  initialData: OrderCardProps[];
  initialDateRange: DateRange;
}

export const OrderClient: React.FC<OrderClientProps> = ({ initialData, initialDateRange }) => {
  const [data, setData] = useState<OrderCardProps[]>(initialData);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange);
  const [loading, setLoading] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  const handleChangeDate = async () => {
    setLoading(true);
    if (!dateRange?.from || !dateRange?.to) {
      setLoading(false);
      toast.error("Veuillez choisir une date");
      return;
    }
    const queryParams = new URLSearchParams({
      from: dateRange.from.toISOString(),
      to: dateRange.to.toISOString(),
    }).toString();
    router.push(`${pathName}?${queryParams}`);

    setLoading(false);
  };

  const handleTodayOrders = () => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
    const endOfDay = addHours(today, 24);
    const queryParams = new URLSearchParams({
      from: startOfDay.toISOString(),
      to: endOfDay.toISOString(),
    }).toString();
    router.push(`${pathName}?${queryParams}`);
  };

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  return (
    <>
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <Heading title={`Commandes (${data.length})`} description="Gérer les commandes" />
        <Button onClick={() => router.push(`/admin/orders/new`)} className="m-2 pb-6 pt-6 sm:ml-2 sm:pb-0 sm:pt-0">
          <Plus className="mr-2 h-4 w-4" />
          Créer une commande
        </Button>
      </div>

      <Separator className="mb-4" />
      <div className="flex flex-col gap-4 sm:flex-row">
        <DatePickerWithRange
          date={dateRange}
          setDate={setDateRange}
          startMonth={new Date(2024, 0)}
          endMonth={new Date(new Date().getFullYear(), 11)}
        />
        <LoadingButton className="w-fit" disabled={loading} onClick={() => handleChangeDate()}>
          Valider
        </LoadingButton>
      </div>
      <SearchId />
      <Button className="w-fit" onClick={handleTodayOrders}>
        Afficher les commandes d'aujourd'hui
      </Button>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center  gap-4">
        {initialData.length === 0 ? (
          <NoResults />
        ) : (
          initialData.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </>
  );
};

function SearchId() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(formData: FormData) {
    router.push(`?id=${formData.get("searchId")}`);
  }
  return (
    <form className="flex flex-wrap gap-2" action={onSubmit}>
      <Input name="searchId" className="max-w-xs" placeholder="Rechercher par numéros de commande" />
      <Button type="submit">Rechercher</Button>
      <Button
        type="button"
        variant={"outline"}
        className="border-dashed"
        onClick={() => {
          formRef.current?.reset();
          router.push(`/admin/orders`);
        }}
      >
        Réinitialiser
      </Button>
    </form>
  );
}

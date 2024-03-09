"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { OrderColumn, columns } from "./order-column";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface OrderTableProps {
  data: OrderColumn[];
}

export const OrderTable: React.FC<OrderTableProps> = ({ data }) => {
  return (
    <OrderStatusProvider initialData={data}>
      <>
        <Heading
          title={`Commandes (${data.length})`}
          description="Gérez les commandes"
        />
        <Separator />
        <DataTable searchKey="products" columns={columns} initialData={data} />
      </>
    </OrderStatusProvider>
  );
};

interface OrderStatusContextType {
  orderStatus: { [key: string]: boolean | "indeterminate" };
  setOrderStatus: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean | "indeterminate" }>
  >;
}
const OrderStatusContext = createContext<OrderStatusContextType>({
  orderStatus: {},
  setOrderStatus: () => {},
});

const OrderStatusProvider = ({
  initialData,
  children,
}: {
  initialData: OrderColumn[];
  children: ReactNode;
}) => {
  const [orderStatus, setOrderStatus] = useState<{
    [key: string]: boolean | "indeterminate";
  }>({});

  useEffect(() => {
    // Initialize the order status state with the `id` and `isPaid` fields from initialData
    const statusMap = initialData.reduce(
      (acc, order) => {
        acc[order.id] = order.isPaid;
        return acc;
      },
      {} as { [key: string]: boolean | "indeterminate" },
    );

    setOrderStatus(statusMap);
  }, [initialData]);

  return (
    <OrderStatusContext.Provider value={{ orderStatus, setOrderStatus }}>
      {children}
    </OrderStatusContext.Provider>
  );
};

export const useOrderStatus = () => useContext(OrderStatusContext);

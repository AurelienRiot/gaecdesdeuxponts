import { useFormContext } from "react-hook-form";
import { DisplayShippingOrder } from "@/components/pdf/pdf-button";
import { UserWithAddress } from "@/types";
import { addressFormatter, dateFormatter } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { OrderFormValues } from "./order-form";
import { DataShippingOrderType } from "@/components/pdf/data-shipping";

const OrderButton = ({ users }: { users: UserWithAddress[] }) => {
  const form = useFormContext<OrderFormValues>();

  const user = users.find((user) => user.id === form.getValues("userId"));
  const address =
    user?.address && user.address.length > 0
      ? addressFormatter(user.address[0])
      : "";
  const dateOfShipping = form.getValues("dateOfShipping");
  const dateOfPayment = form.getValues("dateOfPayment");

  const data: DataShippingOrderType = {
    customer: {
      id: user?.id || "",
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: address,
    },
    order: {
      id: form.getValues("id") || "",
      dateOfShipping: dateOfShipping ? dateFormatter(dateOfShipping) : "",
      dateOfEdition: dateFormatter(new Date()),
      dateOfPayment: dateOfPayment ? dateFormatter(dateOfPayment) : "",
      totalPrice: form.getValues("totalPrice"),
      items: form.getValues("orderItems").map((item) => ({
        priceTTC: item.price || 0,
        desc: item.name || "",
        id: item.itemId || "",
        qty: item.quantity,
      })),
    },
  };

  return (
    <div>
      <Label>Bon de livraison</Label>
      <DisplayShippingOrder data={data} />
    </div>
  );
};

export default OrderButton;

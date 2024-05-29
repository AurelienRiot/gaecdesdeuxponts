import { DataInvoiceType } from "@/components/pdf/data-invoice";
import { DisplayInvoice } from "@/components/pdf/pdf-button";
import { Label } from "@/components/ui/label";
import { dateFormatter } from "@/lib/date-utils";
import { addressFormatter } from "@/lib/utils";
import { UserWithAddress } from "@/types";
import { useFormContext } from "react-hook-form";
import { OrderFormValues } from "./order-form";

const InvoiceButton = ({ users }: { users: UserWithAddress[] }) => {
  const form = useFormContext<OrderFormValues>();

  const user = users.find((user) => user.id === form.getValues("userId"));
  const address =
    user?.address && user.address.length > 0
      ? addressFormatter(user.address[0])
      : "";
  const dateOfShipping = form.getValues("dateOfShipping");
  const dateOfPayment = form.getValues("dateOfPayment");

  const data: DataInvoiceType = {
    customer: {
      id: user?.id || "",
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: address,
    },
    order: {
      id: form.getValues("id") || "",
      dateOfPayment: dateOfPayment ? dateFormatter(dateOfPayment) : "",
      dateOfEdition: dateFormatter(new Date()),
      dateOfShipping: dateOfShipping ? dateFormatter(dateOfShipping) : "",
      totalPrice: form.getValues("totalPrice"),
      items: form.getValues("orderItems").map((item) => ({
        id: item.itemId || "",
        desc: item.name || "",
        qty: item.quantity,
        priceTTC: item.price || 0,
      })),
    },
  };

  return (
    <div>
      <Label>Facture</Label>
      <DisplayInvoice isPaid={!!dateOfPayment} data={data} />
    </div>
  );
};

export default InvoiceButton;

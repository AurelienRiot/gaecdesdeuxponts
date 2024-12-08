import { PaymentMethodCell, StatusCell } from "@/components/table-custom-fuction/cell-orders";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { NameWithImage } from "@/components/user";
import { Package } from "lucide-react";
import Link from "next/link";
import { CellAction } from "./cell-action";
import type { InvoiceColumn } from "./columns";
import { buttonVariants } from "@/components/ui/button";

export function InvoiceCard({
  data,
}: {
  data: InvoiceColumn;
}) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex-col items-center  gap-2 p-4 w-full">
        <div className="flex items-center justify-between  w-full ">
          <Link
            href={data.userId ? `/admin/users/${data.userId}` : "#"}
            className={buttonVariants({ variant: "link" })}
          >
            <NameWithImage name={data.name} image={data.image} className="font-semibold text-md px-0" />
          </Link>
          <CellAction data={data} />
        </div>
        <span className="text-sm text-muted-foreground mr-auto">N° {data.id}</span>
        {/* <DisplayInvoice invoiceId={data.id} isSend={data.emailSend} /> */}
      </CardHeader>
      <CardContent className="grid gap-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <StatusCell status={data.status} />
            {data.paymentMethode && data.status === "Payé" && <PaymentMethodCell paymentMethod={data.paymentMethode} />}
          </div>
          <span className="font-bold lining-nums flex gap-2">
            {data.totalPrice}
            <span className="font-normal flex items-center">
              ( {data.totalOrders} <Package className="mx-2 size-4" />)
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Email envoyé:</span>
            <Checkbox checked={data.emailSend} className="cursor-default" />
          </div>
          <span className="text-muted-foreground">{data.date}</span>
        </div>
      </CardContent>
    </Card>
  );
}

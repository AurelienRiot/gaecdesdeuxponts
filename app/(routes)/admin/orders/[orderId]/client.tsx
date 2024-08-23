"use client";

import { toast } from "sonner";

function OrderClient({
  params,
  searchParams,
}: { params: { orderId: string }; searchParams: { id: string | undefined; referer: string | undefined } }) {
  toast.success(`Params : ${JSON.stringify(params)}, SearchParams : ${JSON.stringify(searchParams)}`, {
    duration: 8000,
    position: "top-center",
  });
  return null;
}

export default OrderClient;

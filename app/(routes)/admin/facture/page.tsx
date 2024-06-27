"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { nanoid } from "@/lib/utils";
import dynamic from "next/dynamic";

const DisplayInvoice = dynamic(() => import("./display-invoice"), {
  ssr: false,
});
const DisplayOrder = dynamic(() => import("./display-order"), {
  ssr: false,
});
const DisplayShippingOrder = dynamic(() => import("./display-shipping-order"), {
  ssr: false,
});

const DisplayMonthlyInvoice = dynamic(() => import("./display-monthly-invoice"), {
  ssr: false,
});

const TestPage = () => {
  return (
    <div className="h-[calc(100vh-66px)] space-y-4 p-4">
      <Button
        className="mx-auto ml-8 mt-6"
        onClick={() => {
          window.location.reload();
        }}
      >
        Recharger la page
      </Button>
      <Button onClick={() => console.log(`CS_${nanoid(7)}`)}>créer id</Button>
      <Tabs defaultValue="monthlyInvoice" className="h-full w-full max-w-[1000px]">
        <TabsList className="flex w-full gap-2">
          <TabsTrigger value="invoice">Facture</TabsTrigger>
          <TabsTrigger value="monthlyInvoice">Facture mensuelle</TabsTrigger>
          <TabsTrigger value="order">Bon de commande</TabsTrigger>
          <TabsTrigger value="shippingOrder">Bon de livraison</TabsTrigger>
        </TabsList>
        <TabsContent value="invoice" className="h-full w-full">
          <DisplayInvoice />
        </TabsContent>
        <TabsContent value="monthlyInvoice" className="h-full w-full">
          <DisplayMonthlyInvoice />
        </TabsContent>
        <TabsContent value="order" className="h-full w-full">
          <DisplayOrder />
        </TabsContent>
        <TabsContent value="shippingOrder" className="h-full w-full">
          <DisplayShippingOrder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestPage;

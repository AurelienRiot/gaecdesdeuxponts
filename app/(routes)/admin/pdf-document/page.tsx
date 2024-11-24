"use client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdType, createId } from "@/lib/id";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner";
// import DisplayContratAMAP from "./display-amap";
// import DisplayFormAMAP from "./display-amap-form";
// import DisplayInvoice from "./display-invoice";
// import DisplayMonthlyInvoice from "./display-monthly-invoice";
// import DisplayOrder from "./display-order";
// import DisplayShippingOrder from "./display-shipping-order";

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
const DisplayContratAMAP = dynamic(() => import("./display-amap"), {
  ssr: false,
});

const DisplayFormAMAP = dynamic(() => import("./display-amap-form"), {
  ssr: false,
});

const TestPage = () => {
  return (
    <div className="h-[calc(100vh-66px)] space-y-4 p-4">
      <div className="flex gap-4">
        <Button
          onClick={() => {
            window.location.reload();
          }}
        >
          Recharger la page
        </Button>
        <DisplayId />
      </div>
      <Tabs defaultValue="monthlyInvoice" className="h-full w-full max-w-[1000px]">
        <TabsList className="flex w-full gap-2">
          <TabsTrigger value="invoice">Facture</TabsTrigger>
          <TabsTrigger value="monthlyInvoice">Facture mensuelle</TabsTrigger>
          <TabsTrigger value="order">Bon de commande</TabsTrigger>
          <TabsTrigger value="shippingOrder">Bon de livraison</TabsTrigger>
          <TabsTrigger value="contratAMAP">Contrat AMAP</TabsTrigger>
          <TabsTrigger value="formAMAP">Formulaire AMAP</TabsTrigger>
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
        <TabsContent value="contratAMAP" className="h-full w-full">
          <DisplayContratAMAP />
        </TabsContent>
        <TabsContent value="formAMAP" className="h-full w-full">
          <DisplayFormAMAP />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestPage;

function DisplayId() {
  const [idValue, setIdValue] = useState<(typeof IdType)[number]>("category");

  return (
    <>
      <Select value={idValue} onValueChange={(value) => setIdValue(value as (typeof IdType)[number])}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select a type" />
        </SelectTrigger>
        <SelectContent>
          {IdType.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={() => {
          const id = createId(idValue);
          navigator.clipboard.writeText(id);
          toast.success(id, { position: "top-center", duration: 5000 });
        }}
      >
        créer id
      </Button>
    </>
  );
}

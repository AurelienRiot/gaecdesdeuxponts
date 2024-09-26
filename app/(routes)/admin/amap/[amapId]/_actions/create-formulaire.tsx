"use server";

import type { AMAPType } from "@/components/pdf/pdf-data";
import { generatePdfSring64 } from "@/components/pdf/pdf-fuction";
import safeServerAction from "@/lib/server-action";
import { schema, type AMAPFormulaireValues } from "../_components/amap-formulaire/amap-formulaire-schema";

async function createAMAPFormulaire(data: AMAPFormulaireValues) {
  return await safeServerAction({
    schema: schema,
    data,
    roles: ["admin"],
    serverAction: async ({ amapItems, daysOfAbsence, shippingDays, startDate, endDate, shopId }) => {
      const AMAPData: AMAPType = {
        customer: {
          name: "Nom :",
          userId: "",
          shippingAddress: "Adresse :",
          billingAddress: "Adresse :",
          phone: "Tél :",
          email: "email :",
        },
        contrat: {
          id: "",
          type: shopId,
          dateOfEdition: new Date(),
          totalPrice: 60,
          dayOfAbsence: daysOfAbsence,
          shippingDay: shippingDays,
          startDate,
          endDate,
          items: amapItems.map((item) => ({
            id: item.itemId,
            desc: item.name,
            priceTTC: item.price,
            qty: item.quantity,
          })),
        },
      };

      const base64String = await generatePdfSring64({ data: AMAPData, type: "formulaire" });
      return {
        success: true,
        message: "",
        data: { base64String },
      };
    },
  });
}

export default createAMAPFormulaire;

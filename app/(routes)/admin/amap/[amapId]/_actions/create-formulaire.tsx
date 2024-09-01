"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import type { AMAPType } from "@/components/pdf/pdf-data";
import { generatePdfSring64 } from "@/components/pdf/server-actions/pdf-fuction";
import safeServerAction from "@/lib/server-action";
import { schema, type AMAPFormulaireValues } from "../_components/amap-formulaire/amap-formulaire-schema";

async function createAMAPFormulaire(data: AMAPFormulaireValues) {
  return await safeServerAction({
    schema: schema,
    data,
    getUser: checkAdmin,
    serverAction: async ({ amapItems, daysOfAbsence, shippingDays, startDate, endDate, shopId }) => {
      const AMAPData: AMAPType = {
        customer: {
          id: "",
          name: "Nom :",
          customerId: "",
          shippingAddress: "Adresse :",
          facturationAddress: "Adresse :",
          phone: "Tél :",
          email: "email :",
          orderId: "",
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

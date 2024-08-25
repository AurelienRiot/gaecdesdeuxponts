import { calendarAPI } from "@/lib/api-google";
import { createId } from "@/lib/id";
import { addHours, format } from "date-fns";
import { fr } from "date-fns/locale";
import deleteEvent from "./delete-events";
import getEventsList from "./get-events-list";
import getOrders from "./get-orders-for-events";

export default async function createOrdersEvent(data: { date: Date }) {
  const date = addHours(data.date, 2);
  const startDate = new Date(date.toISOString().split("T")[0]);
  const endDate = new Date(startDate);
  endDate.setHours(23, 59, 59, 999);

  const events = await getEventsList({ startDate, endDate });
  if (events.success && events.data) {
    const commandEvent = events.data.find((event) => event.id?.startsWith("commandes"));
    if (commandEvent?.id) {
      await deleteEvent(commandEvent.id);
    }
  }

  const description = await createDescription({ startDate, endDate });

  const id = createId("command");
  return await calendarAPI.events
    .insert({
      calendarId: process.env.CALENDAR_ID,
      // eventId: "commandesi9hhkhnpk88rhd58h",
      requestBody: {
        id,
        summary: `Commandes ${format(date, "EEEE d", { locale: fr })}`,
        description: description,
        start: {
          // dateTime: new Date().toISOString(),
          date: startDate.toISOString().split("T")[0],
          timeZone: "Europe/Paris",
        },
        end: {
          // dateTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(),
          date: endDate.toISOString().split("T")[0],
          timeZone: "Europe/Paris",
        },
      },
    })
    .then((event) => {
      console.log(event.data.htmlLink);
      return { success: true, message: "event created" };
    })
    .catch((error) => {
      console.log(error);
      return { success: false, message: "event not created" };
    });
}

async function createDescription({ startDate, endDate }: { startDate: Date; endDate: Date }) {
  const { productQuantities, formattedOrders } = await getOrders({ startDate, endDate });
  if (productQuantities.length === 0) return "<font color='red'> Aucune commande </font>";

  const productDescriptions = productQuantities
    .map((item) => `<strong>${item.name}</strong> : ${item.quantity} ${item.unit || ""}`)
    .join("<br />");

  const orderDescriptions = formattedOrders
    .map(
      (order) =>
        `<strong><a href="${process.env.NEXT_PUBLIC_URL}/admin/orders/${order.id}">Commande n°${order.id}</a></strong><br /><a href="${process.env.NEXT_PUBLIC_URL}/admin/users/${order.customerId}">${order.name}</a><br />` +
        order.orderItems
          .map((item) => `<strong>${item.name}</strong> : ${item.quantity} ${item.unit || ""}`)
          .join("<br />") +
        `<br />${order.shippingAddress}<br /><br />`,
    )
    .join("<br />");

  return `${productDescriptions}<br /><br />${orderDescriptions}`;
}

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
  // return {
  //   success: true,
  //   message: "event created",
  // };
  return await calendarAPI.events
    .insert({
      calendarId: process.env.CALENDAR_ID,
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
      return { success: true, message: "Agenda mise à jour" };
    })
    .catch((error) => {
      console.log(error);
      return { success: false, message: "Erreur dans l'envoi de l'evènement" };
    });
}

async function createDescription({ startDate, endDate }: { startDate: Date; endDate: Date }) {
  const { productQuantities, formattedOrders, groupedAMAPOrders } = await getOrders({ startDate, endDate });
  if (productQuantities.length === 0) return "<font color='red'> Aucune commande </font>";

  const amapOrdersDescription =
    Object.values(groupedAMAPOrders)
      .map(
        (order) =>
          `<strong><a href="${process.env.NEXT_PUBLIC_URL}/admin/shop/${order.shopId}">${order.shopName}</a></strong> <br />` +
          order.orderItems
            .map((item) => `<strong>${item.name}</strong> : ${item.quantity}${item.unit || ""}`)
            .join("<br />") +
          `<br /><a href="https://maps.google.com/?q=${order.address}">Addresse</a><br />`,
      )
      .join("<br />") + "<br />";

  const productDescriptions =
    productQuantities
      .map((item) => `<strong>${item.name}</strong> : ${item.quantity}${item.unit || ""}`)
      .join("<br />") + "<br /><br />";

  const orderDescriptions =
    formattedOrders.length === 0
      ? ""
      : formattedOrders
          .map(
            (order) =>
              `<strong><a href="${process.env.NEXT_PUBLIC_URL}/admin/orders/${order.id}"><font color='red'>Acceder a la commande </font></a></strong> <br /><a href="${process.env.NEXT_PUBLIC_URL}/admin/users/${order.customerId}">${order.name}</a><br />` +
              order.orderItems
                .map((item) => `<strong>${item.name}</strong> : ${item.quantity}${item.unit || ""}`)
                .join("<br />") +
              `<br /><a href="https://maps.google.com/?q=${order.shippingAddress}">Adresse</a><br />`,
          )
          .join("<br />");

  const uniqueShippingAddresses = [...new Set(formattedOrders.map((order) => `${order.shippingAddress}`))];
  const directionString =
    formattedOrders.length === 0
      ? ""
      : `<strong><a  href="https://www.google.fr/maps/dir/6+Le+Pont+Robert,+44290+Massérac/${uniqueShippingAddresses.join("/")}">Parcours</a></strong> <br /><br />`;

  return productDescriptions + amapOrdersDescription + directionString + orderDescriptions;
}

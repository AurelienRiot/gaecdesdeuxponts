import { destination, origin } from "@/app/(routes)/admin/direction/_components/direction-schema";
import { calendarAPI } from "@/lib/api-google";
import { dateFormatter, timeZone } from "@/lib/date-utils";
import { createId } from "@/lib/id";
import { addHours } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import deleteEvent from "./delete-events";
import getEventsList from "./get-events-list";
import getAllOrders from "./get-orders-for-events";

const googleDirectioUrl = process.env.NEXT_PUBLIC_GOOGLE_DIR_URL;

export default async function createOrdersEvent(data: { date: Date }) {
  const start = formatInTimeZone(data.date, timeZone, "yyyy-MM-dd");
  const end = formatInTimeZone(addHours(data.date, 24), timeZone, "yyyy-MM-dd");

  const startDate = fromZonedTime(start, timeZone);
  const endDate = fromZonedTime(end, timeZone);

  // console.log({ date: data.date, startDate, endDate });
  // return { success: true, message: "Agenda mise à jour" };

  const events = await getEventsList({ startDate, endDate });
  if (events.success && events.data) {
    for (const event of events.data) {
      if (event.id?.includes("command")) {
        await deleteEvent(event.id);
      }
    }
  }

  const description = await createDescription({ startDate, endDate });
  if (!description) {
    return { success: true, message: "Aucune commande pour ce jour" };
  }
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
        summary: `Commandes ${dateFormatter(data.date, { customFormat: "EEEE d" })}`,
        description: description,
        start: {
          // dateTime: new Date().toISOString(),
          date: start,
          timeZone,
        },
        end: {
          // dateTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(),
          date: end,
          timeZone,
        },
      },
    })
    .then((event) => {
      return { success: true, message: "Agenda mise à jour" };
    })
    .catch((error) => {
      console.log(error);
      return { success: false, message: "Erreur dans l'envoi de l'evènement" };
    });
}

async function createDescription({ startDate, endDate }: { startDate: Date; endDate: Date }) {
  const { productQuantities, formattedOrders, groupedAMAPOrders } = await getAllOrders({ startDate, endDate });
  if (productQuantities.length === 0) return null;
  // "<font color='red'> Aucune commande </font>";

  const amapOrdersDescription =
    Object.values(groupedAMAPOrders)
      .map(
        (order) =>
          `<br /><strong><a href="${process.env.NEXT_PUBLIC_URL}/admin/shop/${order.shopId}">${order.shopName}</a></strong> <br />` +
          order.orderItems
            .map((item) => `<strong>${item.name}</strong> : ${item.quantity}${item.unit || ""}`)
            .join("<br />") +
          `<br /><a href="https://maps.google.com/?q=${order.address}">Adresse</a><br />`,
      )
      .join("<br />") + "<br />";

  const header = `<h2><a href="${process.env.NEXT_PUBLIC_URL}/admin/calendar/${startDate.toISOString()}">Voir les commandes sur le site</a></h2> <br /><h3><font color='green'>Résumer des produits </font></h3>`;

  const productDescriptions =
    productQuantities
      .map((item) => `<strong>${item.name}</strong> : ${item.quantity}${item.unit || ""}`)
      .join("<br />") + "<br />";

  const orderDescriptions =
    formattedOrders.length === 0
      ? ""
      : formattedOrders
          .map(
            (order) =>
              `<a href="${process.env.NEXT_PUBLIC_URL}/admin/users/${order.customerId}">${order.company ? order.company : order.name}</a><br /><strong><a href="${process.env.NEXT_PUBLIC_URL}/admin/orders/${order.id}"><font color='${order.shippingEmail ? "green" : "red"}'>${order.shippingEmail ? "BL envoyé" : "Acceder à la commande"} </font></a></strong> <br />` +
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
      : `<strong><a  href="${googleDirectioUrl}/${origin.label}/${uniqueShippingAddresses.join("/")}/${destination.label}">Voir le parcours</a></strong> <br /><br />`;

  return header + productDescriptions + amapOrdersDescription + orderDescriptions;
}

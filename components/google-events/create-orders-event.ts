import { destination, origin } from "@/app/(routes)/admin/calendar/_components/direction-schema";
import { calendarAPI } from "@/lib/api-google";
import { dateFormatter } from "@/lib/date-utils";
import { createId } from "@/lib/id";
import getOrders from "./get-orders-for-events";
import getEventsList from "./get-events-list";
import deleteEvent from "./delete-events";
import { format, toZonedTime } from "date-fns-tz";
import { addHours } from "date-fns";

const googleDirectioUrl = process.env.NEXT_PUBLIC_GOOGLE_DIR_URL;
const timeZone = "Europe/Paris";

export default async function createOrdersEvent(data: { date: Date }) {
  // Format the date to the desired format in the specified time zone
  const [year, month, day] = format(data.date, "yyyy-MM-dd", { timeZone }).split("-");
  console.log({ year, month, day });
  const startDate = toZonedTime(`${year}-${month}-${day}`, timeZone);
  const endDate = addHours(startDate, 24);
  console.log({ startDate, endDate });

  // const [day, month, year] = data.date.toLocaleDateString("fr-FR").split("/");
  // const startDate = toZonedTime(`${year}-${month}-${day}`, timeZone);
  // const endDate = addHours(startDate, 24);

  // console.log({ date: data.date, startDate, endDate });
  // return { success: true, message: "Agenda mise à jour" };

  const events = await getEventsList({ startDate, endDate });
  if (events.success && events.data) {
    for (const event of events.data) {
      console.log({ start: event.start, end: event.end });
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
          date: `${year}-${month}-${day}`,
          timeZone,
        },
        end: {
          // dateTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(),
          date: `${year}-${month}-${Number(day) + 1}`,
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
  const { productQuantities, formattedOrders, groupedAMAPOrders } = await getOrders({ startDate, endDate });
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
          `<br /><a href="https://maps.google.com/?q=${order.address}">Addresse</a><br />`,
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

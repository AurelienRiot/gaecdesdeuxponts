import { calendarAPI } from "@/lib/api-google";
import { dateFormatter, getDateOffset, getLocalIsoString, timeZone } from "@/lib/date-utils";
import { createId } from "@/lib/id";
import { numberFormat2Decimals } from "@/lib/utils";
import { addDays, addMinutes, subMinutes } from "date-fns";
import { displayQuantity } from ".";
import deleteEvent from "./delete-events";
import getEventsList from "./get-events-list";
import getAllOrders from "./get-orders-for-events";
import { fromZonedTime } from "date-fns-tz";

export default async function createOrdersEvent(date: Date) {
  const offset = getDateOffset(date);
  const startDate = subMinutes(addMinutes(date, offset).setHours(0, 0, 0, 0), offset);
  const startDate2 = fromZonedTime(getLocalIsoString(date), timeZone);
  const endDate = addDays(startDate, 1);
  console.log({ startDate, startDate2, test: new Date(addMinutes(date, offset).setHours(0, 0, 0, 0)) });
  // await devOnly(async () => {
  //   const start2 = new Date(addHours(date, 2).setHours(0, 0, 0, 0));
  //   const end2 = addHours(start2, 24);
  //   console.log({ start2, end2 });
  //   console.log({ startDate, endDate });
  // });

  // console.log({ date: date, startDate, endDate });
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
        summary: `Commandes ${dateFormatter(date, { customFormat: "EEEE d" })}`,
        description: description,
        start: {
          // dateTime: new Date().toISOString(),
          date: getLocalIsoString(startDate),
          timeZone,
        },
        end: {
          // dateTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000).toISOString(),
          date: getLocalIsoString(endDate),
          timeZone,
        },
      },
    })
    .then((event) => {
      return { success: true, message: "Agenda mis à jour" };
    })
    .catch((error) => {
      console.log(error);
      return { success: false, message: "Erreur dans l'envoi de l'evènement" };
    });
}

async function createDescription({ startDate, endDate }: { startDate: Date; endDate: Date }) {
  const productQuantities = await getAllOrders({ startDate, endDate });
  if (productQuantities.aggregateProducts.length === 0) return null;
  // "<font color='red'> Aucune commande </font>";

  // const amapOrdersDescription =
  //   Object.values(groupedAMAPOrders)
  //     .map(
  //       (order) =>
  //         `<br /><strong><a href="${process.env.NEXT_PUBLIC_URL}/admin/shop/${order.shopId}">${order.shopName}</a></strong> <br />` +
  //         order.orderItems
  //           .map((item) => `<strong>${item.name}</strong> : ${item.quantity}${item.unit || ""}`)
  //           .join("<br />") +
  //         `<br /><a href="https://maps.google.com/?q=${order.address}">Adresse</a><br />`,
  //     )
  //     .join("<br />") + "<br />";

  const header = `<h2><a href="${process.env.NEXT_PUBLIC_URL}/admin/calendar">Voir les commandes sur le site</a></h2> <br /><h3><font color='green'>Résumer des produits </font></h3>`;
  const totaleQuantity =
    productQuantities.totaleQuantity
      .map(
        (item) =>
          `<font color='purple'><strong>${item.name}</strong> : ${numberFormat2Decimals(item.quantity)}${item.unit || ""}</font>`,
      )
      .join("<br />") + "<br />";

  const productDescriptions =
    productQuantities.aggregateProducts
      .map(
        (item) =>
          `<strong>${item.productName}</strong> : ${displayQuantity(item.productName, item.totalQuantity)}${item.unit || ""}`,
      )
      .join("<br />") + "<br />";

  const productByUser =
    productQuantities.aggregateProducts
      .map((item) => {
        const product = `<h3><strong>${item.productName}</strong> : </h3>`;
        const users = item.users
          .map(
            (user) =>
              `<a href="${process.env.NEXT_PUBLIC_URL}/admin/users/${user.userId}">${user.userName}</a> : ${displayQuantity(item.productName, user.quantity)}${item.unit || ""}`,
          )
          .join("<br />");
        return `${product}${users} <br />`;
      })
      .join("<br />") + "<br />";

  // const orderDescriptions =
  //   formattedOrders.length === 0
  //     ? ""
  //     : formattedOrders
  //         .map(
  //           (order) =>
  //             `<a href="${process.env.NEXT_PUBLIC_URL}/admin/users/${order.userId}">${order.company ? order.company : order.name}</a><br /><strong><a href="${process.env.NEXT_PUBLIC_URL}/admin/orders/${order.id}"><font color='${order.shippingEmail ? "green" : "red"}'>${order.shippingEmail ? "BL envoyé" : "Acceder à la commande"} </font></a></strong> <br />` +
  //             order.orderItems
  //               .map((item) => `<strong>${item.name}</strong> : ${item.quantity}${item.unit || ""}`)
  //               .join("<br />") +
  //             `<br /><a href="https://maps.google.com/?q=${order.shippingAddress}">Adresse</a><br />`,
  //         )
  //         .join("<br />");

  // const uniqueShippingAddresses = [...new Set(formattedOrders.map((order) => `${order.shippingAddress}`))];
  // const googleDirectionUrl=createDirectionUrl({addresses:uniqueShippingAddresses})
  // const directionString =
  // formattedOrders.length === 0
  //   ? ""
  //   : `<strong><a  href="${googleDirectionUrl}">Voir le parcours</a></strong> <br /><br />`;
  return header + totaleQuantity + "<br />" + productDescriptions + "<br />" + productByUser;
}

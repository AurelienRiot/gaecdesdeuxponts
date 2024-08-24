"use server";

import { checkAdmin } from "@/components/auth/checkAuth";
import { calendarAPI } from "@/lib/api-calendar";
import { dateFormatter } from "@/lib/date-utils";
import { createId } from "@/lib/id";
import prismadb from "@/lib/prismadb";
import safeServerAction, { type ReturnTypeServerAction } from "@/lib/server-action";
import { addHours } from "date-fns";
import { z } from "zod";

const createEventSchema = z.object({
  date: z.date({ message: "La date est requise", required_error: "La date est requise" }),
});

type CreateEventProps = z.infer<typeof createEventSchema>;

export const createEvent = async (data: CreateEventProps) =>
  await safeServerAction({
    data,
    getUser: checkAdmin,
    schema: createEventSchema,
    serverAction: async (data) => {
      const date = addHours(data.date, 2);
      const startDate = new Date(date.toISOString().split("T")[0]);
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);

      const events = await getEventsForDay({ startDate, endDate });
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
            summary: `Commandes ${dateFormatter(date)}`,
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
    },
  });

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

async function getOrders({ startDate, endDate }: { startDate: Date; endDate: Date }) {
  const orders = await prismadb.order.findMany({
    where: {
      dateOfShipping: {
        gte: startDate,
        lte: endDate,
      },
      NOT: { shop: null },
    },
    include: {
      orderItems: true,
      customer: true,
    },
  });

  const formattedOrders = orders.map((order) => ({
    id: order.id,
    customerId: order.customer?.customerId,
    shippingAddress: order.customer?.shippingAddress,
    name: order.customer?.name,
    orderItems: order.orderItems.map((item) => ({
      itemId: item.itemId,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
    })),
  }));

  const productQuantities = orders
    .flatMap((order) =>
      order.orderItems.map((item) => ({
        itemId: item.itemId,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
      })),
    )
    .reduce((acc: { itemId: string; name: string; quantity: number; unit: string | null }[], curr) => {
      const existing = acc.find((item) => item.itemId === curr.itemId);
      if (existing) {
        existing.quantity += curr.quantity;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

  return { productQuantities, formattedOrders };
}

async function getEventsForDay({
  startDate,
  endDate,
}: { startDate: Date; endDate: Date }): Promise<ReturnTypeServerAction<{ id: string | undefined | null }[]>> {
  try {
    // const startOfDay = new Date(date);
    // startOfDay.setUTCHours(0, 0, 0, 0);

    // const endOfDay = new Date(date);
    // endOfDay.setUTCHours(23, 59, 59, 999);

    const response = await calendarAPI.events.list({
      calendarId: process.env.CALENDAR_ID, // Replace with your calendar ID if it's not the primary calendar
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items;
    if (!events || events.length === 0) {
      return { success: true, message: "Aucun evenement", data: [] };
    }

    return {
      success: true,
      message: "id",
      data: events.map((event) => ({
        id: event.id,
      })),
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { success: false, message: "Erreur lors de la recuperation des evenements" };
  }
}

async function deleteEvent(id: string): Promise<ReturnTypeServerAction> {
  return await calendarAPI.events
    .delete({
      calendarId: process.env.CALENDAR_ID,
      eventId: id,
    })
    .then(() => {
      return { success: true, message: "Evenement supprimé" };
    })
    .catch((error) => {
      console.error("Error deleting event:", error);
      return { success: false, message: "Evenement non supprimé" };
    });
}
export async function createCalendar() {
  const calendar = {
    summary: "Commamdes",
    timeZone: "Europe/Paris",
  };

  try {
    const response = await calendarAPI.calendars.insert({
      requestBody: calendar,
    });
    console.log("Calendar created:", response.data);
    return { message: "Calendar created", calendarId: response.data.id };
  } catch (error) {
    console.error("Error creating calendar:", error);
    return { message: "Calendar not created" };
  }
}

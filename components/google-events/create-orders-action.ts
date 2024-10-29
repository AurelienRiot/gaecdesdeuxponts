"use server";

import safeServerAction from "@/lib/server-action";
import { z } from "zod";
import { READ_ONLY_ADMIN } from "../auth";
import createOrdersEvent from "./create-orders-event";

const createEventSchema = z.object({
  date: z.date({ message: "La date est requise", required_error: "La date est requise" }),
});

type CreateEventProps = z.infer<typeof createEventSchema>;

export const createEvent = async (data: CreateEventProps) =>
  await safeServerAction({
    data,
    schema: createEventSchema,
    roles: READ_ONLY_ADMIN,
    serverAction: ({ date }) => createOrdersEvent(date),
  });

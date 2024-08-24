"use server";

import safeServerAction from "@/lib/server-action";
import { z } from "zod";
import { checkAdmin } from "../auth/checkAuth";
import createOrdersEvent from "./create-orders-event";

const createEventSchema = z.object({
  date: z.date({ message: "La date est requise", required_error: "La date est requise" }),
});

type CreateEventProps = z.infer<typeof createEventSchema>;

export const createEvent = async (data: CreateEventProps) =>
  await safeServerAction({
    data,
    getUser: checkAdmin,
    schema: createEventSchema,
    serverAction: createOrdersEvent,
  });

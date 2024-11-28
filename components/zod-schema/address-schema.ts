import { z } from "zod";

export type FullAdress = {
  label: string;
  city: string;
  country: string;
  line1: string;
  line2: string;
  postalCode: string;
  state: string;
  latitude?: number;
  longitude?: number;
};

export const defaultAddress: FullAdress = {
  label: "",
  city: "",
  country: "FR",
  line1: "",
  line2: "",
  postalCode: "",
  state: "",
};

export const addressSchema = z.object({
  label: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  line1: z.string().optional().nullable(),
  line2: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

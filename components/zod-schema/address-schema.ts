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
  label: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  line1: z.string().optional(),
  line2: z.string().optional(),
  postalCode: z.string().optional(),
  state: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

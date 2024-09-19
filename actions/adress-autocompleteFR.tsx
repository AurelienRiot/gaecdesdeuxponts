import ky from "ky";
import z from "zod";

const fetchResponceSchema = z.object({
  features: z.array(
    z.object({
      geometry: z.object({
        coordinates: z.array(z.number()),
        type: z.literal("Point"),
      }),
      properties: z.object({
        label: z.string(),
        id: z.string(),
        type: z.string(),
        name: z.string(),
        postcode: z.string(),
        citycode: z.string(),
        x: z.number(),
        y: z.number(),
        city: z.string(),
        context: z.string(),
        importance: z.number(),
      }),
    }),
  ),
});

export type Suggestion = {
  label: string;
  city: string;
  country: string;
  line1: string;
  postal_code: string;
  state: string;
  latitude: number;
  longitude: number;
};

function sanitizeQuery(input: string) {
  let sanitized = input.trim().replace(/^-+/, "");
  sanitized = sanitized.replace(/[\n\r]+/g, " ").replace(/\s+/g, " ");
  return sanitized;
}

const AddressAutocomplete = async (value: string): Promise<Suggestion[]> => {
  const trimmedValue = value.trim();
  if (trimmedValue.length < 3) return [];

  const response = await ky
    .get(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(sanitizeQuery(value))}&autocomplete=1&limit=10`,
    )
    .json();

  const { features } = await fetchResponceSchema.parse(response);
  const suggestions: Suggestion[] = features.map((feature) => ({
    label: feature.properties.label,
    city: feature.properties.city,
    country: "FR",
    line1: feature.properties.name,
    postal_code: feature.properties.postcode,
    state: feature.properties.context.split(", ").at(-1) as string,
    longitude: feature.geometry.coordinates[0],
    latitude: feature.geometry.coordinates[1],
  }));
  return suggestions;
};

export const LocationAutocomplete = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Promise<Suggestion[]> => {
  if (latitude === 0 && longitude === 0) return [];

  try {
    const response = await ky
      .get(
        `https://api-adresse.data.gouv.fr/reverse/?lat=${encodeURIComponent(
          latitude.toString(),
        )}&lon=${encodeURIComponent(longitude.toString())}`,
      )
      .json();

    const { features } = await fetchResponceSchema.parse(response);
    const suggestions: Suggestion[] = features.map((feature) => ({
      label: feature.properties.label,
      city: feature.properties.city,
      country: "FR",
      line1: feature.properties.name,
      postal_code: feature.properties.postcode,
      state: feature.properties.context.split(", ").at(-1) as string,
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1],
    }));
    return suggestions;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export default AddressAutocomplete;

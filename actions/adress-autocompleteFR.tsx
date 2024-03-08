interface Feature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    label: string;
    score: number;
    housenumber: string;
    id: string;
    type: "housenumber";
    name: string;
    postcode: string;
    citycode: string;
    x: number;
    y: number;
    city: string;
    context: string;
    importance: number;
    street: string;
  };
}

export type Suggestion = {
  label: string;
  city: string;
  country: string;
  line1: string;
  postal_code: string;
  state: string;
};

const AddressAutocomplete = async (value: string) => {
  const trimmedValue = value.trim();
  if (trimmedValue.length < 3) return [] as Suggestion[];

  const response = await fetch(
    `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
      value
    )}&autocomplete=1`
  );
  const data = await response.json();
  const features = data.features;
  const suggestions = features.map((feature: Feature) => ({
    label: feature.properties.label,
    city: feature.properties.city,
    country: "FR",
    line1: feature.properties.name,
    postal_code: feature.properties.postcode,
    state: feature.properties.context.split(", ").at(-1),
  }));
  return suggestions as Suggestion[];
};

export default AddressAutocomplete;

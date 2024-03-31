export function haversine(
  coord1: { lat: number | undefined; long: number | undefined },
  coord2: { lat: number; long: number },
) {
  const R = 6371.0; // Radius of the Earth in kilometers

  if (!coord1.lat || !coord1.long) {
    return undefined;
  }

  const lon1 = coord1.long;
  const lat1 = coord1.lat;
  const lon2 = coord2.long;
  const lat2 = coord2.lat;

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance;
}

function toRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

import ky from "ky";
import type { DirectionsResponse } from "./google-responce-type";
import type { ReturnTypeServerAction } from "@/lib/server-action";

const baseURL = "https://maps.googleapis.com/maps/api/directions/json";

type directionGoogleProps = {
  origin: string;
  destination: string;
  waypoints: string[];
};

export const directionGoogle = async ({
  origin,
  destination,
  waypoints,
}: directionGoogleProps): Promise<ReturnTypeServerAction<number[]>> => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const waypointsString = waypoints ? `&waypoints=optimize:true|${waypoints.join("|")}` : "";

  try {
    const response = (await ky
      .get(`${baseURL}?origin=${origin}&destination=${destination}${waypointsString}&key=${apiKey}`)
      .json()) as DirectionsResponse;

    if (response.status !== "OK") {
      return { success: false, message: "Erreur lors de la requête" };
    }

    console.log(response.routes[0].waypoint_order);
    return { success: true, message: "Succès", data: response.routes[0].waypoint_order };
  } catch (error) {
    console.log({ error });
    return { success: false, message: "Erreur lors de la requête" };
  }
};

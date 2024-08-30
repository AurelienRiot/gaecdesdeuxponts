import ky from "ky";
import type { ReturnTypeServerAction } from "@/lib/server-action";
import type { DirectionsResponse } from "./google-responce-type";

const baseURL = "https://maps.googleapis.com/maps/api/directions/json";
const apiKey = process.env.GOOGLE_API_KEY;

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
  const waypointsString = waypoints ? `&waypoints=optimize:true|${waypoints.join("|")}` : "";

  if (waypoints.length <= 1) {
    return {
      success: true,
      message: "Veuillez entrer au moins deux points de passage pour avoir un trajet optimisé",
      data: [0],
    };
  }

  try {
    const response = (await ky
      .get(`${baseURL}?origin=${origin}&destination=${destination}${waypointsString}&key=${apiKey}`)
      .json()) as DirectionsResponse;

    if (response.status !== "OK") {
      return { success: false, message: "Erreur lors de la requête" };
    }

    return { success: true, message: "Succès", data: response.routes[0].waypoint_order };
  } catch (error) {
    console.log({ error });
    return { success: false, message: "Erreur lors de la requête" };
  }
};

"use server";

import ky from "ky";

const baseURL = "https://maps.googleapis.com/maps/api/directions/json";

export async function directionGoogle({
  origin,
  destination,
  waypoints,
}: {
  origin: string;
  destination: string;
  waypoints?: string[];
}) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const waypointsString = waypoints ? `&waypoints=optimize:true|${waypoints.join("|")}` : "";

  try {
    const response = await ky
      .get(`${baseURL}?origin=${origin}&destination=${destination}${waypointsString}&key=${apiKey}`)
      .json();

    console.log(response);
  } catch (error) {
    console.log({ error });
  }
}

const username = "julieriot";
const password = "Residue9-Luminance9-Rants6-Unable2-Overspend1";
const locations = [
  { address: "The Hague, The Netherlands", lat: "52.05429", lng: "4.248618" },
  { address: "Uden, The Netherlands", lat: "51.669946", lng: "5.61852" },
  { address: "Sint-Oedenrode, The Netherlands", lat: "51.589548", lng: "5.432482" },
  { address: "The Hague, The Netherlands", lat: "52.076892", lng: "4.26975" },
];
const auth = Buffer.from(`${username}:${password}`).toString("base64");

export async function directionRouteXL() {
  try {
    const response = await fetch("https://api.routexl.com/tour", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ locations }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

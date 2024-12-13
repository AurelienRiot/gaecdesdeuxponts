"use client";
import type { FullShop } from "@/types";
import "leaflet/dist/leaflet.css";
import dynamicImport from "next/dynamic";
import "./marker.css";

const Leaflet = dynamicImport(() => import("./leaflet"), {
  ssr: false,
});

const PlacePicker = ({
  shops,
  farmShop,
}: {
  shops: FullShop[];
  farmShop: FullShop | null;
}) => {
  return <Leaflet shops={shops} farmShop={farmShop} />;
};

export default PlacePicker;

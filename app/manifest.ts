import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: "#171717",
    background_color: "#FAFAFA",
    display: "standalone",
    scope: "/",
    start_url: "/profile",
    name: "Laiterie du Pont Robert",
    short_name: "Laiterie du Pont Robert",
    description:
      "Venez chercher votre lait cru, frais et bio directement dans notre ferme à Massérac, aux heures de la traite 8h30-9h30/18h-19h du lundi au samedi",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

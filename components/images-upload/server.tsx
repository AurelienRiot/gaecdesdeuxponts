"use server";

import prismadb from "@/lib/prismadb";
import cloudinary from "cloudinary";
import { checkAdmin, checkReadOnlyAdmin } from "../auth/checkAuth";
import type { ReturnTypeServerAction } from "@/lib/server-action";
import { z } from "zod";
import safeServerAction from "@/lib/server-action";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type Ressources = {
  access_mode: string;
  asset_id: string;
  bytes: number;
  created_at: Date;
  folder: string;
  format: string;
  height: number;
  public_id: string;
  resource_type: string;
  secure_url: string;
  type: string;
  url: string;
  version: number;
  width: number;
};

type SignatureType = {
  timestamp: number;
  signature: string;
};

async function getSignature(): Promise<ReturnTypeServerAction<SignatureType, undefined>> {
  const isAuth = await checkReadOnlyAdmin();
  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.v2.utils.api_sign_request(
    { timestamp, folder: "farm" },
    process.env.CLOUDINARY_API_SECRET as string,
  );

  return {
    success: true,
    message: "",
    data: { timestamp, signature },
  };
}

async function listFiles(): Promise<ReturnTypeServerAction<Ressources[], undefined>> {
  const isAuth = await checkReadOnlyAdmin();
  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }
  try {
    const files = await cloudinary.v2.api.resources({
      resource_type: "image",
      type: "upload",
      prefix: "farm",
      max_results: 100, // Adjust based on how many results you'd like to fetch (max is 500)
    });

    const images = files.resources?.sort(
      (a: Ressources, b: Ressources) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime(),
    ) as Ressources[];
    return {
      success: true,
      message: "",
      data: images,
    };
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    return {
      success: false,
      message: "Erreur dans le chargement des fichiers, veuillez rafraichir la page",
    };
  }
}

const deleteObjectSchema = z.object({
  publicID: z.string(),
});

async function deleteObject(data: z.infer<typeof deleteObjectSchema>) {
  return await safeServerAction({
    schema: deleteObjectSchema,
    getUser: checkAdmin,
    data,
    serverAction: async (data) => {
      const { publicID } = data;
      const imageUrl = `https://res.cloudinary.com/dsztqh0k7/image/upload/v1709823732/${publicID}`;
      const productsWithImage = await prismadb.product.findMany({
        where: {
          imagesUrl: {
            has: imageUrl,
          },
        },
        select: {
          name: true,
        },
      });

      if (productsWithImage.length > 0) {
        const productNames = productsWithImage.map((category) => category.name).join(", ");
        return {
          success: false,
          message: `L'image est utilisée par les produits : ${productNames}`,
        };
      }

      const imagesCategories = await prismadb.category.findMany({
        where: {
          imageUrl: imageUrl,
        },
        select: {
          name: true,
        },
      });

      if (imagesCategories.length > 0) {
        const categoryNames = imagesCategories.map((category) => category.name).join(", ");
        return {
          success: false,
          message: `L'image est utilisée par la categorie : ${categoryNames}`,
        };
      }

      const imagesShop = await prismadb.shop.findMany({
        where: {
          imageUrl: imageUrl,
        },
        select: {
          name: true,
        },
      });

      if (imagesShop.length > 0) {
        const shoptNames = imagesShop.map((category) => category.name).join(", ");
        return {
          success: false,
          message: `L'image est utilisée par le magasin : ${shoptNames}`,
        };
      }

      const imagesUser = await prismadb.user.findMany({
        where: {
          image: imageUrl,
        },
        select: {
          name: true,
          company: true,
          email: true,
        },
      });

      if (imagesUser.length > 0) {
        const userNames = imagesUser.map((user) => user.name || user.company || user.email).join(", ");
        return {
          success: false,
          message: `L'image est utilisée par le magasin : ${userNames}`,
        };
      }

      try {
        await cloudinary.v2.uploader.destroy(publicID);
        return { success: true, message: "Image supprimée" };
      } catch (error) {
        console.error(`Error deleting object: ${publicID}`, error);
        return { success: false, message: "Erreur dans le suppression de l'image" };
      }
    },
  });
}

export { deleteObject, getSignature, listFiles };

"use server";

import prismadb from "@/lib/prismadb";
import { addDelay, checkIfUrlAccessible } from "@/lib/utils";
import cloudinary from "cloudinary";
import { checkAdmin } from "../auth/checkAuth";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type Ressources = {
  access_mode: string;
  asset_id: string;
  bytes: Number;
  created_at: Date;
  folder: string;
  format: string;
  height: Number;
  public_id: string;
  resource_type: string;
  secure_url: string;
  type: string;
  url: string;
  version: Number;
  width: Number;
};

type listFilesReturnType =
  | {
      success: true;
      data: Ressources[];
    }
  | {
      success: false;
      message: string;
    };

async function listFiles(): Promise<listFilesReturnType> {
  const isAuth = await checkAdmin();
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
      (a: Ressources, b: Ressources) =>
        new Date(b.created_at ?? 0).getTime() -
        new Date(a.created_at ?? 0).getTime(),
    ) as Ressources[];
    return {
      success: true,
      data: images,
    };
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    return {
      success: false,
      message:
        "Erreur dans le chargement des fichiers, veuillez rafraichir la page",
    };
  }
}

type UploadFilesReturnType =
  | {
      success: true;
      data: { secureUrl: string; publicId: string }[];
    }
  | {
      success: false;
      message: string;
    };

async function uploadFile({
  formData,
}: {
  formData: FormData;
}): Promise<UploadFilesReturnType> {
  const isAuth = await checkAdmin();
  if (!isAuth) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }
  try {
    const uploadPromises = Array.from(formData.entries()).map(
      async ([key, value]) => {
        if (value instanceof File) {
          const arrayBuffer = await value.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          const uploadResult: any = await new Promise((resolve) => {
            cloudinary.v2.uploader
              .upload_stream({ folder: "farm" }, (error, result) => {
                if (error) {
                  console.error("Upload error:", error);
                  resolve(null); // Handle error appropriately
                } else {
                  resolve(result);
                }
              })
              .end(uint8Array);
          });
          if (uploadResult) {
            return {
              secureUrl: uploadResult.secure_url as string,
              publicId: uploadResult.public_id as string,
            };
          }
        }
        return null;
      },
    );

    const results = await Promise.all(uploadPromises);
    const validUrls = results.filter(
      (result): result is { secureUrl: string; publicId: string } =>
        result !== null,
    );

    // const check = await checkUrls(validUrls);

    return { success: true, data: validUrls };
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    return {
      success: false,
      message: "Une erreur est survenue dans l'envoi des fichiers",
    };
  }
}

type ReturnTypeDeleteObject =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

async function deleteObject({
  publicID,
}: {
  publicID: string;
}): Promise<ReturnTypeDeleteObject> {
  const isAuth = await checkAdmin();
  if (!isAuth) {
    return { success: false, message: "Vous devez être authentifier" };
  }

  const imagesProducts = await prismadb.image.findMany({
    where: {
      url: `https://res.cloudinary.com/dsztqh0k7/image/upload/v1709823732/${publicID}`,
    },
    include: {
      product: true,
    },
  });

  if (imagesProducts.length > 0) {
    const productNames = imagesProducts
      .map((image) => image.product.name)
      .join(", ");
    return {
      success: false,
      message: `L'image est utilisée par le(s) produit(s) : ${productNames}`,
    };
  }

  const imagesCategories = await prismadb.category.findMany({
    where: {
      imageUrl: `https://res.cloudinary.com/dsztqh0k7/image/upload/v1709823732/${publicID}`,
    },
  });

  if (imagesCategories.length > 0) {
    const productNames = imagesCategories
      .map((category) => category.name)
      .join(", ");
    return {
      success: false,
      message: `L'image est utilisée par le(s) pannneau(s) : ${productNames}`,
    };
  }

  try {
    await cloudinary.v2.uploader.destroy(publicID);
    console.log(`Image supprimé`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting object: ${publicID}`, error);
    return { success: false, message: "Erreur dans le suppression de l'image" };
  }
}

const checkUrls = async (
  urls: { secureUrl: string | null; publicId: string }[],
): Promise<void> => {
  const invalidUrls = await Promise.all(
    urls.map(async (url) => {
      if (!url.secureUrl) {
        return { secureUrl: null, publicId: url.publicId };
      }
      const isAccessible = await checkIfUrlAccessible(url.secureUrl);
      return isAccessible ? { secureUrl: null, publicId: url.publicId } : url;
    }),
  );

  if (invalidUrls.some((url) => url?.secureUrl !== null)) {
    // If there are still invalid URLs, wait for 250ms and check again
    await addDelay(250);
    return checkUrls(invalidUrls.filter((url) => url.secureUrl !== null));
  } else {
    // All URLs are valid
    return;
  }
};

export { deleteObject, listFiles, uploadFile };

export function createImageUrl(publicID: string) {
  return `https://res.cloudinary.com/dsztqh0k7/image/upload/v1709823732/${publicID}`;
}
export const signature =
  "https://res.cloudinary.com/dsztqh0k7/image/upload/v1732348212/static/rgjxhv9k8fnxnd0u1ddc.webp";

export const cloudinaryAPIUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

export function createImageUrl(publicID: string) {
  return `https://res.cloudinary.com/dsztqh0k7/image/upload/v1709823732/${publicID}`;
}
export function createRawUrl(publicID: string) {
  return `https://res.cloudinary.com/dsztqh0k7/raw/upload/v1732556213/${publicID}`;
}
export const signature =
  "https://res.cloudinary.com/dsztqh0k7/image/upload/v1732348212/static/rgjxhv9k8fnxnd0u1ddc.webp";

export const cloudinaryAPIUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

export const certificationBio = createImageUrl("static/xvx7zx5jmcweiecdq0do");

export const logoBio = createImageUrl("static/romxatzb89gidilgmxrw");

export const logoFondBlanc = createImageUrl("static/ofelrvks6dcre6p3leda");

export const fontInter = createRawUrl("static/kg0jzsnbzijs7qv9bwme.ttf");

export const fontInterBold = createRawUrl("static/oei9fb3ywzgponphu9di.ttf");

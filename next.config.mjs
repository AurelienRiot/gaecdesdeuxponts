/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "object-storage-dev.s3.fr-par.scw.cloud",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

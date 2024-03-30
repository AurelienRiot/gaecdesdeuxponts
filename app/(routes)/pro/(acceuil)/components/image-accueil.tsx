"use client";
import ImageFerme from "@/public/dairy_cows.webp";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";

const ImageAccueil = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 2]);
  const session = useSession();
  console.log(session.data?.user);
  // const y = useTransform(scrollY, [0, 1], [0, 1], { clamp: false });

  // const Video = () => {
  //   return (
  //     <video
  //       controls={false}
  //       autoPlay
  //       loop
  //       muted
  //       playsInline
  //       className="absolute top-0 left-0 object-cover object-center w-full h-full"
  //       title="video background"
  //     >
  //       <source src="./videos/film_guimbert.webm" type="video/webm" />
  //     </video>
  //   );
  // };

  return (
    <motion.div
      style={{ scale: scale }}
      className="fixed left-0 top-0 -z-10 h-full w-full  "
    >
      <Image
        priority
        src={ImageFerme}
        alt="image background"
        width={3859}
        height={2500}
        className="absolute left-0 top-0 h-full w-full object-cover object-center"
      />
      <div className="absolute left-0 top-0 h-full w-full bg-black/30 " />
    </motion.div>
  );
};

export default ImageAccueil;

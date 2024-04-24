"use client";
import { cn } from "@/lib/utils";
import {
  useMotionTemplate,
  useScroll,
  useTransform,
  motion,
  easeInOut,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export const ScreenFitText = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "pointer-events-none z-[100] flex min-h-16 w-full items-center  justify-center overflow-hidden  rounded-b-md bg-transparent ",
        className,
      )}
    >
      <TextSVG />
    </div>
  );
};

const TextSVG = () => {
  const { scrollYProgress } = useScroll();
  const textRef = useRef<SVGSVGElement>(null);
  const Width = useTransform(scrollYProgress, [0, 0.02], [100, 40], {
    ease: easeInOut,
  });
  const width = useMotionTemplate`${Width}%`;
  const router = useRouter();

  useEffect(() => {
    const adjustMarginTop = () => {
      const text = textRef.current;
      const imageMain = document.getElementById("main-content");
      if (text && imageMain) {
        const marginTop =
          text.getBoundingClientRect().height - 64 > 0
            ? text.getBoundingClientRect().height - 64
            : 0;
        imageMain.style.marginTop = `${marginTop}px`;
      }
    };

    adjustMarginTop();
    window.addEventListener("resize", adjustMarginTop);

    return () => window.removeEventListener("resize", adjustMarginTop);
  }, []);

  return (
    <motion.svg
      onClick={(e) => {
        e.stopPropagation();
        router.push("/");
      }}
      style={{ width }}
      ref={textRef}
      className="pointer-events-auto min-h-16 cursor-pointer rounded-b-md bg-background  fill-neutral-950 px-2 transition-[width] dark:fill-neutral-50 sm:py-2"
      viewBox="0 0 65.328667 4.0470638"
      preserveAspectRatio="xMidYMid meet"
    >
      <g id="layer1" transform="translate(-9.323869,-59.188604)">
        <g
          aria-label="LAITERIE DU PONT ROBERT"
          id="text432"
          style={{
            fontSize: 5.64444,
            fontFamily: "Dopest by MARSNEV",
            textAlign: "center",
            textAnchor: "middle",
            strokeWidth: 0,
          }}
        >
          <path
            d="M 11.615512,63.218735 V 62.699446 H 9.837513 V 59.211182 H 9.323869 v 4.007553 z m 0,-0.603955 V 62.095491 H 10.441468 V 59.211182 H 9.9221796 v 3.403598 z"
            id="path965"
          />
          <path
            d="m 12.496041,60.656159 v 1.111955 h 1.693332 v -1.111955 c 0,-0.112889 -0.02258,-0.214489 -0.06209,-0.321733 -0.129822,-0.276578 -0.395111,-0.524933 -0.784577,-0.524933 -0.118533,0 -0.220133,0.02258 -0.321733,0.06773 -0.282222,0.112889 -0.524933,0.389467 -0.524933,0.778933 z m 0.846666,-0.327378 c 0.04515,0 0.08467,0.01129 0.124177,0.02822 0.112889,0.0508 0.2032,0.141111 0.2032,0.299155 v 0.592666 h -0.654755 v -0.592666 c 0,-0.180622 0.129822,-0.327378 0.327378,-0.327378 z m 0.846666,1.523999 h -1.693332 v 1.365955 h 0.519288 v -0.846666 h 0.654755 v 0.846666 h 0.519289 z m 0.08467,1.365955 h 0.519289 v -2.562576 c 0,-0.440266 -0.191911,-0.784577 -0.423333,-1.021644 -0.237067,-0.231422 -0.592666,-0.423333 -1.027288,-0.423333 -0.440267,0 -0.790222,0.191911 -1.021644,0.423333 -0.237066,0.237067 -0.423333,0.587022 -0.423333,1.021644 v 2.562576 h 0.513644 v -2.562576 c 0,-0.118533 0.02822,-0.237067 0.07338,-0.3556 0.129822,-0.310444 0.423333,-0.575733 0.857955,-0.575733 0.287866,0 0.502355,0.124178 0.660399,0.276578 0.1524,0.163689 0.270933,0.366888 0.270933,0.654755 z"
            id="path967"
          />
          <path
            d="m 16.289104,59.211182 h -0.519288 v 4.007553 h 0.519288 z m -0.603955,4.007553 v -4.007553 h -0.513644 v 4.007553 z"
            id="path969"
          />
          <path
            d="m 18.563808,60.328781 h 0.807155 V 59.809493 H 18.04452 v 3.409242 h 0.519288 z m -0.603955,2.889954 V 59.809493 H 16.63341 v 0.519288 h 0.807155 v 2.889954 z M 16.63341,59.724826 h 2.737553 V 59.211182 H 16.63341 Z"
            id="path971"
          />
          <path
            d="m 20.257135,62.61478 h 1.998132 v -0.519289 h -1.478844 v -0.321733 h 1.016 V 61.25447 h -1.535288 z m 1.998132,0.08467 h -2.082799 v -2.97462 h 2.082799 v -0.513644 h -2.596443 v 4.007553 h 2.596443 z m -0.462844,-1.529643 v -0.519289 h -1.016 v -0.321733 h 1.478844 v -0.519288 h -1.998132 v 1.36031 z"
            id="path973"
          />
          <path
            d="m 23.903437,62.039047 c -0.01129,0 -0.01129,-0.0056 -0.01129,-0.0056 H 23.24868 v 1.185333 h 0.519289 v -0.666044 h 0.04516 c 0.158045,0.220133 0.316089,0.445911 0.474133,0.666044 h 0.637822 l -0.575733,-0.795866 c -0.09596,-0.129822 -0.186266,-0.265289 -0.282222,-0.395111 l -0.135466,0.0056 c -0.01129,0 -0.01693,0.0056 -0.02822,0.0056 z m 1.642532,-1.15711 c 0,-0.508 -0.220134,-0.9144 -0.491067,-1.185333 -0.276577,-0.270933 -0.671688,-0.485422 -1.179688,-0.485422 h -1.224843 v 4.007553 h 0.513644 v -3.493909 h 0.711199 c 0.3556,0 0.620889,0.146756 0.8128,0.338667 0.186266,0.191911 0.338666,0.468488 0.338666,0.818444 0,0.491066 -0.276577,0.824088 -0.598311,1.010354 l -0.248355,0.141111 0.169333,0.237067 c 0.225778,0.321733 0.451556,0.632177 0.677333,0.948266 h 0.637822 c -0.248355,-0.349956 -0.496711,-0.694266 -0.745066,-1.038577 0.344311,-0.265289 0.626533,-0.716844 0.626533,-1.298221 z m -1.670755,-0.553156 c 0.174978,0 0.293511,0.07338 0.389467,0.163689 0.08467,0.09031 0.158044,0.225778 0.158044,0.389467 0,0.06773 -0.01129,0.141111 -0.03951,0.208844 -0.07902,0.186266 -0.254,0.338666 -0.508,0.338666 H 23.76797 v -1.100666 z m -0.626533,-0.519288 v 2.139243 h 0.626533 c 0.321733,0 0.587022,-0.141111 0.756355,-0.310445 0.169334,-0.174977 0.310445,-0.434621 0.310445,-0.756354 0,-0.141111 -0.02822,-0.276578 -0.07902,-0.4064 -0.112888,-0.265289 -0.310444,-0.462844 -0.581377,-0.581378 -0.135467,-0.05644 -0.270933,-0.08467 -0.4064,-0.08467 z"
            id="path975"
          />
          <path
            d="m 27.002234,59.211182 h -0.519288 v 4.007553 h 0.519288 z m -0.603955,4.007553 v -4.007553 h -0.513644 v 4.007553 z"
            id="path977"
          />
          <path
            d="m 28.080316,62.61478 h 1.998132 v -0.519289 h -1.478844 v -0.321733 h 1.016 V 61.25447 h -1.535288 z m 1.998132,0.08467 h -2.082799 v -2.97462 h 2.082799 v -0.513644 h -2.596443 v 4.007553 h 2.596443 z m -0.462844,-1.529643 v -0.519289 h -1.016 v -0.321733 h 1.478844 v -0.519288 h -1.998132 v 1.36031 z"
            id="path979"
          />
          <path
            d="m 35.293901,61.54798 v -0.666043 c 0,-0.508 -0.220133,-0.9144 -0.491066,-1.185333 -0.276578,-0.270933 -0.671689,-0.485422 -1.179688,-0.485422 h -1.224844 v 4.007553 h 1.224844 c 0.502355,0 0.90311,-0.214489 1.179688,-0.491067 0.270933,-0.270933 0.491066,-0.671688 0.491066,-1.179688 z m -0.519288,0 c 0,0.3556 -0.146756,0.620889 -0.338667,0.818444 -0.2032,0.191911 -0.451555,0.333022 -0.812799,0.333022 h -0.7112 v -2.97462 h 0.7112 c 0.355599,0 0.620888,0.146756 0.812799,0.338667 0.186267,0.191911 0.338667,0.468488 0.338667,0.818444 z m -0.603956,0 c 0,0.07338 -0.01129,0.141111 -0.03951,0.208845 -0.07338,0.180622 -0.248355,0.338666 -0.507999,0.338666 h -0.107245 v -1.76671 h 0.107245 c 0.174977,0 0.293511,0.07338 0.389466,0.163689 0.08467,0.09031 0.158044,0.225778 0.158044,0.389467 z m -0.54751,1.0668 c 0.310444,0 0.581377,-0.141111 0.756355,-0.316089 0.174977,-0.174978 0.310444,-0.423333 0.310444,-0.750711 v -0.666043 c 0,-0.141111 -0.02822,-0.276578 -0.07902,-0.4064 -0.112889,-0.265289 -0.310444,-0.462844 -0.581378,-0.581378 -0.135466,-0.05644 -0.270933,-0.08467 -0.406399,-0.08467 h -0.626533 v 2.805287 z"
            id="path981"
          />
          <path
            d="m 36.964649,62.095491 c -0.191911,0 -0.327377,-0.129822 -0.327377,-0.327377 v -2.556932 h -0.513644 v 2.556932 c 0,0.259644 0.112889,0.462844 0.248355,0.59831 0.124178,0.141111 0.344311,0.248356 0.592666,0.248356 0.254,0 0.4572,-0.107245 0.598311,-0.248356 0.135467,-0.135466 0.248355,-0.338666 0.248355,-0.59831 v -2.556932 h -0.513644 v 2.556932 c 0,0.197555 -0.146755,0.327377 -0.333022,0.327377 z m 0.936977,-2.884309 v 2.556932 c 0,0.282222 -0.135466,0.519288 -0.276577,0.660399 -0.1524,0.158044 -0.372533,0.270933 -0.6604,0.270933 -0.287866,0 -0.507999,-0.112889 -0.660399,-0.270933 -0.1524,-0.146755 -0.270933,-0.378177 -0.270933,-0.660399 v -2.556932 h -0.513644 v 2.556932 c 0,0.197555 0.03387,0.378177 0.107244,0.553155 0.141111,0.349955 0.428977,0.637821 0.784577,0.784577 0.174978,0.07338 0.361244,0.112889 0.553155,0.112889 0.440267,0 0.790222,-0.186267 1.027288,-0.423333 0.231422,-0.231422 0.423333,-0.587022 0.423333,-1.027288 v -2.556932 z"
            id="path983"
          />
          <path
            d="m 41.807574,62.552691 h 0.107245 c 0.507999,0 0.90311,-0.214489 1.179688,-0.491066 0.270933,-0.270934 0.491066,-0.677333 0.491066,-1.179688 0,-0.508 -0.220133,-0.9144 -0.491066,-1.185333 -0.276578,-0.270933 -0.671689,-0.485422 -1.179688,-0.485422 h -1.224844 v 4.007553 h 0.513644 v -3.493909 h 0.7112 c 0.355599,0 0.620888,0.146756 0.812799,0.338667 0.186266,0.191911 0.338666,0.468488 0.338666,0.818444 0,0.34431 -0.1524,0.626532 -0.338666,0.812799 -0.191911,0.191911 -0.4572,0.338666 -0.812799,0.338666 h -0.626533 v 1.185333 h 0.519288 z m 0.107245,-2.22391 c 0.174977,0 0.29351,0.07338 0.389466,0.163689 0.08467,0.09031 0.158044,0.225778 0.158044,0.389467 0,0.06773 -0.01129,0.141111 -0.03951,0.208844 -0.07902,0.186266 -0.254,0.338666 -0.507999,0.338666 h -0.107245 v -1.100666 z m -0.626533,-0.519288 v 2.139243 h 0.626533 c 0.321733,0 0.587021,-0.141111 0.756355,-0.310445 0.169333,-0.174977 0.310444,-0.434621 0.310444,-0.756354 0,-0.141111 -0.02822,-0.276578 -0.07902,-0.4064 -0.112889,-0.265289 -0.310445,-0.462844 -0.581378,-0.581378 -0.135466,-0.05644 -0.270933,-0.08467 -0.406399,-0.08467 z"
            id="path985"
          />
          <path
            d="m 44.838628,61.553625 v -0.677333 c 0,-0.259644 0.158045,-0.428977 0.344311,-0.513644 0.06773,-0.02822 0.135467,-0.03951 0.214489,-0.03951 0.07902,0 0.146755,0.01129 0.214489,0.03951 0.180622,0.09595 0.338666,0.254 0.338666,0.513644 v 0.677333 c 0,0.07338 -0.01129,0.141111 -0.03951,0.208844 -0.07338,0.180622 -0.254,0.344311 -0.513644,0.344311 -0.174978,0 -0.3048,-0.07338 -0.395111,-0.163689 -0.09595,-0.09596 -0.163689,-0.214488 -0.163689,-0.389466 z m -0.519288,0 c 0,0.327377 0.141111,0.587022 0.316089,0.756355 0.174977,0.180622 0.428977,0.321733 0.761999,0.321733 0.321733,0 0.587022,-0.146755 0.761999,-0.321733 0.169334,-0.169333 0.316089,-0.434622 0.316089,-0.756355 v -0.677333 c 0,-0.321733 -0.146755,-0.587022 -0.316089,-0.761999 -0.174977,-0.174978 -0.440266,-0.316089 -0.761999,-0.316089 -0.141111,0 -0.282222,0.02822 -0.412044,0.08467 -0.366889,0.152399 -0.666044,0.491066 -0.666044,0.993421 z m -0.6096,0 c 0,0.513644 0.214489,0.920044 0.491067,1.190977 0.270933,0.276577 0.682977,0.491066 1.196621,0.491066 0.513644,0 0.920044,-0.220133 1.190977,-0.491066 0.270933,-0.270933 0.496711,-0.677333 0.496711,-1.190977 v -0.677333 c 0,-0.513644 -0.231422,-0.908755 -0.496711,-1.190977 -0.265289,-0.259644 -0.699911,-0.496711 -1.190977,-0.496711 -0.220133,0 -0.434622,0.04516 -0.643466,0.129823 -0.570089,0.248355 -1.044222,0.773288 -1.044222,1.557865 z m 1.687688,1.162755 c -0.1524,0 -0.3048,-0.02822 -0.445911,-0.08467 -0.282222,-0.118533 -0.519288,-0.3556 -0.632177,-0.632177 -0.05644,-0.141111 -0.09031,-0.287867 -0.09031,-0.445911 v -0.677333 c 0,-0.361244 0.146755,-0.620888 0.344311,-0.824088 0.191911,-0.191911 0.462844,-0.338667 0.824088,-0.338667 0.361244,0 0.626533,0.146756 0.824088,0.338667 0.191911,0.2032 0.338667,0.462844 0.338667,0.824088 v 0.677333 c 0,0.361244 -0.141111,0.620888 -0.338667,0.824088 -0.191911,0.191911 -0.474133,0.338667 -0.824088,0.338667 z"
            id="path987"
          />
          <path
            d="m 47.971294,63.218735 h 0.519288 v -1.676399 c 0.445911,0.5588 0.886177,1.117599 1.332088,1.676399 h 0.699911 v -4.007553 h -0.519289 v 3.409242 l -2.031998,-2.562576 z m -0.08467,0 v -3.409242 l 2.031999,2.562576 v -3.160887 h -0.519289 v 1.676399 c -0.440266,-0.5588 -0.886177,-1.117599 -1.326443,-1.676399 H 47.37298 v 4.007553 z"
            id="path989"
          />
          <path
            d="m 52.718265,60.328781 h 0.807155 v -0.519288 h -1.326443 v 3.409242 h 0.519288 z m -0.603955,2.889954 v -3.409242 h -1.326443 v 0.519288 h 0.807155 v 2.889954 z m -1.326443,-3.493909 h 2.737553 v -0.513644 h -2.737553 z"
            id="path991"
          />
          <path
            d="m 56.9911,62.039047 c -0.01129,0 -0.01129,-0.0056 -0.01129,-0.0056 h -0.643466 v 1.185333 h 0.519289 v -0.666044 h 0.04516 c 0.158044,0.220133 0.316089,0.445911 0.474133,0.666044 h 0.637822 l -0.575733,-0.795866 c -0.09596,-0.129822 -0.186267,-0.265289 -0.282222,-0.395111 l -0.135467,0.0056 c -0.01129,0 -0.01693,0.0056 -0.02822,0.0056 z m 1.642532,-1.15711 c 0,-0.508 -0.220133,-0.9144 -0.491066,-1.185333 -0.276578,-0.270933 -0.671688,-0.485422 -1.179688,-0.485422 h -1.224844 v 4.007553 h 0.513645 v -3.493909 h 0.711199 c 0.3556,0 0.620888,0.146756 0.812799,0.338667 0.186267,0.191911 0.338667,0.468488 0.338667,0.818444 0,0.491066 -0.276578,0.824088 -0.598311,1.010354 l -0.248355,0.141111 0.169333,0.237067 c 0.225778,0.321733 0.451555,0.632177 0.677333,0.948266 h 0.637822 c -0.248356,-0.349956 -0.496711,-0.694266 -0.745067,-1.038577 0.344311,-0.265289 0.626533,-0.716844 0.626533,-1.298221 z m -1.670754,-0.553156 c 0.174978,0 0.293511,0.07338 0.389466,0.163689 0.08467,0.09031 0.158045,0.225778 0.158045,0.389467 0,0.06773 -0.01129,0.141111 -0.03951,0.208844 -0.07902,0.186266 -0.254,0.338666 -0.508,0.338666 h -0.107244 v -1.100666 z m -0.626533,-0.519288 v 2.139243 h 0.626533 c 0.321733,0 0.587022,-0.141111 0.756355,-0.310445 0.169333,-0.174977 0.310444,-0.434621 0.310444,-0.756354 0,-0.141111 -0.02822,-0.276578 -0.07902,-0.4064 -0.112889,-0.265289 -0.310444,-0.462844 -0.581377,-0.581378 -0.135467,-0.05644 -0.270933,-0.08467 -0.4064,-0.08467 z"
            id="path993"
          />
          <path
            d="m 59.988294,61.553625 v -0.677333 c 0,-0.259644 0.158045,-0.428977 0.344311,-0.513644 0.06773,-0.02822 0.135467,-0.03951 0.214489,-0.03951 0.07902,0 0.146755,0.01129 0.214489,0.03951 0.180622,0.09595 0.338666,0.254 0.338666,0.513644 v 0.677333 c 0,0.07338 -0.01129,0.141111 -0.03951,0.208844 -0.07338,0.180622 -0.254,0.344311 -0.513644,0.344311 -0.174978,0 -0.3048,-0.07338 -0.395111,-0.163689 -0.09596,-0.09596 -0.163689,-0.214488 -0.163689,-0.389466 z m -0.519288,0 c 0,0.327377 0.141111,0.587022 0.316088,0.756355 0.174978,0.180622 0.428978,0.321733 0.762,0.321733 0.321733,0 0.587022,-0.146755 0.761999,-0.321733 0.169333,-0.169333 0.316089,-0.434622 0.316089,-0.756355 v -0.677333 c 0,-0.321733 -0.146756,-0.587022 -0.316089,-0.761999 -0.174977,-0.174978 -0.440266,-0.316089 -0.761999,-0.316089 -0.141111,0 -0.282222,0.02822 -0.412044,0.08467 -0.366889,0.152399 -0.666044,0.491066 -0.666044,0.993421 z m -0.6096,0 c 0,0.513644 0.214489,0.920044 0.491067,1.190977 0.270933,0.276577 0.682977,0.491066 1.196621,0.491066 0.513644,0 0.920044,-0.220133 1.190977,-0.491066 0.270933,-0.270933 0.49671,-0.677333 0.49671,-1.190977 v -0.677333 c 0,-0.513644 -0.231422,-0.908755 -0.49671,-1.190977 -0.265289,-0.259644 -0.699911,-0.496711 -1.190977,-0.496711 -0.220133,0 -0.434622,0.04516 -0.643466,0.129823 -0.570089,0.248355 -1.044222,0.773288 -1.044222,1.557865 z m 1.687688,1.162755 c -0.1524,0 -0.3048,-0.02822 -0.445911,-0.08467 -0.282222,-0.118533 -0.519288,-0.3556 -0.632177,-0.632177 -0.05645,-0.141111 -0.09031,-0.287867 -0.09031,-0.445911 v -0.677333 c 0,-0.361244 0.146755,-0.620888 0.344311,-0.824088 0.191911,-0.191911 0.462844,-0.338667 0.824088,-0.338667 0.361244,0 0.626533,0.146756 0.824088,0.338667 0.191911,0.2032 0.338667,0.462844 0.338667,0.824088 v 0.677333 c 0,0.361244 -0.141111,0.620888 -0.338667,0.824088 -0.191911,0.191911 -0.474133,0.338667 -0.824088,0.338667 z"
            id="path995"
          />
          <path
            d="m 64.232914,62.095491 h -0.592666 v -0.428977 h 0.592666 c 0.112889,0 0.174978,0.1016 0.174978,0.214488 0,0.112889 -0.06773,0.214489 -0.174978,0.214489 z m 0,0.519289 c 0.09031,0 0.174978,-0.01693 0.265289,-0.05645 0.237067,-0.1016 0.428978,-0.349955 0.428978,-0.677333 0,-0.338666 -0.191911,-0.564444 -0.428978,-0.677332 -0.08467,-0.03951 -0.174978,-0.05645 -0.265289,-0.05645 H 63.12096 V 62.61478 Z M 64.12567,60.436026 c 0,0.06209 -0.04515,0.107244 -0.107244,0.107244 h -0.378178 v -0.214489 h 0.378178 c 0.06209,0 0.107244,0.04516 0.107244,0.107245 z m -0.107244,0.620888 c 0.186266,0 0.344311,-0.07338 0.440266,-0.180622 0.08467,-0.08467 0.186267,-0.259644 0.186267,-0.440266 0,-0.07338 -0.01693,-0.1524 -0.0508,-0.237067 -0.09031,-0.208844 -0.282222,-0.389466 -0.575733,-0.389466 H 63.12096 v 1.247421 z m 1.123243,-0.124178 c 0.0056,-0.02258 0.02258,-0.04516 0.03951,-0.06773 0.07338,-0.1016 0.06209,-0.259644 0.06209,-0.428977 0,-0.372533 -0.1524,-0.666044 -0.3556,-0.8636 -0.203199,-0.197555 -0.49671,-0.361244 -0.869243,-0.361244 h -1.495777 v 4.007553 h 1.710265 c 0.169334,0 0.333022,-0.03951 0.502356,-0.107245 0.434621,-0.197555 0.795866,-0.603955 0.795866,-1.230488 0,-0.406399 -0.169334,-0.728132 -0.389467,-0.948266 z m -0.761999,0.124178 c 0.124178,0.03387 0.248355,0.1016 0.349955,0.186267 0.141111,0.146755 0.282222,0.355599 0.282222,0.637821 0,0.112889 -0.01693,0.214489 -0.05644,0.310445 -0.112889,0.270933 -0.3556,0.507999 -0.722489,0.507999 h -1.196621 v -2.97462 h 0.982133 c 0.09595,0 0.186266,0.02258 0.276577,0.05644 0.231422,0.112888 0.434622,0.327377 0.434622,0.654755 0,0.3048 -0.163689,0.49671 -0.349955,0.620888 z"
            id="path997"
          />
          <path
            d="m 66.42295,62.61478 h 1.998132 v -0.519289 h -1.478843 v -0.321733 h 1.015999 V 61.25447 H 66.42295 Z m 1.998132,0.08467 h -2.082798 v -2.97462 h 2.082798 V 59.211182 H 65.82464 v 4.007553 h 2.596442 z m -0.462844,-1.529643 v -0.519289 h -1.015999 v -0.321733 h 1.478843 V 59.809493 H 66.42295 v 1.36031 z"
            id="path999"
          />
          <path
            d="m 70.069252,62.039047 c -0.01129,0 -0.01129,-0.0056 -0.01129,-0.0056 h -0.643466 v 1.185333 h 0.519288 v -0.666044 h 0.04516 c 0.158044,0.220133 0.316088,0.445911 0.474133,0.666044 h 0.637822 l -0.575733,-0.795866 c -0.09596,-0.129822 -0.186267,-0.265289 -0.282222,-0.395111 l -0.135467,0.0056 c -0.01129,0 -0.01693,0.0056 -0.02822,0.0056 z m 1.642532,-1.15711 c 0,-0.508 -0.220133,-0.9144 -0.491066,-1.185333 -0.276578,-0.270933 -0.671689,-0.485422 -1.179688,-0.485422 h -1.224844 v 4.007553 h 0.513644 v -3.493909 h 0.7112 c 0.355599,0 0.620888,0.146756 0.812799,0.338667 0.186267,0.191911 0.338666,0.468488 0.338666,0.818444 0,0.491066 -0.276577,0.824088 -0.59831,1.010354 l -0.248356,0.141111 0.169334,0.237067 c 0.225777,0.321733 0.451555,0.632177 0.677332,0.948266 h 0.637822 c -0.248355,-0.349956 -0.496711,-0.694266 -0.745066,-1.038577 0.344311,-0.265289 0.626533,-0.716844 0.626533,-1.298221 z M 70.04103,60.328781 c 0.174977,0 0.293511,0.07338 0.389466,0.163689 0.08467,0.09031 0.158044,0.225778 0.158044,0.389467 0,0.06773 -0.01129,0.141111 -0.03951,0.208844 -0.07902,0.186266 -0.254,0.338666 -0.507999,0.338666 h -0.107245 v -1.100666 z m -0.626533,-0.519288 v 2.139243 h 0.626533 c 0.321733,0 0.587021,-0.141111 0.756355,-0.310445 0.169333,-0.174977 0.310444,-0.434621 0.310444,-0.756354 0,-0.141111 -0.02822,-0.276578 -0.07902,-0.4064 -0.112889,-0.265289 -0.310444,-0.462844 -0.581378,-0.581378 -0.135466,-0.05644 -0.270933,-0.08467 -0.406399,-0.08467 z"
            id="path1001"
          />
          <path
            d="m 73.845383,60.328781 h 0.807154 v -0.519288 h -1.326443 v 3.409242 h 0.519289 z m -0.603956,2.889954 v -3.409242 h -1.326443 v 0.519288 h 0.807155 v 2.889954 z m -1.326443,-3.493909 h 2.737553 v -0.513644 h -2.737553 z"
            id="path1003"
          />
        </g>
      </g>
    </motion.svg>
  );
};

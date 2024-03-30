import { ConicGradientBorder } from "@/components/animations/conic-gradient-border";
import ImageV2 from "./components/image-v2";
import NosProduits from "./components/nos-produits";
import WhyChooseUs from "./components/why-choose-us";
import Image from "next/image";
import NavBar from "@/components/navbar-public/navbar";

export default function Home() {
  return (
    <>
      {" "}
      <ImageV2 />
      <NosProduits />
      <WhyChooseUs />
      {/* <div className=" relative block w-full overflow-hidden overflow-y-scroll border border-neutral-300 bg-white">
        <div className="bg-slate-950 px-4 py-12">
          <div className="group relative mx-auto w-full max-w-sm overflow-hidden rounded-lg bg-slate-800 p-0.5 transition-all duration-500 hover:scale-[1.01] hover:bg-slate-800/50">
            <div className="relative z-10 flex flex-col items-center justify-center overflow-hidden rounded-[7px] bg-slate-900 p-8 transition-colors duration-500 group-hover:bg-slate-800">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative z-10 mb-10 mt-2 rounded-full border-2 border-indigo-500 bg-slate-900 p-4 text-7xl text-indigo-500"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path>
                <polyline points="13 11 9 17 15 17 11 23"></polyline>
              </svg>
              <h4 className="relative z-10 mb-4 w-full text-3xl font-bold text-slate-50">
                Go faster
              </h4>
              <p className="relative z-10 text-slate-400">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est
                ipsum sed blanditiis iste molestias nemo nobis repellendus nisi
                dolorum itaque optio impedit cum voluptatem facilis minima,
                quasi laborum. Nihil, quaerat.
              </p>
            </div>
            <div
              className="absolute inset-0 z-0  animate-[spin_5s_linear_infinite] bg-gradient-to-br from-indigo-200 via-indigo-200/0 to-indigo-200 opacity-0   group-hover:opacity-100"
              style={{ scale: 1.5 }}
            ></div>
          </div>
        </div>
      </div> */}
      <div className="grid h-screen w-full grid-cols-[1fr_1.2fr_1.5fr] grid-rows-[1fr_4fr_3fr_2fr] p-4 ">
        <div className="col-span-2 row-span-2 bg-orange-200 ">Main </div>
        <header className=" bg-slate-200"></header>
        <div className="  row-span-3  bg-cover bg-no-repeat [background-image:_url('/candy.jpg')]">
          Candy
        </div>
        <section className="bg-green-500">Nom</section>

        <section className="bg-yellow-500">Yum</section>
        <section className="col-span-2 bg-orange-500">Footer</section>
      </div>
    </>
  );
}

const AnimatedInput = () => {
  return (
    <div className="flex h-[200px] items-center justify-center bg-black px-4">
      <form className="relative flex w-full max-w-md items-center gap-2  rounded-md border border-white/20 bg-gradient-to-br from-white/20 to-white/5 py-1.5 pl-6 pr-1.5">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full bg-transparent text-sm text-white placeholder-white/80 focus:outline-0"
        />
        <button
          type="submit"
          className="group flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-br from-gray-50 to-gray-400 px-4 py-3 text-sm font-medium text-gray-900 transition-transform active:scale-[0.985]"
        >
          <span>Join Waitlist</span>
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="-mr-4 opacity-0 transition-all group-hover:-mr-0 group-hover:opacity-100 group-active:-rotate-45"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
        <ConicGradientBorder className="rounded-md " color="purple" />
      </form>
    </div>
  );
};

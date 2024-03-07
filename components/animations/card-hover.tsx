import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type CardHoverProps = React.HTMLAttributes<HTMLDivElement> & {
  image: string;
  text: string;
  title: string;
  link: string;
};

const CardHover = ({
  image,
  text,
  title,
  link,
  className,
  ...props
}: CardHoverProps) => {
  return (
    <>
      <div
        className={cn("m-0 flex items-center justify-center p-0 ", className)}
        {...props}
      >
        <div className=" relative flex justify-between">
          <div className="group relative   transition-all hover:mb-[300px] lg:hover:mb-0 duration-500 ease-in-out">
            <div
              className="absolute  inset-0 z-10 flex flex-col min-h-[300px] max-w-[400px] items-center justify-center bg-gray-600 transition-all duration-500  group-hover:bg-green-600  shadow-[0_20px_50px_rgba(0,0,0,0.8)] group-hover:shadow-none
  "
            >
              <div className="opacity-100 transition-all duration-500 group-hover:opacity-100 flex flex-col items-center justify-center px-4">
                <Image
                  alt=""
                  width={100}
                  height={100}
                  src={image}
                  className="max-w-[100px] self-center"
                />
                <h3
                  className="mx-0 font-SourceCodePro mb-0 mt-2.5 p-0 text-center text-[1.5em] text-green-600 group-hover:text-white transition-all duration-500 self-center
"
                >
                  {title}
                </h3>
              </div>
            </div>
            <div className="relative box-border min-h-[300px] max-w-[400px]   bg-primary-foreground p-5  shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover:translate-y-[300px]   opacity-50  group-hover:opacity-100  flex flex-col  justify-between ">
              <p className="relative m-0 p-0 text-center px-2 text-primary-foreground  group-hover:text-primary transition-all duration-500">
                {text}
              </p>
              <Link
                href={link}
                className="mx-0 mb-0 mt-[15px] border border-solid border-[#333] p-[5px] font-black text-[#333] self-center transition-all duration-500 group-hover:bg-[#333] group-hover:text-white w-fit
"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardHover;

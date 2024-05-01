import NavBar from "@/components/navbar-public/navbar";
import ButtonBackward from "@/components/ui/button-backward";
import { CategoriesProvider } from "@/context/categories-context";

const NotFound = () => {
  return (
    <CategoriesProvider>
      <NavBar />

      <div className="pt-16">
        <div className="grid h-[80vh] place-content-center bg-primary-foreground px-4">
          <div className="flex flex-col justify-center gap-4 text-center">
            <p className="text-2xl font-bold tracking-tight text-primary">
              Erreur
            </p>

            <h1
              className={`animate-[glitch_1s_linear_infinite]  font-[SourceCodePro] text-9xl font-bold tracking-[-5px] text-primary 
          before:absolute
          before:left-0 before:animate-[glitch-top_1s_linear_.5s_infinite] before:content-['404'] before:clip-path-polygon-[0_0,_100%_0,_100%_33%,_0_33%]
          after:absolute after:left-0 after:animate-[glitch-bottom_1s_linear_infinite] after:content-['404']
          after:clip-path-polygon-[0_67%,_100%_67%,_100%_100%,_0_100%]
          `}
            >
              404
            </h1>

            <p className=" text-gray-500 dark:text-gray-400">
              Page introuvable.
            </p>

            <ButtonBackward className="w-20 self-center" />
          </div>
        </div>
      </div>
    </CategoriesProvider>
  );
};

export default NotFound;

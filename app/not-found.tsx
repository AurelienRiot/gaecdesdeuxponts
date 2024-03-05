import NavBar from "@/components/navbar-public/navbar";
import ButtonBackward from "@/components/ui/button-backward";

const NotFound = () => {
  return (
    <div>
      <NavBar />
      <div className="grid h-[80vh] px-4 bg-primary-foreground place-content-center">
        <div className="text-center flex flex-col justify-center gap-4">
          <p className="text-2xl font-bold tracking-tight text-primary">
            Erreur
          </p>

          <h1
            className={`font-bold  text-primary tracking-[-5px] text-9xl font-SourceCodePro animate-[glitch_1s_linear_infinite] 
          before:clip-path-polygon-[0_0,_100%_0,_100%_33%,_0_33%]
          before:animate-[glitch-top_1s_linear_.5s_infinite] before:content-['404'] before:absolute before:left-0
          after:animate-[glitch-bottom_1s_linear_infinite] after:content-['404'] after:absolute after:left-0
          after:clip-path-polygon-[0_67%,_100%_67%,_100%_100%,_0_100%]
          `}
          >
            404
          </h1>

          <p className=" text-gray-500 dark:text-gray-400">Page introuvable.</p>

          <ButtonBackward className="w-20 self-center" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;

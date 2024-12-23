import { Icons } from "@/components/icons";
import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoadingPageLoading() {
  return (
    <div className="flex w-full items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="space-y-12 rounded-xl px-2 pb-8 pt-12 sm:bg-white sm:px-8 sm:shadow-xl sm:dark:bg-black">
        <h1 className="text-3xl font-bold tracking-tight"> Page de Connection</h1>
        <button
          type="button"
          className="relative mx-auto flex w-[306px] items-center justify-between gap-4 rounded-sm bg-[#4285F4] shadow-xl duration-200 ease-linear hover:bg-[#4285F4]/90 active:scale-95 "
        >
          <Icons.google />
          <Skeleton size={"xs"} className="mr-12 h-3 w-40 bg-white/70" />
        </button>
        <div
          className={`my-4 flex h-4 flex-row items-center gap-4 self-stretch whitespace-nowrap before:h-0.5 before:w-full before:flex-grow before:bg-primary/30 after:h-0.5 after:w-full after:flex-grow after:bg-primary/30`}
        >
          ou
        </div>
        <div className="space-y-6 max-w-sm">
          <div className="grid w-full items-center gap-1.5">
            <div className="space-y-6 text-center">
              <div className="text-2xl ">Entrez votre email pour recevoir le code unique pour vous connecter</div>
              <Skeleton className=" h-8 w-full " />
            </div>
          </div>

          <Button
            type="submit"
            className="mt-4 w-full transition-transform duration-200 ease-linear active:scale-95"
            size="lg"
          >
            {"   Recevoir le code  "}
          </Button>
        </div>
      </div>
    </div>
  );
}

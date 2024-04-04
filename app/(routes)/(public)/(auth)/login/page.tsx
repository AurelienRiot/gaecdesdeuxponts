import { EmailButton, GoogleButton } from "@/components/auth/auth-button";
import { checkUser } from "@/components/auth/checkAuth";
import { redirect } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_URL;

const LoginPage = async (context: {
  searchParams: { callbackUrl: string };
}) => {
  const isAuth = await checkUser();
  if (isAuth) {
    if (isAuth.role === "admin") {
      redirect("/admin");
    } else {
      redirect("/dashboard-user");
    }
  }

  const callbackUrl = decodeURI(
    context.searchParams.callbackUrl ?? `${baseUrl}/dashboard-user`,
  );

  console.log(callbackUrl);

  return (
    <div className="flex w-full items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="space-y-12 rounded-xl px-2 pb-8 pt-12 sm:bg-white sm:px-8 sm:shadow-xl sm:dark:bg-black">
        <h1 className="text-center text-2xl font-semibold ">
          {" "}
          Page de Connection{" "}
        </h1>
        <GoogleButton callbackUrl={callbackUrl} />
        <div
          className={`my-4 flex h-4 flex-row  items-center gap-4 self-stretch whitespace-nowrap
        before:h-0.5 before:w-full 
        before:flex-grow before:bg-primary/30  after:h-0.5  after:w-full 
        after:flex-grow  after:bg-primary/30  `}
        >
          ou
        </div>
        <EmailButton callbackUrl={callbackUrl} />
      </div>
    </div>
  );
};

export default LoginPage;

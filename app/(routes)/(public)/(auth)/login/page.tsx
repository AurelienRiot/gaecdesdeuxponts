import { getSessionUser } from "@/actions/get-user";
import { Logout } from "@/components/auth/auth";
import { EmailButton, GoogleButton } from "@/components/auth/auth-button";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoadingPageLoading from "./loading";

const baseUrl = process.env.NEXT_PUBLIC_URL;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Page de connection",
  description: "Connectez-vous à Laiterie du Pont Robert",
};

const LoginPage = async (context: {
  searchParams: Promise<{ callbackUrl: string | undefined; error: string | undefined; emaillogin: string | undefined }>;
}) => {
  const searchParams = await context.searchParams;
  const callbackUrl = decodeURI(searchParams.callbackUrl ?? `${baseUrl}/profile`);
  const user = await getSessionUser();
  if (user) {
    if (user.role === "deleted" || user.role === "trackOnlyUser") {
      return <Logout callbackUrl={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} />;
    }

    if (user.role !== "admin" && user.role !== "readOnlyAdmin" && callbackUrl.includes("/admin")) {
      return <Logout callbackUrl={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}&error=admin`} />;
    }
    if (user.role !== "pro" && callbackUrl.includes("/profile/produits-pro")) {
      return <Logout callbackUrl={`/login?callbackUrl=${encodeURIComponent("/profile")}&error=pro`} />;
    }
    return redirect(callbackUrl);
  }

  return (
    <div className="flex w-full items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="space-y-12 rounded-xl px-2 pb-8 pt-12 sm:bg-white sm:px-8 sm:shadow-xl sm:dark:bg-black">
        <h1 className="text-3xl font-bold tracking-tight"> Page de Connection</h1>
        <ErrorDisplay error={searchParams.error} />
        <GoogleButton callbackUrl={callbackUrl} />
        <div
          className={`my-4 flex h-4 flex-row items-center gap-4 self-stretch whitespace-nowrap before:h-0.5 before:w-full before:flex-grow before:bg-primary/30 after:h-0.5 after:w-full after:flex-grow after:bg-primary/30`}
        >
          ou
        </div>
        <EmailButton callbackUrl={callbackUrl} emaillogin={searchParams.emaillogin} />
      </div>
    </div>
  );
};

export default LoginPage;

function ErrorDisplay({ error }: { error: string | undefined }) {
  switch (error) {
    case "admin":
      return (
        <p className=" font-bold text-sm text-destructive">Veuillez vous connecter avec un compte administrateur.</p>
      );
    case "pro":
      return (
        <p className=" font-bold text-sm text-destructive">Veuillez vous connecter avec un compte professionnel.</p>
      );
    case "Verification":
      return (
        <p className=" font-bold text-sm text-destructive">
          Le code est expiré ou invalide, veuillez entrer votre addresse email.
          <br />
          {"Vérifier qu'il s'agit du dernier email envoyé."}
        </p>
      );
    default:
      return null;
  }
}

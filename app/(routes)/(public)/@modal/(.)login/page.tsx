import LoginPage from "@/app/(routes)/(public)/(auth)/login/page";
import LoginSheet from "./components/login-sheet";

export const dynamic = "force-dynamic";

async function IntercepteLoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl: string | undefined; error: string | undefined; emaillogin: string | undefined };
}) {
  return (
    <LoginSheet>
      <LoginPage searchParams={searchParams} />
    </LoginSheet>
  );
}

export default IntercepteLoginPage;

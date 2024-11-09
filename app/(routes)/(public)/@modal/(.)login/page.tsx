import LoginPage from "@/app/(routes)/(public)/(auth)/login/page";

export const dynamic = "force-dynamic";

async function IntercepteLoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl: string | undefined; error: string | undefined; emaillogin: string | undefined };
}) {
  return <LoginPage searchParams={searchParams} />;
}

export default IntercepteLoginPage;

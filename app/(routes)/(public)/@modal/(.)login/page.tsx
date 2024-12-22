import LoginPage from "@/app/(routes)/(public)/(auth)/login/page";

async function IntercepteLoginPage(props: {
  searchParams: Promise<{ callbackUrl: string | undefined; error: string | undefined; emaillogin: string | undefined }>;
}) {
  return <LoginPage searchParams={props.searchParams} />;
}

export default IntercepteLoginPage;

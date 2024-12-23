import LoginPage from "@/app/(routes)/(public)/(auth)/login/page";
import LoadingPageLoading from "../../(auth)/login/loading";

async function IntercepteLoginPage(props: {
  searchParams: Promise<{ callbackUrl: string | undefined; error: string | undefined; emaillogin: string | undefined }>;
}) {
  // return <LoadingPageLoading />;
  return <LoginPage searchParams={props.searchParams} />;
}

export default IntercepteLoginPage;

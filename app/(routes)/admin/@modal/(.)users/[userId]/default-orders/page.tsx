import DefaultOrdersPage from "@/app/(routes)/admin/users/[userId]/default-orders/page";

async function DefaultOrdersPageIntercept(props: {
  params: Promise<{ userId: string | "new" | undefined }>;
}) {
  return <DefaultOrdersPage params={props.params} />;
}

export default DefaultOrdersPageIntercept;

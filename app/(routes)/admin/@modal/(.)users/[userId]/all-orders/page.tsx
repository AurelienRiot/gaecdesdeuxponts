import AllOrdersPage from "@/app/(routes)/admin/users/[userId]/all-orders/page";

async function AllOrdersPageIntercept(props: {
  params: Promise<{ userId: string | "new" | undefined }>;
}) {
  return <AllOrdersPage params={props.params} />;
}

export default AllOrdersPageIntercept;

import { getSessionUser } from "@/actions/get-user";

async function UserRole() {
  const user = await getSessionUser();
  return <div>{user?.role === "admin" ? "A" : "R"}</div>;
}

export default UserRole;

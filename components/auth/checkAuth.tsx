import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

const checkAdmin = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "admin") {
    return false;
  }

  return true;
};

const checkUser = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return false;
  }

  return true;
};

export { checkAdmin, checkUser };

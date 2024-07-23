import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import prismadb from "@/lib/prismadb";

const checkAdmin = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "admin") {
    return false;
  }

  return true;
};

const checkReadOnlyAdmin = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user.role !== "admin" && session.user.role !== "readOnlyAdmin")) {
    return false;
  }

  return true;
};

const checkUser = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return false;
  }

  return session.user;
};

const checkPro = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return false;
  }
  if (["pro", "admin", "readOnlyAdmin"].includes(session.user.role)) {
    return session.user.role;
  }

  const user = await prismadb.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
    },
  });
  if (!user || user.role === "user") {
    return false;
  }

  return user.role;
};

export { checkAdmin, checkUser, checkPro, checkReadOnlyAdmin };

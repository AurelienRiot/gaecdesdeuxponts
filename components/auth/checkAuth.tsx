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
  if (session.user.role === "pro") {
    return "pro";
  }

  if (session.user.role === "admin") {
    return "admin";
  }
  console.log(session.user);

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

export { checkAdmin, checkUser, checkPro };

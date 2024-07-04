import { getBasicUser, getSessionUser } from "@/actions/get-user";
import { checkAdmin } from "@/components/auth/checkAuth";
import type { User } from "@prisma/client";
import type { Session } from "next-auth";
import type { z } from "zod";

export type ReturnTypeServerAction<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
    };

type SafeServerActionType<D extends z.ZodTypeAny, T> =
  | {
      type: "sessionUser";
      schema: D;
      serverAction: (data: z.infer<D>, user: Session["user"] | null) => Promise<ReturnTypeServerAction<T>>;
      checkUser: boolean;
      data: z.infer<D>;
    }
  | {
      type: "dbUser";
      schema: D;
      serverAction: (data: z.infer<D>, user: User | null) => Promise<ReturnTypeServerAction<T>>;
      checkUser: boolean;
      data: z.infer<D>;
    }
  | {
      type: "admin";
      schema: D;
      serverAction: (data: z.infer<D>) => Promise<ReturnTypeServerAction<T>>;
      checkUser: true;
      data: z.infer<D>;
    };

async function safeServerAction<D extends z.ZodTypeAny, T>({
  type,
  schema,
  serverAction,
  checkUser = true,
  data,
}: SafeServerActionType<D, T>): Promise<ReturnTypeServerAction<T>> {
  const validatedData = schema.safeParse(data);
  if (!validatedData.success) {
    return {
      success: false,
      message: validatedData.error.message,
    };
  }

  switch (type) {
    case "sessionUser": {
      const user = await getSessionUser();
      if (checkUser && !user) {
        return {
          success: false,
          message: "Vous devez être authentifier",
        };
      }
      return await serverAction(data, user);
    }
    case "dbUser": {
      const user = await getBasicUser();
      if (checkUser && !user) {
        return {
          success: false,
          message: "Vous devez être authentifier",
        };
      }
      return await serverAction(data, user);
    }
    case "admin": {
      const isAuth = await checkAdmin();

      if (!isAuth) {
        return {
          success: false,
          message: "Vous devez être authentifier",
        };
      }
      return await serverAction(data);
    }
  }
}

export default safeServerAction;

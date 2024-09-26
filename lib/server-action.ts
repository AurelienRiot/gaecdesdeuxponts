import { checkUser } from "@/components/auth/checkAuth";
import type { Session } from "next-auth";
import type { z } from "zod";
import { rateLimit } from "./rate-limit";
import type { Role } from "@prisma/client";

export type ReturnTypeServerAction<R = undefined, E = undefined> =
  | {
      success: true;
      message: string;
      data?: R;
    }
  | {
      success: false;
      message: string;
      errorData?: E;
    };

type BaseServerActionType<D extends z.ZodTypeAny> = {
  schema: D;
  roles?: Role[];
  data: z.infer<D>;
};

type SafeServerActionType<D extends z.ZodTypeAny, R, E> = BaseServerActionType<D> &
  (
    | {
        ignoreCheckUser?: false;
        serverAction: (data: z.infer<D>, user: Session["user"]) => Promise<ReturnTypeServerAction<R, E>>;
      }
    | {
        ignoreCheckUser: true;
        serverAction: (data: z.infer<D>, user: Session["user"] | null) => Promise<ReturnTypeServerAction<R, E>>;
      }
  );

async function safeServerAction<D extends z.ZodTypeAny, R, E>({
  data,
  serverAction,
  schema,
  ignoreCheckUser,
  roles = ["admin", "readOnlyAdmin", "user", "pro"],
}: SafeServerActionType<D, R, E>): Promise<ReturnTypeServerAction<R, E>> {
  console.time("Total Execution Time");

  const user = await checkUser();

  const isRateLimited = await rateLimit(user?.role);
  if (isRateLimited) {
    console.timeEnd("Total Execution Time");

    return {
      success: false,
      message: "Trop de requêtes. Veuillez reessayer plus tard",
    };
  }

  const validatedData = schema.safeParse(data);
  if (!validatedData.success) {
    console.timeEnd("Total Execution Time");
    return {
      success: false,
      message: validatedData.error.issues[0].message,
    };
  }
  if (ignoreCheckUser) {
    const result = await serverAction(data, user);
    console.timeEnd("Total Execution Time");
    return result;
  }

  if (!user || !roles.includes(user.role)) {
    console.timeEnd("Total Execution Time");
    return {
      success: false,
      message: "Vous devez être authentifier pour continuer",
    };
  }

  const result = await serverAction(data, user);
  console.timeEnd("Total Execution Time");
  return result;
}

export default safeServerAction;

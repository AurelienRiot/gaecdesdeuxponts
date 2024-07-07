import type { z } from "zod";

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

type BaseServerActionType<D extends z.ZodTypeAny, U> = {
  schema: D;
  data: z.infer<D>;
  getUser: () => Promise<U | null>;
};

type SafeServerActionType<D extends z.ZodTypeAny, R, E, U> = BaseServerActionType<D, U> &
  (
    | {
        ignoreCheckUser?: false;
        serverAction: (data: z.infer<D>, user: U) => Promise<ReturnTypeServerAction<R, E>>;
      }
    | {
        ignoreCheckUser: true;
        serverAction: (data: z.infer<D>, user: U | null) => Promise<ReturnTypeServerAction<R, E>>;
      }
  );

async function safeServerAction<D extends z.ZodTypeAny, R, E, U>({
  schema,
  serverAction,
  ignoreCheckUser,
  data,
  getUser,
}: SafeServerActionType<D, R, E, U>): Promise<ReturnTypeServerAction<R, E>> {
  const validatedData = schema.safeParse(data);
  if (!validatedData.success) {
    return {
      success: false,
      message: validatedData.error.issues[0].message,
    };
  }

  const user = await getUser();
  if (ignoreCheckUser) {
    return await serverAction(data, user);
  }

  if (!user) {
    return {
      success: false,
      message: "Vous devez être authentifier",
    };
  }
  return await serverAction(data, user);
}

export default safeServerAction;

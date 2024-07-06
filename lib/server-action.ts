import type { z } from "zod";

export type ReturnTypeServerAction<T, E = undefined> =
  | {
      success: true;
      data: T;
      message?: string;
    }
  | {
      success: false;
      message: string;
      errorData?: E;
    };

export type ReturnTypeServerAction2<R = undefined, E = undefined> =
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
        serverAction: (data: z.infer<D>, user: U) => Promise<ReturnTypeServerAction2<R, E>>;
      }
    | {
        ignoreCheckUser: true;
        serverAction: (data: z.infer<D>, user: U | null) => Promise<ReturnTypeServerAction2<R, E>>;
      }
  );

async function safeServerAction<D extends z.ZodTypeAny, R, E, U>({
  schema,
  serverAction,
  ignoreCheckUser,
  data,
  getUser,
}: SafeServerActionType<D, R, E, U>): Promise<ReturnTypeServerAction2<R, E>> {
  const validatedData = schema.safeParse(data);
  if (!validatedData.success) {
    return {
      success: false,
      message: validatedData.error.message,
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

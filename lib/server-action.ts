import { checkUser } from "@/components/auth/checkAuth";
import type { Session } from "next-auth";
import type { z, ZodSchema } from "zod";
import { rateLimit } from "./rate-limit";
import type { Role } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { nanoid } from "./id";
import { USER } from "@/components/auth";
import { emptySchema } from "@/components/zod-schema";

export type ZodError = {
  [x: string]: string[] | undefined;
  [x: number]: string[] | undefined;
  [x: symbol]: string[] | undefined;
};

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
      zodError?: ZodError;
    };

type BaseServerActionType<D> = {
  schema?: ZodSchema<D>;
  roles?: Role[];
  data: D;
  rateLimited?: boolean;
};

type SafeServerActionType<D, R, E> = BaseServerActionType<D> &
  (
    | {
        ignoreCheckUser?: false;
        serverAction: (data: D, user: Session["user"]) => Promise<ReturnTypeServerAction<R, E>>;
      }
    | {
        ignoreCheckUser: true;
        serverAction: (data: D, user: Session["user"] | null) => Promise<ReturnTypeServerAction<R, E>>;
      }
  );

async function safeServerAction<D, R, E>({
  data,
  serverAction,
  schema = emptySchema as unknown as ZodSchema<D>,
  ignoreCheckUser,
  roles = USER,
  rateLimited,
}: SafeServerActionType<D, R, E>): Promise<ReturnTypeServerAction<R, E>> {
  const timerLabel = `Total Execution Time - ${nanoid(5)}`;
  console.time(timerLabel);

  try {
    const user = await checkUser();

    if (rateLimited) {
      const isRateLimited = await rateLimit(user?.role);
      if (isRateLimited) {
        console.timeEnd(timerLabel);

        return {
          success: false,
          message: "Trop de requêtes. Veuillez reessayer plus tard",
        };
      }
    }

    const validatedData = schema.safeParse(data);
    if (!validatedData.success) {
      console.log(validatedData.error.issues[0]);
      console.timeEnd(timerLabel);
      return {
        success: false,
        message: "Données invalides",
        zodError: validatedData.error.flatten().fieldErrors,
      };
    }
    if (ignoreCheckUser) {
      const result = await serverAction(validatedData.data, user);
      console.timeEnd(timerLabel);
      return result;
    }

    if (!user || !roles.includes(user.role)) {
      console.timeEnd(timerLabel);
      return {
        success: false,
        message: "Vous devez être authentifier pour continuer",
      };
    }

    const result = await serverAction(validatedData.data, user);
    console.timeEnd(timerLabel);
    return result;
  } catch (error) {
    console.timeEnd(timerLabel);
    console.log(error);
    return {
      success: false,
      message: "Une erreur est survenue",
    };
  }
}

export default safeServerAction;

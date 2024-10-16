import { checkUser } from "@/components/auth/checkAuth";
import type { Session } from "next-auth";
import type { z } from "zod";
import { rateLimit } from "./rate-limit";
import type { Role } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { nanoid } from "./id";

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
      zodError?: {
        [x: string]: string[] | undefined;
        [x: number]: string[] | undefined;
        [x: symbol]: string[] | undefined;
      };
    };

type BaseServerActionType<D extends z.ZodTypeAny> = {
  schema: D;
  roles?: Role[];
  data: z.infer<D>;
  rateLimited?: boolean;
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
      console.timeEnd(timerLabel);
      return {
        success: false,
        message: validatedData.error.issues[0].message,
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

type BaseRouteAPIType<D extends z.ZodTypeAny> = {
  schema: D;
  roles?: Role[];
  rateLimited?: boolean;
  request: NextRequest;
  serverError?: string;
};

type SafeRouteAPIType<D extends z.ZodTypeAny, R, E> = BaseRouteAPIType<D> &
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

export async function safeRouteAPI<D extends z.ZodTypeAny, R, E>({
  serverAction,
  schema,
  ignoreCheckUser,
  roles = ["admin", "readOnlyAdmin", "user", "pro"],
  rateLimited,
  request,
  serverError = "[ERROR]",
}: SafeRouteAPIType<D, R, E>): Promise<NextResponse> {
  const timerLabel = `Total Execution Time - ${nanoid(5)}`;
  console.time(timerLabel);
  try {
    const body = await request.json();

    const user = await checkUser();

    if (rateLimited) {
      const isRateLimited = await rateLimit(user?.role);
      if (isRateLimited) {
        console.timeEnd(timerLabel);
        return new NextResponse("Trop de requêtes. Veuillez reessayer plus tard", {
          status: 429,
        });
      }
    }

    const validatedData = schema.safeParse(body);
    if (!validatedData.success) {
      console.timeEnd(timerLabel);
      console.log(validatedData.error.issues[0].message);
      return new NextResponse(validatedData.error.issues[0].message, {
        status: 400,
      });
    }
    if (ignoreCheckUser) {
      const result = await serverAction(validatedData.data, user);
      console.timeEnd(timerLabel);
      if (!result.success) {
        return new NextResponse(result.message, {
          status: 400,
        });
      }
      return NextResponse.json(result, { status: 200 });
    }

    if (!user || !roles.includes(user.role)) {
      console.timeEnd(timerLabel);
      return new NextResponse("Vous devez être authentifier pour continuer", {
        status: 401,
      });
    }

    const result = await serverAction(validatedData.data, user);

    console.timeEnd(timerLabel);
    if (!result.success) {
      return new NextResponse(result.message, {
        status: 400,
      });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(serverError, error);
    console.timeEnd(timerLabel);
    return new NextResponse("Erreur", {
      status: 500,
    });
  }
}

export default safeServerAction;

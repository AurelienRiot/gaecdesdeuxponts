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
      console.log(validatedData.error.issues[0].message);
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

type BaseRouteAPIType<D> = {
  schema?: ZodSchema<D>;
  roles?: Role[];
  rateLimited?: boolean;
  request: NextRequest;
  serverError?: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

type SafeRouteAPIType<D, R, E> = BaseRouteAPIType<D> &
  (
    | {
        ignoreCheckUser?: false;
        serverAction: (data: D, user: Session["user"], request: NextRequest) => Promise<ReturnTypeServerAction<R, E>>;
      }
    | {
        ignoreCheckUser: true;
        serverAction: (
          data: D,
          user: Session["user"] | null,
          request: NextRequest,
        ) => Promise<ReturnTypeServerAction<R, E>>;
      }
  );

export async function safeRouteAPI<D, R, E>({
  serverAction,
  schema = emptySchema as unknown as ZodSchema<D>,
  ignoreCheckUser,
  roles = USER,
  rateLimited,
  request,
  serverError = "[ERROR]",
  method,
}: SafeRouteAPIType<D, R, E>): Promise<NextResponse> {
  const timerLabel = `Total Execution Time - ${nanoid(5)}`;
  console.time(timerLabel);
  try {
    const { searchParams } = new URL(request.url);
    const searchParamsEntries = Object.fromEntries(searchParams.entries());
    const data = method === "GET" ? searchParamsEntries : await request.json();
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

    const validatedData = schema.safeParse(data);
    if (!validatedData.success) {
      console.timeEnd(timerLabel);
      console.log(validatedData.error.issues[0].message);
      return new NextResponse(validatedData.error.issues[0].message, {
        status: 400,
      });
    }
    if (ignoreCheckUser) {
      const result = await serverAction(validatedData.data, user, request);
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

    const result = await serverAction(validatedData.data, user, request);

    console.timeEnd(timerLabel);
    if (!result.success) {
      return new NextResponse(result.message, {
        status: 400,
      });
    }
    return NextResponse.json(result.data ?? result.message, { status: 200 });
  } catch (error) {
    console.log(serverError, error);
    console.timeEnd(timerLabel);
    return new NextResponse("Erreur", {
      status: 500,
    });
  }
}

export default safeServerAction;

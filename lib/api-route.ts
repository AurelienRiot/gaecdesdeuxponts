import { USER } from "@/components/auth";
import { emptySchema } from "@/components/zod-schema";
import type { Role } from "@prisma/client";
import type { Session } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import type { ZodSchema } from "zod";
import type { ReturnTypeServerAction } from "./server-action";
import { nanoid } from "./id";
import { checkUser } from "@/components/auth/checkAuth";
import { rateLimit } from "./rate-limit";

type BaseAPIRouteType<D> = {
  schema?: ZodSchema<D>;
  roles?: Role[];
  rateLimited?: boolean;
  request: NextRequest;
  serverError?: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

type SafeAPIRouteType<D, R, E> = BaseAPIRouteType<D> &
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

type SafeResponseAPIRouteType<D> = BaseAPIRouteType<D> &
  (
    | {
        ignoreCheckUser?: false;
        serverAction: (data: D, user: Session["user"], request: NextRequest) => Promise<NextResponse>;
      }
    | {
        ignoreCheckUser: true;
        serverAction: (data: D, user: Session["user"] | null, request: NextRequest) => Promise<NextResponse>;
      }
  );

export async function safeAPIRoute<D, R, E>({
  serverAction,
  schema = emptySchema as unknown as ZodSchema<D>,
  ignoreCheckUser,
  roles = USER,
  rateLimited,
  request,
  serverError = "[ERROR]",
  method,
}: SafeAPIRouteType<D, R, E> | SafeResponseAPIRouteType<D>): Promise<NextResponse> {
  const timerLabel = `Total Execution Time - ${nanoid(5)}`;
  console.time(timerLabel);
  try {
    const { searchParams } = new URL(request.url);
    const searchParamsEntries = Object.fromEntries(searchParams.entries());
    const data = method === "GET" || method === "DELETE" ? searchParamsEntries : await request.json();
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
      if (result instanceof NextResponse) {
        return result;
      }
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
    if (result instanceof NextResponse) {
      return result;
    }
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

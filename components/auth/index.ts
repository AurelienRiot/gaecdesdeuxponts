import type { Role } from "@prisma/client";

const SHIPPING: Role[] = ["admin", "readOnlyAdmin", "shipping"];

const SHIPPING_ONLY: Role[] = ["shipping", "admin"];

const ADMIN: Role[] = ["admin"];

const READ_ONLY_ADMIN: Role[] = ["readOnlyAdmin", "admin"];

const PRO: Role[] = ["pro", "admin", "readOnlyAdmin", "shipping"];

const USER: Role[] = ["user", "pro", "admin", "readOnlyAdmin", "shipping"];

export { SHIPPING, ADMIN, READ_ONLY_ADMIN, PRO, USER, SHIPPING_ONLY };

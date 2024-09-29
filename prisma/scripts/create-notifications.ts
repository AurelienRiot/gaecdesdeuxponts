// prisma/scripts/create-notifications.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        sendShippingEmail: true,
        sendInvoiceEmail: true,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

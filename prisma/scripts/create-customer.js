import { PrismaClient } from "@prisma/client";

const formatFrenchPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "";
  if (phoneNumber.startsWith("+33")) {
    return (
      phoneNumber
        .replace("+33", "0")
        .match(/.{1,2}/g)
        ?.join(" ") || ""
    );
  }
  return phoneNumber;
};

const addressFormatter = (address, full = true) => {
  if (!address || !address.line1) {
    return "";
  }
  if (full) {
    return `${address.line1}, ${address.postalCode}, ${address.city}, ${address.country}`;
  }
  return `${address.line1}, ${address.postalCode}, ${address.city}`;
};

const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    include: { user: { include: { address: true, billingAddress: true } } },
  });

  for (const order of orders) {
    const shippingAddress = order.user.address ? addressFormatter(order.user.address, true) : "";
    const billingAddress = order.user.billingAddress
      ? addressFormatter(order.user.billingAddress, true)
      : shippingAddress;
    await prisma.shippingCustomer.create({
      data: {
        userId: order.user.id,
        name: order.user.name || "",
        company: order.user.company,
        shippingAddress,
        billingAddress,
        email: order.user.email || "",
        phone: formatFrenchPhoneNumber(order.user.phone),
        orderId: order.id,
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

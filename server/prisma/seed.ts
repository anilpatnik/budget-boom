import { PrismaClient } from "@prisma/client";
import { categories } from "./db";

const prisma = new PrismaClient();

async function main() {
  await prisma.category.deleteMany({});
  await prisma.category.createMany({ data: categories });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
  });

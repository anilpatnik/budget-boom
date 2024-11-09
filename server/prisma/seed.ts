import { PrismaClient } from "@prisma/client";
import { categories, countries } from "./db";

const prisma = new PrismaClient();

async function main() {
  await prisma.category.deleteMany({});
  await prisma.category.createMany({ data: categories });

  await prisma.country.deleteMany({});
  await prisma.country.createMany({ data: countries });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
  });

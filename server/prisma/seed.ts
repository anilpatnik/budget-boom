import { PrismaClient } from "@prisma/client";
import { mockProjects } from "./db";

const prisma = new PrismaClient();

async function main() {
  const projects = await mockProjects(400);
  await prisma.project.deleteMany({});
  await prisma.project.createMany({ data: projects });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
  });

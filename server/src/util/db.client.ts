import { PrismaClient } from "@prisma/client";
import { ENVIRONMENT } from "./config";
import { EnvType } from "./enums";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (ENVIRONMENT !== EnvType.Prod) globalThis.prismaGlobal = prisma;

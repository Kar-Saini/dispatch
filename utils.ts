import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  url: process.env.DATABSE_URL,
  adapter: "postgresql",
});

export default prisma;

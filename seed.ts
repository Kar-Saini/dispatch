import prisma from "./utils";

async function main() {
  await prisma.admin.create({
    data: {
      admin: "SuperAdmin",
      created_by: "admin",
      email: "kackysaini8@gmail.com",
      name: "Kartik",
      password: "kartik",
    },
  });
}

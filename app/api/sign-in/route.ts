import prisma from "@/utils";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ message: "Email is invalid for admin" });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      console.log(password);
      console.log(admin.password);
      console.log("isPasswordValid");
      console.log(isPasswordValid);
      return NextResponse.json({ message: "Password is invalid" });
    }

    return NextResponse.json({
      message: "Admin sign in success",
      id: admin.id,
      email: admin.email,
      name: admin.name,
    });
  } catch (error) {
    return NextResponse.error();
  }
}

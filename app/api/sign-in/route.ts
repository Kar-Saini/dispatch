import prisma from "@/utils";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      NextResponse.json({ message: "Email is invalid for admin" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      NextResponse.json({ message: "Password is invalid" });
      return;
    }
    NextResponse.json({ message: "Admin sign in success", admin });
  } catch (error) {}
}

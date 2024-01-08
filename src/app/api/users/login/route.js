import { prisma } from "@/lib/prisma.js";
import { NextResponse } from "next/server.js";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: "Provide a username and password to login.",
      });
    }
    const user = await prisma.user.findFirst({
      where: { username },
    });
    if (!user) {
      return NextResponse.json({
        success: false,
        error: "Username doesn't exist.",
      });
    }

    const doesPasswordMatch = await bcrypt.compare(password, user.password);
    if (!doesPasswordMatch) {
      return NextResponse.json({
        success: false,
        error: "Incorrect username or password.",
      });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET
    );
    cookieStore.set("token", token);
    return NextResponse.json({ success: true, token });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

import { prisma } from "@/lib/prisma.js";
import { NextResponse } from "next/server.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers.js";

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const { username, password } = await request.json();
    const usernameFound = await prisma.user.findFirst({ where: { username } });
    if (usernameFound) {
      return NextResponse.json({
        success: false,
        error: "Username already exists",
      });
    }
    const saltedHashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await prisma.user.create({
      data: { username, password: saltedHashedPassword },
    });
    if (!createdUser) {
      return NextResponse.json({
        success: false,
        error: "User creation failed",
      });
    }
    delete createdUser.password;
    const token = jwt.sign({ userId: createdUser.id }, process.env.JWT_SECRET);
    if (!token) {
      return NextResponse.json({
        success: false,
        error: "Token failed to form.",
      });
    }
    cookieStore.set("token", token);
    return NextResponse.json({
      success: true,
      user: createdUser,
      token,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}

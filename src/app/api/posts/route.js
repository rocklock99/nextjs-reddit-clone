import { fetchUser } from "@/lib/fetchUser.js";
import { prisma } from "@/lib/prisma.js";
import { NextResponse } from "next/server.js";

export async function POST(request) {
  try {
    const { title, message, subredditId, parentId } = await request.json();
    const user = await fetchUser();
    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not logged in.",
      });
    }
    const post = await prisma.post.create({
      data: { title, message, userId: user.id, subredditId, parentId },
    });
    if (!post) {
      return NextResponse.json({
        success: false,
        error: "Post creation failed.",
      });
    }
    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}

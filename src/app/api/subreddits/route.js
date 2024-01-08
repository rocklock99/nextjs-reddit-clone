import { fetchUser } from "@/lib/fetchUser.js";
import { prisma } from "@/lib/prisma.js";
import { NextResponse } from "next/server.js";

export async function POST(request) {
  try {
    const { name } = await request.json();
    const user = await fetchUser();
    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not logged in.",
      });
    }
    const foundSubreddit = await prisma.subreddit.findFirst({
      where: { name },
    });
    if (foundSubreddit) {
      return NextResponse.json({
        success: false,
        error: "Subreddit name already exists.",
      });
    }
    const subreddit = await prisma.subreddit.create({
      data: { name, userId: user.id },
    });
    if (!subreddit) {
      return NextResponse.json({
        success: false,
        error: "Subreddit creation failed.",
      });
    }
    return NextResponse.json({
      success: true,
      subreddit,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}

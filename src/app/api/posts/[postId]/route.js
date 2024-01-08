import { fetchUser } from "@/lib/fetchUser.js";
import { prisma } from "@/lib/prisma.js";
import { NextResponse } from "next/server.js";

export async function PUT(request, response) {
  try {
    const user = await fetchUser();
    const { title, message } = await request.json();
    const { postId } = response.params;
    if (!postId) {
      return NextResponse.json({
        success: false,
        error: "Post Id was not included in the request URL.",
      });
    }
    if (!message) {
      return NextResponse.json({
        success: false,
        error: "no message included for updating.",
      });
    }
    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not logged in.",
      });
    }
    const post = await prisma.post.update({
      where: { id: postId },
      data: { title, message },
    });
    if (!post) {
      return NextResponse.json({
        success: false,
        error: "Update failed.",
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

export async function DELETE(request, response) {
  try {
    const { postId } = response.params;
    console.log(postId);
    if (!postId) {
      return NextResponse.json({
        success: false,
        error: "Post Id was not included in the request URL.",
      });
    }
    const user = await fetchUser();
    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not logged in.",
      });
    }
    const post = await prisma.post.delete({
      where: { id: postId },
    });
    if (!post) {
      return NextResponse.json({
        success: false,
        error: "Delete failed.",
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

import { fetchUser } from "@/lib/fetchUser.js";
import { prisma } from "@/lib/prisma.js";
import { NextResponse } from "next/server.js";

export async function POST(request) {
  try {
    const { postId, isUpvote } = await request.json();
    //console.log(`backend postId value: ${postId}`);
    //console.log(`backend isUpvote value: ${isUpvote}`);
    const post = await prisma.post.findFirst({
      where: { id: postId },
    });
    //console.log(post);
    if (!post) {
      return NextResponse.json({
        success: false,
        error: "Post not found.",
      });
    }

    const user = await fetchUser();
    //console.log(user);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not logged in.",
      });
    }
    const vote = await prisma.vote.create({
      data: { userId: user.id, postId, isUpvote },
    });
    if (!vote) {
      return NextResponse.json({
        success: false,
        error: "Error creating vote.",
      });
    }
    return NextResponse.json({ success: true, vote });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function PUT(request) {
  try {
    const { voteId, isUpvote } = await request.json();
    if (!voteId) {
      return NextResponse.json({
        success: false,
        error: "voteId required in request body.",
      });
    }
    const user = await fetchUser();
    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not logged in.",
      });
    }
    const vote = await prisma.vote.update({
      where: { id: voteId },
      data: { isUpvote },
    });
    if (!vote) {
      return NextResponse.json({
        success: false,
        error: "Vote update failed.",
      });
    }
    return NextResponse.json({
      success: true,
      vote,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}

export async function DELETE(request) {
  try {
    const { voteId } = await request.json();
    if (!voteId) {
      return NextResponse.json({
        success: false,
        error: "voteId required to delete.",
      });
    }
    const user = await fetchUser();
    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not logged in.",
      });
    }
    const vote = await prisma.vote.delete({
      where: { id: voteId },
    });
    if (!vote) {
      return NextResponse.json({
        success: false,
        error: "Upvote deletion failed.",
      });
    }
    return NextResponse.json({
      success: true,
      vote,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}

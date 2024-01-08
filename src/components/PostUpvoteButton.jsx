"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation.js";
import Image from "next/image";

export default function PostUpvoteButton({ post, user }) {
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setHasUpvoted(
        post.votes.some((vote) => vote.userId === user.id && vote.isUpvote)
      );
    } else {
      setHasUpvoted(false);
    }
  }, [post.votes, user]);

  function handleUpvoteClick() {
    const foundVote = post.votes.find((vote) => vote.userId === user.id);
    if (foundVote && foundVote.isUpvote === true) {
      deleteUpvote(foundVote);
    } else if (foundVote && foundVote.isUpvote === false) {
      updateToUpvote(foundVote);
    } else if (!foundVote) {
      addUpvote();
    }
    router.refresh();
  }

  async function addUpvote() {
    try {
      const response = await fetch(`/api/votes`, {
        method: "POST",
        body: JSON.stringify({
          postId: post.id,
          isUpvote: true,
        }),
      });
      const info = await response.json();
      if (info.success) {
        console.log("upvote successfully added.");
        router.refresh();
      } else {
        console.log("upvote failed to add.");
      }
    } catch (error) {
      console.error("Error handling upvote.", error);
    }
  }

  async function deleteUpvote(vote) {
    try {
      const response = await fetch(`/api/votes`, {
        method: "DELETE",
        body: JSON.stringify({
          voteId: vote.id,
        }),
      });
      const info = await response.json();
      if (info.success) {
        console.log("upvote successfully deleted.");
      } else {
        console.log("upvote failed to delete.");
      }
    } catch (error) {
      console.error("Error handling upvote deletion.", error);
    }
  }

  async function updateToUpvote(vote) {
    try {
      const response = await fetch(`/api/votes`, {
        method: "PUT",
        body: JSON.stringify({
          voteId: vote.id,
          isUpvote: true,
        }),
      });
      const info = await response.json();
      if (info.success) {
        console.log("vote successfully updated.");
      } else {
        console.log("vote failed to update.");
      }
    } catch (error) {
      console.error("Error handling vote update.", error);
    }
  }

  const upvoteIconSrc = hasUpvoted
    ? "/filled-arrow-up.svg"
    : "/empty-arrow-up.svg";

  return (
    <div
      id="upvote-container"
      onClick={user ? handleUpvoteClick : () => router.push("/login")}
    >
      <Image
        id="upvote-image"
        // src="/empty-arrow-up.svg"
        src={upvoteIconSrc}
        alt="upvote icon"
        width={20}
        height={20}
      />
    </div>
  );
}

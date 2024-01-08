"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation.js";
import Image from "next/image";

export default function PostDownvoteButton({ post, user }) {
  const [hasDownvoted, setHasDownvoted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setHasDownvoted(
        post.votes.some((vote) => vote.userId === user.id && !vote.isUpvote)
      );
    } else {
      setHasDownvoted(false);
    }
  }, [post.votes, user]);

  function handleDownvoteClick() {
    const foundVote = post.votes.find((vote) => vote.userId === user.id);
    if (foundVote && foundVote.isUpvote === false) {
      deleteDownvote(foundVote);
    } else if (foundVote && foundVote.isUpvote === true) {
      updateToDownvote(foundVote);
    } else if (!foundVote) {
      addDownvote();
    }
    router.refresh();
  }

  async function addDownvote() {
    try {
      const response = await fetch(`/api/votes`, {
        method: "POST",
        body: JSON.stringify({
          postId: post.id,
          isUpvote: false,
        }),
      });
      const info = await response.json();
      if (info.success) {
        console.log("downvote successfully added.");
        router.refresh();
      } else {
        console.log("downvote failed to add.");
      }
    } catch (error) {
      console.error("Error handling downvote add.", error);
    }
  }

  async function deleteDownvote(vote) {
    try {
      const response = await fetch(`/api/votes`, {
        method: "DELETE",
        body: JSON.stringify({
          voteId: vote.id,
        }),
      });
      const info = await response.json();
      if (info.success) {
        console.log("downvote successfully deleted.");
      } else {
        console.log("downvote failed to delete.");
      }
    } catch (error) {
      console.error("Error handling downvote deletion.", error);
    }
  }

  async function updateToDownvote(vote) {
    try {
      const response = await fetch(`/api/votes`, {
        method: "PUT",
        body: JSON.stringify({
          voteId: vote.id,
          isUpvote: false,
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

  const downvoteIconSrc = hasDownvoted
    ? "/filled-arrow-down.svg"
    : "/empty-arrow-down.svg";

  return (
    <div
      id="downvote-container"
      onClick={user ? handleDownvoteClick : () => router.push("/login")}
    >
      <Image
        id="downvote-image"
        // src="/empty-arrow-down.svg"
        src={downvoteIconSrc}
        alt="downvote icon"
        width={20}
        height={20}
      />
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation.js";

export default function CommentForm({ post, setIsCommenting }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);

  const router = useRouter();

  useEffect(() => {
    setIsAddButtonDisabled(!title.trim());
  }, [title]);

  async function handleAddCommentClick() {
    try {
      const response = await fetch(`/api/posts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          message,
          subredditId: post.subredditId,
          parentId: post.id,
        }),
      });
      const info = await response.json();
      if (!info.success) {
        console.log("Failed to create comment.");
        setError(info.error);
        return;
      }
      setTitle("");
      setMessage("");
      setError("");
      router.refresh();
      setIsCommenting(false);
    } catch (err) {
      setError("Failed to create comment: " + err.message);
    }
  }

  function handleCommentCancelClick() {
    setIsCommenting(false);
  }

  return (
    <div id="comment-form-container">
      <textarea
        id="comment-title-input"
        value={title}
        placeholder="title (required)"
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        id="comment-message-input"
        value={message}
        placeholder="message (optional)"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleAddCommentClick} disabled={isAddButtonDisabled}>
        Add Comment
      </button>
      <button onClick={handleCommentCancelClick}>Cancel</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation.js";

export default function PostEditForm({ post, setIsEditing }) {
  const [editedMessage, setEditedMessage] = useState(post.message);
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleEditSaveClick() {
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: post.title,
          message: editedMessage,
        }),
      });
      const info = await response.json();
      if (!info.success) {
        console.log("Failed to save edit changes.");
        setError(info.error);
        return;
      }
      router.refresh();
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save changes: " + err.message);
    }
  }

  function handleEditCancel() {
    setIsEditing(false);
  }

  return (
    <div id="post-edit-form-container">
      <textarea
        id="post-edit-message-input"
        value={editedMessage}
        onChange={(e) => setEditedMessage(e.target.value)}
      />
      <button onClick={handleEditSaveClick}>Save Changes</button>
      <button onClick={handleEditCancel}>Cancel</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

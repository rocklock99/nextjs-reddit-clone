"use client";
import { useRouter } from "next/navigation.js";
import { useState, useEffect } from "react";

export default function PostCreateForm({ user, subreddits }) {
  const [selectedSubreddit, setSelectedSubreddit] = useState({});
  const [newSubredditName, setNewSubredditName] = useState("");
  const [isCreatingSubreddit, setIsCreatingSubreddit] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [error, setError] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [newSubredditId, setNewSubredditId] = useState(null);
  const [isNewSubreddit, setIsNewSubreddit] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isNewSubredditButtonDisabled, setIsNewSubredditButtonDisabled] =
    useState(true);

  const router = useRouter();

  useEffect(() => {
    const isPostButtonValid =
      postTitle.trim() !== "" && (selectedSubreddit.id || newSubredditId);
    setIsButtonDisabled(!isPostButtonValid);
  }, [postTitle, selectedSubreddit, newSubredditId]);

  useEffect(() => {
    const isNewSubredditButtonValid = newSubredditName.trim() !== "";
    setIsNewSubredditButtonDisabled(!isNewSubredditButtonValid);
  }, [newSubredditName]);

  const handleToggleNewSubreddit = () => {
    setIsNewSubreddit(!isNewSubreddit);
    if (!isNewSubreddit) {
      setSelectedSubreddit({});
    }
  };

  function handleCreatePostClick() {
    setIsCreatingPost(true);
  }

  const handleNewSubredditName = (event) => {
    setError("");
    setNewSubredditName(event.target.value);
  };

  const handleSubredditChange = (event) => {
    setError("");
    const selectedValue = event.target.value;
    setSelectedSubreddit(
      subreddits.find((subreddit) => subreddit.name === selectedValue) || {}
    );
    if (selectedValue === "createNew") {
      setIsCreatingSubreddit(true);
    } else {
      setIsCreatingSubreddit(false);
    }
  };

  async function handleAddPost() {
    try {
      const response = await fetch(`/api/posts`, {
        method: "POST",
        body: JSON.stringify({
          title: postTitle,
          message: postText,
          subredditId: selectedSubreddit.id,
        }),
      });
      const info = await response.json();
      if (!info.success) {
        return setError(info.error);
      }
      setNewSubredditName("");
      setSelectedSubreddit({});
      setIsCreatingSubreddit(false);
      setPostText("");
      setPostTitle("");
      router.refresh();
    } catch (error) {
      console.error(
        "Error adding new subreddit while creating new post.",
        error
      );
    }
  }

  function handleCancelPost() {
    setIsCreatingPost(false);
  }

  async function handleCreateSubreddit() {
    try {
      const response = await fetch(`/api/subreddits`, {
        method: "POST",
        body: JSON.stringify({
          name: newSubredditName,
        }),
      });
      const info = await response.json();
      if (!info.success) {
        return setError(info.error + " Choose another subreddit name.");
      }
      setNewSubredditId(info.subreddit.id);
      setSelectedSubreddit(info.subreddit);
      setIsCreatingSubreddit(false);
      router.refresh();
    } catch (error) {
      setError("Error creating subreddit: " + error.message);
    }
  }

  function handleCancelCreateSubreddit() {
    // setNewSubredditName("");
    // setSelectedSubreddit({});
    // setIsCreatingSubreddit(false);
    setNewSubredditName("");
    setIsNewSubreddit(false);
  }

  function handlePostTitleChange(event) {
    setPostTitle(event.target.value);
  }

  function handlePostTextChange(event) {
    setPostText(event.target.value);
  }

  return isCreatingPost ? (
    <div id="create-post-form">
      <div id="subreddit-selection-container">
        <select
          id="subredditDropdown"
          name="subreddit"
          disabled={isNewSubreddit}
          value={selectedSubreddit.name || ""}
          onChange={handleSubredditChange}
        >
          <option value="">Select Subreddit</option>
          {subreddits.map((subreddit) => (
            <option key={subreddit.id} value={subreddit.name}>
              {subreddit.name}
            </option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={isNewSubreddit}
            onChange={handleToggleNewSubreddit}
          />
          Create New Subreddit
        </label>
      </div>

      {isNewSubreddit && (
        <div id="create-new-subreddit-container">
          <input
            type="text"
            placeholder="New subreddit name"
            value={newSubredditName}
            onChange={handleNewSubredditName}
          />
          <button
            onClick={handleCreateSubreddit}
            disabled={isNewSubredditButtonDisabled}
          >
            Create
          </button>
          <button onClick={handleCancelCreateSubreddit}>Cancel</button>
        </div>
      )}

      <div id="new-post-form-container">
        <input
          type="text"
          placeholder="Enter title (required)"
          value={postTitle}
          onChange={handlePostTitleChange}
        />
        <textarea
          placeholder="Enter message (optional)"
          value={postText}
          onChange={handlePostTextChange}
        />
        <div id="new-post-form-buttons">
          <button onClick={handleAddPost} disabled={isButtonDisabled}>
            Add Post
          </button>
          <button onClick={handleCancelPost}>Cancel</button>
        </div>
      </div>

      {error && <p className="error-messages">{error}</p>}
    </div>
  ) : (
    <div
      id="create-a-post-button"
      className="button-style"
      onClick={handleCreatePostClick}
    >
      Create Post
    </div>
  );
}

"use client";
import { useRouter } from "next/navigation.js";
import { useState } from "react";

export default function SubredditMenu({ subreddits, user }) {
  const router = useRouter();
  const [isAddingSubreddit, setIsAddingSubreddit] = useState(false);
  const [newSubredditName, setNewSubredditName] = useState("");
  const [error, setError] = useState("");

  const handleStartCreate = () => {
    console.log(user);
    if (user) {
      setIsAddingSubreddit(true);
    } else {
      router.push("/login");
    }
  };

  const handleNameChange = (event) => {
    setNewSubredditName(event.target.value);
  };

  const handleCancelAdd = () => {
    setNewSubredditName("");
    setIsAddingSubreddit(false);
  };

  const handleSubredditClick = (subredditId) => {
    console.log(subredditId);
    router.push(`/subreddits/${subredditId}`);
  };

  async function handleCreateSubreddit() {
    try {
      const response = await fetch(`/api/subreddits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newSubredditName,
        }),
      });
      const info = await response.json();
      if (!info.success) {
        console.log("Error adding subreddit.");
        setError(info.error);
      } else {
        console.log("Subreddit successfully added.");
      }
      router.refresh();
      setNewSubredditName("");
    } catch (error) {
      console.error("Error creating subreddit.", error);
    }
  }

  return (
    <div id="subreddit-menu">
      <p id="subreddit-menu-title">TOPICS</p>
      <ul>
        {subreddits.map((subreddit) => (
          <li
            className="subreddit-list-items"
            key={subreddit.id}
            onClick={() => handleSubredditClick(subreddit.id)}
          >
            <span className="subreddit-list-item-content">
              {subreddit.name}
            </span>
          </li>
        ))}
      </ul>
      {!isAddingSubreddit && (
        <button id="subreddit-create-button" onClick={handleStartCreate}>
          <span>+</span>Topic
        </button>
      )}
      {isAddingSubreddit && (
        <div id="subreddit-creation-field">
          <input
            id="subreddit-new-name"
            type="text"
            value={newSubredditName}
            onChange={handleNameChange}
            placeholder="enter community name..."
          />
          <div id="creation-field-button-container">
            <button
              id="add-subreddit"
              className="creation-field-buttons"
              onClick={handleCreateSubreddit}
            >
              Add
            </button>
            <button
              id="cancel-subreddit-add"
              className="creation-field-buttons"
              onClick={handleCancelAdd}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

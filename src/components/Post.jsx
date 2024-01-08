"use client";

import Image from "next/image";
import Link from "next/link.js";
import PostUpvoteButton from "./PostUpvoteButton.jsx";
import PostDownvoteButton from "./PostDownvoteButton.jsx";
import { useState } from "react";
import PostDeleteButton from "./PostDeleteButton.jsx";
import PostEditForm from "./PostEditForm.jsx";
import CommentForm from "./CommentForm.jsx";
//import PostEditButton from "./PostEditButton.jsx";

export default function Post({ post, user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  //const [newMessage, setNewMessage] = useState(post.message);

  function handleEditClick() {
    setIsEditing(true);
  }

  function handleCommentClick() {
    setIsCommenting(true);
  }

  function netVotes() {
    let netVotes = 0;
    post?.votes.forEach((vote) => {
      if (vote.isUpvote) {
        netVotes += 1;
      } else {
        netVotes -= 1;
      }
    });
    return netVotes;
  }

  return (
    <div id="post-container">
      <p id="post-header">
        r/{post?.subreddit.name} 🔸 Posted by u/
        {post?.user.username}
      </p>
      <h3 id="post-title">{post?.title}</h3>
      {/* <p id="post-message">{post?.message}</p> */}
      {isEditing ? (
        <PostEditForm post={post} setIsEditing={setIsEditing} />
      ) : (
        <p id="post-message">{post?.message}</p>
      )}
      <div id="post-interaction-container">
        <div id="post-vote-container">
          <PostUpvoteButton post={post} user={user} />
          <p id="post-vote-count-display">{netVotes()}</p>
          <PostDownvoteButton post={post} user={user} />
        </div>
        {/* <Link id="post-link-to-post-page" href={`/posts/${post.id}`}> */}
        <div id="comment-button-container" onClick={handleCommentClick}>
          <Image
            id="comment-icon"
            src="/comment_icon.svg"
            alt="comment icon"
            width={20}
            height={20}
          />
          <p id="comment-count-display">{post.children.length}</p>
        </div>
        {/* </Link> */}
        {user && post && user.id === post.userId && (
          <>
            <PostDeleteButton post={post} />
            {/* <PostEditButton post={post} /> */}
            <div id="post-edit-button-container" onClick={handleEditClick}>
              <Image
                id="edit-icon"
                src="/edit_icon.svg"
                alt="edit icon"
                width={20}
                height={20}
              />
            </div>
          </>
        )}
      </div>
      {user && isCommenting && (
        <CommentForm post={post} setIsCommenting={setIsCommenting} />
      )}
    </div>
  );
}

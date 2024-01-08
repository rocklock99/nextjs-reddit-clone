"use client";
import { useState } from "react";
import { useRouter } from "next/navigation.js";
import Image from "next/image";

export default function PostDeleteButton({ post }) {
  //const [error, setError] = useState("");
  const router = useRouter();
  async function handleDeleteClick() {
    const response = await fetch(`/api/posts/${post.id}`, {
      method: "DELETE",
    });
    const info = await response.json();
    if (!info.success) {
      console.log(info.error);
    } else {
      router.refresh();
    }
  }

  return (
    <div id="post-delete-button-container" onClick={handleDeleteClick}>
      <Image
        id="trash-bin-image"
        src="/trash_bin_icon.svg"
        alt="trash bin icon"
        width={15}
        height={15}
      />
    </div>
  );
}

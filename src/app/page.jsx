import JoinCommunityButton from "@/components/JoinCommunityButton.jsx";
import Post from "@/components/Post.jsx";
import SubredditMenu from "@/components/SubredditMenu.jsx";
import { fetchUser } from "@/lib/fetchUser.js";
import { prisma } from "@/lib/prisma.js";
import Link from "next/link";

export default async function Home() {
  const subreddits = await prisma.subreddit.findMany();
  const user = await fetchUser();
  const posts = await prisma.post.findMany({
    include: {
      user: true,
      votes: true,
      subreddit: true,
      children: {
        include: {
          user: true,
          votes: true,
          children: true,
        },
      },
      parent: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main>
      <SubredditMenu subreddits={subreddits} user={user} />
      <div id="main-post-area-container">
        <div id="main-create-post-button-container">
          {user ? (
            // <Link id="create-post-button-link" href={`/users/${user.id}/posts`}>
            //   <div id="main-create-post-button">Create Post</div>
            // </Link>
            <Link
              href={`/users/${user.id}/posts`}
              id="create-post-button"
              className="button-style"
            >
              Create Post
            </Link>
          ) : (
            <JoinCommunityButton />
          )}
        </div>
        <div id="posts-list-container">
          {posts.map((post) => {
            return (
              <div key={post.id}>
                <Post post={post} user={user} />
                <hr id="post-divider" />
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

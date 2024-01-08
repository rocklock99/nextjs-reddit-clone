import Post from "@/components/Post.jsx";
import PostCreateForm from "@/components/PostCreateForm.jsx";
import SubredditMenu from "@/components/SubredditMenu.jsx";
import { fetchUser } from "@/lib/fetchUser.js";
import { prisma } from "@/lib/prisma.js";

export default async function UserPosts({ params }) {
  const { userId } = params;
  const subreddits = await prisma.subreddit.findMany();
  const user = await fetchUser();
  const posts = await prisma.post.findMany({
    where: { userId },
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
    <div id="user-posts-page">
      <SubredditMenu subreddits={subreddits} user={user} />
      <div id="user-posts-page-rightside-container">
        <PostCreateForm posts={posts} subreddits={subreddits} />
        <h3>Your previous posts:</h3>
        {posts.map((post) => {
          return (
            <div key={post.id}>
              <Post post={post} user={user} />
              <hr id="post-divider" />
            </div>
          );
        })}
        {/* <p>{error}</p> */}
      </div>
    </div>
  );
}

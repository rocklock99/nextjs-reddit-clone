import Post from "@/components/Post.jsx";
import SubredditMenu from "@/components/SubredditMenu.jsx";
import { fetchUser } from "@/lib/fetchUser.js";
import { prisma } from "@/lib/prisma.js";

export default async function Subreddit({ params }) {
  const subreddits = await prisma.subreddit.findMany();
  const user = await fetchUser();
  const { subredditId } = params;
  //console.log(subredditId);
  const subreddit = await prisma.subreddit.findFirst({
    where: { id: subredditId },
  });
  //console.log(subreddit);
  if (!subreddit) {
    console.log("No subreddit found with that Id.");
  }
  const posts = await prisma.post.findMany({
    where: { subredditId },
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
  //console.log(posts);
  if (!posts) {
    console.log("No posts associated with that subreddit.");
  }

  return (
    <div id="subreddit-posts-page">
      <SubredditMenu subreddits={subreddits} user={user} />
      <div id="subreddit-posts-page-rightside-container">
        <h1>{subreddit.name}</h1>
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

import AddCommentButton from "@/components/AddCommentButton.jsx";
import Post from "@/components/Post.jsx";
import SubredditMenu from "@/components/SubredditMenu.jsx";
import { fetchUser } from "@/lib/fetchUser.js";
import { prisma } from "@/lib/prisma.js";

export default async function PostPage({ params }) {
  const subreddits = await prisma.subreddit.findMany();
  const user = await fetchUser();

  // pull the postId from the frontend URL routing
  const { postId } = params;
  console.log(postId);

  // recursive function that displays posts and nested children of posts
  function displayPosts(post) {
    if (!post.children) {
      return <Post post={post} />;
    } else {
      post.children.map((child) => displayPosts(child));
    }
  }

  // find post by id, include all children
  const post = await prisma.post.findFirst({
    where: { id: postId },
    include: {
      user: true,
      votes: true,
      subreddit: true,
      children: {
        include: {
          user: true,
          votes: true,
          subreddit: true,
          children: true,
        },
      },
      parent: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log(post);
  if (!post) {
    console.log("No post found with that Id.");
  }

  return (
    <div id="post-page">
      <SubredditMenu subreddits={subreddits} user={user} />
      <div id="post-page-rightside-container">
        <Post post={post} user={user} />
        <AddCommentButton />
        {post.children.map((comment) => {
          //console.log(comment);
          return <Post key={comment.id} post={comment} />;
        })}
        {/* <p>{error}</p> */}
      </div>
    </div>
  );
}

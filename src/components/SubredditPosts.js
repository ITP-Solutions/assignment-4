import React from "react";

export default function SubredditPosts({ posts }) {
  return (
    <>
      <h2>Posts</h2>
      {posts.map((post) => {
        return (
          <div key={post.id} className="border-bottom mb-3">
            <p>Title: {post.title}</p>
            <p>Score: {post.score}</p>
            <p>Subscribers: {post.subredditSubscribers.toLocaleString()}</p>
            <p>
              {post.numComments > 0
                ? `# Comments: ${post.numComments.toLocaleString()}`
                : "No comments"}
            </p>
          </div>
        );
      })}
    </>
  );
}
